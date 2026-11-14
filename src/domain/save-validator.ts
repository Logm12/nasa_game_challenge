/**
 * Save Data Validator (TIP-002 / FIX-01 & FIX-02)
 *
 * Kiểm tra tính hợp lệ của dữ liệu lưu/tải đối chiếu trực tiếp với
 * serializer / deserializer hiện hành trong CelestialBody.ts và GameState.ts:
 *
 * serializeTree():
 * - name: string
 * - parent: string | null
 * - position: { x: number, y: number, z: number }
 * - velocity: { x: number, y: number, z: number }
 * - quaternion: { _x: number, _y: number, _z: number, _w: number }
 * - angularVelocity: { x: number, y: number, z: number }
 *
 * GameState serializeState():
 * - saveVersion: 3
 * - simTime: Date string
 * - startTime: Date string
 * - bodies: array of BodyStateRecord
 *
 * FIX-02: Không tự động loại bỏ slot lỗi/khác version khi ghi đè kho gốc.
 * Nếu storage JSON gốc bị hỏng không parse được -> Từ chối ghi, bảo vệ dữ liệu thô gốc.
 */

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errorMessage?: string;
}

export interface Vector3Record {
  x: number;
  y: number;
  z: number;
}

export interface QuaternionRecord {
  _x: number;
  _y: number;
  _z: number;
  _w: number;
}

export interface BodyStateRecord {
  name: string;
  parent: string | null;
  position: Vector3Record;
  velocity: Vector3Record;
  quaternion: QuaternionRecord;
  angularVelocity: Vector3Record;
  totalDeltaV?: number;
  ignitionCount?: number;
  [key: string]: any;
}

export interface SerializedGameState {
  saveVersion: number;
  simTime: string | Date;
  startTime: string | Date;
  bodies: BodyStateRecord[];
}

export interface SaveSlotEntry {
  title: string;
  state: any; // Giữ nguyên state thô để bảo toàn các slot khác version hoặc dữ liệu ngoài
}

export const CURRENT_SAVE_VERSION = 3;
const MAX_TITLE_LENGTH = 120;

export function sanitizeSaveTitle(rawTitle: string | null | undefined): string {
  if (!rawTitle || typeof rawTitle !== 'string') {
    return 'Untitled Save';
  }
  const trimmed = rawTitle.trim();
  if (!trimmed) {
    return 'Untitled Save';
  }
  return trimmed.slice(0, MAX_TITLE_LENGTH);
}

function isFiniteNumber(val: any): boolean {
  return typeof val === 'number' && Number.isFinite(val);
}

function validateVector3Record(v: any): boolean {
  if (!v || typeof v !== 'object') return false;
  return isFiniteNumber(v.x) && isFiniteNumber(v.y) && isFiniteNumber(v.z);
}

function validateQuaternionRecord(q: any): boolean {
  if (!q || typeof q !== 'object') return false;
  return isFiniteNumber(q._x) && isFiniteNumber(q._y) && isFiniteNumber(q._z) && isFiniteNumber(q._w);
}

/**
 * Validate cấu trúc state nghiêm ngặt trước khi chuyển cho loadState()
 */
export function validateGameState(state: any): ValidationResult<SerializedGameState> {
  if (!state || typeof state !== 'object') {
    return { isValid: false, errorMessage: 'Dữ liệu trạng thái không phải là object hợp lệ.' };
  }

  const version = state.saveVersion;
  if (version !== CURRENT_SAVE_VERSION) {
    return {
      isValid: false,
      errorMessage: `Không hỗ trợ phiên bản lưu: ${version} (yêu cầu version ${CURRENT_SAVE_VERSION}).`
    };
  }

  if (!state.simTime || typeof state.simTime !== 'string' && !(state.simTime instanceof Date) && typeof state.simTime !== 'number') {
    return { isValid: false, errorMessage: 'Trường simTime không hợp lệ.' };
  }
  const simTimeDate = new Date(state.simTime);
  if (isNaN(simTimeDate.getTime())) {
    return { isValid: false, errorMessage: 'Trường simTime chứa ngày không hợp lệ.' };
  }

  if (!state.startTime || typeof state.startTime !== 'string' && !(state.startTime instanceof Date) && typeof state.startTime !== 'number') {
    return { isValid: false, errorMessage: 'Trường startTime không hợp lệ.' };
  }
  const startTimeDate = new Date(state.startTime);
  if (isNaN(startTimeDate.getTime())) {
    return { isValid: false, errorMessage: 'Trường startTime chứa ngày không hợp lệ.' };
  }

  if (!Array.isArray(state.bodies)) {
    return { isValid: false, errorMessage: 'Trường bodies phải là một mảng.' };
  }

  for (let i = 0; i < state.bodies.length; i++) {
    const b = state.bodies[i];
    if (!b || typeof b !== 'object') {
      return { isValid: false, errorMessage: `Thiên thể bodies[${i}] không phải object.` };
    }
    if (typeof b.name !== 'string' || !b.name.trim()) {
      return { isValid: false, errorMessage: `Thiên thể bodies[${i}] thiếu trường name hợp lệ.` };
    }
    if (b.parent !== null && b.parent !== undefined && typeof b.parent !== 'string') {
      return { isValid: false, errorMessage: `Thiên thể ${b.name} có trường parent không hợp lệ.` };
    }

    // Các trường bắt buộc bộ tải deserialize() cần: position, velocity, quaternion, angularVelocity
    if (!validateVector3Record(b.position)) {
      return { isValid: false, errorMessage: `Thiên thể ${b.name} thiếu hoặc sai định dạng position (yêu cầu {x,y,z} hữu hạn).` };
    }
    if (!validateVector3Record(b.velocity)) {
      return { isValid: false, errorMessage: `Thiên thể ${b.name} thiếu hoặc sai định dạng velocity (yêu cầu {x,y,z} hữu hạn).` };
    }
    if (!validateQuaternionRecord(b.quaternion)) {
      return { isValid: false, errorMessage: `Thiên thể ${b.name} thiếu hoặc sai định dạng quaternion (yêu cầu {_x,_y,_z,_w} hữu hạn).` };
    }
    if (!validateVector3Record(b.angularVelocity)) {
      return { isValid: false, errorMessage: `Thiên thể ${b.name} thiếu hoặc sai định dạng angularVelocity (yêu cầu {x,y,z} hữu hạn).` };
    }
  }

  return { isValid: true, data: state as SerializedGameState };
}

export function parseAndValidateRawState(rawJson: string | null): ValidationResult<SerializedGameState> {
  if (!rawJson || typeof rawJson !== 'string') {
    return { isValid: false, errorMessage: 'Chuỗi JSON lưu trữ rỗng.' };
  }
  try {
    const parsed = JSON.parse(rawJson);
    return validateGameState(parsed);
  } catch (err) {
    return { isValid: false, errorMessage: `Lỗi phân tích cú pháp JSON: ${(err as Error).message}` };
  }
}

/**
 * FIX-02: Đọc danh sách slot nguyên bản.
 * Nếu storage có chuỗi JSON nhưng parse thất bại -> Trả về lỗi, tuyệt đối không trả mảng rỗng để ghi đè.
 * Giữ nguyên các slot khác phiên bản để không xóa mất dữ liệu của người dùng.
 */
export function readRawSaveSlotList(rawJson: string | null): ValidationResult<SaveSlotEntry[]> {
  if (rawJson === null || rawJson === undefined || rawJson.trim() === '') {
    return { isValid: true, data: [] };
  }
  try {
    const parsed = JSON.parse(rawJson);
    if (!Array.isArray(parsed)) {
      return { isValid: false, errorMessage: 'Dữ liệu danh sách bản lưu trong storage không phải dạng mảng.' };
    }
    return { isValid: true, data: parsed as SaveSlotEntry[] };
  } catch (err) {
    return { isValid: false, errorMessage: `Lỗi cú pháp danh sách bản lưu gốc: ${(err as Error).message}` };
  }
}

export function safeStorageSet(storageKey: string, value: string): boolean {
  try {
    localStorage.setItem(storageKey, value);
    return true;
  } catch (err) {
    console.error(`Không thể ghi vào localStorage (${storageKey}):`, err);
    return false;
  }
}

export function safeStorageGet(storageKey: string): { success: boolean; data: string | null; error?: string } {
  try {
    const item = localStorage.getItem(storageKey);
    return { success: true, data: item };
  } catch (err) {
    console.error(`Lỗi khi đọc localStorage (${storageKey}):`, err);
    return { success: false, data: null, error: (err as Error).message };
  }
}
