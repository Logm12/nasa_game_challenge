import { MissionRunManager } from '../src/domain/mission-run-manager';
import { MissionRunConfig, QuizQuestionContract, SampleItemContract } from '../src/domain/mission-contract';

console.log('--- Testing Mission Run Manager (TIP-004 / FIX-03..08 & Lõi Mới) ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, msg: string) {
  totalTests++;
  if (!condition) {
    console.error(`FAIL [${totalTests}]: ${msg}`);
    process.exit(1);
  }
  passedTests++;
  console.log(`  ✓ ${msg}`);
}

const mockQuestions: QuizQuestionContract[] = [
  { id: 'q1', targetBodyId: 'earth', questionText: 'Q1', options: ['A', 'B'], correctOptionIndex: 0 },
  { id: 'q2', targetBodyId: 'earth', questionText: 'Q2', options: ['A', 'B'], correctOptionIndex: 0 }
];

const mockSamples: SampleItemContract[] = [
  { id: 's_earth_1', name: 'Mẫu Trái Đất', siteId: 'earth', typeCategory: 'cat_e' },
  { id: 's_moon_1', name: 'Mẫu Mặt Trăng 1', siteId: 'moon', typeCategory: 'cat_m1' },
  { id: 's_moon_2', name: 'Mẫu Mặt Trăng 2', siteId: 'moon', typeCategory: 'cat_m2' }
];

function createConfig(runId: string, initialBudget?: number, durationLimit?: number): MissionRunConfig {
  return {
    runId,
    missionId: 'm1_test',
    missionType: 'M1_PHOTO_QUIZ',
    rulesVersion: '1.0.0',
    contentVersion: '1.0.0',
    revision: 1,
    m1Questions: mockQuestions,
    initialBudgetCredits: initialBudget,
    durationLimitSeconds: durationLimit
  };
}

// ----------------------------------------------------
// 1. Kiểm tra Idempotency & Revision (Chỉ đạo mới):
// Gửi lệnh ở rev 1, thành công -> rev 2; gửi lại nguyên lệnh -> cùng kết quả & rev vẫn là 2
// ----------------------------------------------------
const runIdempotency = new MissionRunManager(createConfig('RUN_IDEMPOTENCY', 500, 3600));
runIdempotency.startRun(); // Revision từ 0 -> 1
assert(runIdempotency.getProgress().revision === 1, 'Bắt đầu ván: revision = 1');

// Lệnh mới thiếu expectedRevision -> Bị từ chối
const missingRevCmd = runIdempotency.executeCommand({
  commandId: 'cmd_rev_test',
  type: 'ANSWER_QUIZ',
  runId: 'RUN_IDEMPOTENCY',
  questionId: 'q1',
  selectedOptionIndex: 0,
  timestamp: 10
} as any);
assert(!missingRevCmd.success && missingRevCmd.error?.code === 'INVALID_REVISION', 'Lệnh thiếu expectedRevision bị từ chối');

// Lệnh mới với expectedRevision sai (ví dụ 99 != 1) -> Bị từ chối
const wrongRevCmd = runIdempotency.executeCommand({
  commandId: 'cmd_rev_test',
  expectedRevision: 99,
  type: 'ANSWER_QUIZ',
  runId: 'RUN_IDEMPOTENCY',
  questionId: 'q1',
  selectedOptionIndex: 0,
  timestamp: 10
});
assert(!wrongRevCmd.success && wrongRevCmd.error?.code === 'REVISION_MISMATCH', 'Lệnh sai expectedRevision bị từ chối');

// Gửi lệnh ở revision 1 -> Thành công, revision trở thành 2
const validCmd = {
  commandId: 'cmd_rev_test',
  expectedRevision: 1,
  type: 'ANSWER_QUIZ' as const,
  runId: 'RUN_IDEMPOTENCY',
  questionId: 'q1',
  selectedOptionIndex: 0,
  timestamp: 10
};
const resFirst = runIdempotency.executeCommand(validCmd);
assert(resFirst.success, 'Lệnh gửi ở revision 1 thành công');
assert(runIdempotency.getProgress().revision === 2, 'Sau khi thành công: revision = 2');

// Gửi lại NGUYÊN lệnh cũ (kèm expectedRevision: 1) -> Vẫn nhận cùng kết quả và revision VẪN LÀ 2
const resSecond = runIdempotency.executeCommand(validCmd);
assert(resSecond.success, 'Gửi lại nguyên lệnh nhận lại cùng kết quả');
assert(runIdempotency.getProgress().revision === 2, 'Revision vẫn giữ nguyên là 2, không bị tăng và không bị báo lỗi lệch revision');

// Gửi lại cùng commandId nhưng sửa payload -> Bị từ chối
const tamperedPayloadCmd = { ...validCmd, selectedOptionIndex: 1 };
const resTampered = runIdempotency.executeCommand(tamperedPayloadCmd);
assert(!resTampered.success && resTampered.error?.code === 'COMMAND_PAYLOAD_MISMATCH', 'Cùng commandId khác payload bị từ chối');

// ----------------------------------------------------
// 2. Kiểm tra Option chặt chẽ (Chỉ đạo mới):
// Chỉ nhận số nguyên hữu hạn; NaN, Infinity, số thập phân, số âm, vượt phạm vi bị từ chối, không đổi state/revision
// ----------------------------------------------------
const revBeforeBadOptions = runIdempotency.getProgress().revision;

const badOptions = [NaN, Infinity, -Infinity, 0.5, 1.2, -1, 2, 999];
for (const badOpt of badOptions) {
  const badOptCmd = runIdempotency.executeCommand({
    commandId: `cmd_bad_opt_${badOpt}`,
    expectedRevision: revBeforeBadOptions,
    type: 'ANSWER_QUIZ',
    runId: 'RUN_IDEMPOTENCY',
    questionId: 'q2',
    selectedOptionIndex: badOpt as any,
    timestamp: 20
  });
  assert(!badOptCmd.success && badOptCmd.error?.code === 'INVALID_OPTION_INDEX', `Option ${badOpt} bị từ chối`);
}
assert(runIdempotency.getProgress().revision === revBeforeBadOptions, 'Revision không đổi khi gửi option không hợp lệ');

// ----------------------------------------------------
// 3. Điều kiện toàn ván: Khi chính sách thời gian chưa xác minh -> UNRESOLVED
// Không tự đặt deadline; ngưỡng kiến thức/mẫu vẫn báo riêng
// ----------------------------------------------------
// Case A: Đủ ngân sách, đạt 100% câu hỏi nhưng durationLimitSeconds = undefined
const runNoTimePolicy = new MissionRunManager(createConfig('RUN_NO_TIME', 500, undefined));
runNoTimePolicy.startRun();
runNoTimePolicy.executeCommand({ commandId: 't1', expectedRevision: 1, type: 'ANSWER_QUIZ', runId: 'RUN_NO_TIME', questionId: 'q1', selectedOptionIndex: 0, timestamp: 1 });
runNoTimePolicy.executeCommand({ commandId: 't2', expectedRevision: 2, type: 'ANSWER_QUIZ', runId: 'RUN_NO_TIME', questionId: 'q2', selectedOptionIndex: 0, timestamp: 2 });
runNoTimePolicy.executeCommand({ commandId: 't3', expectedRevision: 3, type: 'COMPLETE_RUN', runId: 'RUN_NO_TIME', timestamp: 3 });

const repNoTime = runNoTimePolicy.getFinalReport();
assert(repNoTime.isReady, 'Báo cáo ván RUN_NO_TIME đã sẵn sàng');
assert(repNoTime.report?.isThresholdMet === true, 'Ngưỡng kiến thức vẫn đạt riêng (100% >= 80%)');
assert(repNoTime.report?.status === 'UNRESOLVED', 'Khi chính sách thời gian chưa xác minh -> Kết quả toàn ván phải là UNRESOLVED');

// Case B: Có đầy đủ ngân sách và thời hạn xác minh -> Đạt SUCCESS
const runCompleteSuccess = new MissionRunManager(createConfig('RUN_SUCCESS', 500, 3600));
runCompleteSuccess.startRun();
runCompleteSuccess.executeCommand({ commandId: 's1', expectedRevision: 1, type: 'ANSWER_QUIZ', runId: 'RUN_SUCCESS', questionId: 'q1', selectedOptionIndex: 0, timestamp: 1 });
runCompleteSuccess.executeCommand({ commandId: 's2', expectedRevision: 2, type: 'ANSWER_QUIZ', runId: 'RUN_SUCCESS', questionId: 'q2', selectedOptionIndex: 0, timestamp: 2 });
runCompleteSuccess.executeCommand({ commandId: 's3', expectedRevision: 3, type: 'COMPLETE_RUN', runId: 'RUN_SUCCESS', timestamp: 3 });

const repSuccess = runCompleteSuccess.getFinalReport();
assert(repSuccess.report?.status === 'SUCCESS', 'Đầy đủ cả ngân sách và thời hạn hợp lệ -> Toàn ván đạt SUCCESS');

// Case C: Quá thời hạn quy định -> FAILURE
const runOvertime = new MissionRunManager(createConfig('RUN_OVERTIME', 500, 10)); // Deadline 10s
runOvertime.startRun();
runOvertime.updateElapsedTime(25); // Chơi mất 25s > 10s
runOvertime.executeCommand({ commandId: 'o1', expectedRevision: 1, type: 'ANSWER_QUIZ', runId: 'RUN_OVERTIME', questionId: 'q1', selectedOptionIndex: 0, timestamp: 1 });
runOvertime.executeCommand({ commandId: 'o2', expectedRevision: 2, type: 'ANSWER_QUIZ', runId: 'RUN_OVERTIME', questionId: 'q2', selectedOptionIndex: 0, timestamp: 2 });
runOvertime.executeCommand({ commandId: 'o3', expectedRevision: 3, type: 'COMPLETE_RUN', runId: 'RUN_OVERTIME', timestamp: 3 });

const repOvertime = runOvertime.getFinalReport();
assert(repOvertime.report?.status === 'FAILURE', 'Quá thời hạn quy định -> FAILURE');

// Case D: Ngân sách âm -> FAILURE
const runNegBudget = new MissionRunManager(createConfig('RUN_NEG', -50, 3600));
runNegBudget.startRun();
runNegBudget.executeCommand({ commandId: 'n1', expectedRevision: 1, type: 'COMPLETE_RUN', runId: 'RUN_NEG', timestamp: 1 });
assert(runNegBudget.getFinalReport().report?.status === 'FAILURE', 'Ngân sách âm dẫn đến FAILURE');

// ----------------------------------------------------
// 4. M2: Đổi địa điểm & tích lũy mẫu
// ----------------------------------------------------
const runM2 = new MissionRunManager({
  runId: 'RUN_M2',
  missionId: 'm2_test',
  missionType: 'M2_SAMPLE_RETURN',
  rulesVersion: '1.0.0',
  contentVersion: '1.0.0',
  revision: 1,
  m2AvailableSamples: mockSamples,
  initialBudgetCredits: 500,
  durationLimitSeconds: 3600
});
runM2.startRun();
runM2.executeCommand({ commandId: 'm1', expectedRevision: 1, type: 'LAND_AND_COLLECT_SAMPLE', runId: 'RUN_M2', siteId: 'earth', sampleId: 's_earth_1', timestamp: 1 });
runM2.executeCommand({ commandId: 'm2', expectedRevision: 2, type: 'LAND_AND_COLLECT_SAMPLE', runId: 'RUN_M2', siteId: 'moon', sampleId: 's_moon_1', timestamp: 2 });
runM2.executeCommand({ commandId: 'm3', expectedRevision: 3, type: 'LAND_AND_COLLECT_SAMPLE', runId: 'RUN_M2', siteId: 'moon', sampleId: 's_moon_2', timestamp: 3 });
runM2.executeCommand({ commandId: 'm4', expectedRevision: 4, type: 'COMPLETE_RUN', runId: 'RUN_M2', timestamp: 4 });

const repM2 = runM2.getFinalReport();
assert(repM2.report?.isThresholdMet === true, 'M2: 1 mẫu ở Earth + 2 mẫu ở Moon đạt ngưỡng 3 loại khác nhau');
assert(repM2.report?.status === 'SUCCESS', 'M2: Đầy đủ điều kiện và không quá hạn -> SUCCESS');

console.log(`PASS: All ${totalTests} Mission Run Manager (Lõi mới hoàn thiện) unit tests succeeded.`);
