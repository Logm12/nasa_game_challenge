import * as THREE from 'three/src/Three';
import { CelestialBody, AU } from './CelestialBody';
import { RotationButtons } from './RotationControl';
import GameState from './GameState';
import { getControlTexts, onLangChange, formatTpl } from './i18n';

export type SasMode = 'STABILITY' | 'PROGRADE' | 'RETROGRADE' | 'MANUAL';

export class FlightDeckControl {
  public domElement: HTMLElement;
  private isCollapsed = false;

  // DOM Elements
  private throttleReadout: HTMLElement;
  private throttleFill: HTMLElement;
  private throttleThumb: HTMLElement;
  private throttleTrack: HTMLElement;

  private orbitSpeedVal: HTMLElement;
  private sasStatusPill: HTMLElement;

  private sasBtnStab: HTMLElement;
  private sasBtnPrograde: HTMLElement;
  private sasBtnRetrograde: HTMLElement;
  private sasBtnManual: HTMLElement;

  private dirBtns: Record<string, HTMLElement> = {};

  private isDraggingThrottle = false;

  constructor(
    private gameState: GameState,
    private buttons: RotationButtons,
    private allowThrottleCallback: (thr: number) => boolean
  ) {
    this.domElement = document.createElement('div');
    this.domElement.id = 'flight-deck-root';
    this.domElement.className = 'flight-deck-root';

    this.buildHTML();
    this.bindEvents();
    this.applyLanguage();
    onLangChange(() => this.applyLanguage());
  }

  private buildHTML() {
    this.domElement.innerHTML = `
      <!-- Collapsed Toggle Pill -->
      <div class="flight-deck-pill" id="flight-deck-pill" style="display: none;">
        <span class="pill-dot"></span>
        <span class="pill-icon">🚀</span>
        <span class="pill-title">FLIGHT DECK</span>
        <span class="pill-chevron">▴</span>
      </div>

      <!-- Main Flight Deck Console -->
      <div class="flight-deck-console" id="flight-deck-console">
        <!-- Minimize Tab -->
        <button class="deck-collapse-toggle" id="deck-collapse-btn" title="Toggle Flight Deck View">
          <span class="collapse-icon">▾</span>
        </button>

        <!-- Left Wing: Thrust & Engine Controller -->
        <div class="deck-wing deck-throttle-wing">
          <div class="deck-wing-header">
            <span class="wing-icon">🔥</span>
            <span class="wing-title">MAIN THRUST</span>
            <span class="throttle-val-badge" id="deck-throttle-readout">0%</span>
          </div>

          <div class="deck-throttle-body">
            <!-- Vertical Interactive Slider -->
            <div class="deck-throttle-track-wrap" id="deck-throttle-track-wrap">
              <div class="deck-throttle-track" id="deck-throttle-track">
                <div class="deck-throttle-fill" id="deck-throttle-fill"></div>
                <div class="deck-throttle-thumb" id="deck-throttle-thumb"></div>
              </div>
            </div>

            <!-- Instant Quick Actions -->
            <div class="deck-throttle-actions">
              <button class="deck-btn-preset full" id="deck-btn-full" title="Full Throttle (Z key)">
                <span>100%</span>
                <span class="btn-kbd">Z</span>
              </button>
              <button class="deck-btn-preset half" id="deck-btn-half" title="50% Throttle">
                <span>50%</span>
              </button>
              <button class="deck-btn-preset cut" id="deck-btn-cut" title="Cut Engine (X key)">
                <span>CUT</span>
                <span class="btn-kbd">X</span>
              </button>
              <div class="deck-throttle-nudges">
                <button class="deck-btn-nudge" id="deck-btn-step-up" title="Throttle Up (+10% / Shift)">+10%</button>
                <button class="deck-btn-nudge" id="deck-btn-step-down" title="Throttle Down (-10% / Ctrl)">-10%</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Center: 3D Navball Housing & Orbit Telemetry -->
        <div class="deck-center-housing">
          <!-- Orbital Speed HUD Badge -->
          <div class="deck-telemetry-badge" id="deck-orbit-speed-badge">
            <span class="telemetry-label">ORBIT SPEED</span>
            <span class="telemetry-val" id="deck-orbit-speed-val">0.0000 km/s</span>
          </div>

          <!-- Navball Ring Frame -->
          <div class="deck-navball-ring" id="deck-navball-ring">
            <!-- Directional Flight D-Pad (RCS & Gimbals) -->
            <button class="flight-dir-btn pitch-up" id="btn-pitch-up" title="Pitch Up (W key)">
              <span class="arrow-glyph">▲</span>
              <span class="k-hint">W</span>
            </button>
            <button class="flight-dir-btn pitch-down" id="btn-pitch-down" title="Pitch Down (S key)">
              <span class="arrow-glyph">▼</span>
              <span class="k-hint">S</span>
            </button>
            <button class="flight-dir-btn yaw-left" id="btn-yaw-left" title="Yaw Left (A key)">
              <span class="arrow-glyph">◀</span>
              <span class="k-hint">A</span>
            </button>
            <button class="flight-dir-btn yaw-right" id="btn-yaw-right" title="Yaw Right (D key)">
              <span class="arrow-glyph">▶</span>
              <span class="k-hint">D</span>
            </button>
            <button class="flight-dir-btn roll-ccw" id="btn-roll-ccw" title="Roll CCW (Q key)">
              <span class="arrow-glyph">↺</span>
              <span class="k-hint">Q</span>
            </button>
            <button class="flight-dir-btn roll-cw" id="btn-roll-cw" title="Roll CW (E key)">
              <span class="arrow-glyph">↻</span>
              <span class="k-hint">E</span>
            </button>
          </div>
        </div>

        <!-- Right Wing: SAS Autopilot & Flight Assist -->
        <div class="deck-wing deck-sas-wing">
          <div class="deck-wing-header">
            <span class="wing-icon">🧭</span>
            <span class="wing-title">AUTOPILOT / SAS</span>
            <span class="sas-active-pill" id="deck-sas-status-pill">STAB LOCK</span>
          </div>

          <div class="deck-sas-body">
            <button class="deck-sas-btn active" id="btn-sas-stab" data-mode="STABILITY" title="Stability Lock / Gyro Dampening - Stops tumbling immediately">
              <span class="sas-btn-icon">🛡️</span>
              <div class="sas-btn-text">
                <span class="sas-btn-main">STAB LOCK</span>
                <span class="sas-btn-sub">Kill Rotation</span>
              </div>
            </button>
            <button class="deck-sas-btn" id="btn-sas-prograde" data-mode="PROGRADE" title="Align Nose Forward Along Orbital Velocity (V+ Boost)">
              <span class="sas-btn-icon">▲</span>
              <div class="sas-btn-text">
                <span class="sas-btn-main">PROGRADE</span>
                <span class="sas-btn-sub">Boost V+</span>
              </div>
            </button>
            <button class="deck-sas-btn" id="btn-sas-retrograde" data-mode="RETROGRADE" title="Align Nose Backward Opposite Orbital Velocity (V- Brake)">
              <span class="sas-btn-icon">▼</span>
              <div class="sas-btn-text">
                <span class="sas-btn-main">RETROGRADE</span>
                <span class="sas-btn-sub">Brake V-</span>
              </div>
            </button>
            <button class="deck-sas-btn" id="btn-sas-manual" data-mode="MANUAL" title="Manual Unassisted RCS">
              <span class="sas-btn-icon">🎮</span>
              <div class="sas-btn-text">
                <span class="sas-btn-main">MANUAL</span>
                <span class="sas-btn-sub">Direct RCS</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.domElement);

    // Cache elements
    this.throttleReadout = document.getElementById('deck-throttle-readout')!;
    this.throttleFill = document.getElementById('deck-throttle-fill')!;
    this.throttleThumb = document.getElementById('deck-throttle-thumb')!;
    this.throttleTrack = document.getElementById('deck-throttle-track')!;

    this.orbitSpeedVal = document.getElementById('deck-orbit-speed-val')!;
    this.sasStatusPill = document.getElementById('deck-sas-status-pill')!;

    this.sasBtnStab = document.getElementById('btn-sas-stab')!;
    this.sasBtnPrograde = document.getElementById('btn-sas-prograde')!;
    this.sasBtnRetrograde = document.getElementById('btn-sas-retrograde')!;
    this.sasBtnManual = document.getElementById('btn-sas-manual')!;

    this.dirBtns = {
      up: document.getElementById('btn-pitch-up')!,
      down: document.getElementById('btn-pitch-down')!,
      left: document.getElementById('btn-yaw-left')!,
      right: document.getElementById('btn-yaw-right')!,
      counterclockwise: document.getElementById('btn-roll-ccw')!,
      clockwise: document.getElementById('btn-roll-cw')!
    };
  }

  private bindEvents() {
    // 1. Collapse / Expand toggles
    const collapseBtn = document.getElementById('deck-collapse-btn');
    const pill = document.getElementById('flight-deck-pill');
    const consoleEl = document.getElementById('flight-deck-console');

    collapseBtn?.addEventListener('click', () => {
      this.isCollapsed = true;
      if (consoleEl) consoleEl.style.display = 'none';
      if (pill) pill.style.display = 'flex';
    });

    pill?.addEventListener('click', () => {
      this.isCollapsed = false;
      if (consoleEl) consoleEl.style.display = 'flex';
      if (pill) pill.style.display = 'none';
    });

    // 2. Throttle Quick Presets
    document.getElementById('deck-btn-full')?.addEventListener('click', () => this.setThrottle(1.0));
    document.getElementById('deck-btn-half')?.addEventListener('click', () => this.setThrottle(0.5));
    document.getElementById('deck-btn-cut')?.addEventListener('click', () => this.setThrottle(0.0));
    document.getElementById('deck-btn-step-up')?.addEventListener('click', () => this.stepThrottle(0.1));
    document.getElementById('deck-btn-step-down')?.addEventListener('click', () => this.stepThrottle(-0.1));

    // 3. Throttle Slider Drag / Click
    const handleThrottleMove = (clientY: number) => {
      const rect = this.throttleTrack.getBoundingClientRect();
      const relativeY = clientY - rect.top;
      const normalized = 1.0 - Math.max(0, Math.min(1, relativeY / rect.height));
      this.setThrottle(normalized);
    };

    this.throttleTrack.addEventListener('mousedown', (e) => {
      this.isDraggingThrottle = true;
      handleThrottleMove(e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDraggingThrottle) {
        handleThrottleMove(e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDraggingThrottle = false;
    });

    // Touch support for slider
    this.throttleTrack.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.isDraggingThrottle = true;
        handleThrottleMove(e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDraggingThrottle && e.touches.length > 0) {
        handleThrottleMove(e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDraggingThrottle = false;
    });

    // 4. Directional Buttons (Pitch/Yaw/Roll)
    const setupDirBtn = (btn: HTMLElement, key: keyof RotationButtons) => {
      if (!btn) return;
      const press = (e: Event) => {
        e.preventDefault();
        (this.buttons as any)[key] = true;
        btn.classList.add('active');
        // Drop out of Prograde/Retrograde to Stability upon manual input
        const sel = this.gameState.getSelectObj();
        if (sel && (sel.sasMode === 'PROGRADE' || sel.sasMode === 'RETROGRADE')) {
          sel.sasMode = 'STABILITY';
          this.syncSasUI('STABILITY');
        }
      };
      const release = (e: Event) => {
        e.preventDefault();
        (this.buttons as any)[key] = false;
        btn.classList.remove('active');
      };

      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);

      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('touchcancel', release, { passive: false });
    };

    setupDirBtn(this.dirBtns.up, 'up');
    setupDirBtn(this.dirBtns.down, 'down');
    setupDirBtn(this.dirBtns.left, 'left');
    setupDirBtn(this.dirBtns.right, 'right');
    setupDirBtn(this.dirBtns.counterclockwise, 'counterclockwise');
    setupDirBtn(this.dirBtns.clockwise, 'clockwise');

    // 5. SAS Autopilot Mode Selectors
    const sasBtns = [this.sasBtnStab, this.sasBtnPrograde, this.sasBtnRetrograde, this.sasBtnManual];
    sasBtns.forEach((btn) => {
      btn?.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode') as SasMode;
        const sel = this.gameState.getSelectObj();
        if (sel) {
          sel.sasMode = mode;
          this.syncSasUI(mode);
          const ct = getControlTexts();
          this.gameState.sendMessage(formatTpl(ct.sasEngagedMsg, { mode }));
        }
      });
    });

    // 6. Keyboard Synchronized Highlights
    window.addEventListener('keydown', (e) => {
      const char = e.key.toLowerCase();
      if (char === 'w') this.dirBtns.up?.classList.add('active');
      if (char === 's') this.dirBtns.down?.classList.add('active');
      if (char === 'a') this.dirBtns.left?.classList.add('active');
      if (char === 'd') this.dirBtns.right?.classList.add('active');
      if (char === 'q') this.dirBtns.counterclockwise?.classList.add('active');
      if (char === 'e') this.dirBtns.clockwise?.classList.add('active');

      if (['w', 's', 'a', 'd', 'q', 'e'].includes(char)) {
        const sel = this.gameState.getSelectObj();
        if (sel && (sel.sasMode === 'PROGRADE' || sel.sasMode === 'RETROGRADE')) {
          sel.sasMode = 'STABILITY';
          this.syncSasUI('STABILITY');
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const char = e.key.toLowerCase();
      if (char === 'w') this.dirBtns.up?.classList.remove('active');
      if (char === 's') this.dirBtns.down?.classList.remove('active');
      if (char === 'a') this.dirBtns.left?.classList.remove('active');
      if (char === 'd') this.dirBtns.right?.classList.remove('active');
      if (char === 'q') this.dirBtns.counterclockwise?.classList.remove('active');
      if (char === 'e') this.dirBtns.clockwise?.classList.remove('active');
    });
  }

  public setThrottle(pos: number) {
    const val = Math.max(0, Math.min(1, pos));
    if (!this.allowThrottleCallback(val)) return;

    const sel = this.gameState.getSelectObj();
    if (sel && sel.controllable) {
      sel.throttle = val;
      if (sel.blastModel) {
        sel.blastModel.visible = val > 0;
      }
    }
    this.updateThrottleUI(val);
  }

  public stepThrottle(delta: number) {
    const sel = this.gameState.getSelectObj();
    if (sel && sel.controllable) {
      this.setThrottle(sel.throttle + delta);
    }
  }

  public increment(delta: number) {
    this.stepThrottle(delta);
  }

  public decrement(delta: number) {
    this.stepThrottle(-delta);
  }

  public set visible(val: boolean) {
    this.domElement.style.display = val ? 'block' : 'none';
  }

  public get visible(): boolean {
    return this.domElement.style.display !== 'none';
  }

  private updateThrottleUI(val: number) {
    const percent = Math.round(val * 100);
    if (this.throttleReadout) {
      this.throttleReadout.textContent = `${percent}%`;
    }
    if (this.throttleFill) {
      this.throttleFill.style.height = `${percent}%`;
    }
    if (this.throttleThumb) {
      this.throttleThumb.style.bottom = `calc(${percent}% - 6px)`;
    }
  }

  public syncSasUI(mode: SasMode) {
    [this.sasBtnStab, this.sasBtnPrograde, this.sasBtnRetrograde, this.sasBtnManual].forEach((b) => {
      if (!b) return;
      if (b.getAttribute('data-mode') === mode) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    if (this.sasStatusPill) {
      const ct = getControlTexts();
      if (mode === 'STABILITY') this.sasStatusPill.textContent = ct.sasStabPill || ct.sasStabMain;
      else if (mode === 'PROGRADE') this.sasStatusPill.textContent = ct.sasProgradePill || ct.sasProgradeMain;
      else if (mode === 'RETROGRADE') this.sasStatusPill.textContent = ct.sasRetrogradePill || ct.sasRetrogradeMain;
      else this.sasStatusPill.textContent = ct.sasManualPill || ct.sasManualMain;
    }
  }


  public applyLanguage() {
    const ct = getControlTexts();
    const setTxt = (id: string, text: string) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    const setTitle = (id: string, title: string) => {
      const el = document.getElementById(id);
      if (el) el.title = title;
    };

    // Pill & Collapse
    const pillTitle = document.querySelector('#flight-deck-pill .pill-title');
    if (pillTitle) pillTitle.textContent = ct.flightDeckTitle;
    setTitle('deck-collapse-btn', ct.flightDeckToggleTitle);

    // Thrust
    const thrustTitle = document.querySelector('.deck-throttle-wing .wing-title');
    if (thrustTitle) thrustTitle.textContent = ct.mainThrustTitle;
    setTitle('deck-btn-full', ct.throttleFullTitle);
    setTitle('deck-btn-half', ct.throttleHalfTitle);
    setTitle('deck-btn-cut', ct.throttleCutTitle);
    const cutLbl = document.querySelector('#deck-btn-cut > span:first-child');
    if (cutLbl) cutLbl.textContent = ct.throttleCutLabel;
    setTitle('deck-btn-step-up', ct.throttleStepUpTitle);
    setTitle('deck-btn-step-down', ct.throttleStepDownTitle);

    // Orbit Speed
    const orbitLbl = document.querySelector('#deck-orbit-speed-badge .telemetry-label');
    if (orbitLbl) orbitLbl.textContent = ct.orbitSpeedLabel;

    // D-Pad
    setTitle('btn-pitch-up', ct.pitchUpTitle);
    setTitle('btn-pitch-down', ct.pitchDownTitle);
    setTitle('btn-yaw-left', ct.yawLeftTitle);
    setTitle('btn-yaw-right', ct.yawRightTitle);
    setTitle('btn-roll-ccw', ct.rollCcwTitle);
    setTitle('btn-roll-cw', ct.rollCwTitle);

    // Autopilot / SAS
    const sasTitle = document.querySelector('.deck-sas-wing .wing-title');
    if (sasTitle) sasTitle.textContent = ct.autopilotTitle;

    const setSasBtn = (id: string, main: string, sub: string, title: string) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.title = title;
      const m = btn.querySelector('.sas-btn-main');
      if (m) m.textContent = main;
      const s = btn.querySelector('.sas-btn-sub');
      if (s) s.textContent = sub;
    };
    setSasBtn('btn-sas-stab', ct.sasStabMain, ct.sasStabSub, ct.sasStabTitle);
    setSasBtn('btn-sas-prograde', ct.sasProgradeMain, ct.sasProgradeSub, ct.sasProgradeTitle);
    setSasBtn('btn-sas-retrograde', ct.sasRetrogradeMain, ct.sasRetrogradeSub, ct.sasRetrogradeTitle);
    setSasBtn('btn-sas-manual', ct.sasManualMain, ct.sasManualSub, ct.sasManualTitle);

    const sel = this.gameState.getSelectObj();
    this.syncSasUI((sel && sel.sasMode) ? (sel.sasMode as SasMode) : 'STABILITY');
  }

  public update() {
    const sel = this.gameState.getSelectObj();
    const consoleEl = document.getElementById('flight-deck-console');
    const pill = document.getElementById('flight-deck-pill');

    if (!sel || !sel.controllable) {
      // Planet or non-ship selected: minimize into pill
      if (consoleEl) consoleEl.style.display = 'none';
      if (pill) pill.style.display = 'none';
      return;
    }

    // Ship selected
    if (this.isCollapsed) {
      if (consoleEl) consoleEl.style.display = 'none';
      if (pill) pill.style.display = 'flex';
    } else {
      if (consoleEl) consoleEl.style.display = 'flex';
      if (pill) pill.style.display = 'none';
    }

    // 1. Update Speed Readout
    const speed = sel.velocity.length() * AU;
    if (this.orbitSpeedVal) {
      if (speed < 1) {
        this.orbitSpeedVal.textContent = `${(speed * 1000).toFixed(1)} m/s`;
      } else {
        this.orbitSpeedVal.textContent = `${speed.toFixed(4)} km/s`;
      }
    }

    // 2. Synchronize Throttle UI
    this.updateThrottleUI(sel.throttle || 0);

    // 3. Synchronize SAS mode if changed externally
    if (sel.sasMode) {
      this.syncSasUI(sel.sasMode as SasMode);
    }
  }
}
