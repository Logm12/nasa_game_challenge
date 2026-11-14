/**
 * Mission Run Manager (TIP-004 / FIX-03, FIX-04, FIX-05, FIX-06, FIX-08)
 *
 * Quản lý vòng đời ván chơi, chuyển trạng thái và xử lý lệnh.
 *
 * FIX-03: Ngân sách âm/không hữu hạn bị từ chối; bỏ đơn vị $M tự đặt; tách đạt ngưỡng với kết quả toàn ván.
 * FIX-04: Bổ sung commandId và expectedRevision; validate payload chặt chẽ; chặn re-answer khi chưa có chính sách;
 *         trả cùng kết quả cho lệnh lặp (kể cả COMPLETE_RUN).
 * FIX-05: Đóng băng/sao chép sâu config để caller không thể sửa từ bên ngoài; bảo vệ snapshot kết quả.
 * FIX-06: Giữ tiến độ mẫu vật qua nhiều địa điểm bay (Earth -> Moon -> Mars).
 * FIX-08: Kiểm tra thời gian hữu hạn >= 0 trong updateElapsedTime.
 */

import {
  MissionRunConfig,
  MissionProgress,
  MissionCommand,
  ValidationError,
  RunResult,
  ClientMissionView,
  CollectedSampleRecord,
  ValidM2LandingSite,
  M2_ALLOWED_LANDING_SITES
} from './mission-contract';
import { evaluateM1Quiz, evaluateM2SampleReturn } from './mission-rules';
import { buildDebriefReport } from './mission-report';

export class MissionRunManager {
  private config: MissionRunConfig;
  private status: MissionProgress['status'] = 'NOT_STARTED';
  private revision = 0;
  private currentBudget?: number;
  private elapsedTimeSeconds = 0;

  // State M1
  private m1Answers = new Map<string, number>();

  // State M2: FIX-06 lưu giữ mẫu thu thập tích lũy theo địa điểm
  private m2CurrentSite: ValidM2LandingSite | null = null;
  private m2CollectedRecords: CollectedSampleRecord[] = [];

  // Idempotency: Lưu map commandId -> { payloadJson: string, result: { success: boolean, error?: ValidationError } }
  private processedCommandMap = new Map<
    string,
    { payloadJson: string; result: { success: boolean; error?: ValidationError } }
  >();

  // Snapshot kết quả cố định khi ván kết thúc
  private cachedFinalReport: RunResult | null = null;

  constructor(rawConfig: MissionRunConfig) {
    // FIX-05: Deep copy config để bảo vệ khỏi thay đổi từ bên ngoài
    this.config = JSON.parse(JSON.stringify(rawConfig));

    // FIX-03: Kiểm tra ngân sách ban đầu hợp lệ
    if (this.config.initialBudgetCredits !== undefined) {
      if (
        typeof this.config.initialBudgetCredits !== 'number' ||
        !Number.isFinite(this.config.initialBudgetCredits) ||
        this.config.initialBudgetCredits < 0
      ) {
        // Đánh dấu ngân sách không hợp lệ
        this.currentBudget = -1;
      } else {
        this.currentBudget = this.config.initialBudgetCredits;
      }
    }
  }

  public getRunId(): string {
    return this.config.runId;
  }

  public getStatus(): MissionProgress['status'] {
    return this.status;
  }

  public startRun(): { success: boolean; error?: ValidationError } {
    if (this.status !== 'NOT_STARTED') {
      return {
        success: false,
        error: { code: 'RULE_VIOLATION', message: 'Ván chơi đã bắt đầu trước đó.' }
      };
    }
    this.status = 'IN_PROGRESS';
    this.revision++;
    return { success: true };
  }

  /**
   * FIX-08: Thời gian chỉ nhận số hữu hạn, không âm
   */
  public updateElapsedTime(seconds: number): void {
    if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0 || isNaN(seconds)) {
      // Đầu vào sai không đổi state
      return;
    }
    if (this.status === 'IN_PROGRESS') {
      this.elapsedTimeSeconds += seconds;
    }
  }

  /**
   * Xử lý lệnh gameplay (FIX-04)
   */
  public executeCommand(command: MissionCommand): { success: boolean; error?: ValidationError } {
    if (!command || !command.commandId) {
      return {
        success: false,
        error: { code: 'RULE_VIOLATION', message: 'Lệnh thiếu commandId bắt buộc.' }
      };
    }

    if (command.runId !== this.config.runId) {
      return {
        success: false,
        error: { code: 'INVALID_RUN_ID', message: 'runId của lệnh không khớp với ván đang chạy.' }
      };
    }

    // 1. Kiểm tra đối chiếu lệnh đã xử lý (Idempotency) trước khi kiểm tra expectedRevision hiện tại
    const currentPayloadJson = JSON.stringify(command);
    if (this.processedCommandMap.has(command.commandId)) {
      const prev = this.processedCommandMap.get(command.commandId)!;
      if (prev.payloadJson === currentPayloadJson) {
        // Cùng commandId và cùng payload -> Trả lại đúng kết quả đã lưu trước đó mà không đổi state/revision
        return prev.result;
      } else {
        // Cùng commandId nhưng khác payload -> Bị từ chối
        return {
          success: false,
          error: {
            code: 'COMMAND_PAYLOAD_MISMATCH',
            message: `CommandId '${command.commandId}' đã được sử dụng với payload khác.`
          }
        };
      }
    }

    // 2. Lệnh mới: bắt buộc kiểm tra expectedRevision; thiếu hoặc sai revision phải bị từ chối
    if (command.expectedRevision === undefined || typeof command.expectedRevision !== 'number') {
      return {
        success: false,
        error: {
          code: 'INVALID_REVISION',
          message: 'Lệnh mới bắt buộc phải cung cấp expectedRevision hợp lệ.'
        }
      };
    }

    if (command.expectedRevision !== this.revision) {
      return {
        success: false,
        error: {
          code: 'REVISION_MISMATCH',
          message: `Lệch revision: expected ${command.expectedRevision}, current ${this.revision}.`
        }
      };
    }

    // Nếu ván đã kết thúc thì không nhận lệnh mới nữa (ngoại trừ lệnh lặp đã được bắt ở trên)
    if (this.status !== 'IN_PROGRESS') {
      const errRes = {
        success: false,
        error: {
          code: 'RUN_ALREADY_FINISHED' as const,
          message: 'Không thể nhận lệnh khi ván không ở trạng thái IN_PROGRESS.'
        }
      };
      return errRes;
    }

    if (command.type === 'ANSWER_QUIZ') {
      if (this.config.missionType !== 'M1_PHOTO_QUIZ') {
        return {
          success: false,
          error: { code: 'RULE_VIOLATION', message: 'Lệnh ANSWER_QUIZ chỉ hợp lệ cho nhiệm vụ M1.' }
        };
      }

      // Kiểm tra câu hỏi có trong danh sách cố định không
      const question = this.config.m1Questions?.find(q => q.id === command.questionId);
      if (!question) {
        return {
          success: false,
          error: { code: 'UNKNOWN_QUESTION', message: `Câu hỏi '${command.questionId}' không tồn tại trong ván.` }
        };
      }

      // Kiểm tra option hợp lệ: chỉ nhận số nguyên hữu hạn trong phạm vi options
      const opt = command.selectedOptionIndex;
      if (
        typeof opt !== 'number' ||
        !Number.isFinite(opt) ||
        isNaN(opt) ||
        Math.floor(opt) !== opt ||
        opt < 0 ||
        opt >= question.options.length
      ) {
        return {
          success: false,
          error: {
            code: 'INVALID_OPTION_INDEX',
            message: `Lựa chọn '${command.selectedOptionIndex}' không hợp lệ (yêu cầu số nguyên trong phạm vi options).`
          }
        };
      }

      // FIX-04: Chưa xác minh chính sách trả lời lại -> Từ chối thay đổi câu trả lời đã ghi nhận
      if (this.m1Answers.has(command.questionId)) {
        return {
          success: false,
          error: {
            code: 'REANSWER_POLICY_UNVERIFIED',
            message: 'Chính sách trả lời lại câu hỏi chưa được xác minh; không thể đổi đáp án đã nộp.'
          }
        };
      }

      this.m1Answers.set(command.questionId, command.selectedOptionIndex);
      this.revision++;
      const okResult = { success: true };
      this.processedCommandMap.set(command.commandId, { payloadJson: currentPayloadJson, result: okResult });
      return okResult;
    }

    if (command.type === 'LAND_AND_COLLECT_SAMPLE') {
      if (this.config.missionType !== 'M2_SAMPLE_RETURN') {
        return {
          success: false,
          error: { code: 'RULE_VIOLATION', message: 'Lệnh LAND_AND_COLLECT_SAMPLE chỉ hợp lệ cho M2.' }
        };
      }

      // FIX-04: Kiểm tra địa điểm đáp có thuộc Earth/Moon/Mars (REQ-02)
      const isAllowedSite = (M2_ALLOWED_LANDING_SITES as readonly string[]).includes(command.siteId);
      if (!isAllowedSite) {
        return {
          success: false,
          error: {
            code: 'INVALID_LANDING_SITE',
            message: `Địa điểm '${command.siteId}' không được phép đáp. Chỉ cho phép đáp tại Earth, Moon, Mars (REQ-02).`
          }
        };
      }

      // Kiểm tra mẫu vật có tồn tại và thuộc đúng địa điểm đáp không
      const sampleItem = this.config.m2AvailableSamples?.find(
        s => s.id === command.sampleId && s.siteId === command.siteId
      );
      if (!sampleItem) {
        return {
          success: false,
          error: {
            code: 'SAMPLE_NOT_FOUND_AT_SITE',
            message: `Mẫu vật '${command.sampleId}' không tồn tại tại địa điểm '${command.siteId}'.`
          }
        };
      }

      // Kiểm tra trùng lặp ID mẫu
      if (this.m2CollectedRecords.some(r => r.sample.id === command.sampleId)) {
        return {
          success: false,
          error: {
            code: 'DUPLICATE_SAMPLE',
            message: `Mẫu vật '${command.sampleId}' đã được thu thập trước đó.`
          }
        };
      }

      // FIX-06: Cập nhật địa điểm hiện tại và lưu mẫu tích lũy
      this.m2CurrentSite = command.siteId as ValidM2LandingSite;
      this.m2CollectedRecords.push({
        sample: sampleItem,
        collectedAtSite: command.siteId as ValidM2LandingSite,
        timestamp: command.timestamp
      });
      this.revision++;
      const okResult = { success: true };
      this.processedCommandMap.set(command.commandId, { payloadJson: currentPayloadJson, result: okResult });
      return okResult;
    }

    if (command.type === 'COMPLETE_RUN') {
      this.status = 'COMPLETED';
      this.revision++;
      this.cachedFinalReport = buildDebriefReport(this.config, this.getProgress());
      const okResult = { success: true };
      this.processedCommandMap.set(command.commandId, { payloadJson: currentPayloadJson, result: okResult });
      return okResult;
    }

    return { success: false, error: { code: 'RULE_VIOLATION', message: 'Loại lệnh không xác định.' } };
  }

  public getProgress(): MissionProgress {
    let m1Prog = undefined;
    let m2Prog = undefined;

    if (this.config.missionType === 'M1_PHOTO_QUIZ') {
      const evalM1 = evaluateM1Quiz(this.config, this.m1Answers);
      m1Prog = evalM1.m1Progress;
    } else if (this.config.missionType === 'M2_SAMPLE_RETURN') {
      const evalM2 = evaluateM2SampleReturn(this.config, this.m2CurrentSite, this.m2CollectedRecords);
      m2Prog = evalM2.m2Progress;
    }

    return {
      runId: this.config.runId,
      revision: this.revision,
      status: this.status,
      remainingBudgetCredits: this.currentBudget,
      elapsedTimeSeconds: this.elapsedTimeSeconds,
      m1Progress: m1Prog,
      m2Progress: m2Prog,
      isOutcomeReady: this.status === 'COMPLETED' || this.status === 'FAILED'
    };
  }

  /**
   * FIX-05: getFinalReport trả về bản deep clone của cachedFinalReport
   */
  public getFinalReport(): { isReady: boolean; report?: RunResult } {
    if (this.status !== 'COMPLETED' && this.status !== 'FAILED') {
      return { isReady: false };
    }
    if (!this.cachedFinalReport) {
      this.cachedFinalReport = buildDebriefReport(this.config, this.getProgress());
    }
    return {
      isReady: true,
      report: JSON.parse(JSON.stringify(this.cachedFinalReport))
    };
  }

  /**
   * FIX-03 & FIX-05: Dựng view model sạch không gán $M tự đặt
   */
  public getClientView(): ClientMissionView {
    const prog = this.getProgress();
    const isCompleted = prog.isOutcomeReady;

    const allowed: ClientMissionView['allowedActions'] = [];
    const disallowed: ClientMissionView['disallowedActions'] = [];

    if (!isCompleted) {
      if (this.config.missionType === 'M1_PHOTO_QUIZ') {
        allowed.push('ANSWER_QUIZ');
      } else if (this.config.missionType === 'M2_SAMPLE_RETURN') {
        allowed.push('LAND_AND_COLLECT_SAMPLE');
      }
      allowed.push('COMPLETE_RUN');
    } else {
      disallowed.push({ action: 'ALL', reason: 'Ván chơi đã kết thúc.' });
    }

    let progressLabel = 'Tiến độ';
    let progressValue = '0%';
    let pct = 0;

    if (this.config.missionType === 'M1_PHOTO_QUIZ' && prog.m1Progress) {
      progressLabel = 'Kiến thức trả lời đúng';
      pct = Math.round(prog.m1Progress.accuracyRatio * 100);
      progressValue = `${prog.m1Progress.correctAnswersCount}/${prog.m1Progress.totalQuestions} (${pct}%)`;
    } else if (this.config.missionType === 'M2_SAMPLE_RETURN' && prog.m2Progress) {
      progressLabel = 'Loại mẫu vật thu thập';
      const count = prog.m2Progress.uniqueCategoriesCollected.length;
      pct = Math.min(100, Math.round((count / 3) * 100));
      progressValue = `${count}/3 loại`;
    }

    const budgetDisplay =
      this.currentBudget !== undefined
        ? this.currentBudget < 0
          ? 'Ngân sách không hợp lệ'
          : `${this.currentBudget} credits`
        : 'Chưa xác định';

    return {
      runId: this.config.runId,
      revision: this.revision,
      status: this.status,
      allowedActions: allowed,
      disallowedActions: disallowed,
      progressDisplay: {
        label: progressLabel,
        value: progressValue,
        percentage: pct
      },
      budgetRemainingDisplay: budgetDisplay,
      isReportReady: isCompleted,
      debriefReport: this.cachedFinalReport ? JSON.parse(JSON.stringify(this.cachedFinalReport)) : undefined
    };
  }
}
