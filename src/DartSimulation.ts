/**
 * NASA DART (Double Asteroid Redirection Test) Simulation Model
 * 
 * Sources:
 * - NASA DART Mission Overview: https://science.nasa.gov/mission/dart/
 * - NASA Confirms DART Impact Changed Asteroid's Motion in Space (Oct 11, 2022):
 *   https://www.nasa.gov/news-release/nasa-confirms-dart-mission-impact-changed-asteroids-motion-in-space/
 * - NASA Study: Asteroid's Orbit, Shape Changed After DART Impact (March 19, 2024):
 *   https://www.nasa.gov/missions/dart/nasa-study-asteroids-orbit-shape-changed-after-dart-impact/
 * - Daly et al., Nature 616, 438-440 (2023) / Cheng et al., Nature 616, 457-460 (2023):
 *   Momentum transfer and beta factor analysis (beta in range 2.2 - 4.9).
 * 
 * Physical Units:
 * - Position & Distances: meters (m)
 * - Velocity: meters per second (m/s)
 * - Mass: kilograms (kg)
 * - Time: seconds (s)
 * - Angles: radians (rad)
 */

export interface DartVector3 {
  x: number;
  y: number;
  z: number;
}

export function createVector3(x = 0, y = 0, z = 0): DartVector3 {
  return { x, y, z };
}

export function vAdd(a: DartVector3, b: DartVector3): DartVector3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function vSub(a: DartVector3, b: DartVector3): DartVector3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function vScale(a: DartVector3, s: number): DartVector3 {
  return { x: a.x * s, y: a.y * s, z: a.z * s };
}

export function vDot(a: DartVector3, b: DartVector3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function vCross(a: DartVector3, b: DartVector3): DartVector3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  };
}

export function vLengthSq(a: DartVector3): number {
  return a.x * a.x + a.y * a.y + a.z * a.z;
}

export function vLength(a: DartVector3): number {
  return Math.sqrt(vLengthSq(a));
}

export function vNormalize(a: DartVector3): DartVector3 {
  const l = vLength(a);
  if (l === 0) return { x: 0, y: 0, z: 0 };
  return { x: a.x / l, y: a.y / l, z: a.z / l };
}

export function vDistance(a: DartVector3, b: DartVector3): number {
  return vLength(vSub(a, b));
}

export function vClone(a: DartVector3): DartVector3 {
  return { x: a.x, y: a.y, z: a.z };
}

/**
 * Standard Gravitational Constant G (m^3 / (kg * s^2))
 */
export const G_CONST = 6.67430e-11;

/**
 * Astronomical Unit in meters
 */
export const AU_METERS = 149597870700;

export interface DartBodyConfig {
  id: 'didymos' | 'dimorphos' | 'dart';
  name: string;
  mass: number;          // kg
  radius: number;        // m (physical collider radius)
  visualRadius: number;  // m (for 3D display scaling)
  color: string;
}

export interface DartOrbitalElements {
  semiMajorAxis: number;       // meters
  eccentricity: number;
  periodSeconds: number;       // seconds
  periodMinutes: number;       // minutes
  periodFormatted: string;     // e.g. "11h 55m 17s"
  specificEnergy: number;      // J/kg
  isBound: boolean;
}

export type DartSimulationState =
  | 'approaching'
  | 'impacted_target'
  | 'evaluating_orbit'
  | 'completed'
  | 'insufficient_period_change'
  | 'missed'
  | 'hit_wrong_body'
  | 'invalid_state';

export interface DartImpactResult {
  state: DartSimulationState;
  impactBodyId: 'dimorphos' | 'didymos' | null;
  impactTimeSeconds: number;
  impactRelativeVelocity: DartVector3;
  impactSpeedMs: number;
  impactSpeedKmS: number;
  preImpactOrbit: DartOrbitalElements;
  postImpactOrbit: DartOrbitalElements | null;
  periodChangeSeconds: number | null;
  periodChangeMinutes: number | null;
  meetsSuccessCriteria: boolean;
  explanationKey: string;
  retryTipKey: string;
}

export interface DartSimulationSnapshot {
  version: string;
  simTime: number;
  state: DartSimulationState;
  dartPos: DartVector3;
  dartVel: DartVector3;
  dartMass: number;
  dimorphosPos: DartVector3;
  dimorphosVel: DartVector3;
  didymosPos: DartVector3;
  guidanceAssistEnabled: boolean;
  impactProcessed: boolean;
  result: DartImpactResult | null;
}

export interface DartHistoricalReference {
  launchDate: string;
  impactDate: string;
  targetBody: string;
  primaryBody: string;
  nominalImpactSpeedKmS: number;
  nominalImpactorMassKg: number;
  preImpactPeriodMinutes: number;
  nasaSuccessThresholdSeconds: number;
  nasaInitialReductionMinutes: number;
  nasa2024StudyReductionMinutes: number;
  nasa2024StudyReductionSeconds: number;
  officialSourceUrl: string;
}

export const DART_HISTORICAL_DATA: DartHistoricalReference = {
  launchDate: 'November 24, 2021',
  impactDate: 'September 26, 2022 23:14 UTC',
  targetBody: 'Dimorphos (Asteroid moonlet)',
  primaryBody: '65803 Didymos',
  nominalImpactSpeedKmS: 6.14,
  nominalImpactorMassKg: 570.0,
  preImpactPeriodMinutes: 715.28, // 11h 55m 17s
  nasaSuccessThresholdSeconds: 73.0, // Minimum NASA success criterion
  nasaInitialReductionMinutes: 32.0, // Oct 2022 announcement (~32 min)
  nasa2024StudyReductionMinutes: 33.25, // March 2024 study: 33 min 15 sec
  nasa2024StudyReductionSeconds: 1995.0, // 33 * 60 + 15 = 1995 seconds
  officialSourceUrl: 'https://science.nasa.gov/mission/dart/'
};

export class DartSimulation {
  public static readonly VERSION = '1.0.0-dart-q24';

  // 1. Physical constants and body configs (with clear category tags)
  // [Historical Fact] Didymos primary mass and radius
  // Total binary system mass is (5.40 ± 0.3) x 10^11 kg (Daly et al., Nature 2023)
  public readonly didymosMass = 5.357e11;     // kg
  public readonly didymosRadius = 390.0;      // m (mean radius)

  // [Historical Fact] Dimorphos secondary moonlet mass and radius
  public readonly dimorphosMass = 4.30e9;     // kg
  public readonly dimorphosRadius = 75.5;     // m (mean physical radius, ~151m diameter)

  // [Historical Fact] Pre-impact semi-major axis
  public readonly initialSemiMajorAxis = 1189.0; // m (1.189 km)

  // [Simplified Model Assumption] Calibrated momentum enhancement factor beta
  // Nature 2023 papers measured beta between 2.2 and 4.9.
  // beta = 3.42 calibrated to produce historical ~33 min 15 sec period reduction under head-on impact.
  public beta: number = 3.42;

  // [Historical Fact] DART spacecraft impact mass
  public dartMass: number = 570.0;            // kg

  // Standard gravitational parameter mu = G * (M1 + M2)
  public readonly mu: number;

  // Initial circular orbital speed
  public readonly initialOrbitalSpeed: number;

  // Initial orbital period (seconds and minutes)
  public readonly initialPeriodSeconds: number;
  public readonly initialPeriodMinutes: number;

  // 2. Dynamic Simulation State
  public simTime = 0; // seconds
  public state: DartSimulationState = 'approaching';
  public guidanceAssistEnabled = true;

  // Positions and velocities in inertial Didymos frame
  public didymosPos: DartVector3 = createVector3(0, 0, 0);
  public dimorphosPos: DartVector3 = createVector3(0, 0, 0);
  public dimorphosVel: DartVector3 = createVector3(0, 0, 0);

  public dartPos: DartVector3 = createVector3(0, 0, 0);
  public dartVel: DartVector3 = createVector3(0, 0, 0);

  // Initial condition cache for clean reset
  private initialDartPos: DartVector3 = createVector3(0, 0, 0);
  private initialDartVel: DartVector3 = createVector3(0, 0, 0);

  // Impact event tracking (ensures impulse applies only once)
  public impactProcessed = false;
  public result: DartImpactResult | null = null;

  // Post-impact orbital elements cache
  public postImpactOrbit: DartOrbitalElements | null = null;

  constructor() {
    this.mu = G_CONST * (this.didymosMass + this.dimorphosMass);
    this.initialOrbitalSpeed = Math.sqrt(this.mu / this.initialSemiMajorAxis);
    this.initialPeriodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(this.initialSemiMajorAxis, 3) / this.mu);
    this.initialPeriodMinutes = this.initialPeriodSeconds / 60;

    this.resetToInitialConditions();
  }

  /**
   * Format seconds into "Xh Ym Zs"
   */
  public static formatPeriod(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '--';
    const totalSec = Math.round(seconds);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${m}m ${s}s`;
  }

  /**
   * Calculate orbital elements for a body relative to Didymos
   */
  public computeOrbitalElements(pos: DartVector3, vel: DartVector3): DartOrbitalElements {
    const r = vLength(pos);
    const v = vLength(vel);

    if (r === 0) {
      return {
        semiMajorAxis: 0,
        eccentricity: 1,
        periodSeconds: 0,
        periodMinutes: 0,
        periodFormatted: '--',
        specificEnergy: 0,
        isBound: false
      };
    }

    const specificEnergy = (v * v) / 2 - this.mu / r;

    // Check if orbit is unbound (parabolic or hyperbolic: energy >= 0)
    if (specificEnergy >= 0) {
      return {
        semiMajorAxis: Infinity,
        eccentricity: 1.0,
        periodSeconds: Infinity,
        periodMinutes: Infinity,
        periodFormatted: 'UNBOUND (Hyperbolic)',
        specificEnergy,
        isBound: false
      };
    }

    const a = -this.mu / (2 * specificEnergy);

    // Eccentricity vector e = ((v^2 - mu/r) * r - (r . v) * v) / mu
    const rDotV = vDot(pos, vel);
    const term1 = vScale(pos, v * v - this.mu / r);
    const term2 = vScale(vel, rDotV);
    const eVec = vScale(vSub(term1, term2), 1 / this.mu);
    const ecc = vLength(eVec);

    if (ecc >= 1.0 || a <= 0) {
      return {
        semiMajorAxis: a,
        eccentricity: ecc,
        periodSeconds: Infinity,
        periodMinutes: Infinity,
        periodFormatted: 'UNBOUND',
        specificEnergy,
        isBound: false
      };
    }

    const periodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / this.mu);
    const periodMinutes = periodSeconds / 60;

    return {
      semiMajorAxis: a,
      eccentricity: ecc,
      periodSeconds,
      periodMinutes,
      periodFormatted: DartSimulation.formatPeriod(periodSeconds),
      specificEnergy,
      isBound: true
    };
  }

  /**
   * Reset simulation cleanly to standard nominal initial conditions
   */
  public resetToInitialConditions(): void {
    this.simTime = 0;
    this.state = 'approaching';
    this.impactProcessed = false;
    this.result = null;
    this.postImpactOrbit = null;
    this.dartMass = 570.0;
    this.beta = 3.42;

    this.didymosPos = createVector3(0, 0, 0);

    // Dimorphos starts on +X axis moving in +Y direction (counter-clockwise circular orbit)
    this.dimorphosPos = createVector3(this.initialSemiMajorAxis, 0, 0);
    this.dimorphosVel = createVector3(0, this.initialOrbitalSpeed, 0);

    // DART nominal approach:
    // Approaches along -Y (head-on retrograde against Dimorphos motion) from distance ~15 km
    // Approach speed relative to Dimorphos: 6.14 km/s (6140 m/s)
    // DART velocity: (0, initialOrbitalSpeed - 6140, 0)
    // Starting position: (initialSemiMajorAxis, 15000, 0) -> takes ~2.44 seconds at 6140 m/s
    const approachDistance = 15000; // 15 km
    const approachSpeed = 6140;     // m/s

    this.dartPos = createVector3(this.initialSemiMajorAxis, approachDistance, 0);
    this.dartVel = createVector3(0, -approachSpeed, 0);

    this.initialDartPos = vClone(this.dartPos);
    this.initialDartVel = vClone(this.dartVel);
  }

  /**
   * Set custom DART initial conditions (for testing misses, Didymos hit, reverse impulse, etc.)
   */
  public setCustomInitialState(dartPos: DartVector3, dartVel: DartVector3, dartMass = 570, beta = 3.42): void {
    this.resetToInitialConditions();
    this.dartPos = vClone(dartPos);
    this.dartVel = vClone(dartVel);
    this.initialDartPos = vClone(dartPos);
    this.initialDartVel = vClone(dartVel);
    this.dartMass = dartMass;
    this.beta = beta;
  }

  /**
   * Continuous Collision Detection (CCD) between a moving point and moving sphere
   * Solves: || (r0 + u * d) ||^2 = R^2 for u in [0, 1]
   */
  private checkContinuousCollision(
    p0: DartVector3,
    p1: DartVector3,
    c0: DartVector3,
    c1: DartVector3,
    radius: number
  ): { hit: boolean; u: number; hitPoint: DartVector3 } {
    const r0 = vSub(p0, c0);
    const dP = vSub(p1, p0);
    const dC = vSub(c1, c0);
    const d = vSub(dP, dC);

    const A = vLengthSq(d);
    const B = 2 * vDot(r0, d);
    const C = vLengthSq(r0) - radius * radius;

    // Already inside collider at start of step
    if (C <= 0) {
      return { hit: true, u: 0, hitPoint: vClone(p0) };
    }

    // No relative motion
    if (A === 0) {
      return { hit: false, u: 1, hitPoint: vClone(p1) };
    }

    const discriminant = B * B - 4 * A * C;
    if (discriminant < 0) {
      return { hit: false, u: 1, hitPoint: vClone(p1) };
    }

    const sqrtDisc = Math.sqrt(discriminant);
    const u1 = (-B - sqrtDisc) / (2 * A);

    if (u1 >= 0 && u1 <= 1) {
      const hitPoint = vAdd(p0, vScale(dP, u1));
      return { hit: true, u: u1, hitPoint };
    }

    return { hit: false, u: 1, hitPoint: vClone(p1) };
  }

  /**
   * Advance simulation by dt seconds (decoupled from render frame rate)
   */
  public step(dt: number): DartImpactResult | null {
    if (this.impactProcessed || this.state === 'completed' || this.state === 'missed' || this.state === 'hit_wrong_body') {
      return this.result;
    }

    if (dt <= 0) return null;

    // Validate inputs
    if (this.dartMass < 0 || isNaN(this.dartPos.x) || isNaN(this.dartVel.x)) {
      this.state = 'invalid_state';
      this.result = this.buildImpactResult('invalid_state', null, 0, createVector3());
      return this.result;
    }

    // 1. Compute Guidance Assist acceleration (SMART Nav inspired proportional steering)
    if (this.guidanceAssistEnabled && this.state === 'approaching') {
      const relPos = vSub(this.dimorphosPos, this.dartPos);
      const relVel = vSub(this.dartVel, this.dimorphosVel);
      const dist = vLength(relPos);
      const closingSpeed = -vDot(relVel, vNormalize(relPos));

      if (dist > this.dimorphosRadius && closingSpeed > 10) {
        // Line-of-sight rate nulling guidance
        const los = vNormalize(relPos);
        const lateralVel = vSub(relVel, vScale(los, vDot(relVel, los)));
        // Maximum steering acceleration ~15 m/s^2 (representing hydrazine RCS burn)
        const maxSteerAccel = 15.0;
        const correctionDir = vScale(lateralVel, -1);
        const corrLen = vLength(correctionDir);
        if (corrLen > 0.01) {
          const steerAccel = Math.min(corrLen / Math.max(0.1, dist / closingSpeed), maxSteerAccel);
          this.dartVel = vAdd(this.dartVel, vScale(vNormalize(correctionDir), steerAccel * dt));
        }
      }
    }

    // 2. Next positions over step dt
    const dartNextPos = vAdd(this.dartPos, vScale(this.dartVel, dt));

    // Dimorphos orbits Didymos via 2-body Keplerian integration
    // Angular speed omega = sqrt(mu / a^3)
    const currentDimDist = vLength(this.dimorphosPos);
    const omega = Math.sqrt(this.mu / Math.pow(currentDimDist, 3));
    const dTheta = omega * dt;

    const cosT = Math.cos(dTheta);
    const sinT = Math.sin(dTheta);
    const dimNextPos: DartVector3 = {
      x: this.dimorphosPos.x * cosT - this.dimorphosPos.y * sinT,
      y: this.dimorphosPos.x * sinT + this.dimorphosPos.y * cosT,
      z: 0
    };
    const dimNextVel: DartVector3 = {
      x: this.dimorphosVel.x * cosT - this.dimorphosVel.y * sinT,
      y: this.dimorphosVel.x * sinT + this.dimorphosVel.y * cosT,
      z: 0
    };

    // 3. Continuous Collision Detection (CCD)
    // Check collision with Dimorphos
    const dimHit = this.checkContinuousCollision(
      this.dartPos,
      dartNextPos,
      this.dimorphosPos,
      dimNextPos,
      this.dimorphosRadius
    );

    // Check collision with Didymos
    const didHit = this.checkContinuousCollision(
      this.dartPos,
      dartNextPos,
      this.didymosPos,
      this.didymosPos,
      this.didymosRadius
    );

    // Determine earliest collision event
    let hitTarget: 'dimorphos' | 'didymos' | null = null;
    let hitU = 1.0;

    if (dimHit.hit && didHit.hit) {
      if (dimHit.u <= didHit.u) {
        hitTarget = 'dimorphos';
        hitU = dimHit.u;
      } else {
        hitTarget = 'didymos';
        hitU = didHit.u;
      }
    } else if (dimHit.hit) {
      hitTarget = 'dimorphos';
      hitU = dimHit.u;
    } else if (didHit.hit) {
      hitTarget = 'didymos';
      hitU = didHit.u;
    }

    // 4. Handle Collision Event
    if (hitTarget === 'dimorphos') {
      const collisionTime = this.simTime + hitU * dt;
      this.dartPos = vAdd(this.dartPos, vScale(vSub(dartNextPos, this.dartPos), hitU));
      this.dimorphosPos = vAdd(this.dimorphosPos, vScale(vSub(dimNextPos, this.dimorphosPos), hitU));
      this.simTime = collisionTime;

      const relVel = vSub(this.dartVel, this.dimorphosVel);
      const relSpeed = vLength(relVel);

      this.processDimorphosImpact(relVel, relSpeed, collisionTime);
      return this.result;
    } else if (hitTarget === 'didymos') {
      const collisionTime = this.simTime + hitU * dt;
      this.simTime = collisionTime;
      const relVel = vSub(this.dartVel, createVector3(0, 0, 0));
      this.state = 'hit_wrong_body';
      this.impactProcessed = true;
      this.result = this.buildImpactResult('hit_wrong_body', 'didymos', vLength(relVel), relVel);
      return this.result;
    }

    // 5. Update positions if no collision
    this.dartPos = dartNextPos;
    this.dimorphosPos = dimNextPos;
    this.dimorphosVel = dimNextVel;
    this.simTime += dt;

    // 6. Check for Miss (Flyby past Dimorphos and Didymos)
    const distToDim = vDistance(this.dartPos, this.dimorphosPos);
    const distToDid = vDistance(this.dartPos, this.didymosPos);
    const relVel = vSub(this.dartVel, this.dimorphosVel);
    const isMovingAway = vDot(relVel, vSub(this.dartPos, this.dimorphosPos)) > 0;

    // If past closest approach and distance > 5 km while moving away -> Missed!
    if (isMovingAway && distToDim > 5000 && distToDid > 5000) {
      this.state = 'missed';
      this.impactProcessed = true;
      this.result = this.buildImpactResult('missed', null, vLength(relVel), relVel);
      return this.result;
    }

    return null;
  }

  /**
   * Apply instantaneous momentum transfer impulse to Dimorphos upon confirmed impact
   * Delta v_dim = beta * (m_dart / M_dim) * v_rel
   */
  private processDimorphosImpact(relVel: DartVector3, relSpeed: number, collisionTime: number): void {
    if (this.impactProcessed) return;
    this.impactProcessed = true;

    // Check invalid inputs (zero mass or zero beta)
    if (this.dartMass <= 0) {
      this.state = 'invalid_state';
      this.result = this.buildImpactResult('invalid_state', 'dimorphos', relSpeed, relVel);
      return;
    }

    // Momentum enhancement impulse: Delta v = beta * (m_dart / M_dim) * relVel
    // relVel = v_dart - v_dimorphos
    const deltaV = vScale(relVel, this.beta * (this.dartMass / this.dimorphosMass));

    // Update Dimorphos velocity vector
    this.dimorphosVel = vAdd(this.dimorphosVel, deltaV);

    // Compute post-impact orbital elements
    const postOrbit = this.computeOrbitalElements(this.dimorphosPos, this.dimorphosVel);
    this.postImpactOrbit = postOrbit;

    if (!postOrbit.isBound) {
      this.state = 'insufficient_period_change';
      this.result = this.buildImpactResult('insufficient_period_change', 'dimorphos', relSpeed, relVel, postOrbit);
      return;
    }

    const preOrbit = this.getPreImpactOrbit();
    const periodDeltaSeconds = postOrbit.periodSeconds - preOrbit.periodSeconds;
    const periodDeltaMinutes = periodDeltaSeconds / 60;

    // NASA Success criteria:
    // 1. Impact confirmed on Dimorphos
    // 2. Bound orbit
    // 3. Orbital period reduction magnitude >= 73 seconds (periodDeltaSeconds <= -73.0)
    const meetsCriteria = periodDeltaSeconds <= -DART_HISTORICAL_DATA.nasaSuccessThresholdSeconds;

    if (meetsCriteria) {
      this.state = 'completed';
    } else {
      this.state = 'insufficient_period_change';
    }

    this.result = this.buildImpactResult(
      this.state,
      'dimorphos',
      relSpeed,
      relVel,
      postOrbit,
      periodDeltaSeconds,
      periodDeltaMinutes,
      meetsCriteria
    );
  }

  public getPreImpactOrbit(): DartOrbitalElements {
    return {
      semiMajorAxis: this.initialSemiMajorAxis,
      eccentricity: 0.0,
      periodSeconds: this.initialPeriodSeconds,
      periodMinutes: this.initialPeriodMinutes,
      periodFormatted: DartSimulation.formatPeriod(this.initialPeriodSeconds),
      specificEnergy: -this.mu / (2 * this.initialSemiMajorAxis),
      isBound: true
    };
  }

  private buildImpactResult(
    state: DartSimulationState,
    impactBodyId: 'dimorphos' | 'didymos' | null,
    impactSpeedMs: number,
    relVel: DartVector3,
    postOrbit: DartOrbitalElements | null = null,
    periodDeltaSeconds: number | null = null,
    periodDeltaMinutes: number | null = null,
    meetsSuccessCriteria = false
  ): DartImpactResult {
    const preOrbit = this.getPreImpactOrbit();

    let explanationKey = 'dartReasonApproaching';
    let retryTipKey = 'dartTipGeneral';

    if (state === 'completed') {
      explanationKey = 'dartReasonSuccess';
      retryTipKey = 'dartTipSuccess';
    } else if (state === 'insufficient_period_change') {
      explanationKey = 'dartReasonInsufficient';
      retryTipKey = 'dartTipInsufficient';
    } else if (state === 'hit_wrong_body') {
      explanationKey = 'dartReasonHitDidymos';
      retryTipKey = 'dartTipAimDimorphos';
    } else if (state === 'missed') {
      explanationKey = 'dartReasonMissed';
      retryTipKey = 'dartTipEnableGuidance';
    } else if (state === 'invalid_state') {
      explanationKey = 'dartReasonInvalid';
      retryTipKey = 'dartTipCheckConfig';
    }

    return {
      state,
      impactBodyId,
      impactTimeSeconds: this.simTime,
      impactRelativeVelocity: relVel,
      impactSpeedMs,
      impactSpeedKmS: impactSpeedMs / 1000,
      preImpactOrbit: preOrbit,
      postImpactOrbit: postOrbit,
      periodChangeSeconds: periodDeltaSeconds,
      periodChangeMinutes: periodDeltaMinutes,
      meetsSuccessCriteria,
      explanationKey,
      retryTipKey
    };
  }

  /**
   * Capture deterministic snapshot of current state
   */
  public getSnapshot(): DartSimulationSnapshot {
    return {
      version: DartSimulation.VERSION,
      simTime: this.simTime,
      state: this.state,
      dartPos: vClone(this.dartPos),
      dartVel: vClone(this.dartVel),
      dartMass: this.dartMass,
      dimorphosPos: vClone(this.dimorphosPos),
      dimorphosVel: vClone(this.dimorphosVel),
      didymosPos: vClone(this.didymosPos),
      guidanceAssistEnabled: this.guidanceAssistEnabled,
      impactProcessed: this.impactProcessed,
      result: this.result ? { ...this.result } : null
    };
  }

  /**
   * Restore deterministic snapshot
   */
  public restoreSnapshot(s: DartSimulationSnapshot): void {
    this.simTime = s.simTime;
    this.state = s.state;
    this.dartPos = vClone(s.dartPos);
    this.dartVel = vClone(s.dartVel);
    this.dartMass = s.dartMass;
    this.dimorphosPos = vClone(s.dimorphosPos);
    this.dimorphosVel = vClone(s.dimorphosVel);
    this.didymosPos = vClone(s.didymosPos);
    this.guidanceAssistEnabled = s.guidanceAssistEnabled;
    this.impactProcessed = s.impactProcessed;
    this.result = s.result ? { ...s.result } : null;
    this.postImpactOrbit = this.result ? this.result.postImpactOrbit : null;
  }
}
