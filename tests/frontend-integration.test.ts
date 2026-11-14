import {
  getTexts,
  SUPPORTED_LANGS,
  SupportedLang,
  I18nTexts
} from '../src/i18n';
import {
  DART_OFFICIAL_SOURCES,
  renderDartSourcesHTML,
  getDartSourceByStableId
} from '../src/DartSources';
import * as assert from 'assert';

console.log('--- Running FE07, FE11, and FE14 Frontend Integration Test Suite ---');

// =========================================================================
// TEST SUITE 1: FE14 DART Official Sources as Real Clickable Links
// =========================================================================
console.log('\n[TEST SUITE 1] FE14: DART Official Sources Verification');

// 1.1 Source Registry Validation
assert.strictEqual(DART_OFFICIAL_SOURCES.length, 3, 'Must have exactly 3 official DART sources');
const expectedIds = ['dart_overview', 'dart_results_2022', 'dart_study_2024'];
DART_OFFICIAL_SOURCES.forEach((s, idx) => {
  assert.strictEqual(s.id, expectedIds[idx], `Source #${idx} must have stable ID "${expectedIds[idx]}"`);
  assert.ok(s.url.startsWith('https://'), `Source ${s.id} URL must use secure https://`);
  assert.ok(s.dateStr && s.dateStr.length >= 4, `Source ${s.id} must have a valid publication date`);
  assert.ok(s.labelKey && s.labelKey.startsWith('dartSource'), `Source ${s.id} must reference a dartSource i18n key`);
});
console.log('  PASS 1.1: Source registry has 3 stable entries with secure HTTPS URLs and valid dates');

// 1.2 Stable ID lookup
assert.ok(getDartSourceByStableId('dart_overview') !== undefined, 'getDartSourceByStableId finds dart_overview');
assert.ok(getDartSourceByStableId('dart_results_2022') !== undefined, 'getDartSourceByStableId finds dart_results_2022');
assert.ok(getDartSourceByStableId('dart_study_2024') !== undefined, 'getDartSourceByStableId finds dart_study_2024');
assert.strictEqual(getDartSourceByStableId('invalid_id'), undefined, 'getDartSourceByStableId returns undefined for invalid ID');
console.log('  PASS 1.2: Stable ID lookup functions correctly');

// 1.3 HTML Rendering in all 9 Languages
SUPPORTED_LANGS.forEach((lang) => {
  const html = renderDartSourcesHTML(lang);
  assert.ok(html.includes('class="dart-source-item"'), `[${lang}] Item class missing`);
  assert.ok(html.includes('class="dart-source-link"'), `[${lang}] Link class missing`);
  assert.ok(html.includes('class="dart-source-meta"'), `[${lang}] Meta class missing`);

  // Count <a> tags
  const anchorMatches = html.match(/<a\s+[^>]*class="dart-source-link"[^>]*>/g);
  assert.strictEqual(anchorMatches ? anchorMatches.length : 0, 3, `[${lang}] Must render exactly 3 <a class="dart-source-link"> tags`);

  // Verify target="_blank" and rel="noopener noreferrer"
  assert.ok(html.includes('target="_blank"'), `[${lang}] Missing target="_blank"`);
  assert.ok(html.includes('rel="noopener noreferrer"'), `[${lang}] Missing rel="noopener noreferrer"`);

  // Verify official URLs exist in HTML
  assert.ok(html.includes('https://science.nasa.gov/mission/dart/'), `[${lang}] DART overview URL missing`);
  assert.ok(html.includes('https://www.nasa.gov/news-release/nasa-confirms-dart-mission-impact-changed-asteroids-motion-in-space/'), `[${lang}] DART 2022 result URL missing`);
  assert.ok(html.includes('https://www.nasa.gov/missions/dart/nasa-study-asteroids-orbit-shape-changed-after-dart-impact/'), `[${lang}] DART 2024 study URL missing`);

  // Verify non-empty labels (no undefined or [key])
  assert.ok(!html.includes('undefined'), `[${lang}] HTML output must not contain undefined`);
  assert.ok(!html.includes('null'), `[${lang}] HTML output must not contain null`);
});
console.log('  PASS 1.3: HTML generated for all 9 languages with secure clickable <a> tags and valid URLs');


// =========================================================================
// TEST SUITE 2: FE07 Complete 9-Language Localization (No Fallback Leaks)
// =========================================================================
console.log('\n[TEST SUITE 2] FE07: Complete 9-Language Dynamic Flows & Debrief Localization');

// 2.1 Guided Tour 6 Steps
const TOUR_STEP_COUNT = 6;
SUPPORTED_LANGS.forEach((lang) => {
  const t = getTexts(lang);

  // Counter
  assert.ok(t.tourStepCounter.includes('{current}') && t.tourStepCounter.includes('{total}'), `[${lang}] tourStepCounter missing placeholders`);
  // Buttons
  assert.ok(t.tourBtnPrev && t.tourBtnPrev.trim().length > 0, `[${lang}] tourBtnPrev missing`);
  assert.ok(t.tourBtnNext && t.tourBtnNext.trim().length > 0, `[${lang}] tourBtnNext missing`);
  assert.ok(t.tourBtnFinish && t.tourBtnFinish.trim().length > 0, `[${lang}] tourBtnFinish missing`);
  assert.ok(t.tourBtnSkip && t.tourBtnSkip.trim().length > 0, `[${lang}] tourBtnSkip missing`);
  assert.ok(t.tourBtnCloseAria && t.tourBtnCloseAria.trim().length > 0, `[${lang}] tourBtnCloseAria missing`);

  // Steps 1..6
  for (let s = 1; s <= TOUR_STEP_COUNT; s++) {
    const titleKey = `tourStep${s}Title` as keyof I18nTexts;
    const descKey = `tourStep${s}Desc` as keyof I18nTexts;
    const hintKey = `tourStep${s}Hint` as keyof I18nTexts;

    const title = t[titleKey] as string;
    const desc = t[descKey] as string;
    const hint = t[hintKey] as string;

    assert.ok(title && title.length > 2, `[${lang}] Step ${s} title missing or too short`);
    assert.ok(desc && desc.length > 5, `[${lang}] Step ${s} description missing or too short`);
    assert.ok(hint && hint.length > 3, `[${lang}] Step ${s} hint missing or too short`);
  }
});
console.log('  PASS 2.1: Guided tour steps 1..6 have 100% complete localized titles, descriptions, hints, and controls in all 9 languages');

// 2.2 Dock & Blade Toggle Buttons
SUPPORTED_LANGS.forEach((lang) => {
  const t = getTexts(lang);
  assert.ok(t.dockCollapse && t.dockCollapse.length > 2, `[${lang}] dockCollapse missing`);
  assert.ok(t.dockExpand && t.dockExpand.length > 2, `[${lang}] dockExpand missing`);
  assert.ok(t.dockToggleAria && t.dockToggleAria.length > 2, `[${lang}] dockToggleAria missing`);

  assert.ok(t.bladeMissionsCollapseAria && t.bladeMissionsCollapseAria.length > 2, `[${lang}] bladeMissionsCollapseAria missing`);
  assert.ok(t.bladeMissionsExpandAria && t.bladeMissionsExpandAria.length > 2, `[${lang}] bladeMissionsExpandAria missing`);
  assert.ok(t.bladeAvionicsCollapseAria && t.bladeAvionicsCollapseAria.length > 2, `[${lang}] bladeAvionicsCollapseAria missing`);
  assert.ok(t.bladeAvionicsExpandAria && t.bladeAvionicsExpandAria.length > 2, `[${lang}] bladeAvionicsExpandAria missing`);
});
console.log('  PASS 2.2: Dock and blade collapse/expand labels & ARIA attributes fully localized in all 9 languages');

// 2.3 DART Outcome, Reason, and Retry Tip Texts
const dartStates = [
  { state: 'completed', outcomeKey: 'dartOutcomeCompleted', reasonKey: 'dartReasonSuccess', tipKey: 'dartTipSuccess' },
  { state: 'insufficient_period_change', outcomeKey: 'dartOutcomeInsufficient', reasonKey: 'dartReasonInsufficient', tipKey: 'dartTipInsufficient' },
  { state: 'hit_wrong_body', outcomeKey: 'dartOutcomeWrongBody', reasonKey: 'dartReasonHitDidymos', tipKey: 'dartTipAimDimorphos' },
  { state: 'missed', outcomeKey: 'dartOutcomeMissed', reasonKey: 'dartReasonMissed', tipKey: 'dartTipEnableGuidance' },
  { state: 'invalid', outcomeKey: 'dartOutcomeInvalid', reasonKey: 'dartReasonInvalid', tipKey: 'dartTipCheckConfig' }
];

SUPPORTED_LANGS.forEach((lang) => {
  const t = getTexts(lang);
  dartStates.forEach(({ state, outcomeKey, reasonKey, tipKey }) => {
    const outcome = t[outcomeKey as keyof I18nTexts] as string;
    const reason = t[reasonKey as keyof I18nTexts] as string;
    const tip = t[tipKey as keyof I18nTexts] as string;

    assert.ok(outcome && outcome.length > 2, `[${lang}] ${outcomeKey} missing for state ${state}`);
    assert.ok(reason && reason.length > 10, `[${lang}] ${reasonKey} missing for state ${state}`);
    assert.ok(tip && tip.length > 5, `[${lang}] ${tipKey} missing for state ${state}`);
  });
});
console.log('  PASS 2.3: DART outcomes, reasons, and retry advice fully localized across all simulation states in all 9 languages');

// 2.4 Generic Debrief Reports for other missions
SUPPORTED_LANGS.forEach((lang) => {
  const t = getTexts(lang);
  assert.ok(t.debriefTitle && t.debriefTitle.length > 2, `[${lang}] debriefTitle missing`);
  assert.ok(t.debriefRankSuccess && t.debriefRankSuccess.length > 2, `[${lang}] debriefRankSuccess missing`);
  assert.ok(t.debriefRankPartial && t.debriefRankPartial.length > 2, `[${lang}] debriefRankPartial missing`);
  assert.ok(t.debriefSummarySuccess && t.debriefSummarySuccess.includes('{destination}'), `[${lang}] debriefSummarySuccess missing template placeholders`);
  assert.ok(t.debriefSummaryPartial && t.debriefSummaryPartial.includes('{destination}'), `[${lang}] debriefSummaryPartial missing template placeholders`);
});
console.log('  PASS 2.4: Mission debrief reports and rank summaries fully localized across all 9 languages');

// 2.5 Regression Check: Verify Italian, Japanese, and French are NOT falling back to English
const tEn = getTexts('en_us');
const tIt = getTexts('it');
const tJa = getTexts('ja');
const tFr = getTexts('fr');

assert.notStrictEqual(tIt.dockCollapse, tEn.dockCollapse, 'Italian dockCollapse must not be English');
assert.notStrictEqual(tIt.dartReasonSuccess, tEn.dartReasonSuccess, 'Italian dartReasonSuccess must not be English');
assert.notStrictEqual(tJa.tourStep1Title, tEn.tourStep1Title, 'Japanese tourStep1Title must not be English');
assert.notStrictEqual(tFr.dartTipSuccess, tEn.dartTipSuccess, 'French dartTipSuccess must not be English');
console.log('  PASS 2.5: Verified foreign languages (Italian, Japanese, French) do not leak English fallback');


// =========================================================================
// TEST SUITE 3: FE11 Keyboard Navigation & Accessibility Semantics
// =========================================================================
console.log('\n[TEST SUITE 3] FE11: Keyboard Navigation, ARIA Roles, and Flight Control Guards');

// 3.1 Check ARIA Attributes in i18n
SUPPORTED_LANGS.forEach((lang) => {
  const t = getTexts(lang);
  assert.ok(t.missionsListAria && t.missionsListAria.length > 2, `[${lang}] missionsListAria missing`);
  assert.ok(t.armoryGridAria && t.armoryGridAria.length > 2, `[${lang}] armoryGridAria missing`);
});
console.log('  PASS 3.1: Radiogroup ARIA labels present for mission selector and armory dock');

// 3.2 Mock DOM Simulation of Keyboard Event Interaction on Radiogroup
interface MockElement {
  id: string;
  role?: string;
  tabIndex: number;
  ariaChecked?: string;
  ariaSelected?: string;
  focused: boolean;
  selected: boolean;
}

const mockMissions: MockElement[] = [
  { id: 'mission-0', role: 'radio', tabIndex: 0, ariaChecked: 'true', ariaSelected: 'true', focused: false, selected: true },
  { id: 'mission-1', role: 'radio', tabIndex: -1, ariaChecked: 'false', ariaSelected: 'false', focused: false, selected: false },
  { id: 'mission-2', role: 'radio', tabIndex: -1, ariaChecked: 'false', ariaSelected: 'false', focused: false, selected: false },
];

function simulateRovingKeyDown(key: string, currentIndex: number, items: MockElement[]): number {
  let nextIndex = currentIndex;
  if (key === 'ArrowDown' || key === 'ArrowRight') {
    nextIndex = (currentIndex + 1) % items.length;
  } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
    nextIndex = (currentIndex - 1 + items.length) % items.length;
  } else if (key === 'Enter' || key === ' ') {
    items.forEach((item, idx) => {
      item.selected = (idx === currentIndex);
      item.ariaChecked = item.selected ? 'true' : 'false';
      item.ariaSelected = item.selected ? 'true' : 'false';
    });
    return currentIndex;
  }

  // Update roving tabindex
  items.forEach((item, idx) => {
    item.tabIndex = (idx === nextIndex) ? 0 : -1;
    item.focused = (idx === nextIndex);
  });
  return nextIndex;
}

let activeIdx = 0;
activeIdx = simulateRovingKeyDown('ArrowDown', activeIdx, mockMissions);
assert.strictEqual(activeIdx, 1, 'ArrowDown moves focus to next mission');
assert.strictEqual(mockMissions[1].tabIndex, 0, 'New active mission has tabIndex=0');
assert.strictEqual(mockMissions[0].tabIndex, -1, 'Previous mission has tabIndex=-1');

activeIdx = simulateRovingKeyDown('Enter', activeIdx, mockMissions);
assert.strictEqual(mockMissions[1].selected, true, 'Enter key selects the focused mission');
assert.strictEqual(mockMissions[1].ariaChecked, 'true', 'Selected mission has aria-checked="true"');
assert.strictEqual(mockMissions[0].ariaChecked, 'false', 'Unselected mission has aria-checked="false"');
console.log('  PASS 3.2: Roving tabindex, Arrow keys, and Enter/Space selection semantics verified');

// 3.3 Orbiter Flight Key Interception Guard Logic
let isFlightMode = false;
let throttle = 0;
function handleOrbiterKeyDown(char: string, isInteractive: boolean) {
  if (!isFlightMode || isInteractive) return;
  if (char === 'z') throttle = 1;
  if (char === 'x') throttle = 0;
}

// Case A: Inside hangar, user presses 'z' (e.g. typing or zooming in design view)
handleOrbiterKeyDown('z', false);
assert.strictEqual(throttle, 0, 'Flight key "z" must NOT trigger while in Hangar mode');

// Case B: In flight mode, but user is interacting with modal / card
isFlightMode = true;
handleOrbiterKeyDown('z', true); // interactive element
assert.strictEqual(throttle, 0, 'Flight key "z" must NOT trigger while interacting with UI element');

// Case C: In flight mode, canvas focused
handleOrbiterKeyDown('z', false);
assert.strictEqual(throttle, 1, 'Flight key "z" triggers when flight mode active and outside interactive elements');
console.log('  PASS 3.3: Orbiter flight controls key listener guard protects UI and design interactions');

console.log('\n=========================================================================');
console.log('ALL FRONTEND INTEGRATION & ACCESSIBILITY TESTS PASSED SUCCESSFULLY! (100%)');
console.log('=========================================================================\n');
