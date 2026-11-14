import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as os from 'os';

/**
 * Baseline kiểm tra bảo vệ độc lập toàn diện (TIP-001 / FIX-07)
 *
 * Bao phủ đầy đủ toàn bộ các phân vùng được bảo vệ:
 * 1. Hạm đội tàu (SPACECRAFT_FLEET)
 * 2. Nhiệm vụ NASA gốc (NASA_MISSIONS)
 * 3. Bảng thiết bị khoa học (TECH_MAP) - Ngăn ngừa P01 bỏ lọt sửa giá/thông số
 * 4. Bảng năng lượng (POWER_MAP)
 * 5. Bảng động cơ & Isp (ENGINE_MAP)
 * 6. Bảng tên lửa đẩy (CARRIER_MAP)
 * 7. Công thức Tsiolkovsky delta-V
 * 8. Logic cộng điểm & ticker nhiệm vụ NASA cũ (TICKER_LOGIC)
 * 9. Động lực học mô phỏng Kepler/Newton (CELESTIAL_SIMULATE_BODY)
 * 10. Dữ liệu thiên thể khởi tạo Hệ Mặt Trời (UNIVERSE_BODIES)
 * 11. Hàm thiết lập quỹ đạo dịch chuyển tức thời (SOLAR_ESTABLISH_ORBIT)
 * 12. Guard delta-time bảo vệ bước thời gian (GAMESTATE_TIME_GUARD)
 */

export const PROTECTED_BASELINES: Record<string, { file: string; pattern: RegExp; expectedHash: string }> = {
  SPACECRAFT_FLEET: {
    file: 'src/NasaMissionDesigner.ts',
    pattern: /export const SPACECRAFT_FLEET: SpacecraftDefinition\[\] = \[[\s\S]*?\];\s*\n\s*export interface NasaMission/,
    expectedHash: 'dcfd1dd075e040b8d0ae344eae3233b2c4663a929c2bcb04097db8f9f0fb6144'
  },
  NASA_MISSIONS: {
    file: 'src/NasaMissionDesigner.ts',
    pattern: /export const NASA_MISSIONS: NasaMission\[\] = \[[\s\S]*?\];\s*\n\s*export interface TourStep/,
    expectedHash: '48a7e40e97c35a138d22e78149b63f2de6f083bdb2f94d200264279f1c9d55b6'
  },
  TECH_MAP: {
    file: 'src/NasaMissionDesigner.ts',
    pattern: /const techMap: Record<string, \{ mass: number, cost: number, power: number, points: number \}> = \{[\s\S]*?\};\s*\n\s*const engineMap/,
    expectedHash: '71eb06bb9d19c4b35ca220866e9b3bd9fb04ca36754273daf78eb92e91f9d844'
  },
  POWER_MAP: {
    file: 'src/NasaMissionDesigner.ts',
    pattern: /const powerMap: Record<string, \{ mass: number, cost: number, basePower: number, isSolar: boolean \}> = \{[\s\S]*?\};\s*\n\s*const techMap/,
    expectedHash: 'd111adba251b3731357ca084aa2b204dce9f50cedc4b47cc55889c953a6753f9'
  },
  ENGINE_MAP: {
    file: 'src/NasaMissionDesigner.ts',
    pattern: /const engineMap: Record<string, \{ dryMass: number, fuelMass: number, cost: number, isp: number, powerReq: number \}> = \{[\s\S]*?\};\s*\n\s*const carrierMap/,
    expectedHash: '6bfe408b4c1708a2803b318a10ae8957a6f4a867e41603e7b83ed4c494c35514'
  },
  CARRIER_MAP: {
    file: 'src/NasaMissionDesigner.ts',
    pattern: /const carrierMap: Record<string, \{ cost: number, cap: number \}> = \{[\s\S]*?\};\s*\n\s*const power/,
    expectedHash: 'de362a13433b01d5f78fbe84bce489ed7cd34c57f85674ace8d25f3b9bdba7fc'
  },
  TSIOLKOVSKY_EQUATION: {
    file: 'src/NasaMissionDesigner.ts',
    pattern: /\/\/ Tsiolkovsky rocket equation\s*\n\s*const deltaV = Math\.round\(engine\.isp \* 9\.80665 \* Math\.log\(totalMass \/ dryMass\)\);/,
    expectedHash: '62cbd19a682c7fc07b2e2695f0ace2e3939d3635592982de0208c5919bb0e57e'
  },
  TICKER_LOGIC: {
    file: 'src/NasaMissionDesigner.ts',
    pattern: /this\.missionTickerId = setInterval\(\(\) => \{[\s\S]*?this\.currentScienceCollected \+= Math\.floor\(Math\.random\(\) \* 5\) \+ 3;[\s\S]*?\}, 1000\);/,
    expectedHash: '28ec5eba090000b81fc3e9b15e9ef597cb8d0f20d1de12bd4def1fe711f06407'
  },
  CELESTIAL_SIMULATE_BODY: {
    file: 'src/CelestialBody.ts',
    pattern: /simulateBody\(deltaTime: number, div: number, timescale: number, buttons: RotationButtons, select_obj\?: CelestialBody\)[\s\S]*?a\.simulateBody\(deltaTime, div, timescale, buttons, select_obj\);/,
    expectedHash: '96473df291419ad2b0595092652eb027319413ac24b0eef59cd1e5ec954bbfd1'
  },
  UNIVERSE_BODIES: {
    file: 'src/Universe.ts',
    pattern: /this\.sun = new CelestialBody\(null, new THREE\.Vector3\(\), null, "#ffffff", GMsun, "sun"\);\s*\n\s*this\.sun\.radius = Rsun;/,
    expectedHash: '93ee7a15f0049651147f0383ac4389103eb03938dcae8b98ff03f529ccaf88d6'
  },
  SOLAR_ESTABLISH_ORBIT: {
    file: 'src/SolarSystemExplorer.ts',
    pattern: /private establishOrbitAtCurrentTarget\(\) \{[\s\S]*?this\.sendMessage\(`🚀 Đã thiết lập quỹ đạo thành công![\s\S]*?\}\n/,
    expectedHash: 'ea5f9f44225a3fa2142283112c3d3c0122c6ab691db81d15711289b138f16e0a'
  },
  GAMESTATE_TIME_GUARD: {
    file: 'src/GameState.ts',
    pattern: /if \(realDeltaTimeMilliSec > 250\) \{\s*\n\s*realDeltaTimeMilliSec = 16\.67;\s*\n\s*\}/,
    expectedHash: '86a2d4bf9105f2a66a6839cca53e10ff541ab899f11366bd7201e97e9fda2c7d'
  }
};

export function computePatternHash(content: string, pattern: RegExp): string | null {
  const normalized = content.replace(/\r\n/g, '\n');
  const match = normalized.match(pattern);
  if (!match) return null;
  return crypto.createHash('sha256').update(match[0]).digest('hex');
}

export function runProtectionChecks(): { passed: boolean; failures: string[] } {
  const failures: string[] = [];

  for (const [name, target] of Object.entries(PROTECTED_BASELINES)) {
    const fullPath = path.resolve(target.file);
    if (!fs.existsSync(fullPath)) {
      failures.push(`${name}: File not found: ${target.file}`);
      continue;
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    const hash = computePatternHash(content, target.pattern);
    if (!hash) {
      failures.push(`${name}: Pattern not matched in ${target.file}`);
      continue;
    }
    if (hash !== target.expectedHash) {
      failures.push(`${name}: Hash mismatch in ${target.file}. Expected ${target.expectedHash}, got ${hash}`);
    }
  }

  return {
    passed: failures.length === 0,
    failures
  };
}

/**
 * FIX-07: Kiểm tra độ nhạy phát hiện thay đổi trên 4 ca đại diện độc lập:
 * 1. Giá thiết bị cerebro trong techMap đổi từ 35 thành 36
 * 2. Hằng số màu/GM của Sun trong Universe.ts bị đổi
 * 3. Logic ticker cộng điểm nhiệm vụ cũ bị can thiệp
 * 4. Công thức Tsiolkovsky deltaV bị đổi
 */
export function verifyHarnessDetectsMutationsOnTempCopies(): { allPassed: boolean; testResults: Record<string, boolean> } {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'harness-tamper-check-'));
  const testResults: Record<string, boolean> = {};

  try {
    // 1. Thử thay đổi giá cerebro trong techMap (P01 regression test)
    {
      const source = fs.readFileSync(path.resolve('src/NasaMissionDesigner.ts'), 'utf8');
      const tampered = source.replace('cerebro: { mass: 40, cost: 35,', 'cerebro: { mass: 40, cost: 36,');
      const hash = computePatternHash(tampered, PROTECTED_BASELINES.TECH_MAP.pattern);
      testResults.TECH_MAP_TAMPER_DETECTED = hash !== PROTECTED_BASELINES.TECH_MAP.expectedHash;
    }

    // 2. Thử đổi dữ liệu thiên thể trong Universe.ts
    {
      const source = fs.readFileSync(path.resolve('src/Universe.ts'), 'utf8');
      const tampered = source.replace('"#ffffff"', '"#ffff00"');
      const hash = computePatternHash(tampered, PROTECTED_BASELINES.UNIVERSE_BODIES.pattern);
      testResults.UNIVERSE_TAMPER_DETECTED = hash !== PROTECTED_BASELINES.UNIVERSE_BODIES.expectedHash;
    }

    // 3. Thử đổi logic ticker nhiệm vụ cũ
    {
      const source = fs.readFileSync(path.resolve('src/NasaMissionDesigner.ts'), 'utf8');
      const tampered = source.replace('Math.random() * 5', 'Math.random() * 10');
      const hash = computePatternHash(tampered, PROTECTED_BASELINES.TICKER_LOGIC.pattern);
      testResults.TICKER_TAMPER_DETECTED = hash !== PROTECTED_BASELINES.TICKER_LOGIC.expectedHash;
    }

    // 4. Thử đổi công thức Tsiolkovsky deltaV
    {
      const source = fs.readFileSync(path.resolve('src/NasaMissionDesigner.ts'), 'utf8');
      const tampered = source.replace('engine.isp * 9.80665', 'engine.isp * 9.81');
      const hash = computePatternHash(tampered, PROTECTED_BASELINES.TSIOLKOVSKY_EQUATION.pattern);
      testResults.TSIOLKOVSKY_TAMPER_DETECTED = hash !== PROTECTED_BASELINES.TSIOLKOVSKY_EQUATION.expectedHash;
    }

    const allPassed = Object.values(testResults).every(v => v === true);
    return { allPassed, testResults };
  } finally {
    try {
      if ((fs as any).rmSync) {
        (fs as any).rmSync(tempDir, { recursive: true, force: true });
      } else {
        fs.rmdirSync(tempDir, { recursive: true });
      }
    } catch (e) {
      // Ignore cleanup error
    }
  }
}

// Chạy trực tiếp nếu execute qua CLI
if (require.main === module) {
  console.log('--- Running Complete Protection Baseline Checks (12 Critical Guards) ---');
  const result = runProtectionChecks();
  if (!result.passed) {
    console.error('PROTECTION VIOLATIONS DETECTED:');
    result.failures.forEach(f => console.error('  FAIL:', f));
    process.exit(1);
  }
  console.log('PASS: All 12 protected modules, constants, formulas, and ticker logics match fixed baseline.');

  console.log('--- Verifying Harness Sensitivity On 4 Isolated Temp Mutations ---');
  const sensitivity = verifyHarnessDetectsMutationsOnTempCopies();
  if (!sensitivity.allPassed) {
    console.error('FAIL: Protection harness failed to detect mutation:', sensitivity.testResults);
    process.exit(1);
  }
  console.log('PASS: Protection harness successfully caught all 4 representative mutations (techMap, universe, ticker, deltaV).');
}
