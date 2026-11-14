/**
 * Mission Contract & Domain Interfaces (TIP-001 / FIX-03 & FIX-04)
 *
 * Định nghĩa hợp đồng kiểu dữ liệu cho MissionRun, Progress, Command, ValidationError, RunResult.
 * Tuân thủ REQ-01 đến REQ-07.
 * FIX-03: Tách biệt đạt ngưỡng với kết quả toàn ván; thiếu điều kiện thì UNRESOLVED, không tự kết luận SUCCESS/FAILURE.
 * FIX-04: Bổ sung commandId và expectedRevision cho hợp đồng command.
 * FIX-06: Lưu nguồn địa điểm của từng mẫu đã thu thập (collectedSamples có siteId).
 */

export type MissionType = 'M1_PHOTO_QUIZ' | 'M2_SAMPLE_RETURN' | 'NASA_LEGACY';

export type CelestialTargetId =
  | 'earth'
  | 'moon'
  | 'mars'
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'didymos'
  | 'bennu'
  | 'apophis'
  | string;

export type ValidM2LandingSite = 'earth' | 'moon' | 'mars';

export const M2_ALLOWED_LANDING_SITES: readonly ValidM2LandingSite[] = ['earth', 'moon', 'mars'] as const;

export interface MissionCatalogItem {
  id: string;
  type: MissionType;
  title: string;
  targetBodyId: CelestialTargetId;
  budgetCredits?: number;
  durationLimitSeconds?: number;
  rulesVersion: string;
  contentVersion: string;
}

export interface QuizQuestionContract {
  id: string;
  targetBodyId: CelestialTargetId;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

export interface SampleItemContract {
  id: string;
  name: string;
  siteId: ValidM2LandingSite;
  typeCategory: string; // Tên phân loại mẫu (ví dụ: 'basalt', 'regolith', 'ice')
}

export interface MissionRunConfig {
  runId: string;
  missionId: string;
  missionType: MissionType;
  rulesVersion: string;
  contentVersion: string;
  revision: number;
  m1Questions?: QuizQuestionContract[];
  m2AvailableSamples?: SampleItemContract[];
  initialBudgetCredits?: number;
  durationLimitSeconds?: number;
}

export type RunStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'UNRESOLVED';

export interface M1Progress {
  answeredQuestions: {
    questionId: string;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
  totalQuestions: number;
  correctAnswersCount: number;
  accuracyRatio: number;
  isKnowledgeThresholdMet: boolean;
}

export interface CollectedSampleRecord {
  sample: SampleItemContract;
  collectedAtSite: ValidM2LandingSite;
  timestamp: number;
}

export interface M2Progress {
  currentLandingSite: ValidM2LandingSite | null;
  /**
   * FIX-06: Lưu giữ toàn bộ các mẫu đã thu kèm địa điểm thu thập qua nhiều chặng bay
   */
  collectedSamples: CollectedSampleRecord[];
  uniqueCategoriesCollected: string[];
  isSampleThresholdMet: boolean;
}

export interface MissionProgress {
  runId: string;
  revision: number;
  status: RunStatus;
  remainingBudgetCredits?: number;
  elapsedTimeSeconds: number;
  m1Progress?: M1Progress;
  m2Progress?: M2Progress;
  isOutcomeReady: boolean;
}

// FIX-04: Commands có commandId và expectedRevision rõ ràng
export type MissionCommand =
  | {
      commandId: string;
      expectedRevision?: number;
      type: 'START_RUN';
      runId: string;
      config: MissionRunConfig;
      timestamp: number;
    }
  | {
      commandId: string;
      expectedRevision?: number;
      type: 'ANSWER_QUIZ';
      runId: string;
      questionId: string;
      selectedOptionIndex: number;
      timestamp: number;
    }
  | {
      commandId: string;
      expectedRevision?: number;
      type: 'LAND_AND_COLLECT_SAMPLE';
      runId: string;
      siteId: string;
      sampleId: string;
      timestamp: number;
    }
  | {
      commandId: string;
      expectedRevision?: number;
      type: 'COMPLETE_RUN';
      runId: string;
      timestamp: number;
    };

export interface ValidationError {
  code:
    | 'INVALID_RUN_ID'
    | 'INVALID_REVISION'
    | 'REVISION_MISMATCH'
    | 'COMMAND_PAYLOAD_MISMATCH'
    | 'RUN_ALREADY_FINISHED'
    | 'UNKNOWN_QUESTION'
    | 'INVALID_OPTION_INDEX'
    | 'REANSWER_POLICY_UNVERIFIED'
    | 'INVALID_LANDING_SITE'
    | 'SAMPLE_NOT_FOUND_AT_SITE'
    | 'DUPLICATE_SAMPLE'
    | 'UNRESOLVED_DATA'
    | 'INVALID_TIME'
    | 'INVALID_BUDGET'
    | 'RULE_VIOLATION';
  message: string;
  field?: string;
}

export interface RunResult {
  runId: string;
  missionId: string;
  missionType: MissionType;
  rulesVersion: string;
  contentVersion: string;
  /**
   * FIX-03: Thêm UNRESOLVED khi thiếu thông tin toàn ván
   */
  status: 'SUCCESS' | 'FAILURE' | 'IN_PROGRESS' | 'UNRESOLVED';
  isThresholdMet: boolean;
  score?: number; // Chỉ có khi có công thức xác minh, không tự đặt *10 hay *50
  remainingBudget?: number;
  elapsedTimeSeconds: number;
  reasons: string[];
  summary: string;
}

export interface ClientMissionView {
  runId: string;
  revision: number;
  status: RunStatus;
  allowedActions: ('ANSWER_QUIZ' | 'LAND_AND_COLLECT_SAMPLE' | 'COMPLETE_RUN')[];
  disallowedActions: {
    action: string;
    reason: string;
  }[];
  progressDisplay: {
    label: string;
    value: string;
    percentage: number;
  };
  budgetRemainingDisplay?: string;
  isReportReady: boolean;
  debriefReport?: RunResult;
}
