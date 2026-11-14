import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { FileBasedOnlineHistoryStorage } from '../src/domain/online-history-storage';
import { OnlineHistoryService } from '../src/domain/online-history-service';
import { OnlineMissionHistoryClientAdapter } from '../src/domain/mission-history-adapter';
import { OnlineSyncPayload, RunResult } from '../src/domain/mission-contract';

console.log('--- Testing Online Mission History & Report (Netlify Serverless Flow) ---');

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

async function runOnlineHistorySuite() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nasa-history-test-'));

  try {
    const storage = new FileBasedOnlineHistoryStorage(tempDir);
    const service = new OnlineHistoryService(storage);

    // =========================================================================
    // 1. Xác thực Auth Token Server-side
    // =========================================================================
    const unauthRes = await service.handleSyncRun(undefined, {
      runId: 'RUN_TEST_1',
      missionId: 'nasa_dart',
      missionType: 'M1_PHOTO_QUIZ',
      spacecraftName: 'Discovery',
      startTimeIso: '2026-11-15T00:00:00Z',
      durationSeconds: 120,
      status: 'SUCCESS',
      isThresholdMet: true,
      rulesVersion: '1.0.0',
      contentVersion: '1.0.0'
    });
    assert(!unauthRes.success && unauthRes.statusCode === 401, 'Thiếu Auth Token bị từ chối 401');

    const invalidTokenRes = await service.handleSyncRun('Basic abc', {
      runId: 'RUN_TEST_1',
      missionId: 'nasa_dart',
      missionType: 'M1_PHOTO_QUIZ',
      spacecraftName: 'Discovery',
      startTimeIso: '2026-11-15T00:00:00Z',
      durationSeconds: 120,
      status: 'SUCCESS',
      isThresholdMet: true,
      rulesVersion: '1.0.0',
      contentVersion: '1.0.0'
    });
    assert(!invalidTokenRes.success && invalidTokenRes.statusCode === 401, 'Token không đúng chuẩn Bearer bị từ chối 401');

    // =========================================================================
    // 2. Lưu lượt chơi thành công & Không tin ownerId giả trong payload
    // =========================================================================
    const tokenAlice = 'Bearer user_alice_123';
    const payloadAlice: OnlineSyncPayload = {
      runId: 'RUN_ALICE_001',
      missionId: 'nasa_dart',
      missionType: 'M1_PHOTO_QUIZ',
      spacecraftName: 'Space Shuttle Discovery',
      spacecraftPayload: 'High-Res Optical Scanner',
      startTimeIso: '2026-11-15T01:00:00Z',
      endTimeIso: '2026-11-15T01:10:00Z',
      durationSeconds: 600,
      status: 'SUCCESS',
      isThresholdMet: true,
      score: 9,
      remainingBudget: 350,
      rulesVersion: '1.0.0',
      contentVersion: '1.0.0',
      debriefReport: {
        runId: 'RUN_ALICE_001',
        missionId: 'nasa_dart',
        missionType: 'M1_PHOTO_QUIZ',
        rulesVersion: '1.0.0',
        contentVersion: '1.0.0',
        status: 'SUCCESS',
        isThresholdMet: true,
        score: 9,
        remainingBudget: 350,
        elapsedTimeSeconds: 600,
        reasons: ['Đạt ngưỡng kiến thức 90%'],
        summary: 'Nhiệm vụ hoàn thành xuất sắc.'
      }
    };

    const saveAliceRes = await service.handleSyncRun(tokenAlice, payloadAlice);
    assert(saveAliceRes.success && saveAliceRes.statusCode === 200, 'Lưu lượt chơi của Alice thành công');
    assert(saveAliceRes.data?.ownerId === 'user_alice_123', 'Server gán đúng ownerId từ token xác thực');

    // =========================================================================
    // 3. Idempotency: Gửi lại cùng yêu cầu không tạo bản ghi mới
    // =========================================================================
    const resendAliceRes = await service.handleSyncRun(tokenAlice, payloadAlice);
    assert(resendAliceRes.success && resendAliceRes.statusCode === 200, 'Gửi lại cùng runId thành công');
    assert(resendAliceRes.data?.syncedAtIso === saveAliceRes.data?.syncedAtIso, 'Idempotency: Thời điểm sync được giữ nguyên bản gốc');

    // =========================================================================
    // 4. Phân quyền và Bảo mật: Người khác (Bob) không xem được dữ liệu của Alice
    // =========================================================================
    const tokenBob = 'Bearer user_bob_456';
    const bobListRes = await service.handleListHistory(tokenBob, {});
    assert(bobListRes.success && bobListRes.data?.items.length === 0, 'Danh sách của Bob ban đầu trống, không thấy ván của Alice');

    const bobGetReportRes = await service.handleGetReport(tokenBob, 'RUN_ALICE_001');
    assert(!bobGetReportRes.success && bobGetReportRes.statusCode === 404, 'Bob không thể lấy report lượt chơi của Alice');

    // Alice lấy report của chính mình -> Thành công
    const aliceGetReportRes = await service.handleGetReport(tokenAlice, 'RUN_ALICE_001');
    assert(aliceGetReportRes.success && aliceGetReportRes.data?.status === 'SUCCESS', 'Alice lấy được debrief report của mình');
    assert(aliceGetReportRes.data?.score === 9, 'Dữ liệu điểm số và báo cáo nguyên vẹn');

    // =========================================================================
    // 5. Phân trang & Lượt mới nhất nằm trên
    // =========================================================================
    // Lưu thêm 2 ván nữa cho Alice với các mốc thời gian khác nhau
    await service.handleSyncRun(tokenAlice, {
      ...payloadAlice,
      runId: 'RUN_ALICE_002',
      startTimeIso: '2026-11-15T02:00:00Z',
      durationSeconds: 300,
      status: 'FAILURE'
    });

    await service.handleSyncRun(tokenAlice, {
      ...payloadAlice,
      runId: 'RUN_ALICE_003',
      startTimeIso: '2026-11-15T03:00:00Z',
      durationSeconds: 400,
      status: 'SUCCESS'
    });

    const paginatedRes = await service.handleListHistory(tokenAlice, { page: 1, pageSize: 2 });
    assert(paginatedRes.success, 'Lấy danh sách phân trang thành công');
    assert(paginatedRes.data?.totalCount === 3, 'Tổng số lượt chơi là 3');
    assert(paginatedRes.data?.items.length === 2, 'Trang 1 trả về đúng 2 mục');
    assert(paginatedRes.data?.items[0].runId === 'RUN_ALICE_003', 'Lượt mới nhất (03:00:00Z) nằm ở vị trí đầu tiên');
    assert(paginatedRes.data?.items[1].runId === 'RUN_ALICE_002', 'Lượt kế tiếp (02:00:00Z) nằm ở vị trí thứ hai');

    // =========================================================================
    // 6. Client Adapter: Quản lý trạng thái và Retry khi lỗi mạng / storage
    // =========================================================================
    const adapter = new OnlineMissionHistoryClientAdapter(service, tokenAlice);
    assert(adapter.getSyncStatus() === 'idle', 'Trạng thái ban đầu của adapter là idle');

    // Giả lập lỗi storage
    storage.setSimulateFailure(true);
    const failSyncRes = await adapter.syncRunOnline({
      ...payloadAlice,
      runId: 'RUN_ALICE_FAIL'
    });
    assert(!failSyncRes.success, 'Sync thất bại khi storage gặp sự cố');
    assert(adapter.getSyncStatus() === 'error', 'Trạng thái adapter chuyển sang error');
    assert(adapter.getLastError() !== null, 'Adapter ghi nhận thông báo lỗi');

    // Khắc phục sự cố và gọi retry
    storage.setSimulateFailure(false);
    const retryRes = await adapter.retryLastSync();
    assert(retryRes !== null && retryRes.success, 'Gọi retryLastSync thành công sau khi phục hồi');
    assert(adapter.getSyncStatus() === 'saved_online', 'Trạng thái adapter chuyển sang saved_online');

    console.log(`PASS: All ${totalTests} Online Mission History & Report unit tests succeeded.`);
  } finally {
    // Dọn dẹp temp dir
    try {
      if ((fs as any).rmSync) {
        (fs as any).rmSync(tempDir, { recursive: true, force: true });
      } else {
        fs.rmdirSync(tempDir);
      }
    } catch (e) {
      // bỏ qua
    }
  }
}

runOnlineHistorySuite().catch(err => {
  console.error('Online History Suite Failed:', err);
  process.exit(1);
});
