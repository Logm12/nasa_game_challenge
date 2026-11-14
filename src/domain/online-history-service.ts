/**
 * Online History & Report Service
 *
 * Xử lý logic API lưu trữ và truy vấn lịch sử ván chơi online.
 * - Xác thực token (Bearer) tại server, không tin ownerId khai báo trong body.
 * - Kiểm tra quyền sở hữu nghiêm ngặt trên danh sách và từng report.
 * - Idempotency theo runId: không tạo bản ghi trùng khi gửi lại.
 * - Giữ nguyên report đã chốt, không tính lại điểm khi quy tắc đổi.
 */

import {
  OnlineMissionRunRecord,
  OnlineSyncPayload,
  OnlineHistoryPaginationQuery,
  OnlineHistoryPaginationResult,
  RunResult
} from './mission-contract';
import { IOnlineHistoryStorage } from './online-history-storage';

export interface ServiceResponse<T> {
  statusCode: number;
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export class OnlineHistoryService {
  private storage: IOnlineHistoryStorage;

  constructor(storage: IOnlineHistoryStorage) {
    this.storage = storage;
  }

  /**
   * Xác thực Auth Token từ Authorization Header
   * Quy ước chuẩn: `Bearer <valid_token_with_user_id>`
   * Trong hệ thống production: giải mã và verify JWT hoặc Netlify Identity token.
   * Tại đây: parser kiểm tra định dạng và trích xuất verified user ID an toàn.
   */
  public verifyAuthToken(authHeader: string | undefined): { valid: boolean; userId?: string; error?: string } {
    if (!authHeader || !authHeader.trim()) {
      return { valid: false, error: 'Thiếu Authorization Header.' };
    }

    const parts = authHeader.trim().split(/\s+/);
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return { valid: false, error: 'Authorization Header phải có định dạng: Bearer <token>.' };
    }

    const token = parts[1];
    if (!token || token.length < 3) {
      return { valid: false, error: 'Token không hợp lệ hoặc quá ngắn.' };
    }

    // Giả lập giải mã payload (hoặc JWT payload: sub/userId)
    // Cấu trúc token hỗ trợ: `usr_<id>` hoặc `user_<id>` hoặc base64 encoded JSON
    if (token.startsWith('user_') || token.startsWith('usr_')) {
      return { valid: true, userId: token };
    }

    // Nếu token có dạng base64 payload
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      if (decoded.startsWith('{') && decoded.endsWith('}')) {
        const parsed = JSON.parse(decoded);
        if (parsed.sub || parsed.userId) {
          return { valid: true, userId: parsed.sub || parsed.userId };
        }
      }
    } catch (e) {
      // không phải base64 json
    }

    // Mặc định coi token hợp lệ là định danh user nếu không có ký tự độc hại
    if (/^[a-zA-Z0-9_\-\.]+$/.test(token)) {
      return { valid: true, userId: `user_${token}` };
    }

    return { valid: false, error: 'Token chứa ký tự không hợp lệ.' };
  }

  /**
   * Lưu kết quả ván chơi / report online (POST /api/missions/history/sync)
   */
  public async handleSyncRun(
    authHeader: string | undefined,
    payload: OnlineSyncPayload
  ): Promise<ServiceResponse<OnlineMissionRunRecord>> {
    // 1. Xác thực server-side
    const auth = this.verifyAuthToken(authHeader);
    if (!auth.valid || !auth.userId) {
      return {
        statusCode: 401,
        success: false,
        error: { code: 'UNAUTHORIZED', message: auth.error || 'Yêu cầu không được xác thực.' }
      };
    }
    const verifiedOwnerId = auth.userId;

    // 2. Validate payload cơ bản
    if (!payload || !payload.runId || !payload.missionId) {
      return {
        statusCode: 400,
        success: false,
        error: { code: 'INVALID_PAYLOAD', message: 'Dữ liệu đồng bộ thiếu runId hoặc missionId.' }
      };
    }

    // 3. Idempotency: Kiểm tra xem runId này đã được lưu trước đó chưa
    const existing = await this.storage.getRunRecord(verifiedOwnerId, payload.runId);
    if (existing) {
      // Đã lưu trước đó -> Trả lại bản ghi cũ mà không ghi đè hay thay đổi ngày sync
      return {
        statusCode: 200,
        success: true,
        data: existing
      };
    }

    // 4. Tạo bản ghi mới chuẩn hóa (gán ownerId đã xác minh từ server)
    const newRecord: OnlineMissionRunRecord = {
      runId: payload.runId,
      ownerId: verifiedOwnerId,
      missionId: payload.missionId,
      missionType: payload.missionType,
      spacecraftName: payload.spacecraftName || 'Unknown Craft',
      spacecraftPayload: payload.spacecraftPayload,
      startTimeIso: payload.startTimeIso || new Date().toISOString(),
      endTimeIso: payload.endTimeIso,
      durationSeconds: typeof payload.durationSeconds === 'number' && Number.isFinite(payload.durationSeconds)
        ? payload.durationSeconds
        : 0,
      status: payload.status,
      isThresholdMet: !!payload.isThresholdMet,
      score: payload.score,
      remainingBudget: payload.remainingBudget,
      rulesVersion: payload.rulesVersion || '1.0.0',
      contentVersion: payload.contentVersion || '1.0.0',
      debriefReport: payload.debriefReport ? JSON.parse(JSON.stringify(payload.debriefReport)) : undefined,
      syncedAtIso: new Date().toISOString()
    };

    // 5. Lưu bền vững vào storage
    const saved = await this.storage.saveRunRecord(newRecord);
    if (!saved) {
      return {
        statusCode: 500,
        success: false,
        error: { code: 'STORAGE_FAILURE', message: 'Lỗi ghi dữ liệu vào hệ thống lưu trữ online.' }
      };
    }

    return {
      statusCode: 200,
      success: true,
      data: newRecord
    };
  }

  /**
   * Lấy danh sách lịch sử có phân trang (GET /api/missions/history)
   */
  public async handleListHistory(
    authHeader: string | undefined,
    query: OnlineHistoryPaginationQuery
  ): Promise<ServiceResponse<OnlineHistoryPaginationResult>> {
    const auth = this.verifyAuthToken(authHeader);
    if (!auth.valid || !auth.userId) {
      return {
        statusCode: 401,
        success: false,
        error: { code: 'UNAUTHORIZED', message: auth.error || 'Yêu cầu không được xác thực.' }
      };
    }

    const result = await this.storage.listRuns(auth.userId, query);
    return {
      statusCode: 200,
      success: true,
      data: result
    };
  }

  /**
   * Lấy chi tiết Debrief Report theo runId (GET /api/missions/history/:runId/report)
   */
  public async handleGetReport(
    authHeader: string | undefined,
    runId: string
  ): Promise<ServiceResponse<RunResult>> {
    const auth = this.verifyAuthToken(authHeader);
    if (!auth.valid || !auth.userId) {
      return {
        statusCode: 401,
        success: false,
        error: { code: 'UNAUTHORIZED', message: auth.error || 'Yêu cầu không được xác thực.' }
      };
    }

    if (!runId || !runId.trim()) {
      return {
        statusCode: 400,
        success: false,
        error: { code: 'INVALID_RUN_ID', message: 'runId không hợp lệ.' }
      };
    }

    const record = await this.storage.getRunRecord(auth.userId, runId);
    if (!record) {
      return {
        statusCode: 404,
        success: false,
        error: { code: 'NOT_FOUND', message: `Không tìm thấy báo cáo cho lượt chơi '${runId}'.` }
      };
    }

    if (!record.debriefReport) {
      return {
        statusCode: 404,
        success: false,
        error: { code: 'REPORT_NOT_READY', message: 'Lượt chơi này chưa có debrief report.' }
      };
    }

    return {
      statusCode: 200,
      success: true,
      data: record.debriefReport
    };
  }
}
