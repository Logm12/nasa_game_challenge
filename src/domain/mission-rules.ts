/**
 * Mission Rules Engine (TIP-003 / FIX-03 & FIX-06)
 *
 * FIX-03: Tách biệt đạt ngưỡng với kết quả toàn ván; thiếu dữ liệu thì UNRESOLVED.
 * FIX-06: Giữ mẫu qua nhiều địa điểm; một loại tại Earth + hai loại tại Moon đạt 3 loại.
 */

import {
  MissionRunConfig,
  M1Progress,
  M2Progress,
  ValidationError,
  M2_ALLOWED_LANDING_SITES,
  ValidM2LandingSite,
  SampleItemContract,
  CollectedSampleRecord
} from './mission-contract';

export interface EvaluationOutcome {
  isValid: boolean;
  error?: ValidationError;
  m1Progress?: M1Progress;
  m2Progress?: M2Progress;
  isThresholdMet: boolean;
}

/**
 * Đánh giá tiến độ M1 (Photo/Quiz)
 */
export function evaluateM1Quiz(
  config: MissionRunConfig,
  currentAnswers: Map<string, number>
): EvaluationOutcome {
  if (!config.m1Questions || config.m1Questions.length === 0) {
    return {
      isValid: false,
      error: {
        code: 'UNRESOLVED_DATA',
        message: 'Nhiệm vụ M1 chưa có danh sách câu hỏi xác minh.'
      },
      isThresholdMet: false
    };
  }

  const totalQuestions = config.m1Questions.length;
  let correctCount = 0;
  const answeredRecords: M1Progress['answeredQuestions'] = [];

  for (const q of config.m1Questions) {
    if (currentAnswers.has(q.id)) {
      const selectedOption = currentAnswers.get(q.id)!;
      const isCorrect = selectedOption === q.correctOptionIndex;
      if (isCorrect) correctCount++;
      answeredRecords.push({
        questionId: q.id,
        selectedOptionIndex: selectedOption,
        isCorrect
      });
    }
  }

  const accuracyRatio = correctCount / totalQuestions;
  const isKnowledgeThresholdMet = accuracyRatio >= 0.8; // Đúng >= 80% (REQ-03)

  return {
    isValid: true,
    m1Progress: {
      answeredQuestions: answeredRecords,
      totalQuestions,
      correctAnswersCount: correctCount,
      accuracyRatio,
      isKnowledgeThresholdMet
    },
    isThresholdMet: isKnowledgeThresholdMet
  };
}

/**
 * Đánh giá tiến độ M2 (Sample Return)
 * FIX-06: Nhận danh sách các mẫu đã thu thập tích lũy qua các địa điểm khác nhau
 */
export function evaluateM2SampleReturn(
  config: MissionRunConfig,
  currentLandingSite: string | null,
  collectedRecords: CollectedSampleRecord[]
): EvaluationOutcome {
  if (!config.m2AvailableSamples || config.m2AvailableSamples.length === 0) {
    return {
      isValid: false,
      error: {
        code: 'UNRESOLVED_DATA',
        message: 'Nhiệm vụ M2 chưa có danh mục mẫu vật xác minh.'
      },
      isThresholdMet: false
    };
  }

  const uniqueCategoriesSet = new Set<string>();
  const validCollected: CollectedSampleRecord[] = [];

  for (const rec of collectedRecords) {
    // Chỉ tính các mẫu được lấy tại các địa điểm hợp lệ (Earth/Moon/Mars) (REQ-02)
    const isAllowed = (M2_ALLOWED_LANDING_SITES as readonly string[]).includes(rec.collectedAtSite);
    if (isAllowed && rec.sample && rec.sample.typeCategory) {
      validCollected.push(rec);
      uniqueCategoriesSet.add(rec.sample.typeCategory);
    }
  }

  // Đạt ngưỡng mẫu: Thu thập ít nhất 3 loại mẫu vật KHÁC NHAU từ Earth, Moon, Mars (REQ-01, REQ-02)
  // Không bắt buộc phải lấy tại cùng một địa điểm (ví dụ: 1 loại ở Earth + 2 loại ở Moon là đạt).
  const isSampleThresholdMet = uniqueCategoriesSet.size >= 3;

  return {
    isValid: true,
    m2Progress: {
      currentLandingSite: currentLandingSite as ValidM2LandingSite | null,
      collectedSamples: validCollected,
      uniqueCategoriesCollected: Array.from(uniqueCategoriesSet),
      isSampleThresholdMet
    },
    isThresholdMet: isSampleThresholdMet
  };
}
