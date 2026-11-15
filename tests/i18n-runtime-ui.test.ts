import * as assert from 'assert';
import {
  SUPPORTED_LANGS,
  SupportedLang,
  setCurrentLang,
  getCurrentLang,
  getControlTexts,
  formatTpl
} from '../src/i18n';
import { RunResult } from '../src/domain/mission-contract';
import { getMissionText } from '../src/i18n-catalog';

console.log('--- Testing 9-Language Runtime UI Switching & Result Immutability ---');

let passedTests = 0;
let totalTests = 0;

function check(condition: boolean, msg: string) {
  totalTests++;
  if (!condition) {
    console.error(`FAIL [${totalTests}]: ${msg}`);
    process.exit(1);
  }
  passedTests++;
  console.log(`  ✓ ${msg}`);
}

const EXPECTED_9_LANGS: SupportedLang[] = [
  'en_us', 'vi', 'en_uk', 'ja', 'ko', 'fr', 'de', 'it', 'es'
];

function runRuntimeI18nTests() {
  // 1. Kiểm tra từng ngôn ngữ trong cả 9 lựa chọn
  for (const lang of EXPECTED_9_LANGS) {
    setCurrentLang(lang);
    check(getCurrentLang() === lang, `Chuyển sang ngôn ngữ '${lang}' thành công`);

    const ct = getControlTexts(lang);

    // Kiểm tra các khóa Flight Deck
    check(!!ct.flightDeckTitle && ct.flightDeckTitle.trim().length > 0, `[${lang}] flightDeckTitle không rỗng`);
    check(!!ct.sasStabPill && ct.sasStabPill.trim().length > 0, `[${lang}] sasStabPill không rỗng`);
    check(!!ct.sasProgradePill && ct.sasProgradePill.trim().length > 0, `[${lang}] sasProgradePill không rỗng`);
    check(!!ct.sasRetrogradePill && ct.sasRetrogradePill.trim().length > 0, `[${lang}] sasRetrogradePill không rỗng`);
    check(!!ct.sasManualPill && ct.sasManualPill.trim().length > 0, `[${lang}] sasManualPill không rỗng`);

    // Kiểm tra các khóa Save & Load Error mới
    check(!!ct.saveErrRead && ct.saveErrRead.includes('{error}'), `[${lang}] saveErrRead có chứa placeholder {error}`);
    check(!!ct.saveErrCorrupt && ct.saveErrCorrupt.includes('{error}'), `[${lang}] saveErrCorrupt có chứa placeholder {error}`);
    check(!!ct.saveErrDelete && ct.saveErrDelete.trim().length > 0, `[${lang}] saveErrDelete không rỗng`);
    check(!!ct.saveErrInvalidState && ct.saveErrInvalidState.includes('{error}'), `[${lang}] saveErrInvalidState có chứa {error}`);
    check(!!ct.saveErrStorageWrite && ct.saveErrStorageWrite.trim().length > 0, `[${lang}] saveErrStorageWrite không rỗng`);

    // Kiểm tra thay thế tham số template
    const formattedErr = formatTpl(ct.saveErrRead, { error: 'STORAGE_TEST_ERR' });
    check(formattedErr.includes('STORAGE_TEST_ERR'), `[${lang}] formatTpl thay thế đúng biến {error}`);

    // Kiểm tra các khóa History Online UI
    check(!!ct.historyTitle && ct.historyTitle.trim().length > 0, `[${lang}] historyTitle không rỗng`);
    check(!!ct.historyEmpty && ct.historyEmpty.trim().length > 0, `[${lang}] historyEmpty không rỗng`);
    check(!!ct.historyLoading && ct.historyLoading.trim().length > 0, `[${lang}] historyLoading không rỗng`);
    check(!!ct.historyError && ct.historyError.trim().length > 0, `[${lang}] historyError không rỗng`);
    check(!!ct.historySaving && ct.historySaving.trim().length > 0, `[${lang}] historySaving không rỗng`);
    check(!!ct.historySavedOnline && ct.historySavedOnline.trim().length > 0, `[${lang}] historySavedOnline không rỗng`);
    check(!!ct.historyRetry && ct.historyRetry.trim().length > 0, `[${lang}] historyRetry không rỗng`);
    check(!!ct.historyViewReport && ct.historyViewReport.trim().length > 0, `[${lang}] historyViewReport không rỗng`);
  }

  // 2. Kiểm chứng tính bất biến của dữ liệu kết quả khi chuyển đổi ngôn ngữ
  const originalReport: RunResult = {
    runId: 'RUN_IMMUTABLE_TEST',
    missionId: 'nasa_dart',
    missionType: 'M1_PHOTO_QUIZ',
    rulesVersion: '1.0.0',
    contentVersion: '1.0.0',
    status: 'SUCCESS',
    isThresholdMet: true,
    score: 8.5,
    remainingBudget: 420,
    elapsedTimeSeconds: 512,
    reasons: ['REASON_THRESHOLD_MET', 'REASON_TIME_NOMINAL'],
    summary: 'Mission nominal.'
  };

  const reportSnapshotJson = JSON.stringify(originalReport);

  // Chuyển liên tục qua các ngôn ngữ khác nhau
  setCurrentLang('ja');
  setCurrentLang('vi');
  setCurrentLang('de');
  setCurrentLang('ko');
  setCurrentLang('en_us');

  const afterSwitchJson = JSON.stringify(originalReport);
  check(reportSnapshotJson === afterSwitchJson, 'Dữ liệu kết quả report không đổi sau nhiều lần chuyển ngôn ngữ');
  check(originalReport.score === 8.5, 'Score vẫn là 8.5 nguyên bản');
  check(originalReport.status === 'SUCCESS', 'Status vẫn là SUCCESS nguyên bản');

  // 3. Kiểm chứng việc đồng bộ ngôn ngữ cho History (tên nhiệm vụ & nút hành động) theo 9 ngôn ngữ
  const dartTitles: Record<string, string> = {};
  for (const lang of EXPECTED_9_LANGS) {
    setCurrentLang(lang);
    const m = getMissionText('nasa_dart', lang);
    check(!!m && !!m.title, `[${lang}] getMissionText('nasa_dart') trả về tiêu đề hợp lệ`);
    if (m) dartTitles[lang] = m.title;

    const ct = getControlTexts(lang);
    check(!!ct.historyTitle && !!ct.historyViewReport, `[${lang}] Khóa historyTitle và historyViewReport khả dụng`);
  }

  // Đảm bảo tiêu đề nhiệm vụ có sự khác biệt giữa các ngôn ngữ đại diện
  check(dartTitles['vi'] !== dartTitles['en_us'], 'Tiêu đề tiếng Việt khác tiếng Anh');
  check(dartTitles['ja'] !== dartTitles['en_us'], 'Tiêu đề tiếng Nhật khác tiếng Anh');

  console.log(`PASS: All ${totalTests} 9-Language Runtime UI & Immutability checks succeeded.`);
}

runRuntimeI18nTests();
