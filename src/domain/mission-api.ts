/**
 * Mission API Handler & Security Gateway (TIP-006 / FIX-BE01, FIX-BE02, FIX-BE03)
 *
 * Xử lý các request API cục bộ theo hợp đồng và nguyên tắc bảo mật:
 * 1. FIX-BE01: Kiểm quyền report trên mọi đường đọc (kể cả khi service được tạo lại từ repo).
 * 2. FIX-BE02: Cập nhật repository sau MỌI command hợp lệ (ANSWER_QUIZ, thu mẫu, complete).
 * 3. FIX-BE03: Không báo thành công khi lưu thất bại; rollback trạng thái nếu repository không ghi được.
 */

import {
  MissionCommand,
  MissionRunConfig,
  ValidationError,
  RunResult,
  ClientMissionView
} from './mission-contract';
import { MissionRunManager } from './mission-run-manager';
import { IMissionStorageRepository } from './mission-database';

export interface ApiRequest<T> {
  sessionId: string;
  payload: T;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  data?: T;
  error?: ValidationError;
}

export class MissionApiService {
  private activeManagers = new Map<string, { manager: MissionRunManager; ownerSessionId: string }>();
  private repository: IMissionStorageRepository;

  constructor(repository: IMissionStorageRepository) {
    this.repository = repository;
  }

  /**
   * Khởi tạo một ván chơi mới
   */
  public async handleStartRun(req: ApiRequest<{ config: MissionRunConfig }>): Promise<ApiResponse<ClientMissionView>> {
    if (!req.sessionId || !req.sessionId.trim()) {
      return {
        statusCode: 401,
        success: false,
        error: { code: 'RULE_VIOLATION', message: 'Yêu cầu không có session xác thực.' }
      };
    }

    const { config } = req.payload;
    if (!config || !config.runId) {
      return {
        statusCode: 400,
        success: false,
        error: { code: 'INVALID_RUN_ID', message: 'Thiếu cấu hình ván chơi hoặc runId.' }
      };
    }

    if (this.activeManagers.has(config.runId)) {
      return {
        statusCode: 409,
        success: false,
        error: { code: 'RULE_VIOLATION', message: `Ván chơi '${config.runId}' đã tồn tại.` }
      };
    }

    // Kiểm tra trong repo xem run đã tồn tại chưa
    const existingInRepo = await this.repository.getRun(config.runId);
    if (existingInRepo) {
      return {
        statusCode: 409,
        success: false,
        error: { code: 'RULE_VIOLATION', message: `Ván chơi '${config.runId}' đã tồn tại trong lưu trữ.` }
      };
    }

    const manager = new MissionRunManager(config);
    const startRes = manager.startRun();
    if (!startRes.success) {
      return {
        statusCode: 400,
        success: false,
        error: startRes.error
      };
    }

    // FIX-BE03: Ghi vào repository trước. Nếu thất bại, KHÔNG kích hoạt manager và KHÔNG báo thành công giả
    let savedOk = false;
    try {
      savedOk = await this.repository.saveRun(req.sessionId, manager.getProgress(), config);
    } catch (e) {
      savedOk = false;
    }

    if (!savedOk) {
      return {
        statusCode: 500,
        success: false,
        error: { code: 'RULE_VIOLATION', message: 'Lỗi ghi nhận ván chơi vào hệ thống lưu trữ.' }
      };
    }

    this.activeManagers.set(config.runId, { manager, ownerSessionId: req.sessionId });

    return {
      statusCode: 200,
      success: true,
      data: manager.getClientView()
    };
  }

  /**
   * Tiếp nhận và thực thi Command an toàn (FIX-BE02 & FIX-BE03)
   */
  public async handleExecuteCommand(req: ApiRequest<{ command: MissionCommand }>): Promise<ApiResponse<ClientMissionView>> {
    if (!req.sessionId || !req.sessionId.trim()) {
      return {
        statusCode: 401,
        success: false,
        error: { code: 'RULE_VIOLATION', message: 'Yêu cầu không có session xác thực.' }
      };
    }

    const { command } = req.payload;
    if (!command || !command.runId) {
      return {
        statusCode: 400,
        success: false,
        error: { code: 'INVALID_RUN_ID', message: 'Lệnh không hợp lệ hoặc thiếu runId.' }
      };
    }

    let entry = this.activeManagers.get(command.runId);
    let configForRun: MissionRunConfig;

    if (!entry) {
      // Phục hồi từ repository nếu service được tạo lại
      const storedRun = await this.repository.getRun(command.runId);
      if (!storedRun) {
        return {
          statusCode: 404,
          success: false,
          error: { code: 'INVALID_RUN_ID', message: `Không tìm thấy ván chơi '${command.runId}'.` }
        };
      }
      const recordedCommands = await this.repository.getRecordedCommandsForRun(command.runId);
      const restoredManager = MissionRunManager.restoreFromStored(storedRun.config, storedRun.progress, recordedCommands);
      entry = { manager: restoredManager, ownerSessionId: storedRun.ownerSessionId };
      this.activeManagers.set(command.runId, entry);
      configForRun = storedRun.config;
    } else {
      const storedRun = await this.repository.getRun(command.runId);
      configForRun = storedRun ? storedRun.config : (command as any).config;
    }

    // FIX-BE01: Kiểm tra quyền sở hữu Session
    if (entry.ownerSessionId !== req.sessionId) {
      return {
        statusCode: 403,
        success: false,
        error: { code: 'RULE_VIOLATION', message: 'Bạn không có quyền thực thi lệnh trên ván chơi này.' }
      };
    }

    // Snapshot trạng thái manager trước khi thực thi để có thể rollback nếu repository ghi lỗi (Mục 2)
    const managerSnapshot = entry.manager.createSnapshot();

    const execRes = entry.manager.executeCommand(command);

    if (!execRes.success) {
      // Ghi nhận command thất bại vào audit log
      try {
        await this.repository.recordCommand(command, execRes);
      } catch (e) {
        // bỏ qua lỗi audit command thất bại
      }
      return {
        statusCode: 400,
        success: false,
        error: execRes.error
      };
    }

    // Lệnh thành công -> FIX-BE02: Cập nhật repository đồng bộ
    const newProgress = entry.manager.getProgress();
    let finalReport: RunResult | undefined = undefined;
    if (newProgress.status === 'COMPLETED' || newProgress.status === 'FAILED') {
      const rep = entry.manager.getFinalReport();
      if (rep.isReady && rep.report) {
        finalReport = rep.report;
      }
    }

    // FIX-BE03: Ghi nguyên tử vào storage. Nếu lưu thất bại -> Rollback Manager và báo lỗi 500
    let updateOk = false;
    try {
      updateOk = await this.repository.atomicUpdateRunAndCommand(
        entry.ownerSessionId,
        newProgress,
        configForRun,
        command,
        execRes,
        finalReport
      );
    } catch (e) {
      updateOk = false;
    }

    if (!updateOk) {
      // Rollback Manager về trạng thái trước khi thực thi lệnh (không để lệch revision hay dữ liệu)
      entry.manager.restoreSnapshot(managerSnapshot);
      return {
        statusCode: 500,
        success: false,
        error: { code: 'RULE_VIOLATION', message: 'Lỗi ghi nhận tiến độ vào hệ thống lưu trữ.' }
      };
    }

    return {
      statusCode: 200,
      success: true,
      data: entry.manager.getClientView()
    };
  }

  /**
   * Truy vấn Debrief Report cuối cùng (FIX-BE01)
   */
  public async handleGetReport(req: ApiRequest<{ runId: string }>): Promise<ApiResponse<RunResult>> {
    // FIX-BE01: Kiểm tra session có mặt
    if (!req.sessionId || !req.sessionId.trim()) {
      return {
        statusCode: 401,
        success: false,
        error: { code: 'RULE_VIOLATION', message: 'Yêu cầu không có session xác thực.' }
      };
    }

    const { runId } = req.payload;
    if (!runId) {
      return {
        statusCode: 400,
        success: false,
        error: { code: 'INVALID_RUN_ID', message: 'Thiếu runId.' }
      };
    }

    // FIX-BE01: Đọc từ repository hoặc active manager
    const entry = this.activeManagers.get(runId);
    let ownerSessionId: string | null = null;
    let finalReport: RunResult | null = null;

    if (entry) {
      ownerSessionId = entry.ownerSessionId;
      const rep = entry.manager.getFinalReport();
      if (rep.isReady && rep.report) {
        finalReport = rep.report;
      }
    } else {
      // Đọc từ repository
      const storedReportRecord = await this.repository.getReport(runId);
      if (storedReportRecord) {
        ownerSessionId = storedReportRecord.ownerSessionId;
        finalReport = storedReportRecord.report;
      } else {
        // Kiểm tra xem run có tồn tại không
        const storedRun = await this.repository.getRun(runId);
        if (storedRun) {
          ownerSessionId = storedRun.ownerSessionId;
        }
      }
    }

    if (!ownerSessionId) {
      return {
        statusCode: 404,
        success: false,
        error: { code: 'INVALID_RUN_ID', message: `Không tìm thấy ván chơi '${runId}'.` }
      };
    }

    // FIX-BE01: Luôn kiểm tra quyền sở hữu session, kể cả khi đọc từ repo
    if (ownerSessionId !== req.sessionId) {
      return {
        statusCode: 403,
        success: false,
        error: { code: 'RULE_VIOLATION', message: 'Bạn không có quyền xem báo cáo của ván này.' }
      };
    }

    if (!finalReport) {
      return {
        statusCode: 202,
        success: false,
        error: { code: 'RULE_VIOLATION', message: 'Báo cáo chưa sẵn sàng do ván chơi đang diễn ra.' }
      };
    }

    return {
      statusCode: 200,
      success: true,
      data: finalReport
    };
  }
}
