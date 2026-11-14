/**
 * Mission Report & Run Debrief (TIP-004 / FIX-03 & FIX-05)
 *
 * Xây dựng báo cáo kết quả ván (RunResult) cố định độc lập với DOM và Three.js.
 * FIX-03: Tách đạt ngưỡng khỏi thắng toàn ván.
 * - Nếu thiếu ngân sách xác minh hoặc ngân sách âm/không hợp lệ -> status = 'UNRESOLVED' (hoặc 'FAILURE' nếu ngân sách âm).
 * - Bỏ điểm nhân *10 hoặc *50 tự ý đặt ra.
 * FIX-05: Trả về bản deep-copy để caller không thể sửa snapshot nội bộ.
 */

import { MissionRunConfig, MissionProgress, RunResult } from './mission-contract';

export function buildDebriefReport(
  config: MissionRunConfig,
  progress: MissionProgress
): RunResult {
  const isM1 = config.missionType === 'M1_PHOTO_QUIZ';
  const isM2 = config.missionType === 'M2_SAMPLE_RETURN';

  let isThresholdMet = false;
  const reasons: string[] = [];

  if (isM1 && progress.m1Progress) {
    isThresholdMet = progress.m1Progress.isKnowledgeThresholdMet;
    if (isThresholdMet) {
      reasons.push(
        `Đạt ngưỡng kiến thức: Đúng ${progress.m1Progress.correctAnswersCount}/${progress.m1Progress.totalQuestions} câu (${Math.round(progress.m1Progress.accuracyRatio * 100)}% >= 80%).`
      );
    } else {
      reasons.push(
        `Chưa đạt ngưỡng kiến thức: Đúng ${progress.m1Progress.correctAnswersCount}/${progress.m1Progress.totalQuestions} câu (${Math.round(progress.m1Progress.accuracyRatio * 100)}% < 80%).`
      );
    }
  } else if (isM2 && progress.m2Progress) {
    isThresholdMet = progress.m2Progress.isSampleThresholdMet;
    if (isThresholdMet) {
      reasons.push(
        `Đạt ngưỡng thu thập mẫu: Đã lấy ${progress.m2Progress.uniqueCategoriesCollected.length} loại mẫu khác nhau tại ${progress.m2Progress.collectedSamples.map(s => s.collectedAtSite).join(', ')}.`
      );
    } else {
      reasons.push(
        `Chưa đạt ngưỡng mẫu vật: Chỉ có ${progress.m2Progress.uniqueCategoriesCollected.length} loại mẫu (yêu cầu ít nhất 3 loại tại Earth/Moon/Mars).`
      );
    }
  } else {
    reasons.push('Nhiệm vụ chưa xác định hoặc thiếu dữ liệu tiến độ.');
  }

  // FIX-03: Xác định kết quả toàn ván:
  // - Nếu không có dữ liệu câu hỏi / mẫu -> UNRESOLVED
  // - Nếu ngân sách không xác minh (undefined) -> UNRESOLVED (không tự kết luận SUCCESS)
  // - Nếu ngân sách âm -> FAILURE
  let status: RunResult['status'] = 'IN_PROGRESS';

  const isConfigIncomplete =
    (isM1 && (!config.m1Questions || config.m1Questions.length === 0)) ||
    (isM2 && (!config.m2AvailableSamples || config.m2AvailableSamples.length === 0));

  if (progress.status === 'COMPLETED') {
    if (isConfigIncomplete) {
      status = 'UNRESOLVED';
      reasons.push('Không thể xác định kết quả toàn ván do thiếu cấu hình nhiệm vụ xác minh.');
    } else if (config.initialBudgetCredits === undefined || progress.remainingBudgetCredits === undefined) {
      status = 'UNRESOLVED';
      reasons.push('Chưa có thông số ngân sách xác minh để đánh giá thành công toàn ván.');
    } else if (progress.remainingBudgetCredits < 0) {
      status = 'FAILURE';
      reasons.push('Nhiệm vụ thất bại do vượt quá ngân sách cho phép.');
    } else if (config.durationLimitSeconds === undefined) {
      // Khi chính sách thời gian/deadline còn chưa xác minh, kết quả toàn ván phải UNRESOLVED
      status = 'UNRESOLVED';
      reasons.push('Chính sách thời hạn nhiệm vụ chưa xác minh; không thể kết luận thành công toàn ván.');
    } else if (progress.elapsedTimeSeconds > config.durationLimitSeconds) {
      status = 'FAILURE';
      reasons.push('Nhiệm vụ thất bại do vượt quá thời hạn cho phép.');
    } else {
      status = isThresholdMet ? 'SUCCESS' : 'FAILURE';
    }
  } else if (progress.status === 'FAILED') {
    status = 'FAILURE';
  } else if (progress.status === 'UNRESOLVED') {
    status = 'UNRESOLVED';
  }

  let summary = '';
  if (status === 'SUCCESS') {
    summary = `Nhiệm vụ hoàn thành xuất sắc! Đạt toàn bộ chỉ tiêu khoa học và ngân sách.`;
  } else if (status === 'FAILURE') {
    summary = `Nhiệm vụ kết thúc nhưng chưa đạt yêu cầu thành công toàn ván.`;
  } else if (status === 'UNRESOLVED') {
    summary = `Nhiệm vụ kết thúc; một số tiêu chí toàn ván chưa đủ dữ liệu xác minh.`;
  } else {
    summary = `Nhiệm vụ đang diễn ra.`;
  }

  // FIX-05: Trả về object độc lập không giữ tham chiếu mảng reasons
  return {
    runId: progress.runId,
    missionId: config.missionId,
    missionType: config.missionType,
    rulesVersion: config.rulesVersion,
    contentVersion: config.contentVersion,
    status,
    isThresholdMet,
    remainingBudget: progress.remainingBudgetCredits,
    elapsedTimeSeconds: progress.elapsedTimeSeconds,
    reasons: [...reasons],
    summary
  };
}
