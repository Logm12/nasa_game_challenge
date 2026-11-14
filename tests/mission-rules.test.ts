import { evaluateM1Quiz, evaluateM2SampleReturn } from '../src/domain/mission-rules';
import { MissionRunConfig, QuizQuestionContract, SampleItemContract, CollectedSampleRecord } from '../src/domain/mission-contract';

console.log('--- Testing Mission Rules Engine (TIP-003 / FIX-03 & FIX-06) ---');

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

function createM1Config(count: number): MissionRunConfig {
  const questions: QuizQuestionContract[] = [];
  for (let i = 1; i <= count; i++) {
    questions.push({
      id: `q_${i}`,
      targetBodyId: 'earth',
      questionText: `Câu hỏi số ${i}?`,
      options: ['A', 'B', 'C', 'D'],
      correctOptionIndex: 0
    });
  }
  return {
    runId: 'run_m1_test',
    missionId: 'm1_fixture',
    missionType: 'M1_PHOTO_QUIZ',
    rulesVersion: '1.0.0',
    contentVersion: '1.0.0',
    revision: 1,
    m1Questions: questions,
    initialBudgetCredits: 500
  };
}

// AC03-1: 10 câu: đúng 7 chưa đạt, đúng 8 đạt
const config10 = createM1Config(10);
const ans7 = new Map<string, number>();
for (let i = 1; i <= 7; i++) ans7.set(`q_${i}`, 0);
assert(!evaluateM1Quiz(config10, ans7).isThresholdMet, 'AC03-1: Đúng 7/10 (70%) chưa đạt ngưỡng');

const ans8 = new Map<string, number>();
for (let i = 1; i <= 8; i++) ans8.set(`q_${i}`, 0);
assert(evaluateM1Quiz(config10, ans8).isThresholdMet, 'AC03-1: Đúng 8/10 (80%) đạt ngưỡng');

// AC03-2: 12 câu: đúng 9 chưa đạt, đúng 10 đạt
const config12 = createM1Config(12);
const ans9 = new Map<string, number>();
for (let i = 1; i <= 9; i++) ans9.set(`q_${i}`, 0);
assert(!evaluateM1Quiz(config12, ans9).isThresholdMet, 'AC03-2: Đúng 9/12 (75%) chưa đạt');

const ans10 = new Map<string, number>();
for (let i = 1; i <= 10; i++) ans10.set(`q_${i}`, 0);
assert(evaluateM1Quiz(config12, ans10).isThresholdMet, 'AC03-2: Đúng 10/12 (83.3%) đạt');

// AC03-3: Bỏ qua câu -> Mẫu số giữ nguyên
const ansSkipped = new Map<string, number>();
ansSkipped.set('q_1', 0);
const resSkipped = evaluateM1Quiz(config10, ansSkipped);
assert(resSkipped.m1Progress!.totalQuestions === 10, 'AC03-3: Mẫu số luôn cố định là 10');
assert(resSkipped.m1Progress!.accuracyRatio === 0.1, 'AC03-3: Tỷ lệ 10%');

// ----------------------------------------------------
// FIX-06 & AC03-4, AC03-5: Lấy mẫu tích lũy qua nhiều địa điểm
// ----------------------------------------------------
const mockSamples: SampleItemContract[] = [
  { id: 'earth_basalt', name: 'Basalt Trái Đất', siteId: 'earth', typeCategory: 'basalt' },
  { id: 'moon_regolith', name: 'Bụi Mặt Trăng', siteId: 'moon', typeCategory: 'regolith' },
  { id: 'moon_anorthosite', name: 'Đá Vỏ Mặt Trăng', siteId: 'moon', typeCategory: 'anorthosite' },
  { id: 'mars_clay', name: 'Đất Sét Hỏa Tinh', siteId: 'mars', typeCategory: 'clay' },
  { id: 'mars_ice', name: 'Băng Hỏa Tinh', siteId: 'mars', typeCategory: 'subsurface_ice' }
];

const configM2: MissionRunConfig = {
  runId: 'run_m2_test',
  missionId: 'm2_fixture',
  missionType: 'M2_SAMPLE_RETURN',
  rulesVersion: '1.0.0',
  contentVersion: '1.0.0',
  revision: 1,
  m2AvailableSamples: mockSamples,
  initialBudgetCredits: 800
};

// FIX-06 (R08): 1 loại tại Earth + 2 loại tại Moon -> Đạt ngưỡng 3 loại khác nhau
const multiSiteRecords: CollectedSampleRecord[] = [
  { sample: mockSamples[0], collectedAtSite: 'earth', timestamp: 100 }, // basalt
  { sample: mockSamples[1], collectedAtSite: 'moon', timestamp: 200 },  // regolith
  { sample: mockSamples[2], collectedAtSite: 'moon', timestamp: 300 }   // anorthosite
];
const resMultiSite = evaluateM2SampleReturn(configM2, 'moon', multiSiteRecords);
assert(resMultiSite.isThresholdMet, 'FIX-06 (R08): Thu 1 loại ở Earth + 2 loại ở Moon đạt đủ 3 loại khác nhau');
assert(resMultiSite.m2Progress!.uniqueCategoriesCollected.length === 3, 'Ghi nhận đủ 3 loại độc lập');

// AC03-4: Đủ 3 loại tại 1 địa điểm duy nhất (ví dụ Mars)
const marsOnlyRecords: CollectedSampleRecord[] = [
  { sample: { id: 'm1', name: 'M1', siteId: 'mars', typeCategory: 'c1' }, collectedAtSite: 'mars', timestamp: 1 },
  { sample: { id: 'm2', name: 'M2', siteId: 'mars', typeCategory: 'c2' }, collectedAtSite: 'mars', timestamp: 2 },
  { sample: { id: 'm3', name: 'M3', siteId: 'mars', typeCategory: 'c3' }, collectedAtSite: 'mars', timestamp: 3 }
];
const resMarsOnly = evaluateM2SampleReturn(configM2, 'mars', marsOnlyRecords);
assert(resMarsOnly.isThresholdMet, 'AC03-4: 3 loại mẫu tại 1 nơi (Mars) đạt ngưỡng');

// AC03-5: Nhặt lặp cùng 1 loại -> Chỉ tính 1 loại
const duplicateCatRecords: CollectedSampleRecord[] = [
  { sample: { id: 'm1', name: 'M1', siteId: 'mars', typeCategory: 'cat_same' }, collectedAtSite: 'mars', timestamp: 1 },
  { sample: { id: 'm2', name: 'M2', siteId: 'mars', typeCategory: 'cat_same' }, collectedAtSite: 'mars', timestamp: 2 }
];
assert(!evaluateM2SampleReturn(configM2, 'mars', duplicateCatRecords).isThresholdMet, 'AC03-5: Trùng category không tăng loại');

console.log(`PASS: All ${totalTests} Mission Rules (FIX-03 & FIX-06) unit tests succeeded.`);
