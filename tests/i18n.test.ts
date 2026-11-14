import * as assert from 'assert';
import {
  SUPPORTED_LANGS,
  HANGAR_I18N,
  CONTROLS_I18N,
  normalizeLang,
  formatTpl,
  formatNum
} from '../src/i18n';
import {
  MISSIONS_I18N,
  SPACECRAFT_I18N,
  POWER_CORES_I18N,
  TECH_MODULES_I18N,
  ENGINES_I18N,
  CARRIERS_I18N,
  FLAGS_I18N,
  ORRERY_I18N
} from '../src/i18n-catalog';

const EXPECTED_LANGS = ['en_us', 'vi', 'en_uk', 'ja', 'ko', 'fr', 'de', 'it', 'es'];
const VI_ONLY_CHARS = /[ăằắẳẵặầấẩẫậềếểễệồốổỗộơờớởỡợưừứửữựđảãạẻẽẹỉĩịỏõọủũụỷỹỵ]/i;
const VI_ALL_DIACRITICS = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

function extractPlaceholders(str: string): string[] {
  const matches = str.match(/\{[a-zA-Z0-9_]+\}/g) || [];
  return Array.from(new Set(matches)).sort();
}

function collectStrings(obj: any, prefix = ''): Array<{ path: string; value: string }> {
  const out: Array<{ path: string; value: string }> = [];
  if (typeof obj === 'string') {
    out.push({ path: prefix, value: obj });
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      out.push(...collectStrings(item, `${prefix}[${idx}]`));
    });
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      out.push(...collectStrings(obj[key], prefix ? `${prefix}.${key}` : key));
    }
  }
  return out;
}

function verifyDictionary(name: string, dict: Record<string, any>) {
  assert.deepStrictEqual(
    Object.keys(dict).sort(),
    [...EXPECTED_LANGS].sort(),
    `${name}: must contain all 9 languages`
  );

  const baseEntries = collectStrings(dict.en_us);
  assert.ok(baseEntries.length > 0, `${name}: en_us must not be empty`);

  for (const lang of EXPECTED_LANGS) {
    const langEntries = collectStrings(dict[lang]);
    const baseMap = new Map(baseEntries.map(e => [e.path, e.value]));
    const langMap = new Map(langEntries.map(e => [e.path, e.value]));

    for (const [path, baseVal] of baseMap.entries()) {
      const val = langMap.get(path);
      assert.ok(typeof val === 'string' && val.trim().length > 0, `${name}.${lang}.${path}: missing or empty`);
      assert.ok(!val.includes('undefined') && !val.includes('[object Object]'), `${name}.${lang}.${path}: invalid token in "${val}"`);

      const baseVars = extractPlaceholders(baseVal);
      const langVars = extractPlaceholders(val);
      assert.deepStrictEqual(
        langVars,
        baseVars,
        `${name}.${lang}.${path}: placeholder mismatch (expected ${JSON.stringify(baseVars)}, got ${JSON.stringify(langVars)})`
      );

      if (lang !== 'vi') {
        assert.ok(!VI_ONLY_CHARS.test(val), `${name}.${lang}.${path}: unexpected Vietnamese-only character in "${val}"`);
      }
    }
  }
}

// Run all checks
assert.deepStrictEqual([...SUPPORTED_LANGS].sort(), [...EXPECTED_LANGS].sort(), 'SUPPORTED_LANGS must match 9 languages');

verifyDictionary('HANGAR_I18N', HANGAR_I18N);
verifyDictionary('CONTROLS_I18N', CONTROLS_I18N);
verifyDictionary('MISSIONS_I18N', MISSIONS_I18N);
verifyDictionary('SPACECRAFT_I18N', SPACECRAFT_I18N);
verifyDictionary('POWER_CORES_I18N', POWER_CORES_I18N);
verifyDictionary('TECH_MODULES_I18N', TECH_MODULES_I18N);
verifyDictionary('ENGINES_I18N', ENGINES_I18N);
verifyDictionary('CARRIERS_I18N', CARRIERS_I18N);
verifyDictionary('FLAGS_I18N', FLAGS_I18N);
verifyDictionary('ORRERY_I18N', ORRERY_I18N);

// Helper function checks
assert.strictEqual(normalizeLang('vi'), 'vi');
assert.strictEqual(normalizeLang('invalid_code'), 'en_us');
assert.strictEqual(normalizeLang(null), 'en_us');
assert.strictEqual(normalizeLang(undefined), 'en_us');

assert.strictEqual(
  formatTpl('Deficit: {deficit} m/s at {au} AU', { deficit: 790, au: 1.64 }),
  'Deficit: 790 m/s at 1.64 AU'
);

for (const lang of EXPECTED_LANGS) {
  const formatted = formatNum(5200, lang as any);
  assert.ok(formatted.length > 0 && !formatted.includes('NaN'), `formatNum failed for ${lang}`);
}

console.log('PASS: All 9-language i18n dictionary, placeholder, and helper checks succeeded.');
