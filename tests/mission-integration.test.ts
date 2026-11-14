import { InMemoryMissionStorageRepository } from '../src/domain/mission-database';
import { MissionApiService } from '../src/domain/mission-api';
import { LocalMissionClientAdapter, MockMissionClientAdapter } from '../src/domain/mission-adapter';
import { MissionRunConfig, QuizQuestionContract, SampleItemContract } from '../src/domain/mission-contract';

console.log('--- Testing Database, API Security & Adapter Integration (FIX-BE01, BE02, BE03) ---');

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

async function runIntegrationSuite() {
  const repo = new InMemoryMissionStorageRepository();
  const apiService = new MissionApiService(repo);
  const client = new LocalMissionClientAdapter(apiService, 'session_player_1');

  const mockQuestions: QuizQuestionContract[] = [
    { id: 'q1', targetBodyId: 'earth', questionText: 'Q1', options: ['A', 'B'], correctOptionIndex: 0 },
    { id: 'q2', targetBodyId: 'earth', questionText: 'Q2', options: ['A', 'B'], correctOptionIndex: 0 }
  ];

  const mockSamples: SampleItemContract[] = [
    { id: 's_earth', name: 'Mẫu Đất', siteId: 'earth', typeCategory: 'cat1' },
    { id: 's_moon', name: 'Mẫu Mặt Trăng', siteId: 'moon', typeCategory: 'cat2' },
    { id: 's_mars', name: 'Mẫu Hỏa Tinh', siteId: 'mars', typeCategory: 'cat3' }
  ];

  const config: MissionRunConfig = {
    runId: 'RUN_INTEG_001',
    missionId: 'mission_m1',
    missionType: 'M1_PHOTO_QUIZ',
    rulesVersion: '1.0.0',
    contentVersion: '1.0.0',
    revision: 1,
    m1Questions: mockQuestions,
    initialBudgetCredits: 500,
    durationLimitSeconds: 1800
  };

  // ----------------------------------------------------
  // FIX-BE03: Ghi repository thất bại ở handleStartRun -> Không báo thành công
  // ----------------------------------------------------
  repo.setSimulateFailure(true);
  const failedStartRes = await client.startMission({ ...config, runId: 'RUN_FAIL_STORAGE' });
  assert(!failedStartRes.success && failedStartRes.statusCode === 500, 'FIX-BE03: Lưu storage thất bại thì handleStartRun trả về 500');
  repo.setSimulateFailure(false);

  // ----------------------------------------------------
  // 1. Khởi tạo Mission qua API thành công
  // ----------------------------------------------------
  const startRes = await client.startMission(config);
  assert(startRes.success && startRes.data?.runId === 'RUN_INTEG_001', 'TIP-006: Khởi tạo ván qua API thành công');
  assert(startRes.data?.revision === 1, 'Client view trả về đúng revision ban đầu là 1');

  // Kiểm tra lưu trữ DB (TIP-005)
  const storedRun = await repo.getRun('RUN_INTEG_001');
  assert(storedRun !== null && storedRun.progress.runId === 'RUN_INTEG_001', 'TIP-005: Run được lưu trữ thành công vào Database Repository');
  assert(storedRun?.ownerSessionId === 'session_player_1', 'TIP-005: Lưu trữ đúng ownerSessionId');

  // ----------------------------------------------------
  // FIX-BE01: Kiểm tra bảo mật Session (Ownership Check)
  // ----------------------------------------------------
  const attackerClient = new LocalMissionClientAdapter(apiService, 'session_attacker');
  const attackCmdRes = await attackerClient.submitCommand({
    commandId: 'cmd_hack_1',
    expectedRevision: 1,
    type: 'ANSWER_QUIZ',
    runId: 'RUN_INTEG_001',
    questionId: 'q1',
    selectedOptionIndex: 0,
    timestamp: 10
  });
  assert(!attackCmdRes.success && attackCmdRes.statusCode === 403, 'TIP-006: Chặn session khác can thiệp (403 Forbidden)');

  // ----------------------------------------------------
  // FIX-BE02: Cập nhật repository sau MỌI command được chấp nhận
  // ----------------------------------------------------
  const validCmdRes = await client.submitCommand({
    commandId: 'cmd_legit_1',
    expectedRevision: 1,
    type: 'ANSWER_QUIZ',
    runId: 'RUN_INTEG_001',
    questionId: 'q1',
    selectedOptionIndex: 0,
    timestamp: 10
  });
  assert(validCmdRes.success && validCmdRes.statusCode === 200, 'TIP-006: Chính chủ thực thi command thành công');
  assert(validCmdRes.data?.revision === 2, 'FIX-BE02: Client view trả về revision 2');

  // Kiểm tra repository ngay sau command ANSWER_QUIZ
  const runAfterCmd1 = await repo.getRun('RUN_INTEG_001');
  assert(runAfterCmd1?.progress.revision === 2, 'FIX-BE02: Repository cập nhật revision thành 2 sau ANSWER_QUIZ');
  assert(runAfterCmd1?.progress.m1Progress?.correctAnswersCount === 1, 'FIX-BE02: Repository ghi nhận 1 câu đúng');

  // Gửi tiếp câu 2
  await client.submitCommand({
    commandId: 'cmd_legit_2',
    expectedRevision: 2,
    type: 'ANSWER_QUIZ',
    runId: 'RUN_INTEG_001',
    questionId: 'q2',
    selectedOptionIndex: 0,
    timestamp: 20
  });

  // Hoàn tất ván
  await client.submitCommand({
    commandId: 'cmd_finish_run',
    expectedRevision: 3,
    type: 'COMPLETE_RUN',
    runId: 'RUN_INTEG_001',
    timestamp: 30
  });

  // Kiểm tra lưu trữ report trong DB
  const storedRep = await repo.getReport('RUN_INTEG_001');
  assert(storedRep !== null && storedRep.report.runId === 'RUN_INTEG_001', 'TIP-005: Final Report được lưu trữ vào Database');
  assert(storedRep?.ownerSessionId === 'session_player_1', 'Report record lưu đúng ownerSessionId');

  // ----------------------------------------------------
  // FIX-BE01: Kiểm tra quyền report khi tạo lại Service từ repository
  // ----------------------------------------------------
  const recreatedApiService = new MissionApiService(repo);

  // Case 1: Session rỗng truy vấn -> 401 Unauthorized
  const emptySessionRes = await recreatedApiService.handleGetReport({
    sessionId: '',
    payload: { runId: 'RUN_INTEG_001' }
  });
  assert(!emptySessionRes.success && emptySessionRes.statusCode === 401, 'FIX-BE01: Tạo lại service, session rỗng bị từ chối 401');
  assert(emptySessionRes.data === undefined, 'FIX-BE01: Không trả về dữ liệu report khi session rỗng');

  // Case 2: Session lạ / kẻ tấn công truy vấn -> 403 Forbidden
  const attackerGetRes = await recreatedApiService.handleGetReport({
    sessionId: 'attacker_new_session',
    payload: { runId: 'RUN_INTEG_001' }
  });
  assert(!attackerGetRes.success && attackerGetRes.statusCode === 403, 'FIX-BE01: Tạo lại service, session khác bị từ chối 403');
  assert(attackerGetRes.data === undefined, 'FIX-BE01: Không trả về dữ liệu report cho kẻ tấn công');

  // Case 3: Đúng chủ sở hữu ban đầu truy vấn -> 200 OK và trả report
  const ownerGetRes = await recreatedApiService.handleGetReport({
    sessionId: 'session_player_1',
    payload: { runId: 'RUN_INTEG_001' }
  });
  assert(ownerGetRes.success && ownerGetRes.statusCode === 200, 'FIX-BE01: Tạo lại service, đúng chủ sở hữu nhận 200 OK');
  assert(ownerGetRes.data?.status === 'SUCCESS', 'FIX-BE01: Đúng báo cáo SUCCESS');

  // ----------------------------------------------------
  // FIX-BE03: Ghi command lỗi giữa chừng trong atomicUpdate -> Báo lỗi 500
  // ----------------------------------------------------
  const client2 = new LocalMissionClientAdapter(apiService, 'session_player_2');
  await client2.startMission({ ...config, runId: 'RUN_ATOMIC_TEST' });
  repo.setSimulateFailure(true);
  const failCmdRes = await client2.submitCommand({
    commandId: 'cmd_fail_write',
    expectedRevision: 1,
    type: 'ANSWER_QUIZ',
    runId: 'RUN_ATOMIC_TEST',
    questionId: 'q1',
    selectedOptionIndex: 0,
    timestamp: 10
  });
  assert(!failCmdRes.success && failCmdRes.statusCode === 500, 'FIX-BE03: Ghi command lỗi thì trả về 500');
  repo.setSimulateFailure(false);

  // ----------------------------------------------------
  // Kiểm thử Mock Client Adapter (TIP-007)
  // ----------------------------------------------------
  const mockAdapter = new MockMissionClientAdapter();
  mockAdapter.setMockView({
    runId: 'MOCK_RUN',
    revision: 1,
    status: 'IN_PROGRESS',
    allowedActions: ['ANSWER_QUIZ'],
    disallowedActions: [],
    progressDisplay: { label: 'Mock', value: '50%', percentage: 50 },
    isReportReady: false
  });
  const mockViewRes = await mockAdapter.startMission(config);
  assert(mockViewRes.success && mockViewRes.data?.progressDisplay.percentage === 50, 'TIP-007: Mock Client Adapter hoạt động trơn tru cho Frontend');

  console.log(`PASS: All ${totalTests} Integration & Local API (FIX-BE01..03) unit tests succeeded.`);
}

runIntegrationSuite().catch(err => {
  console.error('Integration Suite Failed:', err);
  process.exit(1);
});
