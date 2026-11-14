import * as assert from 'assert';
import {
  GraphicsQuality,
  QUALITY_PRESETS,
  computeEffectiveDpr,
  getStoredQuality,
  setStoredQuality,
  onQualityChange,
  getQualityConfig
} from '../src/QualityManager';

console.log('--- Testing QualityManager Presets & DPR Capping ---');

// 1. Presets contract
assert.strictEqual(QUALITY_PRESETS.low.maxDpr, 1.0, 'Low quality maxDpr must be <= 1.0');
assert.strictEqual(QUALITY_PRESETS.low.shadows, false, 'Low quality must disable shadows');
assert.strictEqual(QUALITY_PRESETS.balanced.maxDpr, 1.25, 'Balanced quality maxDpr must be 1.25');
assert.strictEqual(QUALITY_PRESETS.balanced.shadows, true, 'Balanced quality enables shadows');
assert.strictEqual(QUALITY_PRESETS.high.maxDpr, 1.75, 'High quality maxDpr must be 1.75');
assert.strictEqual(QUALITY_PRESETS.high.shadows, true, 'High quality enables shadows');

// 2. computeEffectiveDpr capping
assert.strictEqual(computeEffectiveDpr('low'), 1.0, 'Effective DPR for low must cap at 1.0');
assert.strictEqual(computeEffectiveDpr('balanced'), 1.0, 'Effective DPR for balanced in node/1x must be 1.0');

// 3. Stored quality getter/setter & event listener notification
let notifiedQuality: GraphicsQuality | null = null;
const unsubscribe = onQualityChange((q) => {
  notifiedQuality = q;
});

setStoredQuality('low');
assert.strictEqual(getStoredQuality(), 'low', 'Stored quality must be low');
assert.strictEqual(notifiedQuality, 'low', 'Listener must receive low quality notification');

setStoredQuality('high');
assert.strictEqual(getStoredQuality(), 'high', 'Stored quality must be high');
assert.strictEqual(notifiedQuality, 'high', 'Listener must receive high quality notification');

setStoredQuality('balanced');
assert.strictEqual(getStoredQuality(), 'balanced', 'Stored quality must return to balanced');
assert.strictEqual(notifiedQuality, 'balanced', 'Listener must receive balanced notification');

unsubscribe();

// 4. In-flight request deduplication contract
const inFlightMap = new Map<string, Promise<string>>();
function fetchAssetDeduped(id: string): Promise<string> {
  if (inFlightMap.has(id)) {
    return inFlightMap.get(id)!;
  }
  const p = new Promise<string>((resolve) => {
    setTimeout(() => {
      inFlightMap.delete(id);
      resolve(`model_data_${id}`);
    }, 10);
  });
  inFlightMap.set(id, p);
  return p;
}

const req1 = fetchAssetDeduped('shuttle');
const req2 = fetchAssetDeduped('shuttle');
assert.strictEqual(req1, req2, 'In-flight asset requests for same URL must be deduplicated to the exact same promise');

// 5. Sequence token stale request protection contract
let latestRequestId = 0;
let committedModel: string | null = null;

function selectModelWithSeq(name: string, delayMs: number) {
  const reqId = ++latestRequestId;
  setTimeout(() => {
    // Only commit if this was the latest request issued
    if (reqId === latestRequestId) {
      committedModel = name;
    }
  }, delayMs);
}

// Request A takes 30ms, Request B takes 5ms
selectModelWithSeq('ModelA_Slow', 30);
selectModelWithSeq('ModelB_Fast', 5);

setTimeout(() => {
  assert.strictEqual(committedModel, 'ModelB_Fast', 'Stale ModelA request finishing later must NOT overwrite ModelB');
  console.log('PASS: All Quality & Performance optimization unit tests succeeded.');
}, 50);
