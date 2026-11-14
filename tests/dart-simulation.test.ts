import assert from 'assert';
import {
  DartSimulation,
  createVector3,
  vLength,
  vClone,
  DART_HISTORICAL_DATA
} from '../src/DartSimulation';
import { HANGAR_I18N } from '../src/i18n';

console.log('--- Testing DART Mission Simulation & Physics (Q24 Verification Suite) ---');

// -------------------------------------------------------------------------------------------------
// Case 1: Nominal Reconstruction Scenario (Hits Dimorphos and meets criteria: >= 73s reduction)
// -------------------------------------------------------------------------------------------------
{
  const sim = new DartSimulation();
  assert.strictEqual(sim.state, 'approaching');
  const preOrbit = sim.getPreImpactOrbit();
  assert(Math.abs(preOrbit.periodMinutes - 715.28) < 1.0, `Pre-impact period ~715 min (actual: ${preOrbit.periodMinutes})`);

  let res = null;
  const dt = 1 / 60; // 60 FPS
  for (let step = 0; step < 300; step++) {
    res = sim.step(dt);
    if (res) break;
  }

  assert(res !== null, 'Nominal DART trajectory must produce an impact result');
  assert.strictEqual(res.state, 'completed', 'Nominal DART run must succeed');
  assert.strictEqual(res.impactBodyId, 'dimorphos', 'Must impact Dimorphos');
  assert(res.meetsSuccessCriteria === true, 'Must meet success criteria');
  assert(res.periodChangeSeconds !== null && res.periodChangeSeconds <= -73, 'Period reduction must exceed 73 seconds');
  assert(
    res.periodChangeMinutes !== null && res.periodChangeMinutes <= -30 && res.periodChangeMinutes >= -36,
    `Nominal period change should be ~32-34 minutes (actual: ${res.periodChangeMinutes} min)`
  );
  console.log('  PASS 1: Nominal reconstruction hits Dimorphos with delta T ~' + res.periodChangeMinutes?.toFixed(2) + ' min');
}

// -------------------------------------------------------------------------------------------------
// Case 2: Flyby (Miss): No impulse applied, not success
// -------------------------------------------------------------------------------------------------
{
  const sim = new DartSimulation();
  sim.guidanceAssistEnabled = false; // Disable auto-guidance
  // Offset position so DART flies 1 km to the side
  sim.setCustomInitialState(
    createVector3(sim.initialSemiMajorAxis + 1000, 15000, 0),
    createVector3(0, -6140, 0)
  );

  let res = null;
  const dt = 1 / 60;
  for (let step = 0; step < 400; step++) {
    res = sim.step(dt);
    if (res) break;
  }

  assert(res !== null, 'Flyby must terminate in a result');
  assert.strictEqual(res.state, 'missed', 'Must be marked as missed');
  assert.strictEqual(res.impactBodyId, null, 'Must not impact any body');
  assert.strictEqual(res.meetsSuccessCriteria, false, 'Miss cannot succeed');
  assert.strictEqual(sim.impactProcessed, true, 'Miss marks simulation finished');
  console.log('  PASS 2: Missed flyby correctly identified without applying impulse');
}

// -------------------------------------------------------------------------------------------------
// Case 3: Collides with Didymos (Wrong target)
// -------------------------------------------------------------------------------------------------
{
  const sim = new DartSimulation();
  sim.guidanceAssistEnabled = false;
  // Aim directly at Didymos (0, 0, 0)
  sim.setCustomInitialState(
    createVector3(0, 15000, 0),
    createVector3(0, -6140, 0)
  );

  let res = null;
  const dt = 1 / 60;
  for (let step = 0; step < 300; step++) {
    res = sim.step(dt);
    if (res) break;
  }

  assert(res !== null, 'Didymos collision must produce result');
  assert.strictEqual(res.state, 'hit_wrong_body', 'Must be marked as hit_wrong_body');
  assert.strictEqual(res.impactBodyId, 'didymos', 'Must identify Didymos as impacted body');
  assert.strictEqual(res.meetsSuccessCriteria, false, 'Didymos collision cannot be a DART success');
  console.log('  PASS 3: Wrong target (Didymos) impact correctly identified');
}

// -------------------------------------------------------------------------------------------------
// Case 4: High-Velocity Tunneling Prevention (CCD detection)
// -------------------------------------------------------------------------------------------------
{
  const sim = new DartSimulation();
  sim.guidanceAssistEnabled = false;
  // At speed 6140 m/s with large dt = 0.5s, step distance is 3070 m, slicing completely through
  // Dimorphos (diameter 151m) in a single frame!
  sim.setCustomInitialState(
    createVector3(sim.initialSemiMajorAxis, 1500, 0),
    createVector3(0, -6140, 0)
  );

  // In 1 step of dt = 0.5s, DART moves from y = 1500 to y = -1570, passing y = 0
  const res = sim.step(0.5);
  assert(res !== null, 'CCD must detect collision when slicing through target in a single step');
  assert.strictEqual(res.impactBodyId, 'dimorphos', 'Must detect Dimorphos collision without tunneling');
  console.log('  PASS 4: High-velocity tunneling avoided by continuous collision detection');
}

// -------------------------------------------------------------------------------------------------
// Case 5: Near-Miss Outside Collider: No false positive hit
// -------------------------------------------------------------------------------------------------
{
  const sim = new DartSimulation();
  sim.guidanceAssistEnabled = false;
  // Dimorphos physical radius is 75.5 m. Pass at offset 120 m (outside collider).
  sim.setCustomInitialState(
    createVector3(sim.initialSemiMajorAxis + 120, 2000, 0),
    createVector3(0, -6140, 0)
  );

  let res = null;
  for (let step = 0; step < 200; step++) {
    res = sim.step(1 / 60);
    if (res) break;
  }

  assert(res !== null);
  assert.notStrictEqual(res.impactBodyId, 'dimorphos', 'Near miss outside collider must not trigger hit');
  assert.strictEqual(res.state, 'missed', 'Near miss must be classified as missed');
  console.log('  PASS 5: Near-miss trajectory outside collider radius does not false-hit');
}

// -------------------------------------------------------------------------------------------------
// Case 6: Zero Impactor Mass: Invalid state, no orbital period change
// -------------------------------------------------------------------------------------------------
{
  const sim = new DartSimulation();
  sim.guidanceAssistEnabled = false;
  sim.setCustomInitialState(
    createVector3(sim.initialSemiMajorAxis, 1000, 0),
    createVector3(0, -6140, 0),
    0 // mass = 0
  );

  let res = null;
  for (let step = 0; step < 100; step++) {
    res = sim.step(1 / 60);
    if (res) break;
  }

  assert(res !== null, 'Impact with 0 mass must be handled');
  assert.strictEqual(res.state, 'invalid_state', 'Zero mass impactor must result in invalid_state');
  assert.strictEqual(res.meetsSuccessCriteria, false, 'Invalid state cannot meet criteria');
  console.log('  PASS 6: Zero mass handled cleanly as invalid state');
}

// -------------------------------------------------------------------------------------------------
// Case 7: Direction of Impulse Reversed (Prograde Impact increases orbit period)
// -------------------------------------------------------------------------------------------------
{
  const sim = new DartSimulation();
  sim.guidanceAssistEnabled = false;
  // DART moving in +Y (same direction as Dimorphos orbit, prograde impact from behind)
  // Dimorphos is at y = 0 moving at +0.17 m/s. DART starts at y = -1000 moving +6140 m/s.
  sim.setCustomInitialState(
    createVector3(sim.initialSemiMajorAxis, -1000, 0),
    createVector3(0, 6140, 0)
  );

  let res = null;
  for (let step = 0; step < 100; step++) {
    res = sim.step(1 / 60);
    if (res) break;
  }

  assert(res !== null);
  assert.strictEqual(res.impactBodyId, 'dimorphos');
  assert(res.periodChangeSeconds !== null && res.periodChangeSeconds > 0, 'Prograde impact must increase orbital period (Delta T > 0)');
  assert.strictEqual(res.meetsSuccessCriteria, false, 'Increasing period does not meet deflection criteria');
  console.log('  PASS 7: Directional impulse correctly increases orbit period on prograde hit');
}

// -------------------------------------------------------------------------------------------------
// Case 8: Unbound Orbit State (Extreme impulse): Returns unbound without fake finite period
// -------------------------------------------------------------------------------------------------
{
  const sim = new DartSimulation();
  sim.guidanceAssistEnabled = false;
  // Huge mass (e.g. 50,000,000 kg) causing extreme delta V that strips Dimorphos into hyperbolic escape
  sim.setCustomInitialState(
    createVector3(sim.initialSemiMajorAxis, 1000, 0),
    createVector3(0, -6140, 0),
    50000000 // massive impactor
  );

  let res = null;
  for (let step = 0; step < 100; step++) {
    res = sim.step(1 / 60);
    if (res) break;
  }

  assert(res !== null);
  assert(res.postImpactOrbit !== null, 'Must compute post-impact orbit');
  assert.strictEqual(res.postImpactOrbit.isBound, false, 'Hyperbolic orbit must be marked unbound');
  assert(!isFinite(res.postImpactOrbit.periodSeconds), 'Unbound orbit must not return finite period');
  assert.strictEqual(res.meetsSuccessCriteria, false, 'Escape orbit does not meet controlled period change criteria');
  console.log('  PASS 8: Unbound hyperbolic state correctly flagged without fake period');
}

// -------------------------------------------------------------------------------------------------
// Case 9: Impact Handled Once (No double-impulse application)
// -------------------------------------------------------------------------------------------------
{
  const sim = new DartSimulation();
  let res1 = null;
  for (let step = 0; step < 300; step++) {
    res1 = sim.step(1 / 60);
    if (res1) break;
  }
  assert(res1 !== null);
  const vAfterHit = vClone(sim.dimorphosVel);
  const periodAfterHit = sim.postImpactOrbit?.periodSeconds;

  // Step further after impact
  for (let step = 0; step < 100; step++) {
    const res2 = sim.step(1 / 60);
    assert.strictEqual(res2, res1, 'Subsequent steps must return identical result instance');
  }

  assert.strictEqual(sim.dimorphosVel.x, vAfterHit.x, 'Dimorphos velocity must not receive second impulse');
  assert.strictEqual(sim.dimorphosVel.y, vAfterHit.y, 'Dimorphos velocity must not receive second impulse');
  assert.strictEqual(sim.postImpactOrbit?.periodSeconds, periodAfterHit, 'Period must remain constant');
  console.log('  PASS 9: Collision impulse applied exactly once');
}

// -------------------------------------------------------------------------------------------------
// Case 10: Determinism: Identical snapshot and version yields identical results
// -------------------------------------------------------------------------------------------------
{
  const simA = new DartSimulation();
  const simB = new DartSimulation();

  for (let i = 0; i < 50; i++) {
    simA.step(1 / 60);
    simB.step(1 / 60);
  }

  const snapA = simA.getSnapshot();
  const snapB = simB.getSnapshot();

  assert.strictEqual(snapA.version, snapB.version);
  assert.strictEqual(snapA.dartPos.x, snapB.dartPos.x);
  assert.strictEqual(snapA.dartPos.y, snapB.dartPos.y);
  assert.strictEqual(snapA.dimorphosPos.x, snapB.dimorphosPos.x);
  assert.strictEqual(snapA.dimorphosPos.y, snapB.dimorphosPos.y);

  // Restore snapshot into fresh instance
  const simC = new DartSimulation();
  simC.restoreSnapshot(snapA);
  const snapC = simC.getSnapshot();
  assert.strictEqual(snapC.simTime, snapA.simTime);
  assert.strictEqual(snapC.dartPos.y, snapA.dartPos.y);
  console.log('  PASS 10: State snapshot & restore is 100% deterministic');
}

// -------------------------------------------------------------------------------------------------
// Case 11: Multi-framerate Invariance (15 / 30 / 60 FPS)
// -------------------------------------------------------------------------------------------------
{
  const runAtFps = (fps: number) => {
    const sim = new DartSimulation();
    const dt = 1 / fps;
    let res = null;
    while (!res && sim.simTime < 5.0) {
      res = sim.step(dt);
    }
    return res;
  };

  const res15 = runAtFps(15);
  const res30 = runAtFps(30);
  const res60 = runAtFps(60);

  assert(res15 && res30 && res60, 'All framerates must record impact');
  assert.strictEqual(res15.state, 'completed');
  assert.strictEqual(res30.state, 'completed');
  assert.strictEqual(res60.state, 'completed');

  // Time of impact should be virtually identical (within 0.05s) across 15, 30, and 60 FPS
  assert(Math.abs(res15.impactTimeSeconds - res60.impactTimeSeconds) < 0.05);
  assert(Math.abs(res30.impactTimeSeconds - res60.impactTimeSeconds) < 0.02);
  console.log('  PASS 11: 15/30/60 FPS framerate invariance verified');
}

// -------------------------------------------------------------------------------------------------
// Case 12: Cannot win by idling or early report check before collision
// -------------------------------------------------------------------------------------------------
{
  const sim = new DartSimulation();
  assert.strictEqual(sim.state, 'approaching');
  assert.strictEqual(sim.impactProcessed, false);
  assert.strictEqual(sim.result, null);
  // An unimpacted simulation must never claim success
  const meetsCriteria = sim.result ? (sim.result as any).meetsSuccessCriteria : false;
  assert.strictEqual(meetsCriteria, false, 'Cannot win before impact');
  console.log('  PASS 12: Early check / idle cannot produce success');
}

// -------------------------------------------------------------------------------------------------
// Case 13: Reset restores pristine initial state after hit or miss
// -------------------------------------------------------------------------------------------------
{
  const sim = new DartSimulation();
  for (let i = 0; i < 300; i++) {
    if (sim.step(1 / 60)) break;
  }
  assert.strictEqual(sim.impactProcessed, true);

  // Now reset
  sim.resetToInitialConditions();
  assert.strictEqual(sim.state, 'approaching');
  assert.strictEqual(sim.simTime, 0);
  assert.strictEqual(sim.impactProcessed, false);
  assert.strictEqual(sim.result, null);
  assert.strictEqual(sim.postImpactOrbit, null);
  assert.strictEqual(sim.dartPos.y, 15000);
  assert.strictEqual(sim.dimorphosPos.x, sim.initialSemiMajorAxis);
  console.log('  PASS 13: Reset clears all timers, flags, and restores initial conditions');
}

// -------------------------------------------------------------------------------------------------
// Case 14: All 9 languages contain complete DART keys & valid placeholders
// -------------------------------------------------------------------------------------------------
{
  const requiredKeys = [
    'dartBriefTitle',
    'dartBriefDesc',
    'dartTargetDimorphos',
    'dartPrimaryDidymos',
    'dartObjectiveInfo',
    'dartGuidanceAssistLabel',
    'dartGuidanceActive',
    'dartGuidanceManual',
    'dartVisualScaleNotice',
    'dartHudTarget',
    'dartHudRange',
    'dartHudClosingSpeed',
    'dartHudTgo',
    'dartHudOrbitPeriod',
    'dartHudSmartNav',
    'dartHudImpactConfirmed',
    'dartHudPostImpactAnalysis',
    'dartDebriefTitle',
    'dartSimSectionTitle',
    'dartRealSectionTitle',
    'dartFieldImpactBody',
    'dartFieldRelativeSpeed',
    'dartFieldPreOrbit',
    'dartFieldPostOrbit',
    'dartFieldPeriodDelta',
    'dartFieldOutcome',
    'dartFieldReason',
    'dartFieldAdvice',
    'dartRealContextIntro',
    'dartRealBaseline',
    'dartRealInitialResult',
    'dartRealUpdatedStudy',
    'dartRealSourceRef',
    'dartOutcomeCompleted',
    'dartOutcomeInsufficient',
    'dartOutcomeMissed',
    'dartOutcomeWrongBody',
    'dartOutcomeInvalid',
    'dartBtnRetry',
    'dartBtnReturnHangar',
    'dartCraftName',
    'dartCraftDesc'
  ];

  const langs = ['en_us', 'vi', 'en_uk', 'ja', 'ko', 'fr', 'de', 'it', 'es'];
  for (const lang of langs) {
    const dict = HANGAR_I18N[lang];
    assert(dict, `Language dictionary must exist for ${lang}`);
    for (const key of requiredKeys) {
      assert(
        dict[key] && typeof dict[key] === 'string' && dict[key].trim().length > 0,
        `Missing or empty translation key "${key}" in language "${lang}"`
      );
    }
  }
  console.log('  PASS 14: All 9 languages contain 100% complete DART translation keys');
}

console.log('ALL 14 DART SIMULATION TEST CASES PASSED SUCCESSFULLY!\n');
