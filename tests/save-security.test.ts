import {
  sanitizeSaveTitle,
  validateGameState,
  parseAndValidateRawState,
  readRawSaveSlotList,
  safeStorageSet,
  safeStorageGet
} from '../src/domain/save-validator';

console.log('--- Testing Save Data Security & Validation (TIP-002 / FIX-01 & FIX-02) ---');

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

// Mock localStorage in Node
let mockStorage: Record<string, string> = {};
(global as any).localStorage = {
  getItem: (key: string) => {
    if (key === 'STORAGE_READ_ERR') throw new Error('Storage read failure');
    return key in mockStorage ? mockStorage[key] : null;
  },
  setItem: (key: string, val: string) => {
    if (key === 'QUOTA_EXCEEDED') throw new Error('QuotaExceededError');
    mockStorage[key] = val;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  }
};

// AC02-1: Safe text cho tên save
const dangerousTitle = '<script>alert("XSS")</script><img src=x onerror=alert(1)>';
const safeTitle = sanitizeSaveTitle(dangerousTitle);
assert(
  safeTitle === dangerousTitle && !safeTitle.includes('\0'),
  'Tên save chứa ký tự HTML được giữ nguyên bản dạng chuỗi để gán textContent'
);
assert(sanitizeSaveTitle('   ') === 'Untitled Save', 'Tên save khoảng trắng rỗng fallback thành "Untitled Save"');

// Mock state chuẩn theo đúng serializer của Three.js trong GameState & CelestialBody
const validThreeJsState = {
  saveVersion: 3,
  simTime: new Date().toISOString(),
  startTime: new Date().toISOString(),
  bodies: [
    {
      name: 'sun',
      parent: null,
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      quaternion: { _x: 0, _y: 0, _z: 0, _w: 1 },
      angularVelocity: { x: 0, y: 0, z: 0 }
    },
    {
      name: 'earth',
      parent: 'sun',
      position: { x: 1.0, y: 0, z: 0 },
      velocity: { x: 0, y: 29.78, z: 0 },
      quaternion: { _x: 0, _y: 0, _z: 0, _w: 1 },
      angularVelocity: { x: 0, y: 0, z: 0 }
    }
  ]
};

// FIX-01 (S00): Cấu trúc Three.js hiện hành được chấp nhận
const validRes = validateGameState(validThreeJsState);
assert(validRes.isValid && !!validRes.data, 'S00: State chuẩn serializer {x,y,z, _x,_y,_z,_w} hợp lệ 100%');

// FIX-01 (S01): Body chỉ có name -> BỊ TỪ CHỐI
const bodyOnlyName = {
  saveVersion: 3,
  simTime: new Date().toISOString(),
  startTime: new Date().toISOString(),
  bodies: [{ name: 'earth' }]
};
assert(!validateGameState(bodyOnlyName).isValid, 'S01: Body chỉ có name bị từ chối');

// FIX-01 (S02): Body dạng mảng [1,2,3] -> BỊ TỪ CHỐI (bộ tải Three.js yêu cầu {x,y,z})
const bodyArrayPos = {
  saveVersion: 3,
  simTime: new Date().toISOString(),
  startTime: new Date().toISOString(),
  bodies: [
    {
      name: 'earth',
      position: [1, 2, 3],
      velocity: [0, 0, 0]
    }
  ]
};
assert(!validateGameState(bodyArrayPos).isValid, 'S02: Position dạng mảng bị từ chối (yêu cầu {x,y,z})');

// FIX-01 (S03): Thiếu quaternion / angularVelocity -> BỊ TỪ CHỐI trước khi chạm engine
const missingQuat = {
  saveVersion: 3,
  simTime: new Date().toISOString(),
  startTime: new Date().toISOString(),
  bodies: [
    {
      name: 'earth',
      position: { x: 1, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 }
    }
  ]
};
assert(!validateGameState(missingQuat).isValid, 'S03: Thiếu quaternion bị từ chối để bảo vệ bộ tải');

// FIX-01: Ngày simTime lỗi hoặc không phải chuỗi Date hợp lệ
const invalidDateState = {
  ...validThreeJsState,
  simTime: 'invalid-date-string'
};
assert(!validateGameState(invalidDateState).isValid, 'Từ chối state có simTime không hợp lệ');

// FIX-01: Tọa độ Infinity / NaN
const infState = {
  ...validThreeJsState,
  bodies: [
    {
      name: 'earth',
      parent: 'sun',
      position: { x: Infinity, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      quaternion: { _x: 0, _y: 0, _z: 0, _w: 1 },
      angularVelocity: { x: 0, y: 0, z: 0 }
    }
  ]
};
assert(!validateGameState(infState).isValid, 'Từ chối state có tọa độ Infinity');

// FIX-02 (S04): Lưu mới bảo tồn slot khác phiên bản, không tự ý lọc bỏ
const mixedSlotRaw = JSON.stringify([
  { title: 'KEEP_VALID_OLD_VER', state: { saveVersion: 2, customData: 123 } },
  { title: 'KEEP_CURRENT_VER', state: validThreeJsState }
]);
const mixedResult = readRawSaveSlotList(mixedSlotRaw);
assert(mixedResult.isValid && mixedResult.data?.length === 2, 'S04: readRawSaveSlotList giữ nguyên cả 2 slot gồm slot khác phiên bản');
assert(mixedResult.data![0].title === 'KEEP_VALID_OLD_VER', 'S04: Giữ nguyên slot v2 trong danh sách');

// FIX-02 (S05): Lưu mới gặp JSON gốc hỏng -> Từ chối ghi, giữ nguyên dữ liệu gốc
const badJsonRaw = '{ broken json !!!';
const badJsonResult = readRawSaveSlotList(badJsonRaw);
assert(!badJsonResult.isValid, 'S05: Phát hiện JSON gốc trong storage bị hỏng');
assert(!!badJsonResult.errorMessage, 'S05: Báo lỗi có thể hiểu, không trả về mảng rỗng để ghi đè');

// FIX-02 (S07): Lỗi đọc storage được xử lý an toàn
const readErrRes = safeStorageGet('STORAGE_READ_ERR');
assert(!readErrRes.success && !!readErrRes.error, 'S07: Bắt lỗi đọc storage (ném exception) an toàn');

// AC02-4: Storage bị đầy / quota exceeded
const quotaFail = safeStorageSet('QUOTA_EXCEEDED', 'data');
assert(!quotaFail, 'Khi storage bị đầy -> safeStorageSet trả về false (không báo thành công giả)');

console.log(`PASS: All ${totalTests} Save Security & Validation (FIX-01 & FIX-02) unit tests succeeded.`);
