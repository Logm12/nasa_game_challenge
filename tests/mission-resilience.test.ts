import { InMemoryMissionStorageRepository } from '../src/domain/mission-database';
import { MissionApiService } from '../src/domain/mission-api';
import { LocalMissionClientAdapter } from '../src/domain/mission-adapter';
import { MissionRunConfig, QuizQuestionContract } from '../src/domain/mission-contract';

console.log('--- Testing Mission Service Resilience & State Restoration ---');

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

async function runResilienceTests() {
  const repo = new InMemoryMissionStorageRepository();
  const apiService = new MissionApiService(repo);
  const sessionId = 'session_player_resilience';
  const client = new LocalMissionClientAdapter(apiService, sessionId);

  const mockQuestions: QuizQuestionContract[] = [
    { id: 'q1', targetBodyId: 'earth', questionText: 'Q1', options: ['A', 'B'], correctOptionIndex: 0 },
    { id: 'q2', targetBodyId: 'earth', questionText: 'Q2', options: ['A', 'B'], correctOptionIndex: 0 }
  ];

  const config: MissionRunConfig = {
    runId: 'RUN_RESILIENCE_001',
    missionId: 'mission_m1',
    missionType: 'M1_PHOTO_QUIZ',
    rulesVersion: '1.0.0',
    contentVersion: '1.0.0',
    revision: 1,
    m1Questions: mockQuestions,
    initialBudgetCredits: 500,
    durationLimitSeconds: 1800
  };

  // 1. Khởi tạo ván
  const startRes = await client.startMission(config);
  assert(startRes.success && startRes.data?.revision === 1, 'Khởi tạo ván: revision = 1');

  // =========================================================================
  // VẤN ĐỀ 1: KHI GHI REPOSITORY THẤT BẠI -> MANAGER PHẢI GIỮ NGUYÊN STATE CŨ
  // =========================================================================
  repo.setSimulateFailure(true);
  const failCmd = {
    commandId: 'cmd_fail_test_1',
    expectedRevision: 1,
    type: 'ANSWER_QUIZ' as const,
    runId: config.runId,
    questionId: 'q1',
    selectedOptionIndex: 0,
    timestamp: 10
  };

  const failRes = await client.submitCommand(failCmd);
  assert(!failRes.success && failRes.statusCode === 500, 'Lỗi ghi repo trả về HTTP 500');

  // Bật lại repo
  repo.setSimulateFailure(false);

  // Thử lại đúng command đó: Manager phải chưa ghi nhận command, revision vẫn là 1
  const retryCmdRes = await client.submitCommand(failCmd);
  assert(retryCmdRes.success && retryCmdRes.statusCode === 200, 'Thử lại cùng command thành công khi repo bình thường');
  assert(retryCmdRes.data?.revision === 2, 'Revision tăng lên đúng 2 sau khi retry thành công');

  // Gửi lại nguyên command một lần nữa (Idempotency): Phải trả kết quả cũ, revision giữ nguyên 2
  const idempRes = await client.submitCommand(failCmd);
  assert(idempRes.success && idempRes.data?.revision === 2, 'Gửi lại cùng command không tăng revision lần 2');

  // =========================================================================
  // VẤN ĐỀ 2: KHI TẠO LẠI SERVICE TỪ REPOSITORY -> PHỤC HỒI TIẾN ĐỘ & IDEMPOTENCY
  // =========================================================================
  // Ván RUN_RESTORE_DIRECT: chạy lệnh 1 (lên rev 2)
  const run2Config = { ...config, runId: 'RUN_RESTORE_DIRECT' };
  await client.startMission(run2Config);
  const r2Cmd1 = await client.submitCommand({
    commandId: 'cmd_r2_1',
    expectedRevision: 1,
    type: 'ANSWER_QUIZ' as const,
    runId: run2Config.runId,
    questionId: 'q1',
    selectedOptionIndex: 0,
    timestamp: 10
  });
  assert(r2Cmd1.success && r2Cmd1.data?.revision === 2, 'Run 2 lên revision 2');

  // Tạo service mới hoàn toàn từ cùng repo
  const freshService = new MissionApiService(repo);
  const freshClient = new LocalMissionClientAdapter(freshService, sessionId);

  // Client gửi trực tiếp command tiếp theo với expectedRevision = 2
  const directNextRes = await freshClient.submitCommand({
    commandId: 'cmd_r2_2',
    expectedRevision: 2,
    type: 'ANSWER_QUIZ' as const,
    runId: run2Config.runId,
    questionId: 'q2',
    selectedOptionIndex: 0,
    timestamp: 20
  });
  assert(directNextRes.success, 'Service mới phục hồi đúng revision = 2 và chấp nhận command có expectedRevision = 2');
  assert(directNextRes.data?.revision === 3, 'Revision của Run 2 tăng lên 3');
  assert(
    directNextRes.data?.progressDisplay.value.includes('2/2'),
    'Service mới khôi phục cả câu trả lời trước đó (đạt 2/2)'
  );

  // Test idempotency trên service mới: Gửi lại lệnh cmd_r2_1 (lệnh cũ từ service trước)
  const replayOldCmdRes = await freshClient.submitCommand({
    commandId: 'cmd_r2_1',
    expectedRevision: 1,
    type: 'ANSWER_QUIZ' as const,
    runId: run2Config.runId,
    questionId: 'q1',
    selectedOptionIndex: 0,
    timestamp: 10
  });
  assert(replayOldCmdRes.success, 'Service mới nhận diện được command lịch sử cmd_r2_1');
  assert(replayOldCmdRes.data?.revision === 3, 'Gửi lại lệnh cũ không làm đổi revision hiện tại');

  // Test 2.3: Hoàn thành ván trên service mới
  const completeCmd = {
    commandId: 'cmd_complete_test',
    expectedRevision: 3,
    type: 'COMPLETE_RUN' as const,
    runId: run2Config.runId,
    timestamp: 30
  };
  const completeRes = await freshClient.submitCommand(completeCmd);
  assert(completeRes.success, 'Hoàn thành ván thành công trên service mới');

  const reportRes = await freshClient.getDebriefReport(run2Config.runId);
  assert(reportRes.success && reportRes.data?.status === 'SUCCESS', 'Báo cáo cuối cùng đạt SUCCESS 100% trên service mới');

  console.log(`PASS: All ${totalTests} Resilience & Restoration tests succeeded.`);
}

runResilienceTests().catch(err => {
  console.error('Resilience Tests Failed:', err);
  process.exit(1);
});
