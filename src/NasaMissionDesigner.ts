/**
 * NasaMissionDesigner.ts
 * NASA DEEP SPACE FLIGHT ARCHITECTURE & KEPLERIAN DYNAMICS
 * AAA Lobby Experience + NASA Artemis Mission Architecture integrated with WebGL-Orbiter 3D
 * Fully localized in 100% American English (USA).
 */

import * as THREE from 'three/src/Three';
import { OBJLoader } from './OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AU, CelestialBody } from './CelestialBody';
import { SUPPORTED_FLAGS, generateFlagCanvasTexture, generateNasaDecalTexture } from './FlagDecals';
import {
  SupportedLang,
  I18nTexts,
  HANGAR_I18N,
  getCurrentLang,
  setCurrentLang,
  getTexts,
  formatTpl,
  formatNum
} from './i18n';
import {
  computeEffectiveDpr,
  onQualityChange,
  getStoredQuality,
  setStoredQuality,
  GraphicsQuality,
  getQualityConfig
} from './QualityManager';
import {
  DartSimulation,
  DartImpactResult,
  DartVector3,
  vDistance,
  vLength,
  vSub,
  DART_HISTORICAL_DATA
} from './DartSimulation';
import {
  getMissionText,
  getSpacecraftText,
  getPowerText,
  getTechText,
  getEngineText,
  getCarrierText,
  getFlagText
} from './i18n-catalog';
export { I18nTexts, HANGAR_I18N };

import shuttleUrl from './models/spacecraft/space_shuttle.glb';
import voyagerUrl from './models/spacecraft/voyager.glb';
import apolloLmUrl from './models/spacecraft/apollo_lunar_module.glb';
import constellationXUrl from './models/spacecraft/constellation_x.glb';
import ares1Url from './models/spacecraft/ares_1.glb';
import kenneyBattleshipUrl from './models/spacecraft/kenney_battleship.glb';
import kenneyInterceptorUrl from './models/spacecraft/kenney_interceptor.glb';

export interface SpacecraftDefinition {
  id: string;
  name: string;
  category: 'nasa' | 'battleship' | 'custom' | 'marvel';
  mass: number;
  cost: number;
  cap: number;
  rarity: 'epic' | 'legendary' | 'mythic';
  badge: string;
  desc: string;
  modelUrl?: string;
}

export const SPACECRAFT_FLEET: SpacecraftDefinition[] = [
  // 1. Những con tàu ban đầu của người dùng (Initial Core Fleet)
  {
    id: 'quinjet',
    name: 'Quinjet Mk-VII (Stealth Concept)',
    category: 'marvel',
    mass: 520,
    cost: 85,
    cap: 4,
    rarity: 'legendary',
    badge: '🛡️ STEALTH',
    desc: 'Fictional stealth VTOL hull with folding delta wings. Balanced mass and 4 instrument bays.'
  },
  {
    id: 'milano',
    name: 'The Milano (Light Scout)',
    category: 'marvel',
    mass: 120,
    cost: 25,
    cap: 2,
    rarity: 'epic',
    badge: '🪐 SCOUT',
    desc: 'Lightweight fictional scout hull with low dry mass (120 kg) and 2 instrument bays.'
  },
  {
    id: 'benatar',
    name: 'The Benatar (Heavy Cruiser)',
    category: 'marvel',
    mass: 1950,
    cost: 260,
    cap: 5,
    rarity: 'legendary',
    badge: '🚀 CRUISER',
    desc: 'Medium-heavy fictional deep-space cruiser with 5 instrument bays.'
  },
  {
    id: 'sanctuary',
    name: 'Sanctuary Flagship (Dreadnought)',
    category: 'marvel',
    mass: 6500,
    cost: 600,
    cap: 6,
    rarity: 'mythic',
    badge: '👑 HEAVY',
    desc: 'Massive fictional armored hull supporting up to 6 scientific instruments.'
  },

  // 2. Tàu tự thiết kế độc quyền (Custom High-End Flagships)
  {
    id: 'hyperion',
    name: 'Hyperion Exploration Flagship',
    category: 'custom',
    mass: 5800,
    cost: 520,
    cap: 6,
    rarity: 'mythic',
    badge: '🌌 FLAGSHIP',
    desc: 'Heavy deep-space hull with 6 instrument bays and sensor spine.'
  },
  {
    id: 'ghostwing',
    name: 'Ghostwing Recon Interceptor',
    category: 'custom',
    mass: 310,
    cost: 65,
    cap: 3,
    rarity: 'legendary',
    badge: '⚡ RECON',
    desc: 'Light forward-swept reconnaissance hull with 3 instrument bays.'
  },

  // 3. Tàu vũ trụ NASA chính thức (Official NASA Exploration Spacecraft)
  {
    id: 'shuttle',
    name: 'NASA Space Shuttle Orbiter (Discovery OV-103)',
    category: 'nasa',
    mass: 2200,
    cost: 150,
    cap: 5,
    rarity: 'mythic',
    badge: '🚀 NASA ORBITER',
    desc: 'Official NASA winged orbiter model with delta wings and thermal tiles (5 bays).',
    modelUrl: shuttleUrl
  },
  {
    id: 'dart_impactor',
    name: 'NASA DART Kinetic Impactor',
    category: 'nasa',
    mass: 570,
    cost: 110,
    cap: 4,
    rarity: 'epic',
    badge: '🎯 DART PROBE',
    desc: 'Authentic DART planetary defense spacecraft (~570 kg) equipped with DRACO imaging navigation and ROSA solar arrays.'
  },
  {
    id: 'apollo_lm',
    name: 'NASA Apollo 11 Lunar Module (Eagle)',
    category: 'nasa',
    mass: 850,
    cost: 75,
    cap: 4,
    rarity: 'legendary',
    badge: '🌙 APOLLO 11',
    desc: 'Historic lunar lander with shock-absorbing legs and gold thermal foil (4 bays).',
    modelUrl: apolloLmUrl
  },
  {
    id: 'voyager',
    name: 'NASA Voyager 1 Interstellar Probe',
    category: 'nasa',
    mass: 350,
    cost: 45,
    cap: 3,
    rarity: 'legendary',
    badge: '📡 NASA PROBE',
    desc: 'Deep-space probe with high-gain parabolic dish and Golden Record (3 bays).',
    modelUrl: voyagerUrl
  }
];

export interface NasaMission {
  id: string;
  title: string;
  destination: string;
  scenarioName: string;
  distanceAU: number;
  budgetCredits: number;
  reqDeltaV: number;
  minSciencePoints: number;
  description: string;
  badge: string;
}

export const NASA_MISSIONS: NasaMission[] = [
  {
    id: 'nasa_dart',
    title: 'NASA DART: Kinetic Impactor',
    destination: 'Dimorphos / Didymos (Planetary Defense)',
    scenarioName: 'NASA DART: Dimorphos Kinetic Impact',
    distanceAU: 1.64,
    budgetCredits: 1450,
    reqDeltaV: 5200,
    minSciencePoints: 320,
    description: 'NASA Double Asteroid Redirection Test (DART): High-speed kinetic impactor targeting moonlet Dimorphos to alter its orbital trajectory around asteroid Didymos.',
    badge: '🎯 NASA DART'
  },
  {
    id: 'nasa_osiris_rex',
    title: 'NASA OSIRIS-REx: Bennu Sample Return',
    destination: '101955 Bennu (Carbonaceous PHA)',
    scenarioName: 'NASA OSIRIS-REx: 101955 Bennu Rendezvous',
    distanceAU: 1.13,
    budgetCredits: 1200,
    reqDeltaV: 4200,
    minSciencePoints: 290,
    description: 'Rendezvous with hazardous carbonaceous asteroid 101955 Bennu, conduct high-resolution optical surveys, and retrieve TAGSAM dust specimens.',
    badge: '☄️ OSIRIS-REx'
  },
  {
    id: 'nasa_apophis',
    title: 'NASA 99942 Apophis: Planetary Defense',
    destination: '99942 Apophis (Earth-Crosser Hazard)',
    scenarioName: 'NASA Planetary Defense: 99942 Apophis',
    distanceAU: 0.92,
    budgetCredits: 1750,
    reqDeltaV: 4800,
    minSciencePoints: 360,
    description: 'Intercept Earth-crossing asteroid 99942 Apophis using NASA Mission-Viz WSMV orbital mechanics ahead of its 2029 close-approach flyby.',
    badge: '⚠️ PHA DEFENSE'
  },
  {
    id: 'nasa_artemis_tli',
    title: 'NASA Artemis: Trans-Lunar Injection',
    destination: 'The Moon / Ballistic TLI Ellipse',
    scenarioName: 'NASA Artemis: Earth-Moon TLI',
    distanceAU: 1.002,
    budgetCredits: 890,
    reqDeltaV: 3150,
    minSciencePoints: 220,
    description: 'Perform Trans-Lunar Injection (TLI) burn: Propel the spacecraft along a precision Hohmann ballistic ellipse from Low Earth Orbit to lunar orbit.',
    badge: '🚀 ARTEMIS TLI'
  },
  {
    id: 'voyager_heliopause',
    title: 'NASA Voyager 1: Interstellar Boundary',
    destination: 'Heliopause / Interstellar Medium',
    scenarioName: 'Moon orbit',
    distanceAU: 158.0,
    budgetCredits: 480,
    reqDeltaV: 3900,
    minSciencePoints: 240,
    description: 'Cross the solar heliopause boundary into true interstellar space, measuring pristine galactic cosmic rays and local interstellar magnetic field flux.',
    badge: '🛰️ VOYAGER 1'
  },
  {
    id: 'new_horizons_kuiper',
    title: 'NASA New Horizons: Kuiper Belt Survey',
    destination: 'Pluto & Arrokoth (Kuiper Belt)',
    scenarioName: 'Mars orbit',
    distanceAU: 39.5,
    budgetCredits: 980,
    reqDeltaV: 4500,
    minSciencePoints: 310,
    description: 'Conduct high-resolution optical spectrometry, ice geology mapping, and atmospheric escape analysis of dwarf planet Pluto and primordial Kuiper Belt planetesimals.',
    badge: '🪐 NEW HORIZONS'
  },
  {
    id: 'juno_jupiter_polar',
    title: 'NASA Juno: Jupiter Polar Magnetosphere',
    destination: 'Jupiter Polar Orbit & Great Red Spot',
    scenarioName: 'Jupiter orbit',
    distanceAU: 5.20,
    budgetCredits: 1950,
    reqDeltaV: 6800,
    minSciencePoints: 380,
    description: 'Navigate extreme Jovian radiation belts in a high-eccentricity polar orbit to map gravitational harmonics, water abundance, and auroral magnetospheric flux.',
    badge: '⚡ JUNO JUPITER'
  },
  {
    id: 'jwst_deep_cosmos',
    title: 'NASA JWST: Deep Cosmos Observatory',
    destination: 'Sun-Earth L2 Lagrange Halo Orbit',
    scenarioName: 'Earth orbit',
    distanceAU: 1.01,
    budgetCredits: 2500,
    reqDeltaV: 3400,
    minSciencePoints: 420,
    description: 'Deploy the James Webb Space Telescope in a halo orbit around Earth-Sun L2, unfurling infrared optics to resolve the first galaxies formed after the Big Bang.',
    badge: '🔭 NASA JWST'
  }
];

export interface TourStep {
  targetId: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  hintVi: string;
  hintEn: string;
  preferredPos: 'right' | 'left' | 'top' | 'bottom';
}

export const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'blade-missions',
    titleVi: '01 // CHỌN NHIỆM VỤ BAY NASA',
    titleEn: '01 // SELECT FLIGHT MANIFEST',
    descVi: 'Bắt đầu bằng việc chọn một nhiệm vụ khám phá vũ trụ: Artemis lên Mặt Trăng, DART thử nghiệm va chạm thiên thạch, hoặc Voyager 1 bay vào không gian liên sao. Mỗi nhiệm vụ sẽ quy định ngân sách, vận tốc Δv yêu cầu và mục tiêu khoa học.',
    descEn: 'Begin by selecting a flight manifest: Artemis to the Moon, DART kinetic impactor, or Voyager 1 interstellar crossing. Each mission sets budget, required orbital Δv, and scientific goals.',
    hintVi: '💡 Nhấp chọn một nhiệm vụ trong danh sách để xem chi tiết.',
    hintEn: '💡 Click any mission card to load its flight parameters.',
    preferredPos: 'right'
  },
  {
    targetId: 'dock-bottom',
    titleVi: '02 // THIẾT KẾ & TRANG BỊ TÀU (HANGAR ARMORY)',
    titleEn: '02 // SPACECRAFT HANGAR & OUTFITTING',
    descVi: 'Khay trang bị dưới chân cho phép bạn chọn vỏ tàu 4K (Space Shuttle, Apollo Lunar Module, Voyager, Flagship hoặc tự nạp file 3D .glb/.obj của bạn), sơn cờ Tổ quốc Việt Nam 🇻🇳, trang bị tấm pin quang năng hoặc lò hạt nhân RTG, động cơ đẩy và tên lửa mang phóng.',
    descEn: 'Configure your spacecraft: Select official 4K hulls (Shuttle, Apollo LM, Voyager, Flagship or import your own 3D file), apply national decals, install solar arrays or RTGs, propulsion engines, and launch boosters.',
    hintVi: '💡 Duyệt qua các tab: Hạm đội tàu, Cờ Tổ quốc, Lõi năng lượng, Động cơ, Tên lửa...',
    hintEn: '💡 Browse tabs: Fleet, Decals, Power, Engines, Boosters...',
    preferredPos: 'top'
  },
  {
    targetId: 'blade-diagnostics',
    titleVi: '03 // KIỂM SOÁT THÔNG SỐ AVIONICS',
    titleEn: '03 // AVIONICS & FLIGHT DYNAMICS',
    descVi: 'Trước khi phóng, hãy kiểm tra các chỉ số kỹ thuật: Đảm bảo Vận tốc tính toán Delta-V ≥ Delta-V yêu cầu (Phương trình Tsiolkovsky), Khối lượng khô ≤ Sức nâng tên lửa, và Thặng dư ngân sách ≥ $0 (không vượt quá chi phí).',
    descEn: 'Verify telemetry before flight: Ensure Calculated Delta-V ≥ Required Delta-V (Tsiolkovsky equation), Payload Mass ≤ Booster Capacity, and Budget Surplus ≥ $0.',
    hintVi: '💡 Các thanh thông số chuyển sang màu xanh lục biểu thị hệ thống đã sẵn sàng.',
    hintEn: '💡 All bars must turn green for flight authorization.',
    preferredPos: 'left'
  },
  {
    targetId: 'btn-approve-launch',
    titleVi: '04 // PHÊ DUYỆT & XUẤT KÍCH VÀO KHÔNG GIAN',
    titleEn: '04 // AUTHORIZE & INITIATE LAUNCH',
    descVi: 'Khi hệ thống thông báo "FLIGHT DIRECTOR: ALL SYSTEMS NOMINAL", hãy nhấp vào nút màu cam rực rỡ này để kích hoạt tên lửa đẩy, đưa phi thuyền rời bệ phóng vào không gian 3D thực tế!',
    descEn: 'When the flight controller announces all systems nominal, click this glowing orange button to ignite boosters and launch into the 3D Keplerian solar system!',
    hintVi: '💡 Nút sẽ kích hoạt hiệu ứng âm thanh và hiệu ứng bước nhảy không gian.',
    hintEn: '💡 Initiates launch profile and orbital flight HUD.',
    preferredPos: 'top'
  },
  {
    targetId: 'btn-toggle-dock-bottom',
    titleVi: '05 // THU GỌN GIAO DIỆN ĐỂ NGẮM TÀU 3D',
    titleEn: '05 // COLLAPSIBLE LOBBY PANELS',
    descVi: 'Nhấp vào thanh ▼ HIDE DOCK ở đây, hoặc các mũi tên ◀ / ▶ ở hai mép màn hình để thu gọn các bảng menu. Khi đó bạn sẽ có một góc nhìn Hangar hoàn toàn sạch sẽ, tự do xoay chuột 360° chiêm ngưỡng tàu vũ trụ 4K không góc chết!',
    descEn: 'Click the ▼ HIDE DOCK tab here, or the ◀ / ▶ arrow tabs on the edges to collapse panels. This gives you an unobstructed 4K view to admire your 3D spacecraft with zero clutter!',
    hintVi: '💡 Nhấp lại vào các thanh bất kỳ lúc nào để mở lại bảng menu.',
    hintEn: '💡 Click any handle again to slide the panels back out.',
    preferredPos: 'top'
  },
  {
    targetId: 'solar-system-dock',
    titleVi: '06 // THƯỚC NGẮM THIÊN VĂN & DỊCH CHUYỂN TỨC THÌ',
    titleEn: '06 // COSMIC ORRERY & INSTANT WARP',
    descVi: 'Thanh trên đỉnh hiển thị toàn bộ Thái Dương Hệ, các ngôi sao và vũ trụ sâu. Khi nhấp vào bất kỳ hành tinh nào, trong hồ sơ thiên thể hãy nhấp nút "🚀 ESTABLISH ORBIT HERE" để tàu vũ trụ ngay lập tức dịch chuyển vào quỹ đạo tròn Keplerian quanh thiên thể đó!',
    descEn: 'The top orrery tracks planets, stars, and deep space. Click any celestial body and press "🚀 ESTABLISH ORBIT HERE" in its dossier to warp instantly into a circular Keplerian orbit around it!',
    hintVi: '💡 Thử nghiệm bay quanh Trái Đất, Mặt Trăng, Sao Hỏa hay áp sát tiểu hành tinh Didymos!',
    hintEn: '💡 Practice orbital insertions around Earth, Mars, Jupiter, or Didymos!',
    preferredPos: 'bottom'
  }
];

export class NasaMissionDesigner {
  private currentLanguage: SupportedLang = 'en_us';
  private selectedMission: NasaMission = NASA_MISSIONS[0];
  private isTrajectoryLocked = false;
  private missionTickerId: ReturnType<typeof setInterval> | null = null;
  private lastPhaDistAU: number | null = null;
  private currentTourStep = 0;
  private isTourActive = false;
  private tourResizeListener: (() => void) | null = null;
  private tourKeyListener: ((e: KeyboardEvent) => void) | null = null;
  
  // Active equipped inventory items
  private selectedChassisId = 'quinjet';
  private selectedFlagId = 'usa_nasa';
  private selectedPowerId = 'arc_reactor';
  private selectedEngineId = 'tesseract_drive';
  private selectedCarrierId = 'sls_artemis';
  private selectedTechIds: Set<string> = new Set(['dark_matter', 'cerebro']);

  private activeTab: 'chassis' | 'flags' | 'power' | 'tech' | 'engines' | 'carriers' = 'chassis';
  private activeManualTab: string = 'quickstart';

  // NASA DART Simulation State
  public dartSimulation: DartSimulation | null = null;
  private dartImpactHandled = false;
  private onDartImpactCallback?: (result: DartImpactResult) => void;
  private dartLastTelemetryTime = 0;

  public onDartImpact(fn: (result: DartImpactResult) => void) {
    this.onDartImpactCallback = fn;
  }

  // 3D GLB Spacecraft & Battleship Fleet Cache
  private loadedGlbCache: Map<string, THREE.Object3D> = new Map();
  private pendingGlbLoads: Map<string, Promise<THREE.Object3D>> = new Map();
  private currentLoadRequestId = 0;
  private maxCachedGlbs = 4;
  private isHangarVisible = true;
  private onReturnToHangarCallback?: () => void;
  private hangarSunLight: THREE.DirectionalLight | null = null;
  private hangarSpotLight: THREE.SpotLight | null = null;

  // 3D Hangar Viewport & Cinematic Sunset Controls
  private hangarScene: THREE.Scene | null = null;
  private hangarCamera: THREE.PerspectiveCamera | null = null;
  private hangarRenderer: THREE.WebGLRenderer | null = null;
  private shipGroup: THREE.Group | null = null;
  private holoRing: THREE.Mesh | null = null;
  private holoRingInner: THREE.Mesh | null = null;
  private dustParticles: THREE.Points | null = null;
  private thrusterPlumes: THREE.Mesh[] = [];

  // Procedural Textures Cache (4K Ultra HD)
  private hullTexture: THREE.CanvasTexture | null = null;
  private bumpTexture: THREE.CanvasTexture | null = null;
  private roughnessTexture: THREE.CanvasTexture | null = null;
  private floorTexture: THREE.CanvasTexture | null = null;
  private maxAnisotropy = 16;
  private navLights: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial }[] = [];
  private rotatingElements: { obj: THREE.Object3D; speedX?: number; speedY?: number; speedZ?: number }[] = [];
  private isCustomModelLoaded = false;
  private customModel: THREE.Object3D | null = null;
  private customModelName = '';

  // Interactive Orbit Camera
  private isHangarDragging = false;
  private prevMouseX = 0;
  private prevMouseY = 0;
  private cameraAzimuth = 0.55;
  private cameraElevation = 0.32;
  private cameraDistance = 4.3;
  private targetAzimuth = 0.55;
  private targetElevation = 0.32;
  private targetDistance = 4.3;

  // Sound Synth (Web Audio API)
  private audioCtx: AudioContext | null = null;

  // Simulation run state
  private isMissionActive = false;
  private currentScienceCollected = 0;
  private missionTimer = 0;
  private isInitialized = false;

  public onReturnToHangar(fn: () => void) {
    this.onReturnToHangarCallback = fn;
  }

  constructor(
    private onLaunchCallback: (mission: NasaMission, telemetry: any) => void,
    private onShipChangedCallback?: () => void
  ) {
    this.currentLanguage = setCurrentLang(getCurrentLang());

    this.createLobbyDOM();
    this.initAudio();
    this.init3DHangar();
    this.renderMissions();
    this.renderArmoryGrid();
    this.updateLiveTelemetry();
    this.setLanguage(this.currentLanguage);
    this.isInitialized = true;
  }

  private showToast(msg: string, isError = false) {
    const toast = document.getElementById('import-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    toast.style.borderColor = isError ? '#ef4444' : '#00f0ff';
    toast.style.color = isError ? '#ef4444' : '#00f0ff';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 5000);
  }

  private requestLoadGlbModel(craft: SpacecraftDefinition, requestId: number): Promise<THREE.Object3D | null> {
    if (!craft.modelUrl) return Promise.resolve(null);
    if (this.loadedGlbCache.has(craft.id)) {
      return Promise.resolve(this.loadedGlbCache.get(craft.id)!);
    }
    if (this.pendingGlbLoads.has(craft.id)) {
      return this.pendingGlbLoads.get(craft.id)!;
    }

    const p = new Promise<THREE.Object3D>((resolve) => {
      const loader = new GLTFLoader();
      loader.load(craft.modelUrl!, (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
        const targetScale = 3.2 / maxDim;
        model.position.set(-center.x * targetScale, -center.y * targetScale + 0.15, -center.z * targetScale);
        model.scale.set(targetScale, targetScale, targetScale);

        const maxAniso = this.maxAnisotropy || 4;
        model.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.geometry) {
              child.geometry.userData = child.geometry.userData || {};
              child.geometry.userData.isShared = true;
            }
            if (child.material) {
              if (child.material.map) {
                child.material.map.anisotropy = maxAniso;
              }
              child.material.userData = child.material.userData || {};
              child.material.userData.isShared = true;
            }
          }
        });

        // Limit cache size
        if (this.loadedGlbCache.size >= this.maxCachedGlbs) {
          const keys = Array.from(this.loadedGlbCache.keys());
          const evictKey = keys.find(k => k !== this.selectedChassisId) || keys[0];
          if (evictKey) {
            this.loadedGlbCache.delete(evictKey);
          }
        }

        this.loadedGlbCache.set(craft.id, model);
        this.pendingGlbLoads.delete(craft.id);
        resolve(model);

        if (requestId === this.currentLoadRequestId && this.selectedChassisId === craft.id && !this.isCustomModelLoaded) {
          this.rebuild3DShipModel();
          this.onShipChangedCallback?.();
        }
      }, undefined, (err) => {
        this.pendingGlbLoads.delete(craft.id);
        console.warn('Failed to load GLB model for ' + craft.id, err);
        const t = getTexts(this.currentLanguage);
        this.showToast(formatTpl(t.toastErrParseGltf, { err: (err as any)?.message || 'Download failed' }), true);
        resolve(null as any);
      });
    });

    this.pendingGlbLoads.set(craft.id, p);
    return p;
  }

  private initAudio() {
    try {
      const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioClass();
    } catch (e) {
      console.warn('AudioContext not supported:', e);
    }
  }

  private playClickSound() {
    if (!this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const t = this.audioCtx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(1760, t + 0.05);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    } catch (e) {}
  }

  private playEquipSound() {
    if (!this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const t = this.audioCtx.currentTime;

      // Heavy metallic latch sound
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    } catch (e) {}
  }

  private playLaunchSound() {
    if (!this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const t = this.audioCtx.currentTime;

      // Arc Reactor / Warp charging whine
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(1600, t + 1.2);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.9);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 1.4);
    } catch (e) {}
  }

  private createLobbyDOM() {
    const t = getTexts(this.currentLanguage);
    const initCraft = SPACECRAFT_FLEET.find(c => c.id === this.selectedChassisId);
    const initLoc = getSpacecraftText(this.selectedChassisId, this.currentLanguage);
    const initCraftName = (initLoc ? initLoc.name : initCraft?.name || 'Quinjet Mk-VII').toUpperCase();
    const initCraftDesc = initLoc ? initLoc.desc : initCraft?.desc || '';

    const modal = document.createElement('div');
    modal.id = 'nasa-mission-modal';
    modal.innerHTML = `
      <!-- Fullscreen Living 3D Hangar Canvas -->
      <canvas id="hangar-canvas" class="fullscreen-hangar-canvas"></canvas>

      <!-- AAA Floating Tactical Glass HUD (pointer-events: none) -->
      <div class="aaa-hud-overlay">
        <!-- Top Aerospace Header -->
        <header class="aaa-topbar">
          <div class="topbar-left">
            <div class="brand-monogram" style="background: linear-gradient(135deg, #0b3d91 0%, #1e3a8a 100%); border-color: rgba(56, 189, 248, 0.4); font-size: 0.85rem; font-weight: 800; letter-spacing: 0.5px;">NASA</div>
            <div class="brand-titles">
              <div class="brand-name">NASA <span>MISSION-VIZ</span> <span id="brand-tag" class="tag-sword" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-weight: 700;">${t.brandTag}</span></div>
              <div class="brand-sub">${t.brandSub}</div>
            </div>
          </div>

          <div class="topbar-center">
            <div class="ship-callsign-pill">
              <span class="pulse-indicator"></span>
              <span id="hangar-ship-name">${initCraftName}</span>
              <span class="sep">•</span>
              <span id="hangar-ship-class" class="ship-class-text">${initCraftDesc}</span>
            </div>
          </div>

          <div class="topbar-right">
            <div class="telemetry-pill">
              <span class="pill-label" id="pill-credits-label">${t.creditsLabel}</span>
              <strong id="mission-budget-display" class="pill-val">$480.0M</strong>
            </div>
            <div id="lang-selector-wrap" class="lang-selector-wrap" title="${t.langSelectorTitle}">
              <span class="lang-icon">🌐</span>
              <select id="select-game-language" class="select-game-language" aria-label="${t.langSelectorAria}">
                <option value="en_us">🇺🇸 English (US)</option>
                <option value="vi">🇻🇳 Tiếng Việt</option>
                <option value="en_uk">🇬🇧 English (UK)</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="ko">🇰🇷 한국어</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="es">🇪🇸 Español</option>
              </select>
            </div>
            <div id="quality-selector-wrap" class="lang-selector-wrap" title="${t.qualityTitle}">
              <span class="lang-icon">⚙️</span>
              <select id="select-game-quality" class="select-game-language" aria-label="${t.qualityTitle}">
                <option value="low">${t.qualityLow}</option>
                <option value="balanced" selected>${t.qualityBalanced}</option>
                <option value="high">${t.qualityHigh}</option>
              </select>
            </div>
            <button id="btn-start-spotlight-tour" class="btn-spotlight-tour" title="Interactive Step-by-Step Guided Tour / Hướng dẫn tương tác sáng đèn">
              ${t.spotlightTourBtn || '✨ TOUR HƯỚNG DẪN'}
            </button>
            <button id="btn-toggle-cinematic" class="btn-cinematic-mode" title="${t.cinematicTitle}">
              ${t.cinematicBtn}
            </button>
          </div>
        </header>

        <!-- Beginner's Flight Operations Manual Modal -->
        <div id="flight-manual-modal" class="cosmic-dossier-modal" style="display: none;">
          <div class="dossier-card flight-manual-card">
            <div class="dossier-header">
              <div class="dossier-title-wrap">
                <span class="dossier-avatar">📖</span>
                <div>
                  <div class="manual-modal-title">NASA FLIGHT OPERATIONS MANUAL & GUIDE</div>
                  <div class="manual-modal-sub">Beginner's Handbook • Orbital Dynamics • Hangar Architecture</div>
                </div>
              </div>
              <button class="dossier-close-btn" id="manual-btn-close">✕</button>
            </div>

            <!-- Manual Category Tabs -->
            <div class="manual-tabs-nav">
              <button class="manual-nav-btn active" data-manual-tab="quickstart">🚀 QUICKSTART</button>
              <button class="manual-nav-btn" data-manual-tab="missions">🛰️ MISSIONS & BUDGET</button>
              <button class="manual-nav-btn" data-manual-tab="armory">🛠️ SHIPBUILDING</button>
              <button class="manual-nav-btn" data-manual-tab="controls">🕹️ FLIGHT CONTROLS & SAS</button>
              <button class="manual-nav-btn" data-manual-tab="orrery">🌌 ORRERY & WARP</button>
              <button class="manual-nav-btn" data-manual-tab="lobby">👁️ HANGAR VIEW</button>
            </div>

            <!-- Content Area -->
            <div class="manual-tabs-body" id="manual-tabs-body"></div>
          </div>
        </div>

        <!-- Interactive Spotlight Guided Tour Overlay -->
        <div id="spotlight-tour-overlay" class="spotlight-tour-overlay" style="display: none;">
          <!-- Glowing Spotlight Cutout with radar beacon and aerospace corners -->
          <div id="spotlight-box" class="spotlight-box">
            <div class="spotlight-beacon-ring"></div>
            <div class="spotlight-corner tl"></div>
            <div class="spotlight-corner tr"></div>
            <div class="spotlight-corner bl"></div>
            <div class="spotlight-corner br"></div>
          </div>

          <!-- Floating Aerospace HUD Tooltip Card -->
          <div id="spotlight-tooltip" class="spotlight-tooltip">
            <div class="spotlight-tooltip-header">
              <div class="spotlight-step-badge" id="tour-step-badge">BƯỚC 1 / 6</div>
              <div class="spotlight-dots" id="tour-dots"></div>
              <button class="spotlight-close-btn" id="btn-tour-close" title="Đóng hướng dẫn (ESC)">✕</button>
            </div>

            <div class="spotlight-tooltip-body">
              <h3 class="spotlight-tooltip-title" id="tour-step-title">01 // CHỌN NHIỆM VỤ BAY</h3>
              <p class="spotlight-tooltip-desc" id="tour-step-desc">Nhấp chọn một trong các sứ mệnh NASA...</p>
              <div class="spotlight-action-hint" id="tour-action-hint">
                <span class="hint-pulse"></span>
                <span id="tour-hint-text">💡 Mẹo: Bạn có thể nhấp chuột trực tiếp vào vị trí đang sáng đèn để thao tác!</span>
              </div>
            </div>

            <div class="spotlight-tooltip-footer">
              <button class="spotlight-btn-secondary" id="btn-tour-prev">◀ Quay lại</button>
              <div class="spotlight-footer-right">
                <button class="spotlight-btn-skip" id="btn-tour-skip">Bỏ qua</button>
                <button class="spotlight-btn-primary" id="btn-tour-next">Tiếp tục ▶</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Left Operations Blade: Sector Missions -->
        <aside class="hud-blade hud-blade-left" id="blade-missions">
          <!-- Floating Edge Toggle Rail -->
          <button id="btn-toggle-blade-left" class="blade-edge-tab blade-edge-left" title="Thu gọn / Mở rộng bảng Nhiệm vụ (Collapse/Expand)">
            <span class="tab-icon">◀</span>
            <span class="tab-label">MISSIONS</span>
          </button>

          <div class="blade-header">
            <div class="blade-title" id="blade-missions-title">${t.sectorOpsTitle}</div>
            <div class="blade-header-right">
              <div class="blade-badge" id="blade-missions-badge">${t.targetsBadge}</div>
              <button id="btn-collapse-blade-left" class="btn-blade-collapse-header" title="Thu gọn bảng (Collapse)">◀</button>
            </div>
          </div>
          <div class="blade-content" id="marvel-missions-list"></div>
        </aside>

        <!-- Right Avionics Blade: Realtime Telemetry & Diagnostics -->
        <aside class="hud-blade hud-blade-right" id="blade-diagnostics">
          <!-- Floating Edge Toggle Rail -->
          <button id="btn-toggle-blade-right" class="blade-edge-tab blade-edge-right" title="Thu gọn / Mở rộng bảng Avionics (Collapse/Expand)">
            <span class="tab-icon">▶</span>
            <span class="tab-label">AVIONICS</span>
          </button>

          <div class="blade-header">
            <div class="blade-title" id="blade-telemetry-title">${t.avionicsDiagTitle}</div>
            <div class="blade-header-right">
              <div class="blade-badge" id="blade-telemetry-badge">${t.avionicsBadge}</div>
              <button id="btn-collapse-blade-right" class="btn-blade-collapse-header" title="Thu gọn bảng (Collapse)">▶</button>
            </div>
          </div>
          <div class="blade-content">
            <!-- Remaining Budget -->
            <div class="gauge-box">
              <div class="gauge-label">
                <span id="lbl-metric-budget">${t.budgetSurplus}</span>
                <span id="metric-budget-percent" class="mono-tag">100%</span>
              </div>
              <div class="gauge-value" id="metric-budget">$0.0M</div>
              <div class="gauge-track"><div class="gauge-fill" id="bar-budget"></div></div>
            </div>

            <!-- Total Launch Mass vs Limit -->
            <div class="gauge-box">
              <div class="gauge-label">
                <span id="lbl-metric-mass">${t.totalMassLabel}</span>
                <span id="metric-mass-limit" class="mono-tag">LIMIT: 16,000 kg</span>
              </div>
              <div class="gauge-value" id="metric-mass">0 kg</div>
              <div class="gauge-track"><div class="gauge-fill" id="bar-mass"></div></div>
            </div>

            <!-- Power Core Balance -->
            <div class="gauge-box">
              <div class="gauge-label">
                <span id="lbl-metric-power">${t.powerBalance}</span>
                <span id="metric-power-distance" class="mono-tag">@ 1.0 AU</span>
              </div>
              <div class="gauge-value" id="metric-power">+0 W</div>
              <div class="gauge-track"><div class="gauge-fill" id="bar-power"></div></div>
            </div>

            <!-- Calculated Delta-V -->
            <div class="gauge-box">
              <div class="gauge-label">
                <span id="lbl-metric-deltav">${t.calcDeltaV}</span>
                <span id="metric-deltav-req" class="mono-tag">REQ: 3900 m/s</span>
              </div>
              <div class="gauge-value" id="metric-deltav">0 m/s</div>
              <div class="gauge-track"><div class="gauge-fill" id="bar-deltav"></div></div>
            </div>

            <!-- Projected Science Data -->
            <div class="gauge-box">
              <div class="gauge-label">
                <span id="lbl-metric-science">${t.scienceReturn}</span>
                <span id="metric-science-target" class="mono-tag">TARGET: 120 pts</span>
              </div>
              <div class="gauge-value" id="metric-science">0 pts</div>
              <div class="gauge-track"><div class="gauge-fill" id="bar-science"></div></div>
            </div>
          </div>
        </aside>

        <!-- Bottom Subsystem Armory Dock & Launch Control -->
        <footer class="hud-dock-bottom" id="dock-bottom">
          <!-- Dock Collapse/Expand Tab at Top Center -->
          <button id="btn-toggle-dock-bottom" class="dock-collapse-tab" title="Thu gọn / Mở rộng sảnh trang bị (Collapse/Expand Dock)">
            <span class="dock-tab-icon">▼</span>
            <span class="dock-tab-label">HIDE DOCK</span>
          </button>
          <div class="dock-tabs-row">
            <button class="inv-tab-btn active" id="tab-btn-chassis" data-tab="chassis">${t.tabChassis}</button>
            <button class="inv-tab-btn" id="tab-btn-flags" data-tab="flags">${t.tabFlags}</button>
            <button class="inv-tab-btn" id="tab-btn-power" data-tab="power">${t.tabPower}</button>
            <button class="inv-tab-btn" id="tab-btn-tech" data-tab="tech">${t.tabTech}</button>
            <button class="inv-tab-btn" id="tab-btn-engines" data-tab="engines">${t.tabEngines}</button>
            <button class="inv-tab-btn" id="tab-btn-carriers" data-tab="carriers">${t.tabCarriers}</button>
          </div>

          <!-- Horizontal Scroll Armory Shelf -->
          <div class="dock-shelf-container">
            <div class="inventory-items-grid" id="armory-items-grid"></div>
          </div>

          <!-- Launch Bar -->
          <div class="dock-launch-bar">
            <div class="jarvis-status" id="validation-msg">
              <span class="status-dot"></span> ${t.statusNominal}
            </div>
            <button id="btn-approve-launch" class="btn-hyperspace-launch">
              <span>⚡</span> ${t.launchBtn}
            </button>
          </div>
        </footer>
      </div>

      <!-- Quick Exit Button for Cinematic Mode -->
      <button id="btn-exit-cinematic" class="btn-exit-cinematic">
        ${t.restoreFlightBtn}
      </button>
    `;
    document.body.appendChild(modal);

    // Create In-Flight Aerospace GNC HUD
    const hud = document.createElement('div');
    hud.id = 'nasa-flight-hud';
    hud.innerHTML = `
      <div class="hud-panel" id="hud-flight-panel">
        <div class="hud-title" id="hud-drag-handle" title="Click and drag to reposition flight HUD">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="hud-drag-icon">⋮⋮</span>
            <span id="hud-mission-name">NASA DART KINETIC IMPACTOR</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span id="hud-telemetry-badge" style="color: var(--stark-cyan); font-size: 0.72rem;">● ORBITAL TELEMETRY</span>
            <button id="hud-btn-minimize" class="hud-mini-btn" title="Minimize / Expand">—</button>
          </div>
        </div>
        <div id="hud-body-content" class="hud-body-content">
          <div class="hud-row"><span id="hud-lbl-target">${t.hudTargetSector}</span><strong id="hud-target-name">65803 Didymos</strong></div>
          <div class="hud-row"><span id="hud-lbl-science">${t.hudCosmicIntel}</span><strong id="hud-science-live" style="color: var(--stark-gold);">0 pts</strong></div>
          <div class="hud-row"><span id="hud-lbl-power">${t.hudArcOutput}</span><strong id="hud-power-live">2,200 W</strong></div>
          <div class="hud-row"><span id="hud-lbl-status">${t.hudJarvisStatus}</span><strong id="hud-status-text" style="color: var(--stark-cyan);">${t.hudStatusInitial}</strong></div>
          
          <!-- NASA WSMV (Web-based Space Mission Visualization) Telemetry & PHA Radar -->
          <div class="nasa-wsmv-section">
            <div class="nasa-wsmv-header">
              <span class="nasa-badge">NASA WSMV</span>
              <span id="hud-wsmv-header" style="letter-spacing: 0.5px;">KEPLERIAN ORBIT & PHA RADAR</span>
            </div>
            
            <div class="wsmv-telemetry-grid">
              <div class="wsmv-item"><span class="wsmv-lbl" id="wsmv-lbl-sma">SMA (a):</span><span class="wsmv-val" id="wsmv-a">1.000 AU</span></div>
              <div class="wsmv-item"><span class="wsmv-lbl" id="wsmv-lbl-ecc">ECC (e):</span><span class="wsmv-val" id="wsmv-e">0.0000</span></div>
              <div class="wsmv-item"><span class="wsmv-lbl" id="wsmv-lbl-inc">INC (i):</span><span class="wsmv-val" id="wsmv-i">0.00°</span></div>
              <div class="wsmv-item"><span class="wsmv-lbl" id="wsmv-lbl-node">NODE (Ω):</span><span class="wsmv-val" id="wsmv-node">0.00°</span></div>
              <div class="wsmv-item"><span class="wsmv-lbl" id="wsmv-lbl-peri">PERI (ω):</span><span class="wsmv-val" id="wsmv-peri">0.00°</span></div>
              <div class="wsmv-item"><span class="wsmv-lbl" id="wsmv-lbl-head">HEAD:</span><span class="wsmv-val" id="wsmv-head">0.00°</span></div>
            </div>

            <!-- Proximity Radar for Potentially Hazardous Asteroids (PHAs) -->
            <div class="pha-radar-box">
              <div class="pha-radar-header">
                <span class="radar-ping-icon">📡</span>
                <span id="pha-nearest-label">NEAREST ASTEROID (PHA):</span>
                <span id="pha-nearest-name" class="pha-name-tag">99942 Apophis</span>
              </div>
              <div class="pha-distance-row">
                <span class="pha-dist-lbl" id="pha-range-label">RANGE:</span>
                <strong id="pha-nearest-dist" class="pha-dist-val">-- AU</strong>
                <span id="pha-hazard-badge" class="hazard-badge-safe">TRACKING</span>
              </div>
              <div class="pha-radar-bar">
                <div class="pha-radar-fill" id="pha-radar-fill"></div>
              </div>
            </div>
          </div>

          <!-- NASA DART Planetary Defense Guidance HUD (Q24) -->
          <div id="dart-flight-gnc-section" class="dart-gnc-box" style="display: none; margin-top: 8px; padding: 10px; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 0.74rem; font-weight: 700; color: #f59e0b;" id="dart-hud-target-lbl">${t.dartHudTarget}</span>
              <button id="dart-btn-toggle-guidance-hud" style="font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #4ade80; cursor: pointer; font-family: monospace;">${t.dartGuidanceActive}</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 0.72rem; font-family: monospace;">
              <div><span style="color: #94a3b8;" id="dart-lbl-range">${t.dartHudRange}</span> <strong id="dart-val-range" style="color: #38bdf8;">-- km</strong></div>
              <div><span style="color: #94a3b8;" id="dart-lbl-speed">${t.dartHudClosingSpeed}</span> <strong id="dart-val-speed" style="color: #facc15;">6.14 km/s</strong></div>
              <div><span style="color: #94a3b8;" id="dart-lbl-tgo">${t.dartHudTgo}</span> <strong id="dart-val-tgo" style="color: #e2e8f0;">-- s</strong></div>
              <div><span style="color: #94a3b8;" id="dart-lbl-orbit">${t.dartHudOrbitPeriod}</span> <strong id="dart-val-orbit" style="color: #4ade80;">11h 55m 12s</strong></div>
            </div>
            <div id="dart-scale-notice" style="font-size: 0.64rem; color: #94a3b8; font-style: italic; margin-top: 6px; line-height: 1.25;">
              ${t.dartVisualScaleNotice}
            </div>
          </div>

          <div class="hud-btn-group">
            <button id="hud-btn-debrief" class="hud-btn">📊 INTEL DEBRIEF</button>
            <button id="hud-btn-reconfigure" class="hud-btn">⚙️ HANGAR ARMORY</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(hud);

    // Create Debrief Modal
    const debrief = document.createElement('div');
    debrief.id = 'nasa-debrief-modal';
    debrief.innerHTML = `
      <!-- Generic Mission Debrief View -->
      <div class="debrief-box" id="debrief-generic-view" style="display: block;">
        <div style="font-size: 3.5rem; margin-bottom: 8px;">🛡️</div>
        <div id="debrief-title" style="font-family: var(--font-tech); font-size: 1.6rem; color: var(--stark-gold); margin-bottom: 12px;">
          ${t.debriefTitle}
        </div>
        <p style="color: #a0b5d0; font-size: 0.95rem; line-height: 1.6;" id="debrief-summary"></p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; text-align: left;">
          <div class="gauge-box">
            <div id="debrief-lbl-science" class="gauge-label">${t.debriefScienceLabel}</div>
            <div class="gauge-value" style="color: var(--stark-gold);" id="debrief-score-science">0 pts</div>
          </div>
          <div class="gauge-box">
            <div id="debrief-lbl-budget" class="gauge-label">${t.debriefBudgetLabel}</div>
            <div class="gauge-value" style="color: var(--stark-cyan);" id="debrief-score-budget">$0M</div>
          </div>
          <div class="gauge-box">
            <div id="debrief-lbl-reliability" class="gauge-label">${t.debriefReliabilityLabel}</div>
            <div class="gauge-value" style="color: #2ecc71;" id="debrief-score-reliability">3D SIM</div>
          </div>
          <div class="gauge-box">
            <div id="debrief-lbl-cert" class="gauge-label">${t.debriefCertLabel}</div>
            <div class="gauge-value" style="color: var(--stark-cyan);" id="debrief-rank">NASA FLIGHT DIRECTOR</div>
          </div>
        </div>
        <button id="debrief-btn-restart" class="btn-hyperspace-launch" style="font-size: 0.9rem; padding: 10px 28px; margin: 0 auto;">
          ${t.debriefReturnBtn}
        </button>
      </div>

      <!-- Dedicated DART Mission Reconstruction View (Q24) -->
      <div class="debrief-box" id="debrief-dart-view" style="display: none; max-width: 680px; width: 92%;">
        <div style="font-size: 3rem; margin-bottom: 4px;">🎯</div>
        <div id="dart-debrief-title" style="font-family: var(--font-tech); font-size: 1.45rem; color: var(--stark-gold); margin-bottom: 10px;">
          ${t.dartDebriefTitle}
        </div>

        <!-- Section 1: This Simulation Run -->
        <div class="dart-report-section" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 8px; padding: 12px; margin-bottom: 12px; text-align: left;">
          <div style="font-size: 0.85rem; font-weight: 700; color: #38bdf8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
            📍 <span id="dart-lbl-sim-title">${t.dartSimSectionTitle}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.8rem;">
            <div><span style="color: #94a3b8;" id="dart-lbl-field-body">${t.dartFieldImpactBody}</span> <strong id="dart-res-body" style="color: #facc15;">--</strong></div>
            <div><span style="color: #94a3b8;" id="dart-lbl-field-speed">${t.dartFieldRelativeSpeed}</span> <strong id="dart-res-speed" style="color: #facc15;">--</strong></div>
            <div><span style="color: #94a3b8;" id="dart-lbl-field-pre">${t.dartFieldPreOrbit}</span> <strong id="dart-res-pre-orbit">11h 55m 12s</strong></div>
            <div><span style="color: #94a3b8;" id="dart-lbl-field-post">${t.dartFieldPostOrbit}</span> <strong id="dart-res-post-orbit" style="color: #4ade80;">--</strong></div>
            <div style="grid-column: span 2;"><span style="color: #94a3b8;" id="dart-lbl-field-delta">${t.dartFieldPeriodDelta}</span> <strong id="dart-res-delta" style="color: #4ade80; font-size: 0.95rem;">--</strong></div>
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.8rem;">
            <div><span style="color: #94a3b8;" id="dart-lbl-field-outcome">${t.dartFieldOutcome}</span> <strong id="dart-res-outcome" style="color: #38bdf8;">--</strong></div>
            <div style="margin-top: 4px; color: #cbd5e1; font-size: 0.78rem; line-height: 1.4;" id="dart-res-reason">--</div>
            <div style="margin-top: 4px; color: #94a3b8; font-size: 0.74rem; font-style: italic;" id="dart-res-advice">--</div>
          </div>
        </div>

        <!-- Section 2: Real-World NASA DART Observations -->
        <div class="dart-report-section" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 8px; padding: 12px; margin-bottom: 16px; text-align: left;">
          <div style="font-size: 0.85rem; font-weight: 700; color: #f59e0b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
            🪐 <span id="dart-lbl-real-title">${t.dartRealSectionTitle}</span>
          </div>
          <div style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.45; margin-bottom: 6px;" id="dart-txt-real-intro">
            ${t.dartRealContextIntro}
          </div>
          <div style="font-size: 0.76rem; color: #94a3b8; line-height: 1.4;">
            <div id="dart-txt-real-baseline">• <strong>${t.dartRealBaseline}</strong></div>
            <div id="dart-txt-real-initial">• <strong>${t.dartRealInitialResult}</strong></div>
            <div id="dart-txt-real-updated">• <strong>${t.dartRealUpdatedStudy}</strong></div>
          </div>
          <div style="font-size: 0.7rem; color: #64748b; margin-top: 6px;" id="dart-txt-real-source">
            ${t.dartRealSourceRef}
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button id="debrief-btn-dart-retry" class="btn-hyperspace-launch" style="font-size: 0.85rem; padding: 8px 20px; background: linear-gradient(135deg, #0284c7, #0369a1);">
            ${t.dartBtnRetry}
          </button>
          <button id="debrief-btn-dart-restart" class="btn-hyperspace-launch" style="font-size: 0.85rem; padding: 8px 20px;">
            ${t.dartBtnReturnHangar}
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(debrief);

    this.bindDOMEvents();
  }

  /**
   * Tạo Texture kim loại vi tính 4K Ultra HD (2048x2048) với các đường viền giáp, vân sợi carbon và đinh tán titan
   */
  private getOrCreateHullTexture(): THREE.CanvasTexture {
    if (this.hullTexture) return this.hullTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;

    // 1. Nền kim loại tối màu xanh xám Vibranium / Titanium
    ctx.fillStyle = '#18202e';
    ctx.fillRect(0, 0, 2048, 2048);

    // 2. Mảng giáp module đa giác công nghệ cao với các sắc thái hợp kim khác biệt
    const shades = ['#151c28', '#222d3f', '#1b2434', '#121722', '#28364c', '#192231'];
    const step = 256;
    for (let x = 0; x < 2048; x += step) {
      for (let y = 0; y < 2048; y += step) {
        ctx.fillStyle = shades[(Math.floor(x / step) + Math.floor(y / step) * 3) % shades.length];
        ctx.fillRect(x + 4, y + 4, step - 8, step - 8);

        // Vân carbon dệt chéo siêu mịn trên các tấm giáp thứ cấp
        if ((x + y) % 512 === 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
          ctx.lineWidth = 1.5;
          for (let d = -step; d < step * 2; d += 8) {
            ctx.beginPath();
            ctx.moveTo(x + d, y);
            ctx.lineTo(x + d + step, y + step);
            ctx.stroke();
          }
        }
      }
    }

    // 3. Đường rãnh ghép giáp cắt bằng laser (Deep Laser Seams)
    ctx.strokeStyle = '#060a10';
    ctx.lineWidth = 8;
    for (let i = 0; i <= 2048; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i, 2048);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i); ctx.lineTo(2048, i);
      ctx.stroke();
    }

    // 4. Vi mạch bán dẫn quang học phát quang Stark Cyan trong rãnh giáp
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 2.5;
    for (let i = 128; i < 2048; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 32); ctx.lineTo(i, 2016);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(32, i); ctx.lineTo(2016, i);
      ctx.stroke();
    }

    // 5. Hàng nghìn đinh tán Titan vi mô sắc nét độ phân giải 4K
    ctx.fillStyle = '#8ca3c2';
    for (let i = 0; i <= 2048; i += step) {
      for (let j = 16; j < 2048; j += 32) {
        ctx.beginPath();
        ctx.arc(i, j, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(j, i, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Tâm đinh tán phản quang
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i <= 2048; i += step) {
      for (let j = 16; j < 2048; j += 32) {
        ctx.beginPath();
        ctx.arc(i - 1, j - 1, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 6. Vết xước vi mô kim loại phay xước (Micro Brushed Metal Streaks)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let s = 0; s < 180; s++) {
      const rx = Math.random() * 2048;
      const ry = Math.random() * 2048;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + (Math.random() - 0.5) * 80, ry + (Math.random() - 0.5) * 80);
      ctx.stroke();
    }

    this.hullTexture = new THREE.CanvasTexture(canvas);
    this.hullTexture.wrapS = THREE.RepeatWrapping;
    this.hullTexture.wrapT = THREE.RepeatWrapping;
    this.hullTexture.repeat.set(2, 2);
    this.hullTexture.anisotropy = this.maxAnisotropy;
    this.hullTexture.generateMipmaps = true;
    return this.hullTexture;
  }

  /**
   * Bản đồ độ lồi lõm 4K Bump Map (2048x2048) tạo độ nổi khối rãnh giáp và đầu đinh tán cực nét
   */
  private getOrCreateBumpTexture(): THREE.CanvasTexture {
    if (this.bumpTexture) return this.bumpTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 2048, 2048);

    const step = 256;
    // Rãnh giáp khắc sâu (màu tối = chìm xuống)
    ctx.strokeStyle = '#101010';
    ctx.lineWidth = 10;
    for (let i = 0; i <= 2048; i += step) {
      ctx.strokeRect(i - 4, 0, 8, 2048);
      ctx.strokeRect(0, i - 4, 2048, 8);
    }

    // Nắp kỹ thuật bảo dưỡng dập nổi
    ctx.fillStyle = '#a8a8a8';
    for (let x = 64; x < 2048; x += step) {
      for (let y = 64; y < 2048; y += step) {
        ctx.fillRect(x, y, 128, 128);
      }
    }

    // Đinh tán nổi cao
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i <= 2048; i += step) {
      for (let j = 16; j < 2048; j += 32) {
        ctx.beginPath();
        ctx.arc(i, j, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(j, i, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    this.bumpTexture = new THREE.CanvasTexture(canvas);
    this.bumpTexture.wrapS = THREE.RepeatWrapping;
    this.bumpTexture.wrapT = THREE.RepeatWrapping;
    this.bumpTexture.repeat.set(2, 2);
    this.bumpTexture.anisotropy = this.maxAnisotropy;
    this.bumpTexture.generateMipmaps = true;
    return this.bumpTexture;
  }

  /**
   * Bản đồ độ nhám kim loại 4K Roughness Map (2048x2048) tạo độ lóa kim loại tương phản cao
   */
  private getOrCreateRoughnessTexture(): THREE.CanvasTexture {
    if (this.roughnessTexture) return this.roughnessTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;

    // Mặt giáp bóng bẩy (màu tối = nhám thấp = bóng kim loại sắc nét)
    ctx.fillStyle = '#2c2c2c';
    ctx.fillRect(0, 0, 2048, 2048);

    const step = 256;
    // Rãnh giáp và ron cao su cách nhiệt (màu sáng = nhám cao = không bóng lóa)
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 10;
    for (let i = 0; i <= 2048; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i, 2048);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i); ctx.lineTo(2048, i);
      ctx.stroke();
    }

    // Đinh tán titan bóng như gương
    ctx.fillStyle = '#101010';
    for (let i = 0; i <= 2048; i += step) {
      for (let j = 16; j < 2048; j += 32) {
        ctx.beginPath();
        ctx.arc(i, j, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    this.roughnessTexture = new THREE.CanvasTexture(canvas);
    this.roughnessTexture.wrapS = THREE.RepeatWrapping;
    this.roughnessTexture.wrapT = THREE.RepeatWrapping;
    this.roughnessTexture.repeat.set(2, 2);
    this.roughnessTexture.anisotropy = this.maxAnisotropy;
    this.roughnessTexture.generateMipmaps = true;
    return this.roughnessTexture;
  }

  /**
   * Bản đồ mặt sàn Hangar 4K (2048x2048) với gạch lục giác và sọc cảnh báo an toàn
   */
  private getOrCreateFloorTexture(): THREE.CanvasTexture {
    if (this.floorTexture) return this.floorTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0e141f';
    ctx.fillRect(0, 0, 2048, 2048);

    // Lưới kim loại sàn lục giác / ô vuông chịu lực
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.28)';
    ctx.lineWidth = 4;
    const step = 128;
    for (let x = 0; x < 2048; x += step) {
      for (let y = 0; y < 2048; y += step) {
        ctx.strokeRect(x + 4, y + 4, step - 8, step - 8);
      }
    }

    // Các lỗ bulông khóa sàn ở mỗi góc
    ctx.fillStyle = '#3a4a63';
    for (let x = 0; x <= 2048; x += step) {
      for (let y = 0; y <= 2048; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Sọc sơn vàng cảnh báo mép dock phóng siêu nét
    ctx.fillStyle = '#f59e0b';
    for (let i = 0; i < 2048; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i + 32, 0);
      ctx.lineTo(i + 8, 48); ctx.lineTo(i - 24, 48);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(i, 2000); ctx.lineTo(i + 32, 2000);
      ctx.lineTo(i + 8, 2048); ctx.lineTo(i - 24, 2048);
      ctx.fill();
    }

    this.floorTexture = new THREE.CanvasTexture(canvas);
    this.floorTexture.wrapS = THREE.RepeatWrapping;
    this.floorTexture.wrapT = THREE.RepeatWrapping;
    this.floorTexture.repeat.set(4, 4);
    this.floorTexture.anisotropy = this.maxAnisotropy;
    this.floorTexture.generateMipmaps = true;
    return this.floorTexture;
  }

  /**
   * Khởi tạo Hangar 3D Ultra HD 4K với ánh sáng hoàng hôn điện ảnh (Sunset HDR & 4096p Shadows)
   */
  private init3DHangar() {
    const canvas = document.getElementById('hangar-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.hangarScene = new THREE.Scene();
    this.hangarCamera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.hangarCamera.position.set(0, 1.4, 5.0);
    this.hangarCamera.lookAt(0, 0.25, 0);

    // Thiết lập WebGLRenderer chuẩn 4K Ultra HD PBR cao cấp
    this.hangarRenderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'highp'
    });
    this.maxAnisotropy = this.hangarRenderer.capabilities.getMaxAnisotropy() || 16;

    const dpr = computeEffectiveDpr();
    this.hangarRenderer.setSize(width, height);
    this.hangarRenderer.setPixelRatio(dpr);
    this.hangarRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.hangarRenderer.toneMappingExposure = 1.35;
    this.hangarRenderer.outputEncoding = THREE.sRGBEncoding;
    this.hangarRenderer.shadowMap.enabled = true;
    this.hangarRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 1. Ánh sáng bầu trời và đổ bóng môi trường (Atmospheric Fill)
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x090d16, 0.85);
    this.hangarScene.add(hemiLight);

    // 2. Nguồn sáng Ngôi sao Hoàng hôn 4K (Golden Sunset Sun) - Bản đồ bóng đổ 4096x4096
    const sunLight = new THREE.DirectionalLight(0xffa24c, 3.0);
    sunLight.position.set(6, 4.5, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096; // 4K Shadow Map
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 20;
    sunLight.shadow.camera.left = -3;
    sunLight.shadow.camera.right = 3;
    sunLight.shadow.camera.top = 3;
    sunLight.shadow.camera.bottom = -3;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.radius = 1.6;
    this.hangarScene.add(sunLight);

    // 3. Nguồn sáng viền hoàng hôn rực lửa (Dramatic Sunset Rim Backlight)
    const rimLight = new THREE.PointLight(0xff4500, 3.5, 20);
    rimLight.position.set(-5, 2.5, -5.5);
    this.hangarScene.add(rimLight);

    // 4. Ánh sáng phản lực Stark Cyan dưới đáy bệ phóng
    const padGlow = new THREE.PointLight(0x00f0ff, 2.8, 8);
    padGlow.position.set(0, -0.4, 0);
    this.hangarScene.add(padGlow);

    // 5. Đèn Spotlight định hướng trên đỉnh với bóng đổ 2048
    const spotLight = new THREE.SpotLight(0xffffff, 1.5, 14, Math.PI / 4, 0.5);
    spotLight.position.set(0, 5, 2);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.bias = -0.0004;
    this.hangarScene.add(spotLight);
    this.hangarSunLight = sunLight;
    this.hangarSpotLight = spotLight;
    this.applyQualityToHangar(getStoredQuality());
    onQualityChange((q) => this.applyQualityToHangar(q));

    // Sàn kim loại Bệ phóng nhận bóng đổ (Shadow Receiving Dock Floor) - 64 segments siêu mượt
    const floorGeo = new THREE.CylinderGeometry(2.3, 2.4, 0.18, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1f2633,
      metalness: 0.85,
      roughness: 0.35,
      map: this.getOrCreateFloorTexture()
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.58;
    floorMesh.receiveShadow = true;
    this.hangarScene.add(floorMesh);

    // Vòng tròn năng lượng Hologram Cyan
    const ringGeo = new THREE.RingGeometry(1.95, 2.15, 80);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide });
    this.holoRing = new THREE.Mesh(ringGeo, ringMat);
    this.holoRing.position.y = -0.48;
    this.hangarScene.add(this.holoRing);

    // Vòng tròn ký tự Stark Gold xoay ngược chiều
    const ringInnerGeo = new THREE.RingGeometry(1.1, 1.22, 64);
    ringInnerGeo.rotateX(-Math.PI / 2);
    const ringInnerMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
    this.holoRingInner = new THREE.Mesh(ringInnerGeo, ringInnerMat);
    this.holoRingInner.position.y = -0.47;
    this.hangarScene.add(this.holoRingInner);

    // 4 Càng gantry thủy lực khóa bệ phóng (Hydraulic Clamps)
    const clampMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.25 });
    const clampAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    clampAngles.forEach(ang => {
      const clampGroup = new THREE.Group();
      const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.4), clampMat);
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      const armMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 0.15), clampMat);
      armMesh.position.set(0, 0.35, -0.15);
      armMesh.rotation.x = -0.35;
      armMesh.castShadow = true;
      clampGroup.add(baseMesh, armMesh);
      clampGroup.position.set(Math.cos(ang) * 2.2, -0.38, Math.sin(ang) * 2.2);
      clampGroup.rotation.y = -ang + Math.PI / 2;
      this.hangarScene.add(clampGroup);
    });

    // Bụi vũ trụ & tia lửa hạt nổi lơ lửng trong ánh hoàng hôn (Atmospheric Particles)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 6;
      posArray[i + 1] = Math.random() * 3.5 - 0.5;
      posArray[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xffb74d,
      transparent: true,
      opacity: 0.75
    });
    this.dustParticles = new THREE.Points(particleGeo, particleMat);
    this.hangarScene.add(this.dustParticles);

    // Tạo nhóm mô hình tàu chiến Marvel Ultra HD 4K
    this.shipGroup = new THREE.Group();
    this.rebuild3DShipModel();
    this.hangarScene.add(this.shipGroup);

    // Tương tác chuột xoay quỹ đạo 360 độ và Zoom ở bất kỳ đâu trên màn hình
    window.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement).closest('.hud-blade, .hud-dock-bottom, .aaa-topbar, button')) return;
      this.isHangarDragging = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isHangarDragging) return;
      const dx = e.clientX - this.prevMouseX;
      const dy = e.clientY - this.prevMouseY;
      this.targetAzimuth += dx * 0.007;
      this.targetElevation = Math.max(-0.25, Math.min(0.95, this.targetElevation - dy * 0.007));
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isHangarDragging = false;
    });

    window.addEventListener('wheel', (e) => {
      if ((e.target as HTMLElement).closest('.blade-content, .dock-shelf-container')) return;
      this.targetDistance = Math.max(2.2, Math.min(8.0, this.targetDistance + e.deltaY * 0.004));
    }, { passive: true });

    // Vòng lặp render Hangar 4K
    const animateHangar = () => {
      requestAnimationFrame(animateHangar);
      if (!this.isHangarVisible || document.hidden) {
        return;
      }

      // Nội suy mượt chuyển động Camera
      this.cameraAzimuth += (this.targetAzimuth - this.cameraAzimuth) * 0.08;
      this.cameraElevation += (this.targetElevation - this.cameraElevation) * 0.08;
      this.cameraDistance += (this.targetDistance - this.cameraDistance) * 0.08;

      if (!this.isHangarDragging) {
        this.targetAzimuth += 0.004; // Tự động xoay quanh tàu
      }

      const camX = this.cameraDistance * Math.cos(this.cameraElevation) * Math.sin(this.cameraAzimuth);
      const camY = this.cameraDistance * Math.sin(this.cameraElevation);
      const camZ = this.cameraDistance * Math.cos(this.cameraElevation) * Math.cos(this.cameraAzimuth);
      if (this.hangarCamera) {
        this.hangarCamera.position.set(camX, camY + 0.35, camZ);
        this.hangarCamera.lookAt(0, 0.2, 0);
      }

      // Độ nhấp nhô lơ lửng phản trọng lực của tàu (Hovering Oscillation)
      const time = Date.now() * 0.0018;
      if (this.shipGroup) {
        this.shipGroup.position.y = Math.sin(time) * 0.04;
      }

      // Xoay các vòng năng lượng Hologram
      if (this.holoRing) this.holoRing.rotation.y -= 0.005;
      if (this.holoRingInner) this.holoRingInner.rotation.y += 0.008;

      // Xoay các phần tử động cơ và lõi năng lượng (Warp rings, Tesseract Hypercube, Fan turbines)
      this.rotatingElements.forEach(item => {
        if (item.speedX) item.obj.rotation.x += item.speedX;
        if (item.speedY) item.obj.rotation.y += item.speedY;
        if (item.speedZ) item.obj.rotation.z += item.speedZ;
      });

      // Chớp đèn tín hiệu hàng không vũ trụ (Navigation Strobes)
      const strobeOn = Math.floor(Date.now() / 650) % 2 === 0;
      this.navLights.forEach(item => {
        item.mat.opacity = strobeOn ? 1.0 : 0.2;
      });

      // Chuyển động hạt bụi ánh sáng nổi
      if (this.dustParticles) {
        const positions = (this.dustParticles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += 0.003;
          if (positions[i] > 3.0) positions[i] = -0.5;
        }
        this.dustParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Hiệu ứng lửa đẩy động cơ phụt nhịp nhàng
      const flamePulse = 0.9 + Math.sin(time * 8) * 0.2;
      this.thrusterPlumes.forEach(p => {
        p.scale.set(1, flamePulse, 1);
      });

      if (this.hangarRenderer && this.hangarScene && this.hangarCamera) {
        if ((window as any).__perf) (window as any).__perf.hangarRenderCount++;
        this.hangarRenderer.render(this.hangarScene, this.hangarCamera);
      }
    };
    animateHangar();

    window.addEventListener('resize', () => {
      if (!this.hangarCamera || !this.hangarRenderer) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.hangarCamera.aspect = w / h;
      this.hangarCamera.updateProjectionMatrix();
      this.hangarRenderer.setSize(w, h);
      this.hangarRenderer.setPixelRatio(computeEffectiveDpr());
    });
  }

  private applyQualityToHangar(quality: GraphicsQuality) {
    if (!this.hangarRenderer) return;
    const cfg = getQualityConfig(quality);
    const dpr = computeEffectiveDpr(quality);
    this.hangarRenderer.setPixelRatio(dpr);
    this.hangarRenderer.shadowMap.enabled = cfg.shadows;

    if (this.hangarSunLight) {
      this.hangarSunLight.castShadow = cfg.shadows;
      if (this.hangarSunLight.shadow) {
        this.hangarSunLight.shadow.mapSize.width = cfg.shadowMapSize;
        this.hangarSunLight.shadow.mapSize.height = cfg.shadowMapSize;
      }
    }
    if (this.hangarSpotLight) {
      this.hangarSpotLight.castShadow = cfg.shadows && cfg.maxDpr > 1.25;
      if (this.hangarSpotLight.shadow) {
        this.hangarSpotLight.shadow.mapSize.width = Math.min(1024, cfg.shadowMapSize);
        this.hangarSpotLight.shadow.mapSize.height = Math.min(1024, cfg.shadowMapSize);
      }
    }
    this.maxAnisotropy = cfg.anisotropy;
  }

  /**
   * Dựng mô hình 3D chiến hạm Marvel Ultra HD 4K với vật liệu PBR, vân kim loại và chi tiết giáp siêu mịn
   */
  private rebuild3DShipModel() {
    if (!this.shipGroup) return;
    while (this.shipGroup.children.length > 0) {
      const child = this.shipGroup.children[0];
      this.shipGroup.remove(child);
      child.traverse((node: any) => {
        if (node.isMesh) {
          if (node.geometry && !node.geometry.userData?.isShared) {
            node.geometry.dispose();
          }
          if (node.material) {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((m: any) => {
              if (!m.userData?.isShared) {
                m.dispose();
              }
            });
          }
        }
      });
    }
    this.thrusterPlumes = [];
    this.navLights = [];
    this.rotatingElements = [];

    // Nếu người dùng đã tải mô hình 3D tùy chỉnh (.glb, .gltf, .obj)
    if (this.isCustomModelLoaded && this.customModel) {
      this.shipGroup.add(this.customModel);
      this.buildNationalLiveryDecals(this.shipGroup, this.selectedFlagId);
      this.attachEnginePlumes(this.shipGroup, this.customModel);
      if (this.isInitialized) this.onShipChangedCallback?.();
      return;
    }

    // Kiểm tra và hiển thị mô hình 3D chính thức của NASA hoặc Chiến Hạm (.glb)
    const currentCraft = SPACECRAFT_FLEET.find(c => c.id === this.selectedChassisId);
    if (currentCraft && currentCraft.modelUrl) {
      const cached = this.loadedGlbCache.get(currentCraft.id);
      if (cached) {
        const cloned = cached.clone(true);
        this.shipGroup.add(cloned);
        this.buildNationalLiveryDecals(this.shipGroup, this.selectedFlagId);
        this.attachEnginePlumes(this.shipGroup, cloned);
        if (this.isInitialized) this.onShipChangedCallback?.();
        return;
      } else {
        const reqId = ++this.currentLoadRequestId;
        this.requestLoadGlbModel(currentCraft, reqId);
      }
    }

    const hullTex = this.getOrCreateHullTexture();
    const bumpTex = this.getOrCreateBumpTexture();
    const roughTex = this.getOrCreateRoughnessTexture();

    // Hệ thống vật liệu PBR 4K Ultra HD
    const hullArmorMat = new THREE.MeshStandardMaterial({
      color: 0x1e2736,
      metalness: 0.88,
      roughness: 0.22,
      map: hullTex,
      bumpMap: bumpTex,
      bumpScale: 0.04,
      roughnessMap: roughTex
    });

    const starkGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.96,
      roughness: 0.15,
      bumpMap: bumpTex,
      bumpScale: 0.02
    });

    const carbonDarkMat = new THREE.MeshStandardMaterial({
      color: 0x0f141d,
      metalness: 0.92,
      roughness: 0.28,
      bumpMap: bumpTex,
      bumpScale: 0.03
    });

    const glassCanopyMat = new THREE.MeshStandardMaterial({
      color: 0x061e38,
      metalness: 0.98,
      roughness: 0.04,
      transparent: true,
      opacity: 0.86
    });

    const titaniumTrimMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.96,
      roughness: 0.12
    });

    const glowCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const glowOrangeMat = new THREE.MeshBasicMaterial({ color: 0xff7700 });
    const glowRedMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const glowPurpleMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    const glowMagentaMat = new THREE.MeshBasicMaterial({ color: 0xd946ef });
    const glowWhiteMat = new THREE.MeshBasicMaterial({ color: 0xf0fdfa });

    const addNavBeacon = (pos: THREE.Vector3, colorHex: number) => {
      const mat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 1.0 });
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), mat);
      beacon.position.copy(pos);
      this.navLights.push({ mesh: beacon, mat });
      this.shipGroup!.add(beacon);
    };

    const mats = {
      hullArmorMat,
      starkGoldMat,
      carbonDarkMat,
      glassCanopyMat,
      titaniumTrimMat,
      glowCyanMat,
      glowOrangeMat,
      glowRedMat,
      glowPurpleMat,
      glowMagentaMat,
      glowWhiteMat,
      addNavBeacon
    };

    // 1. Dựng thân tàu theo khung gầm Chassis đã chọn
    if (this.selectedChassisId === 'dart_impactor') {
      this.buildDartChassis(this.shipGroup, mats);
    } else if (this.selectedChassisId === 'milano') {
      this.buildMilanoChassis(this.shipGroup, mats);
    } else if (this.selectedChassisId === 'sanctuary') {
      this.buildSanctuaryChassis(this.shipGroup, mats);
    } else if (this.selectedChassisId === 'benatar') {
      this.buildBenatarChassis(this.shipGroup, mats);
    } else if (this.selectedChassisId === 'hyperion') {
      this.buildHyperionChassis(this.shipGroup, mats);
    } else if (this.selectedChassisId === 'ghostwing') {
      this.buildGhostwingChassis(this.shipGroup, mats);
    } else if (this.selectedChassisId === 'quinjet') {
      this.buildQuinjetChassis(this.shipGroup, mats);
    } else {
      this.buildSpaceShuttleChassis(this.shipGroup, mats);
    }

    // 2. Gắn lõi năng lượng mô-đun (Power Reactor Modular Mounting)
    this.buildModularPowerCore(this.selectedPowerId, this.shipGroup, mats);

    // 3. Gắn động cơ phản lực mô-đun (Engines Modular Mounting)
    this.buildModularEngines(this.selectedEngineId, this.shipGroup, mats);

    // 4. Gắn các thiết bị vũ trí công nghệ Marvel (Tech Modular Mounting)
    this.buildModularTechPayloads(this.selectedTechIds, this.shipGroup, mats);

    // 5. Mount 4K National Livery Flag & Official NASA Decals
    this.buildNationalLiveryDecals(this.shipGroup, this.selectedFlagId);

    if (this.isInitialized) this.onShipChangedCallback?.();
  }

  /**
   * High-Fidelity Procedural NASA Space Shuttle Orbiter (Discovery OV-103)
   * Authentic double-delta aerodynamic wing spaceplane with ceramic thermal protection tiles,
   * split-rudder vertical stabilizer, dual orbital maneuvering system (OMS) pods, and RS-25 engine cluster.
   */
  private buildSpaceShuttleChassis(ship: THREE.Group, mats: any) {
    const whiteShuttleMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.2,
      roughness: 0.35,
      map: this.getOrCreateHullTexture(),
      bumpMap: this.getOrCreateBumpTexture(),
      bumpScale: 0.02
    });

    const blackThermalMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.4,
      roughness: 0.65,
      map: this.getOrCreateHullTexture(),
      bumpMap: this.getOrCreateBumpTexture(),
      bumpScale: 0.03
    });

    // 1. Fuselage Body (Aerodynamic White Cylinder with Black Underside)
    const bodyGeo = new THREE.CylinderGeometry(0.38, 0.40, 2.2, 32);
    bodyGeo.rotateX(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, whiteShuttleMat);
    body.position.set(0, 0.12, -0.1);
    body.castShadow = true;
    body.receiveShadow = true;
    ship.add(body);

    // Black heat shield belly
    const bellyGeo = new THREE.CylinderGeometry(0.385, 0.405, 2.18, 32, 1, false, Math.PI, Math.PI);
    bellyGeo.rotateX(Math.PI / 2);
    const belly = new THREE.Mesh(bellyGeo, blackThermalMat);
    belly.position.set(0, 0.12, -0.1);
    belly.castShadow = true;
    ship.add(belly);

    // 2. Nose Cone & Carbon-Carbon Thermal Cap
    const noseGeo = new THREE.CylinderGeometry(0.04, 0.38, 0.85, 32);
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, whiteShuttleMat);
    nose.position.set(0, 0.11, 1.42);
    nose.castShadow = true;
    ship.add(nose);

    const noseCap = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 18), blackThermalMat);
    noseCap.scale.set(1, 0.8, 1.3);
    noseCap.position.set(0, 0.11, 1.84);
    ship.add(noseCap);

    // 3. Cockpit Windshield (6-Pane Flight Deck Windows)
    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 18), mats.glassCanopyMat);
    cockpit.scale.set(1.05, 0.55, 1.1);
    cockpit.position.set(0, 0.34, 1.15);
    cockpit.rotation.x = -0.15;
    ship.add(cockpit);

    // 4. Double-Delta Wings (White topside with black leading edge thermal tiles)
    [-1, 1].forEach(side => {
      // Main wing panel
      const wingGeo = new THREE.BoxGeometry(1.25, 0.05, 1.35);
      const wing = new THREE.Mesh(wingGeo, whiteShuttleMat);
      wing.position.set(side * 0.95, 0.06, -0.32);
      wing.rotation.y = side * -0.22;
      wing.castShadow = true;
      wing.receiveShadow = true;
      ship.add(wing);

      // Black thermal leading edge
      const edgeGeo = new THREE.BoxGeometry(0.08, 0.065, 1.45);
      const edge = new THREE.Mesh(edgeGeo, blackThermalMat);
      edge.position.set(side * 1.55, 0.06, -0.22);
      edge.rotation.y = side * -0.35;
      ship.add(edge);

      // Navigation lights (Port: Red, Starboard: Green)
      mats.addNavBeacon(new THREE.Vector3(side * 1.62, 0.07, -0.55), side < 0 ? 0xef4444 : 0x22c55e);
    });

    // 5. Vertical Stabilizer (Tail Fin with Split Rudder)
    const finGeo = new THREE.BoxGeometry(0.06, 0.95, 0.75);
    const fin = new THREE.Mesh(finGeo, whiteShuttleMat);
    fin.position.set(0, 0.78, -0.75);
    fin.castShadow = true;
    ship.add(fin);

    const finEdge = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.98, 0.08), blackThermalMat);
    finEdge.position.set(0, 0.78, -0.4);
    finEdge.rotation.x = -0.25;
    ship.add(finEdge);

    // 6. OMS Pods (Orbital Maneuvering System Pods at Aft)
    [-0.32, 0.32].forEach(px => {
      const omsGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.65, 18);
      omsGeo.rotateX(Math.PI / 2);
      const oms = new THREE.Mesh(omsGeo, whiteShuttleMat);
      oms.position.set(px, 0.32, -1.05);
      oms.castShadow = true;
      ship.add(oms);
    });

    // 7. RS-25 Main Engines (3 Engine Bells in Classic Triangular Layout)
    const enginePositions = [
      [0, 0.32, -1.3],
      [-0.18, 0.12, -1.3],
      [0.18, 0.12, -1.3]
    ];
    enginePositions.forEach(([ex, ey, ez]) => {
      const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.12, 0.28, 20), mats.titaniumTrimMat);
      bell.rotateX(Math.PI / 2);
      bell.position.set(ex, ey, ez);
      bell.castShadow = true;
      ship.add(bell);

      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), mats.glowCyanMat);
      glow.position.set(ex, ey, ez - 0.1);
      ship.add(glow);
    });
  }

  /**
   * Dựng Siêu Chiến Hạm Thủ Lĩnh HYPERION APEX STAR DREADNOUGHT
   * Thân giáp đa giác titan hạng nặng, pháo ray từ trường khổng lồ chạy dọc sống lưng,
   * tháp chỉ huy bọc thép, 4 ụ pháo kép hai bên sườn, khoang phóng tiêm kích và cụm 4 động cơ ion khổng lồ
   */
  private buildHyperionChassis(ship: THREE.Group, mats: any) {
    // 1. Thân chính bọc giáp titan đa giác vát góc (Heavy polygonal armored hull)
    const hullGeo = new THREE.BoxGeometry(1.48, 0.45, 2.6);
    const hull = new THREE.Mesh(hullGeo, mats.hullArmorMat);
    hull.position.set(0, 0.08, 0.1);
    hull.castShadow = true;
    hull.receiveShadow = true;
    ship.add(hull);

    // Mũi tàu Chisel Prow vát dốc nhọn về trước
    const prowGeo = new THREE.CylinderGeometry(0.12, 0.72, 1.2, 4);
    prowGeo.rotateX(Math.PI / 2);
    prowGeo.rotateZ(Math.PI / 4);
    const prow = new THREE.Mesh(prowGeo, mats.carbonDarkMat);
    prow.scale.set(1.4, 0.6, 1);
    prow.position.set(0, 0.08, 1.7);
    prow.castShadow = true;
    prow.receiveShadow = true;
    ship.add(prow);

    // 2. Hai vè giáp mạn sườn (Armor Sponsons)
    [-1, 1].forEach(side => {
      const sponsonGeo = new THREE.BoxGeometry(0.35, 0.32, 1.8);
      const sponson = new THREE.Mesh(sponsonGeo, mats.carbonDarkMat);
      sponson.position.set(side * 0.82, 0.08, 0.2);
      sponson.castShadow = true;
      sponson.receiveShadow = true;
      ship.add(sponson);

      // Ụ pháo kép hai bên sườn (Dual heavy turret batteries)
      [-0.4, 0.5].forEach(tz => {
        const turretBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.08, 16), mats.starkGoldMat);
        turretBase.position.set(side * 0.85, 0.28, tz);
        const barrel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.45, 12), mats.titaniumTrimMat);
        barrel1.rotateX(Math.PI / 2);
        barrel1.position.set(side * 0.85 - 0.04, 0.32, tz + 0.18);
        const barrel2 = barrel1.clone();
        barrel2.position.x = side * 0.85 + 0.04;
        turretBase.castShadow = true;
        barrel1.castShadow = true;
        barrel2.castShadow = true;
        ship.add(turretBase, barrel1, barrel2);
      });
    });

    // 3. Tháp chỉ huy bọc thép (Bridge Citadel Tower)
    const citadelGeo = new THREE.BoxGeometry(0.52, 0.42, 0.95);
    const citadel = new THREE.Mesh(citadelGeo, mats.hullArmorMat);
    citadel.position.set(0, 0.42, -0.4);
    citadel.castShadow = true;
    citadel.receiveShadow = true;
    ship.add(citadel);

    // Kính quan sát đài chỉ huy toàn cảnh (Bridge Viewport Strip)
    const bridgeGlass = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.22), mats.glassCanopyMat);
    bridgeGlass.position.set(0, 0.52, -0.15);
    ship.add(bridgeGlass);

    // Tháp ăng-ten mảng pha cảm biến siêu trường
    const sensorTower = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.65, 8), mats.starkGoldMat);
    sensorTower.position.set(0, 0.85, -0.65);
    sensorTower.castShadow = true;
    ship.add(sensorTower);

    // 4. Pháo ray từ trường khổng lồ chạy dọc sống lưng (Spinal Railgun Accelerator)
    const railgunSpine = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 2.2), mats.titaniumTrimMat);
    railgunSpine.position.set(0, 0.34, 0.5);
    railgunSpine.castShadow = true;
    ship.add(railgunSpine);

    const railBore = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 2.25), mats.glowCyanMat);
    railBore.position.set(0, 0.35, 0.5);
    ship.add(railBore);

    // Đèn hoa tiêu hạm đội
    mats.addNavBeacon(new THREE.Vector3(-1.0, 0.08, 0.2), 0xef4444);
    mats.addNavBeacon(new THREE.Vector3(1.0, 0.08, 0.2), 0x22c55e);
    mats.addNavBeacon(new THREE.Vector3(0, 1.15, -0.65), 0x00f0ff);
  }

  /**
   * Dựng Siêu Tiêm Kích Trinh Sát Đánh Chặn GHOSTWING ORBITAL RECON INTERCEPTOR
   * Thân tàng hình cánh ngược (Forward-swept wings), mũi kim siêu thanh, đuôi V-Tail kép
   */
  private buildGhostwingChassis(ship: THREE.Group, mats: any) {
    // 1. Thân khí động học tàng hình vuốt dẹt (Stealth Lifting Body)
    const bodyGeo = new THREE.BoxGeometry(0.55, 0.16, 1.8);
    const body = new THREE.Mesh(bodyGeo, mats.carbonDarkMat);
    body.position.set(0, 0.02, 0.0);
    body.castShadow = true;
    body.receiveShadow = true;
    ship.add(body);

    // Mũi kim tàng hình siêu thanh (Stealth needle nose)
    const noseGeo = new THREE.ConeGeometry(0.25, 1.1, 16);
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, mats.hullArmorMat);
    nose.scale.set(1.1, 0.35, 1);
    nose.position.set(0, 0.02, 1.25);
    nose.castShadow = true;
    ship.add(nose);

    // 2. Buồng lái giọt nước phản quang 4K (Teardrop Cockpit)
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 20), mats.glassCanopyMat);
    canopy.scale.set(0.68, 0.48, 1.6);
    canopy.position.set(0, 0.13, 0.38);
    ship.add(canopy);

    // 3. Cánh quét ngược đặc trưng (Forward-swept Delta Wings)
    [-1, 1].forEach(side => {
      const wingGeo = new THREE.BoxGeometry(1.05, 0.03, 0.75);
      const wing = new THREE.Mesh(wingGeo, mats.hullArmorMat);
      wing.position.set(side * 0.95, 0.02, 0.2);
      wing.rotation.y = side * 0.42;
      wing.rotation.z = side * -0.06;
      wing.castShadow = true;
      wing.receiveShadow = true;
      ship.add(wing);

      // Cánh phụ đầu cánh (Wingtip canards)
      const tipGeo = new THREE.BoxGeometry(0.3, 0.02, 0.4);
      const tip = new THREE.Mesh(tipGeo, mats.starkGoldMat);
      tip.position.set(side * 1.5, 0.04, 0.45);
      tip.rotation.y = side * 0.55;
      tip.castShadow = true;
      ship.add(tip);

      // Đèn tín hiệu
      mats.addNavBeacon(new THREE.Vector3(side * 1.62, 0.04, 0.52), side > 0 ? 0x22c55e : 0xef4444);
    });

    // 4. Cặp cánh đuôi chữ V nghiêng vát thể thao (Canted V-Tail)
    [-1, 1].forEach(side => {
      const finGeo = new THREE.BoxGeometry(0.03, 0.48, 0.52);
      const fin = new THREE.Mesh(finGeo, mats.carbonDarkMat);
      fin.position.set(side * 0.35, 0.28, -0.65);
      fin.rotation.x = -0.32;
      fin.rotation.z = side * -0.55;
      fin.castShadow = true;
      fin.receiveShadow = true;
      ship.add(fin);
    });

    // 5. Cảm biến laser quang tử trinh sát dưới bụng
    const reconPod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.6, 16), mats.titaniumTrimMat);
    reconPod.rotateX(Math.PI / 2);
    reconPod.position.set(0, -0.09, 0.35);
    reconPod.castShadow = true;
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), mats.glowCyanMat);
    lens.position.set(0, -0.09, 0.65);
    ship.add(reconPod, lens);
  }

  /**
   * Dựng thân chiến hạm QUINJET MK-VII (Avengers Stealth Interceptor)
   * Mũi vuốt nhọn về phía trước (+Z), buồng lái giọt nước, cánh swept-delta có fan VTOL, đuôi kép vát góc
   */
  private buildQuinjetChassis(ship: THREE.Group, mats: any) {
    // 1. Mũi tàu khí động học vươn nhọn về phía trước (+Z)
    const noseGeo = new THREE.CylinderGeometry(0.04, 0.38, 1.15, 16);
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, mats.hullArmorMat);
    nose.scale.set(1.15, 0.42, 1);
    nose.position.set(0, 0.02, 1.05); // từ +0.48 đến +1.62
    nose.castShadow = true;
    nose.receiveShadow = true;
    ship.add(nose);

    // Ống pitot khí động học siêu thanh ở chóp mũi
    const pitot = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.015, 0.35, 12), mats.titaniumTrimMat);
    pitot.rotateX(Math.PI / 2);
    pitot.position.set(0, 0.02, 1.75);
    ship.add(pitot);

    // 2. Thân giữa dẹt khí động học (Lifting Body & Chines)
    const centerGeo = new THREE.BoxGeometry(0.82, 0.28, 1.25);
    const centerBody = new THREE.Mesh(centerGeo, mats.hullArmorMat);
    centerBody.position.set(0, 0.02, 0.0);
    centerBody.castShadow = true;
    centerBody.receiveShadow = true;
    ship.add(centerBody);

    // Tấm giáp lưng carbon trên sống lưng tàu
    const spineGeo = new THREE.BoxGeometry(0.48, 0.12, 1.35);
    const spine = new THREE.Mesh(spineGeo, mats.carbonDarkMat);
    spine.position.set(0, 0.14, -0.05);
    spine.castShadow = true;
    ship.add(spine);

    // Viền chine khí động học hai bên sườn
    [-1, 1].forEach(side => {
      const chineGeo = new THREE.BoxGeometry(0.22, 0.08, 1.15);
      const chine = new THREE.Mesh(chineGeo, mats.starkGoldMat);
      chine.position.set(side * 0.48, 0.03, 0.05);
      chine.rotation.y = side * -0.15;
      chine.rotation.z = side * 0.18;
      chine.castShadow = true;
      ship.add(chine);
    });

    // 3. Đuôi thân thon nhọn che bệ động cơ, không để hở mặt cắt phẳng
    const aftGeo = new THREE.BoxGeometry(0.72, 0.22, 0.55);
    const aftBody = new THREE.Mesh(aftGeo, mats.hullArmorMat);
    aftBody.position.set(0, 0.03, -0.75);
    aftBody.castShadow = true;
    aftBody.receiveShadow = true;
    ship.add(aftBody);

    // 4. Buồng lái giọt nước cong vút phản quang 4K
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 24), mats.glassCanopyMat);
    canopy.scale.set(0.72, 0.52, 1.6);
    canopy.rotation.x = -0.08;
    canopy.position.set(0, 0.16, 0.42);
    ship.add(canopy);

    // Khung viền kính buồng lái Stark Gold
    const canopyFrame = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.015, 12, 32), mats.starkGoldMat);
    canopyFrame.scale.set(0.72, 0.52, 1.6);
    canopyFrame.rotation.x = -0.08;
    canopyFrame.position.set(0, 0.16, 0.42);
    ship.add(canopyFrame);

    // Holographic Tactical HUD bên trong kính lái
    const hudRing = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.09, 24), mats.glowCyanMat);
    hudRing.position.set(0, 0.17, 0.55);
    hudRing.rotateX(-0.15);
    ship.add(hudRing);

    // 5. Cánh vút hình học Quinjet (Cranked Swept Delta Wings with Anhedral Droop)
    [-1, 1].forEach(side => {
      // Cánh trong
      const wingInnerGeo = new THREE.BoxGeometry(0.92, 0.04, 0.88);
      const wingInner = new THREE.Mesh(wingInnerGeo, mats.hullArmorMat);
      wingInner.position.set(side * 0.80, 0.03, -0.15);
      wingInner.rotation.y = side * -0.22;
      wingInner.rotation.z = side * -0.05;
      wingInner.castShadow = true;
      wingInner.receiveShadow = true;
      ship.add(wingInner);

      // Đầu cánh gập rũ xuống (Outer Wing Fold - đặc trưng Quinjet)
      const wingOuterGeo = new THREE.BoxGeometry(0.58, 0.03, 0.68);
      const wingOuter = new THREE.Mesh(wingOuterGeo, mats.carbonDarkMat);
      wingOuter.position.set(side * 1.45, -0.08, -0.25);
      wingOuter.rotation.y = side * -0.35;
      wingOuter.rotation.z = side * -0.38;
      wingOuter.castShadow = true;
      wingOuter.receiveShadow = true;
      ship.add(wingOuter);

      // Đèn tín hiệu hoa tiêu ở chóp cánh
      mats.addNavBeacon(new THREE.Vector3(side * 1.72, -0.18, -0.34), side > 0 ? 0x22c55e : 0xef4444);

      // Cánh quạt nâng thẳng đứng VTOL tích hợp trên cánh trong
      const vtolHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.07, 32), mats.titaniumTrimMat);
      vtolHousing.position.set(side * 0.76, 0.03, -0.12);
      vtolHousing.castShadow = true;
      const vtolCore = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.09, 24), mats.glowCyanMat);
      vtolCore.position.set(side * 0.76, 0.03, -0.12);
      ship.add(vtolHousing, vtolCore);
    });

    // 6. Cánh đuôi kép vát góc 25 độ thể thao, sắc nét
    [-1, 1].forEach(side => {
      const finGeo = new THREE.BoxGeometry(0.04, 0.58, 0.48);
      const fin = new THREE.Mesh(finGeo, mats.carbonDarkMat);
      fin.position.set(side * 0.38, 0.34, -0.72);
      fin.rotation.x = -0.28;
      fin.rotation.z = side * -0.42;
      fin.castShadow = true;
      fin.receiveShadow = true;

      // Viền Stark Gold trên sống cánh đuôi
      const finTrim = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.08), mats.starkGoldMat);
      finTrim.position.set(side * 0.38, 0.34, -0.54);
      finTrim.rotation.x = -0.28;
      finTrim.rotation.z = side * -0.42;
      finTrim.castShadow = true;

      ship.add(fin, finTrim);
      mats.addNavBeacon(new THREE.Vector3(side * 0.52, 0.58, -0.82), 0xffffff);
    });

    // 7. Cặp pháo plasma năng lượng Stark dưới mũi tàu
    [-0.15, 0.15].forEach(cx => {
      const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.5, 16), mats.titaniumTrimMat);
      cannon.rotateX(Math.PI / 2);
      cannon.position.set(cx, -0.09, 0.85);
      cannon.castShadow = true;
      ship.add(cannon);
    });
  }

  /**
   * Dựng mô hình tàu va chạm động năng NASA DART chính xác theo nguyên mẫu lịch sử
   * Thân hình hộp bọc màng cách nhiệt vàng MLI, ống kính trinh sát DRACO, cánh pin mặt trời cuộn ROSA và động cơ ion NEXT-C
   */
  private buildDartChassis(ship: THREE.Group, mats: any) {
    const dartGroup = new THREE.Group();
    dartGroup.name = "dart_chassis_group";

    // 1. Thân chính hình khối lập phương ~1.2m bọc màng vàng MLI phản quang cao
    const busMat = new THREE.MeshStandardMaterial({
      color: 0xdfab35,
      metalness: 0.92,
      roughness: 0.22,
      bumpMap: this.getOrCreateBumpTexture(),
      bumpScale: 0.05
    });
    const busGeo = new THREE.BoxGeometry(0.85, 0.85, 0.95);
    const bus = new THREE.Mesh(busGeo, busMat);
    bus.position.set(0, 0, 0);
    bus.castShadow = true;
    bus.receiveShadow = true;
    dartGroup.add(bus);

    // Khung viền titanium gia cố các cạnh của thân tàu
    const frameGeo = new THREE.BoxGeometry(0.87, 0.87, 0.97);
    const frameEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(frameGeo),
      new THREE.LineBasicMaterial({ color: 0x94a3b8, linewidth: 2 })
    );
    dartGroup.add(frameEdges);

    // 2. Cụm camera quang học DRACO (Didymos Reconnaissance and Asteroid Camera for Optical navigation)
    // Hướng nhìn thẳng về phía trước (+Z)
    const dracoBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.35, 24), mats.titaniumTrimMat);
    dracoBase.rotateX(Math.PI / 2);
    dracoBase.position.set(0, 0.05, 0.62);
    dartGroup.add(dracoBase);

    const dracoBaffle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.28, 24), mats.carbonDarkMat);
    dracoBaffle.rotateX(Math.PI / 2);
    dracoBaffle.position.set(0, 0.05, 0.85);
    dartGroup.add(dracoBaffle);

    // Thấu kính quang học DRACO với độ phản quang pha lê xanh
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.09, 24), lensMat);
    lens.position.set(0, 0.05, 0.99);
    dartGroup.add(lens);

    // 3. Mảng pin mặt trời cuộn ROSA (Roll-Out Solar Arrays) dang rộng 2 bên (-X và +X)
    const rosaPanelMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      emissive: 0x0f172a,
      emissiveIntensity: 0.3,
      metalness: 0.85,
      roughness: 0.18
    });
    const rosaGoldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.2
    });

    [-1, 1].forEach(side => {
      // Trục kéo dài mảng pin (Boom rod)
      const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 12), mats.titaniumTrimMat);
      boom.rotateZ(Math.PI / 2);
      boom.position.set(side * 0.65, 0, 0);
      dartGroup.add(boom);

      // Tấm pin mặt trời ROSA
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.02, 0.72), rosaPanelMat);
      panel.position.set(side * 1.68, 0, 0);
      panel.castShadow = true;
      dartGroup.add(panel);

      // Viền khung trợ lực bằng sợi carbon/vàng
      const panelTrim = new THREE.Mesh(new THREE.BoxGeometry(1.69, 0.03, 0.04), rosaGoldTrimMat);
      panelTrim.position.set(side * 1.68, 0, 0.36);
      const panelTrimBack = panelTrim.clone();
      panelTrimBack.position.set(side * 1.68, 0, -0.36);
      dartGroup.add(panelTrim, panelTrimBack);

      // Đèn tín hiệu định vị đầu cánh (Nav Beacon)
      mats.addNavBeacon(new THREE.Vector3(side * 2.52, 0.02, 0), side > 0 ? 0x22c55e : 0xef4444);
    });

    // 4. Ăng-ten Parabol độ lợi cao (High-Gain Antenna - HGA)
    const hgaDish = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.06, 0.08, 24), mats.titaniumTrimMat);
    hgaDish.rotateZ(Math.PI / 6);
    hgaDish.position.set(0.35, 0.45, -0.15);
    dartGroup.add(hgaDish);

    const hgaHorn = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.14, 12), mats.carbonDarkMat);
    hgaHorn.rotateZ(Math.PI / 6);
    hgaHorn.position.set(0.38, 0.52, -0.15);
    dartGroup.add(hgaHorn);

    // 5. Động cơ ion NEXT-C và cụm đẩy phản lực khí Hydrazine RCS
    // Động cơ ion ở đuôi tàu (-Z)
    const ionEngine = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.22, 24), mats.carbonDarkMat);
    ionEngine.rotateX(Math.PI / 2);
    ionEngine.position.set(0, 0, -0.56);
    dartGroup.add(ionEngine);

    const ionGlow = new THREE.Mesh(new THREE.CircleGeometry(0.15, 24), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
    ionGlow.rotateY(Math.PI);
    ionGlow.position.set(0, 0, -0.68);
    dartGroup.add(ionGlow);

    // 4 cụm vòi phun RCS Hydrazine ở 4 góc
    [
      [-0.42, 0.42], [0.42, 0.42],
      [-0.42, -0.42], [0.42, -0.42]
    ].forEach(([rx, ry]) => {
      const rcs = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), mats.titaniumTrimMat);
      rcs.position.set(rx, ry, -0.42);
      dartGroup.add(rcs);
    });

    ship.add(dartGroup);
  }

  private buildMilanoChassis(ship: THREE.Group, mats: any) {
    const milanoOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xef6c00,
      metalness: 0.86,
      roughness: 0.18,
      map: this.getOrCreateHullTexture(),
      bumpMap: this.getOrCreateBumpTexture(),
      bumpScale: 0.035
    });

    const bodyGeo = new THREE.CylinderGeometry(0.12, 0.45, 2.0, 32);
    bodyGeo.rotateX(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, milanoOrangeMat);
    body.scale.set(1.15, 0.48, 1);
    body.position.set(0, 0.02, 0.1);
    body.castShadow = true;
    body.receiveShadow = true;
    ship.add(body);

    const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.28, 36, 24), mats.glassCanopyMat);
    canopy.position.set(0, 0.16, 0.35);
    canopy.scale.set(0.9, 0.5, 1.4);
    ship.add(canopy);

    const wingMainGeo = new THREE.BoxGeometry(2.6, 0.05, 0.85);
    const wingMain = new THREE.Mesh(wingMainGeo, mats.hullArmorMat);
    wingMain.position.set(0, 0.02, -0.2);
    wingMain.castShadow = true;
    wingMain.receiveShadow = true;
    ship.add(wingMain);

    const featherOffsets = [-1.15, -0.85, 0.85, 1.15];
    featherOffsets.forEach((fx) => {
      const feather = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.9), mats.starkGoldMat);
      feather.position.set(fx, 0.04, -0.65);
      feather.rotation.y = (fx > 0 ? 0.35 : -0.35);
      feather.rotation.z = (fx > 0 ? -0.1 : 0.1);
      feather.castShadow = true;
      ship.add(feather);
    });

    [-0.65, 0.65].forEach(cx => {
      const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.7, 32), mats.titaniumTrimMat);
      cannon.rotateX(Math.PI / 2);
      cannon.position.set(cx, -0.06, 0.1);
      cannon.castShadow = true;
      ship.add(cannon);
    });

    mats.addNavBeacon(new THREE.Vector3(-1.3, 0.05, -0.2), 0xef4444);
    mats.addNavBeacon(new THREE.Vector3(1.3, 0.05, -0.2), 0x22c55e);
  }

  private buildBenatarChassis(ship: THREE.Group, mats: any) {
    const prowGeo = new THREE.CylinderGeometry(0.1, 0.65, 2.2, 32);
    prowGeo.rotateX(Math.PI / 2);
    const prow = new THREE.Mesh(prowGeo, mats.hullArmorMat);
    prow.scale.set(1.3, 0.45, 1);
    prow.position.set(0, 0.02, 0.15);
    prow.castShadow = true;
    prow.receiveShadow = true;
    ship.add(prow);

    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.22, 0.9), mats.glassCanopyMat);
    bridge.position.set(0, 0.22, 0.25);
    ship.add(bridge);

    [-1, 1].forEach(side => {
      const wingGeo = new THREE.BoxGeometry(1.5, 0.08, 1.1);
      const wing = new THREE.Mesh(wingGeo, mats.carbonDarkMat);
      wing.position.set(side * 1.15, 0, -0.3);
      wing.rotation.y = side * -0.32;
      wing.castShadow = true;
      wing.receiveShadow = true;
      ship.add(wing);

      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.55, 0.8), mats.starkGoldMat);
      fin.position.set(side * 1.3, 0.25, -0.4);
      fin.rotation.z = side * -0.2;
      fin.castShadow = true;
      ship.add(fin);
    });
  }

  private buildSanctuaryChassis(ship: THREE.Group, mats: any) {
    const crescentGeo = new THREE.TorusGeometry(1.5, 0.28, 24, 64, Math.PI * 1.35);
    crescentGeo.rotateX(Math.PI / 2);
    const crescent = new THREE.Mesh(crescentGeo, mats.carbonDarkMat);
    crescent.castShadow = true;
    crescent.receiveShadow = true;
    ship.add(crescent);

    const citadel = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 1.4), mats.hullArmorMat);
    citadel.position.set(0, 0.3, 0.1);
    citadel.castShadow = true;
    citadel.receiveShadow = true;
    ship.add(citadel);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.9, 32), mats.titaniumTrimMat);
    spire.position.set(0, 0.8, -0.1);
    spire.castShadow = true;
    ship.add(spire);

    const railgun = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.2, 32), mats.starkGoldMat);
    railgun.rotateX(Math.PI / 2);
    railgun.position.set(0, -0.15, 0.4);
    railgun.castShadow = true;
    ship.add(railgun);

    for (let r = -2; r <= 2; r++) {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.4), mats.glowRedMat);
      vent.position.set(r * 0.45, 0.15, -0.4 + Math.abs(r) * 0.15);
      ship.add(vent);
    }
  }

  /**
   * Hệ thống Động cơ 3D Mô-đun (Dynamic Modular 3D Engines)
   * Thay đổi rõ rệt loa xả, cuộn siêu dẫn, và hiệu ứng tia plasma tùy theo lựa chọn
   */
  private buildModularEngines(engineId: string, ship: THREE.Group, mats: any) {
    if (engineId === 'repulsor') {
      [-0.28, 0.28].forEach(x => {
        const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.45, 32), mats.titaniumTrimMat);
        nacelle.rotateX(Math.PI / 2);
        nacelle.position.set(x, 0.02, -0.98);
        nacelle.castShadow = true;

        const goldBand = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.015, 12, 28), mats.starkGoldMat);
        goldBand.position.set(x, 0.02, -0.92);

        const shockRing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.012, 12, 24), mats.glowCyanMat);
        shockRing.position.set(x, 0.02, -1.35);

        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.55, 24), mats.glowCyanMat);
        flame.rotateX(-Math.PI / 2);
        flame.position.set(x, 0.02, -1.5);
        this.thrusterPlumes.push(flame);

        ship.add(nacelle, goldBand, shockRing, flame);
      });
    } else if (engineId === 'nova_warp') {
      const mainBell = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 0.55, 36), mats.titaniumTrimMat);
      mainBell.rotateX(Math.PI / 2);
      mainBell.position.set(0, 0.04, -1.02);
      mainBell.castShadow = true;

      const singSphere = new THREE.Mesh(new THREE.SphereGeometry(0.14, 28, 28), mats.glowMagentaMat);
      singSphere.position.set(0, 0.04, -1.2);

      const warpRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.022, 16, 36), mats.starkGoldMat);
      warpRing1.position.set(0, 0.04, -1.08);
      const warpRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.018, 16, 36), mats.glowCyanMat);
      warpRing2.position.set(0, 0.04, -1.22);
      this.rotatingElements.push({ obj: warpRing1, speedZ: 0.025 });
      this.rotatingElements.push({ obj: warpRing2, speedZ: -0.04 });

      const warpFlame = new THREE.Mesh(new THREE.ConeGeometry(0.20, 1.35, 32), new THREE.MeshBasicMaterial({ color: 0xc026d3, transparent: true, opacity: 0.85 }));
      warpFlame.rotateX(-Math.PI / 2);
      warpFlame.position.set(0, 0.04, -1.95);
      this.thrusterPlumes.push(warpFlame);
      ship.add(mainBell, singSphere, warpRing1, warpRing2, warpFlame);
    } else {
      // Tesseract Pulse Engine (Mặc định)
      [-0.30, 0.30].forEach(x => {
        const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.19, 0.55, 32), mats.carbonDarkMat);
        bell.rotateX(Math.PI / 2);
        bell.position.set(x, 0.02, -1.02);
        bell.castShadow = true;

        [-0.85, -0.98, -1.12].forEach(z => {
          const coil = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.018, 12, 28), mats.glowCyanMat);
          coil.position.set(x, 0.02, z);
          ship.add(coil);
        });

        const outerPlume = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.95, 32), new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.75 }));
        outerPlume.rotateX(-Math.PI / 2);
        outerPlume.position.set(x, 0.02, -1.75);

        const innerCore = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.65, 24), mats.glowWhiteMat);
        innerCore.rotateX(-Math.PI / 2);
        innerCore.position.set(x, 0.02, -1.55);

        this.thrusterPlumes.push(outerPlume, innerCore);
        ship.add(bell, outerPlume, innerCore);
      });
    }
  }

  private buildModularPowerCore(powerId: string, ship: THREE.Group, mats: any) {
    if (powerId === 'solar_wings') {
      [-1, 1].forEach(side => {
        const spar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.025, 0.04), mats.carbonDarkMat);
        spar.position.set(side * 2.2, -0.08, -0.25);
        ship.add(spar);

        for (let p = 0; p < 4; p++) {
          const panel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.015, 6), new THREE.MeshStandardMaterial({
            color: 0x1e3a8a, metalness: 0.95, roughness: 0.1, emissive: 0x172554, emissiveIntensity: 0.2
          }));
          panel.position.set(side * (1.75 + p * 0.32), -0.08, -0.25);
          panel.rotation.x = Math.PI / 2;
          panel.castShadow = true;
          ship.add(panel);
        }
      });
    } else if (powerId === 'vibranium_core') {
      const matrixBase = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.9), mats.carbonDarkMat);
      matrixBase.position.set(0, 0.16, 0.0);
      const vibCore = new THREE.Mesh(new THREE.SphereGeometry(0.13, 28, 28), mats.glowPurpleMat);
      vibCore.position.set(0, 0.18, 0.0);
      ship.add(matrixBase, vibCore);
    } else if (powerId === 'tesseract_core') {
      const outerCube = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), new THREE.MeshStandardMaterial({
        color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.6, transparent: true, opacity: 0.72, roughness: 0.05
      }));
      outerCube.position.set(0, 0.26, 0.0);
      const innerCube = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.11), mats.glowWhiteMat);
      innerCube.position.set(0, 0.26, 0.0);
      this.rotatingElements.push({ obj: innerCube, speedX: 0.03, speedY: 0.04, speedZ: 0.02 });
      this.rotatingElements.push({ obj: outerCube, speedY: -0.015 });
      ship.add(outerCube, innerCube);
    } else {
      // Stark Arc Reactor Mark 85 (Mặc định)
      const casing = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.08, 36), mats.starkGoldMat);
      casing.position.set(0, 0.16, 0.0);
      ship.add(casing);

      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * Math.PI * 2;
        const coil = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.07, 0.07), mats.titaniumTrimMat);
        coil.position.set(Math.cos(ang) * 0.17, 0.17, Math.sin(ang) * 0.17);
        coil.rotation.y = -ang;
        ship.add(coil);
      }

      const arcLens = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), mats.glowCyanMat);
      arcLens.position.set(0, 0.17, 0.0);
      ship.add(arcLens);
    }
  }

  private buildModularTechPayloads(techIds: Set<string>, ship: THREE.Group, mats: any) {
    if (techIds.has('cerebro')) {
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.04, 0.06, 24), mats.titaniumTrimMat);
      dish.position.set(0, 0.23, -0.42);
      dish.rotation.x = -0.2;
      const glowEmitter = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), mats.glowCyanMat);
      glowEmitter.position.set(0, 0.27, -0.42);
      ship.add(dish, glowEmitter);
    }

    if (techIds.has('dark_matter')) {
      [-0.24, 0.24].forEach(ax => {
        const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.45, 12), mats.starkGoldMat);
        ant.position.set(ax, 0.35, -0.5);
        ant.rotation.x = -0.35;
        ant.rotation.z = ax > 0 ? -0.15 : 0.15;
        const antCoil = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.008, 8, 16), mats.glowOrangeMat);
        antCoil.position.set(ax, 0.42, -0.53);
        antCoil.rotation.x = Math.PI / 2;
        ship.add(ant, antCoil);
      });
    }

    if (techIds.has('sonic_radar')) {
      const sonicCone = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 16), mats.glowPurpleMat);
      sonicCone.rotateX(-Math.PI / 2);
      sonicCone.position.set(0, -0.11, 0.85);
      ship.add(sonicCone);
    }

    if (techIds.has('pym_bay')) {
      [-0.52, 0.52].forEach(px => {
        const canister = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16), mats.glowRedMat);
        canister.rotateX(Math.PI / 2);
        canister.position.set(px, -0.08, -0.15);
        ship.add(canister);
      });
    }

    if (techIds.has('kree_array')) {
      const mast = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.38, 0.06), mats.starkGoldMat);
      mast.position.set(0, 0.35, -0.62);
      const fin1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.04), mats.glowCyanMat);
      fin1.position.set(0, 0.48, -0.62);
      ship.add(mast, fin1);
    }
  }

  /**
   * Craft-Tailored Decal Placements
   * Ensures national flags and NASA lettering are uniquely positioned, rotated, and scaled
   * for each individual ship design.
   */
  private getDecalPlacementsForCraft(craftId: string): { type: 'flag' | 'nasa'; pos: [number, number, number]; rot: [number, number, number]; size: [number, number] }[] {
    switch (craftId) {
      case 'hyperion':
        return [
          // Broadside Port Armor Sponson
          { type: 'flag', pos: [-0.75, 0.08, 0.35], rot: [0, -Math.PI / 2, 0], size: [0.85, 0.52] },
          // Broadside Starboard Armor Sponson
          { type: 'nasa', pos: [0.75, 0.08, 0.35], rot: [0, Math.PI / 2, 0], size: [1.1, 0.4] },
          // Bridge Citadel Cheek Port
          { type: 'flag', pos: [-0.26, 0.48, -0.45], rot: [0, -Math.PI / 2, 0], size: [0.42, 0.26] },
          // Bridge Citadel Cheek Starboard
          { type: 'nasa', pos: [0.26, 0.48, -0.45], rot: [0, Math.PI / 2, 0], size: [0.48, 0.18] },
          // Forward Chisel Prow Armor Deck
          { type: 'nasa', pos: [0, 0.35, 1.25], rot: [-Math.PI / 2 + 0.1, 0, 0], size: [0.75, 0.28] }
        ];

      case 'ghostwing':
        return [
          // Forward-swept Port Delta Wing
          { type: 'flag', pos: [-0.95, 0.038, 0.18], rot: [-Math.PI / 2, 0, 0.42], size: [0.48, 0.3] },
          // Forward-swept Starboard Delta Wing
          { type: 'nasa', pos: [0.95, 0.038, 0.18], rot: [-Math.PI / 2, 0, -0.42], size: [0.62, 0.22] },
          // Canted Port V-Tail
          { type: 'flag', pos: [-0.42, 0.38, -0.65], rot: [-0.35, 0, 0.55], size: [0.35, 0.22] },
          // Canted Starboard V-Tail
          { type: 'nasa', pos: [0.42, 0.38, -0.65], rot: [-0.35, 0, -0.55], size: [0.42, 0.18] },
          // Nose Stealth Chine
          { type: 'nasa', pos: [0, 0.16, 0.85], rot: [-Math.PI / 2 + 0.08, 0, 0], size: [0.45, 0.16] }
        ];

      case 'shuttle':
        return [
          // Port Wing Flag (Discovery authentic markings)
          { type: 'flag', pos: [-0.62, 0.04, -0.15], rot: [-Math.PI / 2, 0, 0], size: [0.36, 0.22] },
          // Starboard Wing NASA Insignia
          { type: 'nasa', pos: [0.62, 0.04, -0.15], rot: [-Math.PI / 2, 0, 0], size: [0.42, 0.15] },
          // Vertical Stabilizer Fin Starboard
          { type: 'nasa', pos: [0.03, 0.52, -0.65], rot: [0, Math.PI / 2, 0], size: [0.30, 0.11] }
        ];

      case 'milano':
        return [
          // Avian Port Swept Gull Wing
          { type: 'flag', pos: [-0.88, 0.12, -0.15], rot: [-Math.PI / 2, 0, -0.35], size: [0.48, 0.3] },
          // Avian Starboard Swept Gull Wing
          { type: 'nasa', pos: [0.88, 0.12, -0.15], rot: [-Math.PI / 2, 0, 0.35], size: [0.6, 0.2] },
          // Cockpit Canopy Hood
          { type: 'nasa', pos: [0, 0.22, 0.35], rot: [-Math.PI / 2 + 0.2, 0, 0], size: [0.5, 0.18] }
        ];

      case 'benatar':
        return [
          // Central Command Bridge Deck
          { type: 'nasa', pos: [0, 0.28, 0.2], rot: [-Math.PI / 2, 0, 0], size: [0.75, 0.26] },
          // Port Forward Swept Wing
          { type: 'flag', pos: [-1.15, 0.12, -0.2], rot: [-Math.PI / 2, 0, -0.2], size: [0.6, 0.38] },
          // Starboard Forward Swept Wing
          { type: 'nasa', pos: [1.15, 0.12, -0.2], rot: [-Math.PI / 2, 0, 0.2], size: [0.75, 0.26] }
        ];

      case 'sanctuary':
        return [
          // Port Battlement Armor Wing
          { type: 'flag', pos: [-1.4, 0.18, 0.1], rot: [-Math.PI / 2, 0, 0], size: [1.1, 0.7] },
          // Starboard Battlement Armor Wing
          { type: 'nasa', pos: [1.4, 0.18, 0.1], rot: [-Math.PI / 2, 0, 0], size: [1.4, 0.5] },
          // Central Superstructure Deck
          { type: 'nasa', pos: [0, 0.55, -0.2], rot: [-Math.PI / 2, 0, 0], size: [0.95, 0.32] }
        ];

      case 'apollo_lm':
        return [
          // Descent Stage Front Quadrant
          { type: 'flag', pos: [0, 0.35, 0.72], rot: [0, 0, 0], size: [0.45, 0.28] },
          // Descent Stage Port Quadrant
          { type: 'nasa', pos: [-0.72, 0.35, 0], rot: [0, -Math.PI / 2, 0], size: [0.45, 0.2] }
        ];

      case 'voyager':
        return [
          // Instrument Bus Side
          { type: 'flag', pos: [-0.35, 0.1, 0.2], rot: [0, -Math.PI / 2, 0], size: [0.35, 0.22] },
          // Reflector Dish Backing
          { type: 'nasa', pos: [0.35, 0.1, 0.2], rot: [0, Math.PI / 2, 0], size: [0.4, 0.16] }
        ];

      case 'quinjet':
      default:
        return [
          // Port Delta Wing Upper Surface
          { type: 'flag', pos: [-0.92, 0.065, -0.15], rot: [-Math.PI / 2, 0, -0.22], size: [0.55, 0.35] },
          // Starboard Delta Wing Upper Surface
          { type: 'nasa', pos: [0.92, 0.065, -0.15], rot: [-Math.PI / 2, 0, 0.22], size: [0.70, 0.24] },
          // Port Canted Rudder
          { type: 'flag', pos: [-0.62, 0.42, -0.75], rot: [0, -Math.PI / 2, -0.32], size: [0.38, 0.22] },
          // Starboard Canted Rudder
          { type: 'nasa', pos: [0.62, 0.42, -0.75], rot: [0, Math.PI / 2, 0.32], size: [0.44, 0.18] },
          // Dorsal Spine
          { type: 'nasa', pos: [0, 0.21, -0.10], rot: [-Math.PI / 2, 0, 0], size: [0.68, 0.22] }
        ];
    }
  }

  /**
   * Mount 4K Precision Vexillological National Flag & Official NASA Decals onto spacecraft
   */
  private buildNationalLiveryDecals(ship: THREE.Group, flagId: string, craftId?: string) {
    const activeCraft = craftId || (this.isCustomModelLoaded ? 'custom' : this.selectedChassisId);
    const flagTex = generateFlagCanvasTexture(flagId);
    const nasaTex = generateNasaDecalTexture();

    const flagMat = new THREE.MeshBasicMaterial({
      map: flagTex,
      transparent: true,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -4.0
    });

    const nasaMat = new THREE.MeshBasicMaterial({
      map: nasaTex,
      transparent: true,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -4.0
    });

    if (this.isCustomModelLoaded && this.customModel) {
      const bbox = new THREE.Box3().setFromObject(this.customModel);
      const topY = bbox.max.y + 0.015;
      const midZ = (bbox.min.z + bbox.max.z) / 2;
      const spanX = Math.max(0.4, (bbox.max.x - bbox.min.x) * 0.25);

      // Port side: Flag
      const flagPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.3), flagMat);
      flagPlane.rotateX(-Math.PI / 2);
      flagPlane.position.set(-spanX, topY, midZ);
      ship.add(flagPlane);

      // Starboard side: NASA logo
      const nasaPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.22), nasaMat);
      nasaPlane.rotateX(-Math.PI / 2);
      nasaPlane.position.set(spanX, topY, midZ);
      ship.add(nasaPlane);
      return;
    }

    const placements = this.getDecalPlacementsForCraft(activeCraft);
    placements.forEach(p => {
      const geo = new THREE.PlaneGeometry(p.size[0], p.size[1]);
      const mesh = new THREE.Mesh(geo, p.type === 'flag' ? flagMat : nasaMat);
      mesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
      mesh.rotation.set(p.rot[0], p.rot[1], p.rot[2]);
      ship.add(mesh);
    });
  }

  /**
   * Attach dynamic engine flame thruster plumes to model aft
   */
  private attachEnginePlumes(parent: THREE.Group, model: THREE.Object3D) {
    const bbox = new THREE.Box3().setFromObject(model);
    const aftZ = bbox.min.z - 0.08;
    const midY = (bbox.min.y + bbox.max.y) * 0.5;
    const spanX = Math.max(0.2, (bbox.max.x - bbox.min.x) * 0.28);
    const glowCyan = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    
    [-spanX, spanX].forEach(x => {
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.75, 24), glowCyan);
      flame.rotateX(-Math.PI / 2);
      flame.position.set(x, midY, aftZ);
      this.thrusterPlumes.push(flame);
      parent.add(flame);
    });
  }

  /**
   * Read and import 3D model asset from user computer (.glb, .gltf, .obj)
   */
  private loadCustom3DModel(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const toast = document.getElementById('import-3d-toast');
    const showToast = (msg: string, isError = false) => {
      if (!toast) return;
      toast.textContent = msg;
      toast.style.display = 'block';
      toast.style.borderColor = isError ? '#ef4444' : '#00f0ff';
      toast.style.color = isError ? '#ef4444' : '#00f0ff';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 5000);
    };

    const t = getTexts(this.currentLanguage);
    showToast(formatTpl(t.toastLoading, { file: file.name }));

    if (ext === 'glb' || ext === 'gltf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const loader = new GLTFLoader();
          loader.parse(buffer, '', (gltf) => {
            this.applyCustom3DModel(gltf.scene, file.name);
            showToast(formatTpl(getTexts(this.currentLanguage).toastLoadedGltf, { file: file.name }));
          }, (err: any) => {
            console.error(err);
            showToast(formatTpl(getTexts(this.currentLanguage).toastErrParseGltf, { err: err?.message || String(err) }), true);
          });
        } catch (err) {
          console.error(err);
          showToast(formatTpl(getTexts(this.currentLanguage).toastErrReadGltf, { err: (err as any)?.message || String(err) }), true);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (ext === 'obj') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const loader = new OBJLoader();
          const obj = loader.parse(text);
          this.applyCustom3DModel(obj, file.name);
          showToast(formatTpl(getTexts(this.currentLanguage).toastLoadedObj, { file: file.name }));
        } catch (err) {
          console.error(err);
          showToast(formatTpl(getTexts(this.currentLanguage).toastErrParseObj, { err: (err as any)?.message || String(err) }), true);
        }
      };
      reader.readAsText(file);
    } else {
      showToast(formatTpl(t.toastErrUnsupported, { ext: ext || '?' }), true);
    }
  }

  /**
   * Chuẩn hóa kích thước, căn giữa bệ phóng và kích hoạt đổ bóng 4K cho mô hình nhập vào
   */
  private applyCustom3DModel(model: THREE.Object3D, fileName: string) {
    this.isCustomModelLoaded = true;
    this.customModel = model;
    this.customModelName = fileName;

    // Chuẩn hóa tỷ lệ và tọa độ trung tâm
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
    const targetScale = 3.2 / maxDim;

    model.position.set(-center.x * targetScale, -center.y * targetScale + 0.15, -center.z * targetScale);
    model.scale.set(targetScale, targetScale, targetScale);

    // Kích hoạt bóng đổ PBR 4K cho toàn bộ mesh
    model.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (!child.material) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x334155,
            metalness: 0.85,
            roughness: 0.25
          });
        }
      }
    });

    this.rebuild3DShipModel();

    // Cập nhật tên tàu trên HUD
    const shipTitle = document.getElementById('hangar-ship-name');
    const shipClass = document.getElementById('hangar-ship-class');
    if (shipTitle) shipTitle.textContent = fileName.toUpperCase().replace(/\.[^/.]+$/, "");
    if (shipClass) shipClass.textContent = getTexts(this.currentLanguage).customAssetClass;
    this.playEquipSound();
  }

  public getSelectedCraftName(): string {
    if (this.isCustomModelLoaded && this.customModelName) {
      return this.customModelName.replace(/\.[^/.]+$/, '');
    }
    const loc = getSpacecraftText(this.selectedChassisId, this.currentLanguage);
    if (loc) return loc.name;
    const c = SPACECRAFT_FLEET.find(it => it.id === this.selectedChassisId);
    return c ? c.name : 'Orbital Spacecraft';
  }

  /**
   * Tạo mô hình chiến hạm thực tế phục vụ chuyến bay quỹ đạo vũ trụ (In-Flight Model)
   * Đồng bộ 100% thân tàu, động cơ và lõi năng lượng với Hangar
   */
  public createFlightShipModel(): THREE.Group {
    const flightGroup = new THREE.Group();
    flightGroup.name = "nasa_flight_ship";

    const currentCraft = SPACECRAFT_FLEET.find(c => c.id === this.selectedChassisId);

    if (this.isCustomModelLoaded && this.customModel) {
      const cloned = this.customModel.clone(true);
      flightGroup.add(cloned);
      this.buildNationalLiveryDecals(flightGroup, this.selectedFlagId);
    } else if (currentCraft && currentCraft.modelUrl && this.loadedGlbCache.has(currentCraft.id)) {
      const cloned = this.loadedGlbCache.get(currentCraft.id)!.clone(true);
      flightGroup.add(cloned);
      this.buildNationalLiveryDecals(flightGroup, this.selectedFlagId);
    } else {
      const hullTex = this.getOrCreateHullTexture();
      const bumpTex = this.getOrCreateBumpTexture();
      const roughTex = this.getOrCreateRoughnessTexture();

      // Sử dụng vật liệu sắc nét với độ phát quang (emissive) nhẹ để nổi bật trong không gian vũ trụ
      const hullArmorMat = new THREE.MeshStandardMaterial({
        color: 0x2e3d54,
        emissive: 0x0f172a,
        emissiveIntensity: 0.4,
        metalness: 0.85,
        roughness: 0.22,
        map: hullTex,
        bumpMap: bumpTex,
        bumpScale: 0.04
      });

      const starkGoldMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xb45309,
        emissiveIntensity: 0.35,
        metalness: 0.95,
        roughness: 0.15
      });

      const carbonDarkMat = new THREE.MeshStandardMaterial({
        color: 0x182234,
        emissive: 0x090e1a,
        emissiveIntensity: 0.3,
        metalness: 0.9,
        roughness: 0.28
      });

      const glassCanopyMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0369a1,
        emissiveIntensity: 0.5,
        metalness: 0.95,
        roughness: 0.05,
        transparent: true,
        opacity: 0.85
      });

      const titaniumTrimMat = new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        metalness: 0.95,
        roughness: 0.15
      });

      const glowCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const glowOrangeMat = new THREE.MeshBasicMaterial({ color: 0xff7700 });
      const glowRedMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const glowPurpleMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
      const glowMagentaMat = new THREE.MeshBasicMaterial({ color: 0xd946ef });
      const glowWhiteMat = new THREE.MeshBasicMaterial({ color: 0xf0fdfa });

      const mats = {
        hullArmorMat,
        starkGoldMat,
        carbonDarkMat,
        glassCanopyMat,
        titaniumTrimMat,
        glowCyanMat,
        glowOrangeMat,
        glowRedMat,
        glowPurpleMat,
        glowMagentaMat,
        glowWhiteMat,
        addNavBeacon: (pos: THREE.Vector3, colorHex: number) => {
          const b = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshBasicMaterial({ color: colorHex }));
          b.position.copy(pos);
          flightGroup.add(b);
        }
      };

      if (this.selectedChassisId === 'dart_impactor') {
        this.buildDartChassis(flightGroup, mats);
      } else if (this.selectedChassisId === 'milano') {
        this.buildMilanoChassis(flightGroup, mats);
      } else if (this.selectedChassisId === 'sanctuary') {
        this.buildSanctuaryChassis(flightGroup, mats);
      } else if (this.selectedChassisId === 'benatar') {
        this.buildBenatarChassis(flightGroup, mats);
      } else if (this.selectedChassisId === 'hyperion') {
        this.buildHyperionChassis(flightGroup, mats);
      } else if (this.selectedChassisId === 'ghostwing') {
        this.buildGhostwingChassis(flightGroup, mats);
      } else if (this.selectedChassisId === 'quinjet') {
        this.buildQuinjetChassis(flightGroup, mats);
      } else {
        this.buildSpaceShuttleChassis(flightGroup, mats);
      }

      this.buildModularPowerCore(this.selectedPowerId, flightGroup, mats);
      this.buildModularEngines(this.selectedEngineId, flightGroup, mats);
      this.buildModularTechPayloads(this.selectedTechIds, flightGroup, mats);
      this.buildNationalLiveryDecals(flightGroup, this.selectedFlagId);
    }

    // Đèn chiếu sáng thân tàu cục bộ
    const localLight = new THREE.PointLight(0xbae6fd, 1.5, 60 / AU);
    localLight.position.set(0, 8 / AU, 0);
    flightGroup.add(localLight);

    // Xoay 90 độ quanh trục Y để mũi tàu (+Z) quay sang hướng chuyển động (+X) của WebGL-Orbiter
    flightGroup.rotation.y = Math.PI / 2;

    // Chuẩn hóa tỷ lệ kích thước vật lý (~22 / AU)
    const scaleFactor = 22 / AU;
    flightGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

    return flightGroup;
  }

  private renderMissions() {
    const list = document.getElementById('marvel-missions-list');
    if (!list) return;
    list.innerHTML = '';

    const t = getTexts(this.currentLanguage);

    NASA_MISSIONS.forEach(m => {
      const loc = getMissionText(m.id, this.currentLanguage);
      const title = loc ? loc.title : m.title;
      const dest = loc ? loc.destination : m.destination;
      const badge = loc ? loc.badge : m.badge;
      const desc = loc ? loc.description : m.description;
      const budgetText = `${formatNum(m.budgetCredits, this.currentLanguage)}M`;
      const reqText = formatNum(m.reqDeltaV, this.currentLanguage);

      const item = document.createElement('div');
      item.className = `nasa-mission-item ${m.id === this.selectedMission.id ? 'active' : ''}`;
      item.title = desc;
      item.innerHTML = `
        <div style="font-size: 0.72rem; color: var(--stark-gold); font-weight: 700; margin-bottom: 2px;">${badge}</div>
        <div class="mission-name">${title}</div>
        <div class="mission-dest">📍 ${dest}</div>
        <div class="mission-meta">
          <span>${formatTpl(t.missionBudgetMeta, { budget: `<strong>${budgetText}</strong>` })}</span>
          <span>${formatTpl(t.reqDeltaVMeta, { req: `<strong>${reqText}</strong>` })}</span>
        </div>
      `;
      item.onclick = () => {
        this.selectedMission = m;
        if (m.id === 'nasa_dart' && this.selectedChassisId !== 'dart_impactor') {
          this.selectedChassisId = 'dart_impactor';
          this.rebuild3DShipModel();
        }
        this.playClickSound();
        this.renderMissions();
        this.updateLiveTelemetry();
      };
      list.appendChild(item);
    });

    if (this.selectedMission.id === 'nasa_dart') {
      const dartBrief = document.createElement('div');
      dartBrief.className = 'dart-brief-card';
      dartBrief.id = 'dart-brief-banner';
      dartBrief.style.cssText = `
        margin-top: 10px;
        padding: 10px;
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(245, 158, 11, 0.4);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      `;
      const isGuidanceOn = !this.dartSimulation || this.dartSimulation.guidanceAssistEnabled;
      dartBrief.innerHTML = `
        <div style="font-size: 0.75rem; font-weight: 700; color: #f59e0b; margin-bottom: 4px;">🎯 ${t.dartBriefTitle}</div>
        <div style="font-size: 0.72rem; color: #cbd5e1; line-height: 1.4; margin-bottom: 6px;">${t.dartBriefDesc}</div>
        <div style="font-size: 0.7rem; color: #94a3b8; line-height: 1.35; margin-bottom: 8px;">
          <div>• <strong style="color: #38bdf8;">${t.dartTargetDimorphos}</strong></div>
          <div>• <strong style="color: #e2e8f0;">${t.dartPrimaryDidymos}</strong></div>
          <div style="margin-top: 2px;">• ${t.dartObjectiveInfo}</div>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
          <span style="font-size: 0.68rem; color: #38bdf8;">${t.dartGuidanceAssistLabel}:</span>
          <button id="btn-toggle-dart-guidance-lobby" style="padding: 2px 8px; font-size: 0.68rem; border-radius: 4px; border: 1px solid ${isGuidanceOn ? '#22c55e' : '#94a3b8'}; background: ${isGuidanceOn ? 'rgba(34, 197, 94, 0.2)' : 'rgba(100, 116, 139, 0.2)'}; color: ${isGuidanceOn ? '#4ade80' : '#cbd5e1'}; cursor: pointer;">
            ${isGuidanceOn ? t.dartGuidanceActive : t.dartGuidanceManual}
          </button>
        </div>
      `;
      list.appendChild(dartBrief);

      dartBrief.querySelector('#btn-toggle-dart-guidance-lobby')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playClickSound();
        if (!this.dartSimulation) this.dartSimulation = new DartSimulation();
        this.dartSimulation.guidanceAssistEnabled = !this.dartSimulation.guidanceAssistEnabled;
        this.renderMissions();
      });
    }

    const creditEl = document.getElementById('mission-budget-display');
    if (creditEl) creditEl.textContent = `${formatNum(this.selectedMission.budgetCredits, this.currentLanguage, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
  }

  private renderArmoryGrid() {
    const grid = document.getElementById('armory-items-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const t = getTexts(this.currentLanguage);

    if (this.activeTab === 'chassis') {
      SPACECRAFT_FLEET.forEach(it => {
        const isEq = it.id === this.selectedChassisId;
        const loc = getSpacecraftText(it.id, this.currentLanguage);
        const name = loc ? loc.name : it.name;
        const badge = (loc && loc.badge) ? loc.badge : it.badge;
        const desc = loc ? loc.desc : it.desc;
        const card = document.createElement('div');
        card.className = `armory-card ${it.rarity} ${isEq ? 'equipped' : ''}`;
        card.innerHTML = `
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
              <span class="armory-item-name">${name}</span>
              <span class="armory-item-badge" style="font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; background: rgba(56, 189, 248, 0.15); color: #00f0ff; font-family: monospace; font-weight: 700;">${badge}</span>
            </div>
            <div class="armory-item-stats">${formatTpl(t.cardChassisStats, { mass: formatNum(it.mass, this.currentLanguage), cost: formatNum(it.cost, this.currentLanguage), cap: it.cap })}</div>
            <div style="font-size: 0.7rem; color: #a0b5d0; margin-top: 4px;">${desc}</div>
          </div>
          <div class="armory-item-perk">${isEq ? t.equipped : t.clickToEquip}</div>
        `;
        card.onclick = () => {
          this.isCustomModelLoaded = false;
          this.selectedChassisId = it.id;
          this.playEquipSound();
          this.rebuild3DShipModel();
          this.updateHeaderShipInfo();
          this.renderArmoryGrid();
          this.updateLiveTelemetry();
          this.onShipChangedCallback?.();
        };
        grid.appendChild(card);
      });
    } else if (this.activeTab === 'flags') {
      SUPPORTED_FLAGS.forEach(flag => {
        const isEq = flag.id === this.selectedFlagId;
        const loc = getFlagText(flag.id, this.currentLanguage);
        const name = loc ? loc.name : flag.name;
        const agency = loc ? loc.agency : flag.agency;
        const country = loc ? loc.country : flag.country;
        const card = document.createElement('div');
        card.className = `armory-card legendary ${isEq ? 'equipped' : ''}`;
        card.innerHTML = `
          <div style="display: flex; gap: 12px; align-items: center;">
            <span style="font-size: 2.2rem;">${flag.badge.split(' ')[0]}</span>
            <div>
              <div class="armory-item-name">${name}</div>
              <div class="armory-item-stats" style="color: var(--stark-cyan);">${agency}</div>
              <div style="font-size: 0.7rem; color: #a0b5d0; margin-top: 4px;">${formatTpl(t.cardFlagStats, { ratio: flag.ratio, country })}</div>
            </div>
          </div>
          <div class="armory-item-perk" style="color: ${isEq ? 'var(--stark-cyan)' : 'var(--stark-gold)'};">
            ${isEq ? t.equippedLivery : t.clickToApply}
          </div>
        `;
        card.onclick = () => {
          this.selectedFlagId = flag.id;
          this.playEquipSound();
          this.rebuild3DShipModel();
          this.renderArmoryGrid();
          this.onShipChangedCallback?.();
        };
        grid.appendChild(card);
      });
    } else if (this.activeTab === 'power') {
      const items = [
        { id: 'solar_wings', mass: 85, cost: 35, power: 1500, rarity: 'epic' },
        { id: 'arc_reactor', mass: 180, cost: 195, power: 2200, rarity: 'mythic' },
        { id: 'vibranium_core', mass: 130, cost: 220, power: 1900, rarity: 'legendary' },
        { id: 'tesseract_core', mass: 280, cost: 380, power: 4500, rarity: 'mythic' }
      ];

      items.forEach(it => {
        const isEq = it.id === this.selectedPowerId;
        const loc = getPowerText(it.id, this.currentLanguage);
        const name = loc ? loc.name : it.id;
        const desc = loc ? loc.desc : '';
        const card = document.createElement('div');
        card.className = `armory-card ${it.rarity} ${isEq ? 'equipped' : ''}`;
        card.innerHTML = `
          <div>
            <div class="armory-item-name">${name}</div>
            <div class="armory-item-stats">${formatTpl(t.cardPowerStats, { mass: formatNum(it.mass, this.currentLanguage), cost: formatNum(it.cost, this.currentLanguage), power: formatNum(it.power, this.currentLanguage) })}</div>
            <div style="font-size: 0.7rem; color: #a0b5d0; margin-top: 4px;">${desc}</div>
          </div>
          <div class="armory-item-perk">${isEq ? t.equipped : t.clickToEquip}</div>
        `;
        card.onclick = () => {
          this.selectedPowerId = it.id;
          this.playEquipSound();
          this.rebuild3DShipModel();
          this.renderArmoryGrid();
          this.updateLiveTelemetry();
          this.onShipChangedCallback?.();
        };
        grid.appendChild(card);
      });
    } else if (this.activeTab === 'tech') {
      const items = [
        { id: 'cerebro', mass: 40, cost: 35, power: 70, points: 45, rarity: 'epic' },
        { id: 'dark_matter', mass: 65, cost: 65, power: 140, points: 70, rarity: 'legendary' },
        { id: 'sonic_radar', mass: 120, cost: 110, power: 280, points: 110, rarity: 'legendary' },
        { id: 'pym_bay', mass: 90, cost: 140, power: 310, points: 130, rarity: 'mythic' },
        { id: 'kree_array', mass: 30, cost: 28, power: 45, points: 40, rarity: 'epic' }
      ];

      items.forEach(it => {
        const isEq = this.selectedTechIds.has(it.id);
        const loc = getTechText(it.id, this.currentLanguage);
        const name = loc ? loc.name : it.id;
        const desc = loc ? loc.desc : '';
        const card = document.createElement('div');
        card.className = `armory-card ${it.rarity} ${isEq ? 'equipped' : ''}`;
        card.innerHTML = `
          <div>
            <div class="armory-item-name">${name}</div>
            <div class="armory-item-stats">${formatTpl(t.cardTechStats, { mass: formatNum(it.mass, this.currentLanguage), cost: formatNum(it.cost, this.currentLanguage), power: formatNum(it.power, this.currentLanguage) })}</div>
            <div style="font-size: 0.7rem; color: #a0b5d0; margin-top: 4px;">${desc}</div>
          </div>
          <div class="armory-item-perk" style="color: var(--stark-cyan);">${isEq ? formatTpl(t.equippedScience, { points: it.points }) : `+ ${t.clickToEquip}`}</div>
        `;
        card.onclick = () => {
          if (this.selectedTechIds.has(it.id)) {
            this.selectedTechIds.delete(it.id);
          } else {
            this.selectedTechIds.add(it.id);
          }
          this.playEquipSound();
          this.rebuild3DShipModel();
          this.renderArmoryGrid();
          this.updateLiveTelemetry();
          this.onShipChangedCallback?.();
        };
        grid.appendChild(card);
      });
    } else if (this.activeTab === 'engines') {
      const items = [
        { id: 'repulsor', dryMass: 40, fuelMass: 850, cost: 25, isp: 260, rarity: 'epic' },
        { id: 'tesseract_drive', dryMass: 90, fuelMass: 2400, cost: 80, isp: 345, rarity: 'legendary' },
        { id: 'nova_warp', dryMass: 65, fuelMass: 550, cost: 160, isp: 4400, rarity: 'mythic' }
      ];

      items.forEach(it => {
        const isEq = it.id === this.selectedEngineId;
        const loc = getEngineText(it.id, this.currentLanguage);
        const name = loc ? loc.name : it.id;
        const desc = loc ? loc.desc : '';
        const card = document.createElement('div');
        card.className = `armory-card ${it.rarity} ${isEq ? 'equipped' : ''}`;
        card.innerHTML = `
          <div>
            <div class="armory-item-name">${name}</div>
            <div class="armory-item-stats">${formatTpl(t.cardEngineStats, { isp: formatNum(it.isp, this.currentLanguage), fuel: formatNum(it.fuelMass, this.currentLanguage), cost: formatNum(it.cost, this.currentLanguage) })}</div>
            <div style="font-size: 0.7rem; color: #a0b5d0; margin-top: 4px;">${desc}</div>
          </div>
          <div class="armory-item-perk">${isEq ? t.equipped : t.clickToEquip}</div>
        `;
        card.onclick = () => {
          this.selectedEngineId = it.id;
          this.playEquipSound();
          this.rebuild3DShipModel();
          this.renderArmoryGrid();
          this.updateLiveTelemetry();
          this.onShipChangedCallback?.();
        };
        grid.appendChild(card);
      });
    } else if (this.activeTab === 'carriers') {
      const items = [
        { id: 'sls_artemis', cost: 95, cap: 27000, rarity: 'legendary' },
        { id: 'saturn_v', cost: 120, cap: 45000, rarity: 'mythic' },
        { id: 'falcon_heavy', cost: 65, cap: 22000, rarity: 'epic' },
        { id: 'starship_superheavy', cost: 150, cap: 150000, rarity: 'mythic' }
      ];

      items.forEach(it => {
        const isEq = it.id === this.selectedCarrierId;
        const loc = getCarrierText(it.id, this.currentLanguage);
        const name = loc ? loc.name : it.id;
        const desc = loc ? loc.desc : '';
        const card = document.createElement('div');
        card.className = `armory-card ${it.rarity} ${isEq ? 'equipped' : ''}`;
        card.innerHTML = `
          <div>
            <div class="armory-item-name">${name}</div>
            <div class="armory-item-stats">${formatTpl(t.cardCarrierStats, { cap: formatNum(it.cap, this.currentLanguage), cost: formatNum(it.cost, this.currentLanguage) })}</div>
            <div style="font-size: 0.7rem; color: #a0b5d0; margin-top: 4px;">${desc}</div>
          </div>
          <div class="armory-item-perk">${isEq ? t.equipped : t.clickToEquip}</div>
        `;
        card.onclick = () => {
          this.selectedCarrierId = it.id;
          this.playEquipSound();
          this.renderArmoryGrid();
          this.updateLiveTelemetry();
        };
        grid.appendChild(card);
      });
    }
  }

  private updateLiveTelemetry() {
    const fleetCraft = SPACECRAFT_FLEET.find(c => c.id === this.selectedChassisId);
    const chassis = fleetCraft ? { mass: fleetCraft.mass, cost: fleetCraft.cost, cap: fleetCraft.cap } : { mass: 2200, cost: 150, cap: 5 };

    const powerMap: Record<string, { mass: number, cost: number, basePower: number, isSolar: boolean }> = {
      solar_wings: { mass: 85, cost: 35, basePower: 1500, isSolar: true },
      arc_reactor: { mass: 180, cost: 195, basePower: 2200, isSolar: false },
      vibranium_core: { mass: 130, cost: 220, basePower: 1900, isSolar: false },
      tesseract_core: { mass: 280, cost: 380, basePower: 4500, isSolar: false },
      nasa_rtg: { mass: 180, cost: 110, basePower: 2200, isSolar: false },
      nuclear_thermal: { mass: 220, cost: 185, basePower: 3400, isSolar: false },
      fusion_tokamak: { mass: 290, cost: 320, basePower: 4800, isSolar: false }
    };

    const techMap: Record<string, { mass: number, cost: number, power: number, points: number }> = {
      cerebro: { mass: 40, cost: 35, power: 70, points: 45 },
      dark_matter: { mass: 65, cost: 65, power: 140, points: 70 },
      sonic_radar: { mass: 120, cost: 110, power: 280, points: 110 },
      pym_bay: { mass: 90, cost: 140, power: 310, points: 130 },
      kree_array: { mass: 30, cost: 28, power: 45, points: 40 },
      deep_space_optics: { mass: 40, cost: 35, power: 70, points: 50 },
      plasma_spectrometer: { mass: 65, cost: 55, power: 140, points: 75 },
      laser_altimeter: { mass: 80, cost: 85, power: 210, points: 95 },
      sample_bay: { mass: 110, cost: 120, power: 290, points: 130 },
      planetary_radar: { mass: 45, cost: 40, power: 65, points: 60 }
    };

    const engineMap: Record<string, { dryMass: number, fuelMass: number, cost: number, isp: number, powerReq: number }> = {
      repulsor: { dryMass: 40, fuelMass: 850, cost: 25, isp: 260, powerReq: 100 },
      tesseract_drive: { dryMass: 90, fuelMass: 2400, cost: 80, isp: 345, powerReq: 250 },
      nova_warp: { dryMass: 65, fuelMass: 550, cost: 160, isp: 4400, powerReq: 500 },
      rs25_hydrolox: { dryMass: 55, fuelMass: 1800, cost: 45, isp: 452, powerReq: 10 },
      ion_hall_drive: { dryMass: 40, fuelMass: 450, cost: 65, isp: 4190, powerReq: 450 },
      vasimr_drive: { dryMass: 85, fuelMass: 950, cost: 140, isp: 5000, powerReq: 750 }
    };

    const carrierMap: Record<string, { cost: number, cap: number }> = {
      sls_artemis: { cost: 95, cap: 27000 },
      saturn_v: { cost: 120, cap: 45000 },
      falcon_heavy: { cost: 65, cap: 22000 },
      starship_superheavy: { cost: 150, cap: 150000 },
      falcon_stark: { cost: 65, cap: 22000 },
      electron_sword: { cost: 8, cap: 350 },
      starship_sword: { cost: 90, cap: 100000 },
      sanctuary_carrier: { cost: 200, cap: 250000 }
    };

    const power = powerMap[this.selectedPowerId] || powerMap['arc_reactor'] || { mass: 180, cost: 195, basePower: 2200, isSolar: false };
    const engine = engineMap[this.selectedEngineId] || engineMap['tesseract_drive'] || { dryMass: 90, fuelMass: 2400, cost: 80, isp: 345, powerReq: 250 };
    const carrier = carrierMap[this.selectedCarrierId] || carrierMap['sls_artemis'] || { cost: 95, cap: 27000 };

    let techMass = 0;
    let techCost = 0;
    let techPower = 0;
    let totalScience = 0;

    this.selectedTechIds.forEach(id => {
      const it = techMap[id];
      if (it) {
        techMass += it.mass;
        techCost += it.cost;
        techPower += it.power;
        totalScience += it.points;
      }
    });

    const dryMass = chassis.mass + power.mass + engine.dryMass + techMass;
    const totalMass = dryMass + engine.fuelMass;

    const totalCost = chassis.cost + power.cost + engine.cost + techCost + carrier.cost;
    const remainingBudget = this.selectedMission.budgetCredits - totalCost;

    let powerGenerated = power.basePower;
    if (power.isSolar) {
      powerGenerated = Math.round(power.basePower / (this.selectedMission.distanceAU * this.selectedMission.distanceAU));
    }
    const totalPowerConsumed = techPower + engine.powerReq + 80;
    const powerBalance = powerGenerated - totalPowerConsumed;

    // Tsiolkovsky rocket equation
    const deltaV = Math.round(engine.isp * 9.80665 * Math.log(totalMass / dryMass));

    const t = getTexts(this.currentLanguage);

    // Update Telemetry Elements
    const budgetEl = document.getElementById('metric-budget');
    const budgetBar = document.getElementById('bar-budget');
    const budgetPctEl = document.getElementById('metric-budget-percent');
    const budgetPct = Math.round((remainingBudget / this.selectedMission.budgetCredits) * 100);
    if (budgetPctEl) {
      budgetPctEl.textContent = `${budgetPct}%`;
      budgetPctEl.style.color = remainingBudget >= 0 ? 'var(--accent-cyan, #38bdf8)' : '#e23636';
    }
    if (budgetEl && budgetBar) {
      const remStr = formatNum(remainingBudget, this.currentLanguage, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      const totStr = formatNum(this.selectedMission.budgetCredits, this.currentLanguage);
      budgetEl.textContent = `${remStr}M / ${totStr}M`;
      budgetEl.style.color = remainingBudget >= 0 ? '#00f0ff' : '#e23636';
      budgetBar.style.background = remainingBudget >= 0 ? '#00f0ff' : '#e23636';
      budgetBar.style.width = `${Math.max(0, Math.min(100, (remainingBudget / this.selectedMission.budgetCredits) * 100))}%`;
    }

    const massEl = document.getElementById('metric-mass');
    const massBar = document.getElementById('bar-mass');
    const massLimitEl = document.getElementById('metric-mass-limit');
    if (massEl && massBar && massLimitEl) {
      massLimitEl.textContent = `${formatTpl(t.massLimitMeta, { max: formatNum(carrier.cap, this.currentLanguage) })} (${formatTpl(t.massBreakdownMeta, { dry: formatNum(dryMass, this.currentLanguage), fuel: formatNum(engine.fuelMass, this.currentLanguage) })})`;
      massEl.textContent = `${formatNum(totalMass, this.currentLanguage)} kg`;
      const isMassOk = totalMass <= carrier.cap;
      massEl.style.color = isMassOk ? '#00f0ff' : '#e23636';
      massBar.style.background = isMassOk ? '#00f0ff' : '#e23636';
      massBar.style.width = `${Math.min(100, (totalMass / carrier.cap) * 100)}%`;
    }

    const powerEl = document.getElementById('metric-power');
    const powerBar = document.getElementById('bar-power');
    const powerDistEl = document.getElementById('metric-power-distance');
    if (powerEl && powerBar && powerDistEl) {
      powerDistEl.textContent = formatTpl(t.powerDistMeta, {
        au: formatNum(this.selectedMission.distanceAU, this.currentLanguage),
        gen: formatNum(powerGenerated, this.currentLanguage),
        cons: formatNum(totalPowerConsumed, this.currentLanguage)
      });
      powerEl.textContent = `${powerBalance >= 0 ? '+' : ''}${formatNum(powerBalance, this.currentLanguage)} W`;
      const isPowerOk = powerBalance >= 0;
      powerEl.style.color = isPowerOk ? '#00f0ff' : '#e23636';
      powerBar.style.background = isPowerOk ? '#00f0ff' : '#e23636';
      powerBar.style.width = `${Math.min(100, Math.max(5, (powerGenerated / (totalPowerConsumed || 1)) * 50))}%`;
    }

    const deltaVEl = document.getElementById('metric-deltav');
    const deltaVBar = document.getElementById('bar-deltav');
    const deltaVReqEl = document.getElementById('metric-deltav-req');
    if (deltaVEl && deltaVBar && deltaVReqEl) {
      deltaVReqEl.textContent = formatTpl(t.deltaVReqMeta, { req: formatNum(this.selectedMission.reqDeltaV, this.currentLanguage) });
      deltaVEl.textContent = `${formatNum(deltaV, this.currentLanguage)} m/s`;
      const isDeltaVOk = deltaV >= this.selectedMission.reqDeltaV;
      deltaVEl.style.color = isDeltaVOk ? '#00f0ff' : '#e23636';
      deltaVBar.style.background = isDeltaVOk ? '#00f0ff' : '#e23636';
      deltaVBar.style.width = `${Math.min(100, (deltaV / this.selectedMission.reqDeltaV) * 100)}%`;
    }

    const scienceEl = document.getElementById('metric-science');
    const scienceBar = document.getElementById('bar-science');
    const scienceTargetEl = document.getElementById('metric-science-target');
    if (scienceEl && scienceBar && scienceTargetEl) {
      scienceTargetEl.textContent = formatTpl(t.scienceTargetMeta, { target: formatNum(this.selectedMission.minSciencePoints, this.currentLanguage) });
      scienceEl.textContent = `${formatNum(totalScience, this.currentLanguage)} pts`;
      const isScienceOk = totalScience >= this.selectedMission.minSciencePoints;
      scienceEl.style.color = isScienceOk ? '#f6b800' : '#8fa6c5';
      scienceBar.style.background = '#f6b800';
      scienceBar.style.width = `${Math.min(100, (totalScience / this.selectedMission.minSciencePoints) * 100)}%`;
    }

    // Validation checks
    const msgEl = document.getElementById('validation-msg');
    const btnLaunch = document.getElementById('btn-approve-launch') as HTMLButtonElement;

    let errorReason = '';
    if (remainingBudget < 0) {
      errorReason = formatTpl(t.errBudget, { excess: formatNum(Math.abs(remainingBudget), this.currentLanguage, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) });
    } else if (totalMass > carrier.cap) {
      errorReason = formatTpl(t.errOverweight, { excess: formatNum(totalMass - carrier.cap, this.currentLanguage) });
    } else if (powerBalance < 0) {
      errorReason = formatTpl(t.errPower, { deficit: formatNum(Math.abs(powerBalance), this.currentLanguage), au: formatNum(this.selectedMission.distanceAU, this.currentLanguage) });
    } else if (deltaV < this.selectedMission.reqDeltaV) {
      errorReason = formatTpl(t.errDeltaV, { deficit: formatNum(this.selectedMission.reqDeltaV - deltaV, this.currentLanguage) });
    } else if (this.selectedTechIds.size === 0) {
      errorReason = t.errNoTech;
    } else if (this.selectedTechIds.size > chassis.cap) {
      errorReason = formatTpl(t.errMaxTech, { max: chassis.cap });
    }

    if (errorReason) {
      if (msgEl) msgEl.textContent = errorReason;
      if (btnLaunch) btnLaunch.disabled = true;
    } else {
      if (msgEl) {
        msgEl.textContent = t.statusNominal;
      }
      if (btnLaunch) btnLaunch.disabled = false;
    }
  }

  private bindDOMEvents() {
    // Inventory Tabs
    const tabBtns = document.querySelectorAll('.inv-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e: any) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.activeTab = e.target.getAttribute('data-tab');
        this.playClickSound();
        this.renderArmoryGrid();
      });
    });

    // Launch Button
    document.getElementById('btn-approve-launch')?.addEventListener('click', () => {
      this.playLaunchSound();
      this.launchHyperspace();
    });

    // Cinematic View Toggle
    const toggleCinematic = () => {
      const modal = document.getElementById('nasa-mission-modal');
      if (modal) {
        modal.classList.toggle('cinematic-mode');
        this.playClickSound();
      }
    };
    document.getElementById('btn-toggle-cinematic')?.addEventListener('click', toggleCinematic);
    document.getElementById('btn-exit-cinematic')?.addEventListener('click', toggleCinematic);

    // In-Flight HUD Drag & Minimize Controls
    const hudEl = document.getElementById('nasa-flight-hud');
    const hudHandle = document.getElementById('hud-drag-handle');
    const hudContent = document.getElementById('hud-body-content');
    const btnMin = document.getElementById('hud-btn-minimize');

    if (btnMin && hudContent) {
      btnMin.addEventListener('click', (e) => {
        e.stopPropagation();
        const isMin = hudContent.classList.toggle('minimized');
        btnMin.textContent = isMin ? '+' : '—';
        this.playClickSound();
      });
    }

    if (hudEl && hudHandle) {
      let isHudDragging = false;
      let startMouseX = 0, startMouseY = 0;
      let initLeft = 0, initTop = 0;

      hudHandle.addEventListener('mousedown', (e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        isHudDragging = true;
        const rect = hudEl.getBoundingClientRect();
        hudEl.style.right = 'auto'; // chuyển sang tọa độ left cố định
        hudEl.style.left = `${rect.left}px`;
        hudEl.style.top = `${rect.top}px`;
        startMouseX = e.clientX;
        startMouseY = e.clientY;
        initLeft = rect.left;
        initTop = rect.top;
      });

      window.addEventListener('mousemove', (e) => {
        if (!isHudDragging) return;
        const dx = e.clientX - startMouseX;
        const dy = e.clientY - startMouseY;
        const newLeft = Math.max(10, Math.min(window.innerWidth - hudEl.offsetWidth - 10, initLeft + dx));
        const newTop = Math.max(10, Math.min(window.innerHeight - hudEl.offsetHeight - 10, initTop + dy));
        hudEl.style.left = `${newLeft}px`;
        hudEl.style.top = `${newTop}px`;
      });

      window.addEventListener('mouseup', () => {
        isHudDragging = false;
      });
    }

    // In-Flight HUD buttons
    document.getElementById('hud-btn-reconfigure')?.addEventListener('click', () => {
      this.showLobby();
    });

    document.getElementById('hud-btn-debrief')?.addEventListener('click', () => {
      this.showDebrief();
    });

    document.getElementById('debrief-btn-restart')?.addEventListener('click', () => {
      document.getElementById('nasa-debrief-modal')!.style.display = 'none';
      this.showLobby();
    });

    document.getElementById('debrief-btn-dart-restart')?.addEventListener('click', () => {
      document.getElementById('nasa-debrief-modal')!.style.display = 'none';
      this.showLobby();
    });

    document.getElementById('debrief-btn-dart-retry')?.addEventListener('click', () => {
      document.getElementById('nasa-debrief-modal')!.style.display = 'none';
      this.launchHyperspace();
    });

    document.getElementById('dart-btn-toggle-guidance-hud')?.addEventListener('click', () => {
      this.playClickSound();
      if (!this.dartSimulation) this.dartSimulation = new DartSimulation();
      this.dartSimulation.guidanceAssistEnabled = !this.dartSimulation.guidanceAssistEnabled;
      const btn = document.getElementById('dart-btn-toggle-guidance-hud');
      const t = getTexts(this.currentLanguage);
      if (btn) {
        const isAct = this.dartSimulation.guidanceAssistEnabled;
        btn.textContent = isAct ? t.dartGuidanceActive : t.dartGuidanceManual;
        btn.style.borderColor = isAct ? '#22c55e' : '#94a3b8';
        btn.style.color = isAct ? '#4ade80' : '#cbd5e1';
      }
    });

    // Language Selector
    const langSelect = document.getElementById('select-game-language') as HTMLSelectElement | null;
    if (langSelect) {
      langSelect.value = this.currentLanguage;
      langSelect.addEventListener('change', () => {
        this.setLanguage(langSelect.value);
      });
    }

    // Quality Selector
    const qualitySelect = document.getElementById('select-game-quality') as HTMLSelectElement | null;
    if (qualitySelect) {
      qualitySelect.value = getStoredQuality();
      qualitySelect.addEventListener('change', () => {
        setStoredQuality(qualitySelect.value as GraphicsQuality);
      });
    }
    onQualityChange((q) => {
      if (qualitySelect) qualitySelect.value = q;
    });

    // Flight Manual Modal
    const manualModal = document.getElementById('flight-manual-modal');
    const btnManualClose = document.getElementById('manual-btn-close');

    // Spotlight Guided Tour Controls
    document.getElementById('btn-start-spotlight-tour')?.addEventListener('click', () => {
      this.startSpotlightTour(0);
    });
    document.getElementById('btn-tour-next')?.addEventListener('click', () => {
      this.nextTourStep();
    });
    document.getElementById('btn-tour-prev')?.addEventListener('click', () => {
      this.prevTourStep();
    });
    document.getElementById('btn-tour-skip')?.addEventListener('click', () => {
      this.endSpotlightTour();
    });
    document.getElementById('btn-tour-close')?.addEventListener('click', () => {
      this.endSpotlightTour();
    });

    btnManualClose?.addEventListener('click', () => {
      this.playClickSound();
      if (manualModal) manualModal.style.display = 'none';
    });

    manualModal?.addEventListener('click', (e) => {
      if (e.target === manualModal) {
        manualModal.style.display = 'none';
      }
    });

    // Manual Tab Navigation
    const manualTabs = document.querySelectorAll('.manual-nav-btn');
    manualTabs.forEach(btn => {
      btn.addEventListener('click', (e: any) => {
        manualTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeManualTab = btn.getAttribute('data-manual-tab') || 'quickstart';
        this.playClickSound();
        this.renderFlightManualContent();
      });
    });

    // Left Blade Collapse Toggles
    const bladeLeft = document.getElementById('blade-missions');
    const btnToggleLeft = document.getElementById('btn-toggle-blade-left');
    const btnCollapseLeft = document.getElementById('btn-collapse-blade-left');

    const toggleLeftBlade = () => {
      if (!bladeLeft) return;
      this.playClickSound();
      const isCollapsed = bladeLeft.classList.toggle('collapsed');
      const icon = btnToggleLeft?.querySelector('.tab-icon');
      if (icon) icon.textContent = isCollapsed ? '▶' : '◀';
      const headerBtn = btnCollapseLeft;
      if (headerBtn) headerBtn.textContent = isCollapsed ? '▶' : '◀';
      btnToggleLeft?.setAttribute('title', isCollapsed ? 'Mở rộng bảng Nhiệm vụ (Expand)' : 'Thu gọn bảng Nhiệm vụ (Collapse)');
    };
    btnToggleLeft?.addEventListener('click', toggleLeftBlade);
    btnCollapseLeft?.addEventListener('click', toggleLeftBlade);

    // Right Blade Collapse Toggles
    const bladeRight = document.getElementById('blade-diagnostics');
    const btnToggleRight = document.getElementById('btn-toggle-blade-right');
    const btnCollapseRight = document.getElementById('btn-collapse-blade-right');

    const toggleRightBlade = () => {
      if (!bladeRight) return;
      this.playClickSound();
      const isCollapsed = bladeRight.classList.toggle('collapsed');
      const icon = btnToggleRight?.querySelector('.tab-icon');
      if (icon) icon.textContent = isCollapsed ? '◀' : '▶';
      const headerBtn = btnCollapseRight;
      if (headerBtn) headerBtn.textContent = isCollapsed ? '◀' : '▶';
      btnToggleRight?.setAttribute('title', isCollapsed ? 'Mở rộng bảng Avionics (Expand)' : 'Thu gọn bảng Avionics (Collapse)');
    };
    btnToggleRight?.addEventListener('click', toggleRightBlade);
    btnCollapseRight?.addEventListener('click', toggleRightBlade);

    // Bottom Dock Collapse Toggle
    const dockBottom = document.getElementById('dock-bottom');
    const btnToggleDock = document.getElementById('btn-toggle-dock-bottom');

    const toggleBottomDock = () => {
      if (!dockBottom) return;
      this.playClickSound();
      const isCollapsed = dockBottom.classList.toggle('collapsed');
      const icon = btnToggleDock?.querySelector('.dock-tab-icon');
      const label = btnToggleDock?.querySelector('.dock-tab-label');
      if (icon) icon.textContent = isCollapsed ? '▲' : '▼';
      if (label) {
        const isVi = this.currentLanguage === 'vi';
        label.textContent = isCollapsed 
          ? (isVi ? 'MỞ RỘNG BẢNG TRANG BỊ' : 'SHOW DOCK') 
          : (isVi ? 'THU GỌN BẢNG' : 'HIDE DOCK');
      }
      btnToggleDock?.setAttribute('title', isCollapsed ? 'Mở rộng bảng Trang bị (Expand Dock)' : 'Thu gọn bảng Trang bị (Collapse Dock)');
    };
    btnToggleDock?.addEventListener('click', toggleBottomDock);
  }

  private renderFlightManualContent() {
    const container = document.getElementById('manual-tabs-body');
    if (!container) return;
    const isVi = this.currentLanguage === 'vi';
    container.innerHTML = this.getFlightManualTabHTML(this.activeManualTab, isVi);

    // Wire up the Spotlight Tour CTA button inside the modal
    document.getElementById('btn-launch-tour-from-modal')?.addEventListener('click', () => {
      this.startSpotlightTour(0);
    });
  }

  private getFlightManualTabHTML(tabId: string, isVi: boolean): string {
    if (tabId === 'quickstart') {
      return isVi ? `
        <div class="manual-section">
          <div class="manual-banner">
            <div class="manual-banner-badge">HƯỚNG DẪN TỔNG QUAN</div>
            <h2 class="manual-banner-title">QUY TRÌNH THỰC HIỆN NHIỆM VỤ TỪ A ĐẾN Z</h2>
            <p class="manual-banner-desc">Khám phá không gian và điều khiển tàu vũ trụ NASA theo chuẩn vật lý Keplerian trong 5 bước cơ bản.</p>
            <div style="margin-top: 14px;">
              <button id="btn-launch-tour-from-modal" class="btn-launch-tour-cta">
                <span class="cta-pulse">✨</span>
                <strong>BẮT ĐẦU TOUR HƯỚNG DẪN SÁNG ĐÈN TRỰC QUAN (SPOTLIGHT TOUR)</strong>
                <span style="opacity: 0.85; font-size: 0.72rem;">— Rọi sáng từng nút bấm thực tế</span>
              </button>
            </div>
          </div>

          <div class="manual-steps-grid">
            <div class="manual-step-card">
              <div class="step-badge">BƯỚC 1</div>
              <h3>🛰️ CHỌN NHIỆM VỤ BAY</h3>
              <p>Nhìn vào cột bên trái <strong>01 // SECTOR OPERATIONS</strong>. Nhấp chọn 1 trong các sứ mệnh NASA nổi tiếng: <em>Artemis TLI (Mặt Trăng)</em>, <em>Apollo 11</em>, <em>DART (Phòng thủ hành tinh)</em>, <em>Voyager 1 (Liên sao)</em>, v.v. Mỗi nhiệm vụ sẽ quy định ngân sách, vận tốc &Delta;v yêu cầu và mục tiêu khoa học.</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">BƯỚC 2</div>
              <h3>🛠️ THIẾT KẾ & TRANG BỊ TÀU</h3>
              <p>Dưới thanh Dock, tùy biến phi thuyền: 
              <strong>Hạm đội tàu</strong> (Shuttle, Apollo 11, Voyager 1, Hyperion, Ghostwing, Quinjet hoặc tự tải file 3D .glb/.gltf/.obj); 
              <strong>Cờ Tổ quốc</strong> (sơn cờ Việt Nam 🇻🇳, NASA 🇺🇸); 
              <strong>Lõi năng lượng</strong> (Pin mặt trời / RTG hạt nhân); 
              <strong>Khí tài khoa học</strong>; 
              <strong>Động cơ đẩy</strong>; 
              <strong>Tên lửa mang phóng</strong>.</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">BƯỚC 3</div>
              <h3>📊 KIỂM TRA AVIONICS & PHÓNG TÀU</h3>
              <p>Nhìn sang cột bên phải <strong>02 // AVIONICS & FLIGHT DYNAMICS</strong>: Đảm bảo <em>Thặng dư ngân sách &ge; $0</em>, <em>Khối lượng khô &le; Tải trọng tên lửa</em>, <em>Cân bằng điện &ge; 0W</em>, và <em>&Delta;v &ge; &Delta;v yêu cầu</em>. Khi thông số hợp lệ, nhấp nút màu cam <strong>AUTHORIZE & INITIATE LAUNCH</strong>!</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">BƯỚC 4</div>
              <h3>🕹️ ĐIỀU KHIỂN BUỒNG LÁI & SAS</h3>
              <p>Trong không gian, điều khiển tàu bằng phím: 
              <span class="kbd-badge">W</span>/<span class="kbd-badge">S</span> (Góc chúi/ngửa), 
              <span class="kbd-badge">A</span>/<span class="kbd-badge">D</span> (Lăn cánh), 
              <span class="kbd-badge">Q</span>/<span class="kbd-badge">E</span> (Đảo hướng mũi), 
              <span class="kbd-badge">Shift</span>/<span class="kbd-badge">Ctrl</span> (Tăng/giảm ga), 
              <span class="kbd-badge">Space</span> (Phanh ngược), 
              <span class="kbd-badge">T</span> hoặc nút <strong>STAB LOCK</strong> để khóa cố định hướng mũi tàu.</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">BƯỚC 5</div>
              <h3>🌌 DỊCH CHUYỂN QUỸ ĐẠO TỨC THÌ (WARP)</h3>
              <p>Nhấp vào bất kỳ hành tinh, mặt trăng hoặc tiểu hành tinh nào trên thanh <strong>Cosmic Orrery</strong> ở trên cùng. Trong bảng hồ sơ thiên thể, nhấn nút <strong>🚀 ESTABLISH ORBIT HERE</strong> để phi thuyền nhảy bước nhảy không gian vào ngay quỹ đạo tròn Keplerian ổn định!</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">MẸO GIAO DIỆN</div>
              <h3>👁️ THU GỌN GIAO DIỆN SẢNH CHỜ</h3>
              <p>Nhấp vào thanh <strong>◀ / ▶</strong> ở mép 2 bên hoặc <strong>▼ HIDE DOCK</strong> ở mép dưới để thu gọn các bảng menu. Khi đó bạn có thể thưởng thức toàn cảnh tàu vũ trụ 3D trong Hangar với chất lượng 4K sắc nét và không gian bao la không hề bị che khuất!</p>
            </div>
          </div>
        </div>
      ` : `
        <div class="manual-section">
          <div class="manual-banner">
            <div class="manual-banner-badge">OVERVIEW GUIDE</div>
            <h2 class="manual-banner-title">END-TO-END MISSION PROTOCOL</h2>
            <p class="manual-banner-desc">Master NASA deep space exploration and 3D flight dynamics in 5 Keplerian steps.</p>
            <div style="margin-top: 14px;">
              <button id="btn-launch-tour-from-modal" class="btn-launch-tour-cta">
                <span class="cta-pulse">✨</span>
                <strong>START INTERACTIVE SPOTLIGHT GUIDED TOUR</strong>
                <span style="opacity: 0.85; font-size: 0.72rem;">— Highlights each button live</span>
              </button>
            </div>
          </div>

          <div class="manual-steps-grid">
            <div class="manual-step-card">
              <div class="step-badge">STEP 1</div>
              <h3>🛰️ SELECT FLIGHT MANIFEST</h3>
              <p>Inspect the left blade <strong>01 // SECTOR OPERATIONS</strong>. Select your mission profile: <em>Artemis TLI (Moon)</em>, <em>Apollo 11</em>, <em>DART (Planetary Defense)</em>, <em>Voyager 1 (Interstellar)</em>, etc. Each mission sets budget, required &Delta;v, and target science return.</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">STEP 2</div>
              <h3>🛠️ HANGAR OUTFITTING</h3>
              <p>Use the bottom dock shelf to engineer your craft: 
              <strong>Fleet Chassis</strong> (Shuttle, Apollo 11, Voyager 1, Hyperion, Ghostwing, Quinjet or import custom .glb/.gltf/.obj); 
              <strong>National Insignia</strong> (apply Vietnam 🇻🇳, NASA 🇺🇸, UK, etc.); 
              <strong>Power Core</strong> (Solar arrays / RTG); 
              <strong>Scientific Avionics</strong>; 
              <strong>Propulsion Engines</strong>; 
              <strong>Launch Booster</strong>.</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">STEP 3</div>
              <h3>📊 AVIONICS VERIFICATION & LAUNCH</h3>
              <p>Examine the right blade <strong>02 // AVIONICS & FLIGHT DYNAMICS</strong>: Ensure <em>Budget Surplus &ge; $0</em>, <em>Dry Mass &le; Booster Limit</em>, <em>Electrical Power &ge; 0W</em>, and <em>&Delta;v &ge; Mission Requirement</em>. When green, click <strong>AUTHORIZE & INITIATE LAUNCH</strong>!</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">STEP 4</div>
              <h3>🕹️ FLIGHT DECK & AUTOPILOT</h3>
              <p>Control the ship in zero-g: 
              <span class="kbd-badge">W</span>/<span class="kbd-badge">S</span> (Pitch), 
              <span class="kbd-badge">A</span>/<span class="kbd-badge">D</span> (Roll), 
              <span class="kbd-badge">Q</span>/<span class="kbd-badge">E</span> (Yaw), 
              <span class="kbd-badge">Shift</span>/<span class="kbd-badge">Ctrl</span> (Throttle), 
              <span class="kbd-badge">Space</span> (Retro-Brake), 
              <span class="kbd-badge">T</span> or click <strong>STAB LOCK</strong> on the console to damp angular rates and lock heading.</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">STEP 5</div>
              <h3>🌌 ORRERY & INSTANT WARP INSERTION</h3>
              <p>Click any celestial body on the top <strong>Cosmic Orrery</strong> bar. In the body dossier, click <strong>🚀 ESTABLISH ORBIT HERE</strong> to warp into a circular Keplerian orbit around that planet or asteroid!</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">UI TIP</div>
              <h3>👁️ COLLAPSIBLE LOBBY PANELS</h3>
              <p>Click the <strong>◀ / ▶</strong> tabs on the screen edges or <strong>▼ HIDE DOCK</strong> at the bottom to collapse panels, giving you an unobstructed 4K view of your spacecraft in the hangar!</p>
            </div>
          </div>
        </div>
      `;
    }

    if (tabId === 'missions') {
      return isVi ? `
        <div class="manual-section">
          <div class="manual-banner">
            <div class="manual-banner-badge">SỨ MỆNH KHÔNG GIAN</div>
            <h2 class="manual-banner-title">DANH MỤC NHIỆM VỤ & QUẢN LÝ NGÂN SÁCH NASA</h2>
            <p class="manual-banner-desc">Mỗi sứ mệnh mô phỏng một dự án thực tế của NASA với thông số quỹ đạo, cự ly và yêu cầu vận tốc riêng biệt.</p>
          </div>

          <div class="manual-table-wrap">
            <table class="manual-table">
              <thead>
                <tr>
                  <th>Sứ Mệnh</th>
                  <th>Mục Tiêu Thiên Thể</th>
                  <th>Cự Ly (AU)</th>
                  <th>&Delta;v Tối Thiểu</th>
                  <th>Ngân Sách Cấp</th>
                  <th>Điểm Khoa Học</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><strong>NASA Artemis TLI</strong></td><td>Mặt Trăng (Moon)</td><td>1.00 AU</td><td>3,150 m/s</td><td>$890M</td><td>220 pts</td></tr>
                <tr><td><strong>NASA Apollo 11</strong></td><td>Mặt Trăng (Eagle LM)</td><td>1.00 AU</td><td>3,900 m/s</td><td>$480M</td><td>180 pts</td></tr>
                <tr><td><strong>NASA DART</strong></td><td>Tiểu hành tinh Didymos</td><td>1.25 AU</td><td>3,450 m/s</td><td>$330M</td><td>280 pts</td></tr>
                <tr><td><strong>NASA OSIRIS-REx</strong></td><td>Tiểu hành tinh Bennu</td><td>1.12 AU</td><td>2,800 m/s</td><td>$800M</td><td>310 pts</td></tr>
                <tr><td><strong>NASA 99942 Apophis</strong></td><td>Apophis (Phòng thủ)</td><td>0.98 AU</td><td>3,200 m/s</td><td>$550M</td><td>250 pts</td></tr>
                <tr><td><strong>NASA Voyager 1</strong></td><td>Biên giới Liên sao</td><td>158.0 AU</td><td>4,200 m/s</td><td>$450M</td><td>500 pts</td></tr>
                <tr><td><strong>NASA New Horizons</strong></td><td>Vành đai Kuiper / Pluto</td><td>32.0 AU</td><td>4,100 m/s</td><td>$700M</td><td>420 pts</td></tr>
                <tr><td><strong>NASA Juno</strong></td><td>Sao Mộc (Jupiter)</td><td>5.20 AU</td><td>3,850 m/s</td><td>$1,100M</td><td>360 pts</td></tr>
                <tr><td><strong>NASA JWST</strong></td><td>Điểm Lagrange L2</td><td>1.01 AU</td><td>3,600 m/s</td><td>$1,200M</td><td>450 pts</td></tr>
              </tbody>
            </table>
          </div>

          <div class="manual-callout-tip">
            <strong>💡 Quy tắc quản lý ngân sách:</strong> Mỗi linh kiện lắp thêm vào tàu (thân tàu, động cơ phản lực, tấm pin quang năng, thiết bị đo đạc, tên lửa đẩy) đều tiêu tốn ngân sách. Hãy giữ <em>Thặng dư ngân sách &ge; $0</em> để được Flight Director phê duyệt lệnh phóng!
          </div>
        </div>
      ` : `
        <div class="manual-section">
          <div class="manual-banner">
            <div class="manual-banner-badge">FLIGHT MANIFEST</div>
            <h2 class="manual-banner-title">NASA MISSIONS & BUDGET PROTOCOLS</h2>
            <p class="manual-banner-desc">Each mission simulates a real NASA flight program with rigorous orbital constraints.</p>
          </div>

          <div class="manual-table-wrap">
            <table class="manual-table">
              <thead>
                <tr>
                  <th>Mission</th>
                  <th>Target Destination</th>
                  <th>Distance (AU)</th>
                  <th>Min &Delta;v</th>
                  <th>NASA Budget</th>
                  <th>Science Target</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><strong>NASA Artemis TLI</strong></td><td>The Moon (TLI)</td><td>1.00 AU</td><td>3,150 m/s</td><td>$890M</td><td>220 pts</td></tr>
                <tr><td><strong>NASA Apollo 11</strong></td><td>The Moon (Eagle LM)</td><td>1.00 AU</td><td>3,900 m/s</td><td>$480M</td><td>180 pts</td></tr>
                <tr><td><strong>NASA DART</strong></td><td>65803 Didymos</td><td>1.25 AU</td><td>3,450 m/s</td><td>$330M</td><td>280 pts</td></tr>
                <tr><td><strong>NASA OSIRIS-REx</strong></td><td>101955 Bennu</td><td>1.12 AU</td><td>2,800 m/s</td><td>$800M</td><td>310 pts</td></tr>
                <tr><td><strong>NASA 99942 Apophis</strong></td><td>99942 Apophis</td><td>0.98 AU</td><td>3,200 m/s</td><td>$550M</td><td>250 pts</td></tr>
                <tr><td><strong>NASA Voyager 1</strong></td><td>Interstellar Boundary</td><td>158.0 AU</td><td>4,200 m/s</td><td>$450M</td><td>500 pts</td></tr>
                <tr><td><strong>NASA New Horizons</strong></td><td>Kuiper Belt / Pluto</td><td>32.0 AU</td><td>4,100 m/s</td><td>$700M</td><td>420 pts</td></tr>
                <tr><td><strong>NASA Juno</strong></td><td>Jupiter Polar Orbit</td><td>5.20 AU</td><td>3,850 m/s</td><td>$1,100M</td><td>360 pts</td></tr>
                <tr><td><strong>NASA JWST</strong></td><td>Sun-Earth L2 Lagrange</td><td>1.01 AU</td><td>3,600 m/s</td><td>$1,200M</td><td>450 pts</td></tr>
              </tbody>
            </table>
          </div>

          <div class="manual-callout-tip">
            <strong>💡 Budget Allocation Rule:</strong> Every equipped module, chassis, engine, and launch carrier consumes credits. Maintain a <em>Budget Surplus &ge; $0</em> to receive Flight Director launch approval!
          </div>
        </div>
      `;
    }

    if (tabId === 'armory') {
      return isVi ? `
        <div class="manual-section">
          <div class="manual-banner">
            <div class="manual-banner-badge">KỸ THUẬT VÀ KHÍ TÀI</div>
            <h2 class="manual-banner-title">HẠM ĐỘI TÀU, CỜ TỔ QUỐC & CÔNG THỨC TSIOLKOVSKY</h2>
            <p class="manual-banner-desc">Tự do trang bị hạm đội tàu vũ trụ hoặc tải mô hình 3D của riêng bạn (.glb, .gltf, .obj).</p>
          </div>

          <div class="manual-steps-grid">
            <div class="manual-step-card">
              <h3>🚀 Hạm Đội Tàu Vũ Trụ Chuẩn 4K</h3>
              <p>• <strong>Space Shuttle Orbiter (Discovery OV-103)</strong>: Cánh tam giác khí động học, gạch gốm tản nhiệt.<br>
              • <strong>Apollo 11 Lunar Module (Eagle)</strong>: Chân giảm chấn tiếp đất và lớp chắn bức xạ vàng Kapton.<br>
              • <strong>Voyager 1 Explorer</strong>: Đĩa ăng-ten parabol đường kính lớn High-Gain Antenna.<br>
              • <strong>Hyperion Flagship</strong>: Soái hạm bọc giáp titan với 4 động cơ cơ động lớn.<br>
              • <strong>Ghostwing Interceptor</strong>: Cánh vát ngược tàng hình với cảm biến quang tử lượng tử.<br>
              • <strong>Quinjet Tactical Craft</strong>: Động cơ phản lực lưỡng dụng khí quyển và vũ trụ.</p>
            </div>

            <div class="manual-step-card">
              <h3>📂 Nhập Mẫu 3D Tùy Biến (.glb, .gltf, .obj)</h3>
              <p>Bạn có thể tải bất kỳ mô hình tàu chiến, phi thuyền nào từ NASA 3D Resources hoặc Sketchfab CC0, nhấp nút <strong>📂 IMPORT 3D</strong> trên thanh công cụ để đưa trực tiếp vào Hangar và bay tự do trong Thái Dương Hệ!</p>
            </div>

            <div class="manual-step-card">
              <h3>🇻🇳 Cờ Tổ Quốc & Phù Hiệu Quốc Gia</h3>
              <p>Sơn cờ Việt Nam 🇻🇳, cờ NASA 🇺🇸, Anh 🇬🇧, Nhật Bản 🇯🇵, v.v. trực tiếp lên vỏ tàu 3D với độ nét cao PBR.</p>
            </div>

            <div class="manual-step-card">
              <h3>⚛ Năng Lượng & Nghịch Đảo Bình Phương</h3>
              <p>Quang năng tấm pin mặt trời giảm mạnh theo khoảng cách:<br>
              <code>P(r) = P_0 / r²</code><br>
              Khi bay xa ngoài Sao Mộc (r > 5 AU), ánh sáng rất yếu, bắt buộc trang bị Lò nhiệt hạch hạt nhân RTG (Plutonium-238) để duy trì sự sống và hệ thống điều khiển!</p>
            </div>
          </div>

          <div class="formula-box">
            <div class="formula-title">📐 PHƯƠNG TRÌNH TÊN LỬA TSIOLKOVSKY</div>
            <div>&Delta;v = I_sp &bull; g_0 &bull; ln(m_0 / m_f)</div>
            <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 4px;">
              Trong đó: I_sp là xung lực riêng của động cơ (giây), g_0 = 9.80665 m/s², m_0 là tổng khối lượng xuất phát, m_f là khối lượng khô (Dry Mass).
            </div>
          </div>
        </div>
      ` : `
        <div class="manual-section">
          <div class="manual-banner">
            <div class="manual-banner-badge">AEROSPACE ENGINEERING</div>
            <h2 class="manual-banner-title">SPACECRAFT FLEET & TSIOLKOVSKY ROCKET DYNAMICS</h2>
            <p class="manual-banner-desc">Customize official NASA craft or import your own 3D assets (.glb, .gltf, .obj).</p>
          </div>

          <div class="manual-steps-grid">
            <div class="manual-step-card">
              <h3>🚀 Official 4K Spacecraft Fleet</h3>
              <p>• <strong>Space Shuttle Orbiter (Discovery OV-103)</strong>: Delta wings & thermal tiles.<br>
              • <strong>Apollo 11 Lunar Module (Eagle)</strong>: Quad shock landing legs & Kapton gold foil.<br>
              • <strong>Voyager 1 Explorer</strong>: High-gain parabolic antenna dish.<br>
              • <strong>Hyperion Flagship</strong>: Titanium-armored interstellar exploration cruiser.<br>
              • <strong>Ghostwing Interceptor</strong>: Forward-swept stealth reconnaissance craft.<br>
              • <strong>Quinjet Tactical Craft</strong>: Dual-environment atmospheric and orbital jet.</p>
            </div>

            <div class="manual-step-card">
              <h3>📂 Custom 3D Model Importer</h3>
              <p>Download free spacecraft from NASA 3D Resources or Sketchfab CC0 and load them via <strong>📂 IMPORT 3D</strong> to fly them instantly in the solar system!</p>
            </div>

            <div class="manual-step-card">
              <h3>🇻🇳 National Insignia & Decals</h3>
              <p>Apply Vietnam 🇻🇳, NASA 🇺🇸, UK 🇬🇧, Japan 🇯🇵, or European decals onto the 4K PBR hull texture.</p>
            </div>

            <div class="manual-step-card">
              <h3>⚛ Power & Inverse Square Law</h3>
              <p>Solar flux falls off sharply with distance:<br>
              <code>P(r) = P_0 / r²</code><br>
              Beyond Jupiter (r > 5 AU), sunlight is insufficient. Equip an RTG nuclear core to maintain positive power balance!</p>
            </div>
          </div>

          <div class="formula-box">
            <div class="formula-title">📐 TSIOLKOVSKY ROCKET EQUATION</div>
            <div>&Delta;v = I_sp &bull; g_0 &bull; ln(m_0 / m_f)</div>
            <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 4px;">
              Where I_sp is engine specific impulse (seconds), g_0 = 9.80665 m/s², m_0 is wet launch mass, and m_f is dry burn-out mass.
            </div>
          </div>
        </div>
      `;
    }

    if (tabId === 'controls') {
      return isVi ? `
        <div class="manual-section">
          <div class="manual-banner">
            <div class="manual-banner-badge">BUỒNG LÁI & AUTOPILOT</div>
            <h2 class="manual-banner-title">HỆ THỐNG ĐIỀU KHIỂN BAY & LÁI TỰ ĐỘNG SAS</h2>
            <p class="manual-banner-desc">Điều khiển phi thuyền 6 bậc tự do (6-DoF) trong môi trường không trọng lực với hệ thống tự cân bằng SAS.</p>
          </div>

          <div class="manual-table-wrap">
            <table class="manual-table">
              <thead>
                <tr>
                  <th>Phím Tắt</th>
                  <th>Thao Tác</th>
                  <th>Chức Năng Hàng Không Vũ Trụ</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><span class="kbd-badge">W</span></td><td>Pitch Down</td><td>Chúc mũi tàu xuống dưới</td></tr>
                <tr><td><span class="kbd-badge">S</span></td><td>Pitch Up</td><td>Ngửa mũi tàu lên trên</td></tr>
                <tr><td><span class="kbd-badge">A</span></td><td>Roll Left</td><td>Lăn lộn cánh phi thuyền sang trái (ngược chiều kim đồng hồ)</td></tr>
                <tr><td><span class="kbd-badge">D</span></td><td>Roll Right</td><td>Lăn lộn cánh phi thuyền sang phải (thuận chiều kim đồng hồ)</td></tr>
                <tr><td><span class="kbd-badge">Q</span></td><td>Yaw Left</td><td>Đảo hướng mũi tàu sang trái trên mặt phẳng nằm ngang</td></tr>
                <tr><td><span class="kbd-badge">E</span></td><td>Yaw Right</td><td>Đảo hướng mũi tàu sang phải trên mặt phẳng nằm ngang</td></tr>
                <tr><td><span class="kbd-badge">Shift</span></td><td>Throttle Up</td><td>Tăng công suất bướm ga động cơ đẩy (+5% mỗi lần nhấn)</td></tr>
                <tr><td><span class="kbd-badge">Ctrl</span></td><td>Throttle Down</td><td>Giảm công suất bướm ga động cơ đẩy (-5% mỗi lần nhấn)</td></tr>
                <tr><td><span class="kbd-badge">Z</span></td><td>Max Throttle</td><td>Đặt công suất động cơ lên 100% cực đại ngay lập tức</td></tr>
                <tr><td><span class="kbd-badge">X</span></td><td>Cutoff Engine</td><td>Cắt toàn bộ lực đẩy động cơ khẩn cấp (0% Throttle)</td></tr>
                <tr><td><span class="kbd-badge">Space</span></td><td>Retro-Brake</td><td>Kích hoạt cụm động cơ RCS hãm ngược chiều bay để giảm tốc</td></tr>
                <tr><td><span class="kbd-badge">T</span></td><td>SAS Autopilot</td><td>Bật/Tắt hệ thống hỗ trợ ổn định hướng bay tự động</td></tr>
              </tbody>
            </table>
          </div>

          <div class="manual-steps-grid" style="margin-top: 14px;">
            <div class="manual-step-card">
              <h3>🔒 STAB LOCK (Khóa Cố Định Hướng)</h3>
              <p>Tự động tính toán vận tốc góc xoay và tạo mô-men hãm triệt tiêu dao động quay tự do, giữ mũi tàu cố định hoàn toàn theo hướng đã định trong chân không.</p>
            </div>

            <div class="manual-step-card">
              <h3>🎯 PROGRADE (Theo Hướng Bay)</h3>
              <p>Tự động quay mũi tàu hướng theo vector vận tốc bay (+v). Khi nhấn tăng ga ở chế độ này, bạn sẽ gia tăng cơ năng quỹ đạo, nâng cao điểm cực viễn (Apoapsis).</p>
            </div>

            <div class="manual-step-card">
              <h3>🔄 RETROGRADE (Ngược Hướng Bay)</h3>
              <p>Tự động quay mũi tàu ngược 180° so với vector vận tốc (-v). Khi kích hoạt động cơ đẩy, tốc độ quỹ đạo sẽ giảm xuống, hạ thấp điểm cực cận (Periapsis) để tiếp cận khí quyển hoặc đổ bộ.</p>
            </div>

            <div class="manual-step-card">
              <h3>🕹️ MANUAL (Thủ Công Tự Do)</h3>
              <p>Tắt toàn bộ can thiệp tự động để phi công hoàn toàn làm chủ góc quay tự do theo định luật 1 Newton (quán tính vĩnh cửu trong chân không vũ trụ).</p>
            </div>
          </div>
        </div>
      ` : `
        <div class="manual-section">
          <div class="manual-banner">
            <div class="manual-banner-badge">FLIGHT DECK & AUTOPILOT</div>
            <h2 class="manual-banner-title">IN-FLIGHT 6-DoF CONTROLS & SAS AUTOPILOT</h2>
            <p class="manual-banner-desc">Master full 6-degree-of-freedom zero-g attitude control with active SAS damping.</p>
          </div>

          <div class="manual-table-wrap">
            <table class="manual-table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Action</th>
                  <th>Aerospace Function</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><span class="kbd-badge">W</span></td><td>Pitch Down</td><td>Pitches nose downward</td></tr>
                <tr><td><span class="kbd-badge">S</span></td><td>Pitch Up</td><td>Pitches nose upward</td></tr>
                <tr><td><span class="kbd-badge">A</span></td><td>Roll Left</td><td>Rolls spacecraft counter-clockwise</td></tr>
                <tr><td><span class="kbd-badge">D</span></td><td>Roll Right</td><td>Rolls spacecraft clockwise</td></tr>
                <tr><td><span class="kbd-badge">Q</span></td><td>Yaw Left</td><td>Yaws spacecraft nose to the port (left)</td></tr>
                <tr><td><span class="kbd-badge">E</span></td><td>Yaw Right</td><td>Yaws spacecraft nose to the starboard (right)</td></tr>
                <tr><td><span class="kbd-badge">Shift</span></td><td>Throttle Up</td><td>Increases engine thrust (+5% per tap)</td></tr>
                <tr><td><span class="kbd-badge">Ctrl</span></td><td>Throttle Down</td><td>Decreases engine thrust (-5% per tap)</td></tr>
                <tr><td><span class="kbd-badge">Z</span></td><td>Max Throttle</td><td>Instant 100% full engine throttle</td></tr>
                <tr><td><span class="kbd-badge">X</span></td><td>Cutoff Engine</td><td>Instant emergency engine thrust cutoff (0%)</td></tr>
                <tr><td><span class="kbd-badge">Space</span></td><td>Retro-Brake</td><td>Fires RCS retro thrusters opposing velocity vector</td></tr>
                <tr><td><span class="kbd-badge">T</span></td><td>SAS Autopilot</td><td>Toggles Stability Augmentation System</td></tr>
              </tbody>
            </table>
          </div>

          <div class="manual-steps-grid" style="margin-top: 14px;">
            <div class="manual-step-card">
              <h3>🔒 STAB LOCK (Heading Hold)</h3>
              <p>Computes angular drift rates and applies active counter-torque damping to lock spacecraft heading solidly in inertial space.</p>
            </div>

            <div class="manual-step-card">
              <h3>🎯 PROGRADE (Velocity Aligned)</h3>
              <p>Automatically rotates the nose toward the orbital velocity vector (+v). Burning engines here raises orbital energy and Apoapsis altitude.</p>
            </div>

            <div class="manual-step-card">
              <h3>🔄 RETROGRADE (Anti-Velocity Burn)</h3>
              <p>Automatically aligns 180° opposing velocity (-v). Burning engines here slows orbital velocity and lowers Periapsis for atmospheric reentry or capture.</p>
            </div>

            <div class="manual-step-card">
              <h3>🕹️ MANUAL (Newtonian Inertia)</h3>
              <p>Disengages autopilot dampers, allowing complete manual attitude control under pure Newton's First Law of inertial motion.</p>
            </div>
          </div>
        </div>
      `;
    }

    if (tabId === 'orrery') {
      return isVi ? `
        <div class="manual-section">
          <div class="manual-banner">
            <div class="manual-banner-badge">ĐIỀU HƯỚNG QUỸ ĐẠO</div>
            <h2 class="manual-banner-title">THƯỚC NGẮM THIÊN VĂN & NHẢY QUỸ ĐẠO TỨC THÌ</h2>
            <p class="manual-banner-desc">Định vị mọi hành tinh, ngôi sao liên sao và thiên thạch nguy hiểm với thanh Cosmic Orrery.</p>
          </div>

          <div class="manual-steps-grid">
            <div class="manual-step-card">
              <h3>☀️ Thái Dương Hệ (Solar System)</h3>
              <p>Bao gồm Mặt Trời, 8 hành tinh chính (Sao Thủy, Sao Kim, Trái Đất, Sao Hỏa, Sao Mộc, Sao Thổ, Sao Thiên Vương, Sao Hải Vương), Mặt Trăng, Vành đai Tiểu hành tinh, Sao chổi Halley và các thiên thạch nguy hiểm.</p>
            </div>

            <div class="manual-step-card">
              <h3>✨ Hệ Sao Ngoài (Extrasolar Stars)</h3>
              <p>Alpha Centauri, Proxima Centauri, Sirius, Vega, Betelgeuse, v.v. với quang phổ Harvard thực tế.</p>
            </div>

            <div class="manual-step-card">
              <h3>🌌 Vũ Trụ Sâu (Deep Cosmos)</h3>
              <p>Tinh vân Lạp Hộ (Orion Nebula), Tinh vân Con Cua, Thiên hà Tiên Nữ Andromeda.</p>
            </div>

            <div class="manual-step-card">
              <h3>🚀 Dịch Chuyển Quỹ Đạo Tức Thì (Instant Warp)</h3>
              <p>Khi nhấp vào bất kỳ thiên thể nào, mở bảng hồ sơ và nhấp nút <strong>🚀 ESTABLISH ORBIT HERE</strong>. Tàu vũ trụ sẽ lập tức dịch chuyển tới vị trí an toàn và đạt vận tốc tròn Keplerian chuẩn xác:<br>
              <code>v_circ = &radic;(G &bull; M / r)</code><br>
              Giúp bạn ngay lập tức bay quanh thiên thể đó mà không mất thời gian chờ đợi hàng tháng!</p>
            </div>
          </div>
        </div>
      ` : `
        <div class="manual-section">
          <div class="manual-banner">
            <div class="manual-banner-badge">CELESTIAL NAVIGATION</div>
            <h2 class="manual-banner-title">COSMIC ORRERY & INSTANT WARP INSERTION</h2>
            <p class="manual-banner-desc">Target planets, extrasolar stars, and hazardous asteroids with instant Keplerian orbital insertion.</p>
          </div>

          <div class="manual-steps-grid">
            <div class="manual-step-card">
              <h3>☀️ Solar System</h3>
              <p>The Sun, Mercury, Venus, Earth, Moon, Mars, Asteroid Belt, Jupiter, Saturn, Uranus, Neptune, Halley's Comet, and NASA PHAs.</p>
            </div>

            <div class="manual-step-card">
              <h3>✨ Extrasolar Stars</h3>
              <p>Alpha Centauri, Proxima, Sirius, Vega, Betelgeuse with authentic Harvard spectral class colors.</p>
            </div>

            <div class="manual-step-card">
              <h3>🌌 Deep Cosmos</h3>
              <p>Orion Nebula, Crab Nebula, and the Andromeda Galaxy.</p>
            </div>

            <div class="manual-step-card">
              <h3>🚀 Instant Warp Orbital Insertion</h3>
              <p>Click any celestial body and press <strong>🚀 ESTABLISH ORBIT HERE</strong> to warp directly into a stable Keplerian circular orbit around that world:<br>
              <code>v_circ = &radic;(G &bull; M / r)</code><br>
              Instant orbit capture without years of interplanetary Hohmann transfers!</p>
            </div>
          </div>
        </div>
      `;
    }

    if (tabId === 'lobby') {
      return isVi ? `
        <div class="manual-section">
          <div class="manual-banner">
            <div class="manual-banner-badge">TỐI ƯU HÓA SẢNH CHỜ</div>
            <h2 class="manual-banner-title">THU GỌN GIAO DIỆN & GÓC QUAN SÁT ĐIỆN ẢNH</h2>
            <p class="manual-banner-desc">Tạo không gian Hangar thoáng đãng, lộng lẫy để ngắm trọn vẹn tàu vũ trụ 3D chất lượng 4K.</p>
          </div>

          <div class="manual-steps-grid">
            <div class="manual-step-card">
              <div class="step-badge">◀ BẢNG TRÁI</div>
              <h3>Thu Gọn Bảng Nhiệm Vụ</h3>
              <p>Nhấp vào tab <strong>◀ MISSIONS</strong> ở mép ngoài hoặc nút <strong>◀</strong> trên thanh tiêu đề của bảng <em>01 // SECTOR OPERATIONS</em>. Bảng sẽ trượt vào mép trái, để lại một thanh cầm nhỏ <strong>▶</strong> để bạn mở lại bất kỳ lúc nào.</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">▶ BẢNG PHẢI</div>
              <h3>Thu Gọn Bảng Avionics</h3>
              <p>Nhấp vào tab <strong>▶ AVIONICS</strong> ở mép ngoài hoặc nút <strong>▶</strong> trên thanh tiêu đề của bảng <em>02 // AVIONICS</em>. Bảng sẽ trượt vào mép phải, để lại thanh cầm nhỏ <strong>◀</strong> để mở lại.</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">▼ ĐÁY MÀN HÌNH</div>
              <h3>Thu Gọn Bảng Trang Bị & Phóng</h3>
              <p>Nhấp vào thanh <strong>▼ HIDE DOCK</strong> ở phía trên khu vực trang bị. Toàn bộ khay trang bị và bệ phóng sẽ trượt xuống mép dưới, hiển thị thanh nhỏ <strong>▲ SHOW DOCK</strong> nổi ở đáy màn hình.</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">👁 CINEMATIC</div>
              <h3>Chế Độ Quan Sát Điện Ảnh 360°</h3>
              <p>Nhấn nút <strong>👁 CINEMATIC VIEW</strong> trên thanh công cụ trên cùng để ẩn toàn bộ HUD và kích hoạt camera xoay tự do 360° quanh tàu vũ trụ 4K!</p>
            </div>
          </div>

          <div class="manual-callout-tip">
            <strong>✨ Trải nghiệm hoàn hảo:</strong> Khi thu gọn cả 3 bảng, bạn sẽ có một góc nhìn Hangar hoàn toàn sạch sẽ, không bị che khuất, ngắm nhìn ánh sáng phản chiếu PBR trên lớp sơn kim loại và phù hiệu cờ Tổ quốc với độ sắc nét tuyệt đối!
          </div>
        </div>
      ` : `
        <div class="manual-section">
          <div class="manual-banner">
            <div class="manual-banner-badge">LOBBY ERGONOMICS</div>
            <h2 class="manual-banner-title">COLLAPSIBLE PANELS & CINEMATIC CAMERA</h2>
            <p class="manual-banner-desc">Enjoy an unobstructed 4K view of your spacecraft with single-click collapsible blades.</p>
          </div>

          <div class="manual-steps-grid">
            <div class="manual-step-card">
              <div class="step-badge">◀ LEFT BLADE</div>
              <h3>Collapse Sector Missions</h3>
              <p>Click the <strong>◀ MISSIONS</strong> edge tab or the header <strong>◀</strong> button on <em>01 // SECTOR OPERATIONS</em>. The panel slides off-screen, leaving a slim <strong>▶</strong> handle on the edge to re-open.</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">▶ RIGHT BLADE</div>
              <h3>Collapse Avionics Telemetry</h3>
              <p>Click the <strong>▶ AVIONICS</strong> edge tab or the header <strong>▶</strong> button on <em>02 // AVIONICS</em>. The panel slides off-screen, leaving a slim <strong>◀</strong> handle on the right edge.</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">▼ BOTTOM DOCK</div>
              <h3>Collapse Outfitting Shelf</h3>
              <p>Click the <strong>▼ HIDE DOCK</strong> tab centered above the launch bar. The dock glides down, leaving a floating <strong>▲ SHOW DOCK</strong> tab at the bottom edge.</p>
            </div>

            <div class="manual-step-card">
              <div class="step-badge">👁 CINEMATIC</div>
              <h3>360° Cinematic Spacecraft View</h3>
              <p>Click <strong>👁 CINEMATIC VIEW</strong> in the top header to hide all interface elements and enter full-screen 360° orbital camera rotation!</p>
            </div>
          </div>

          <div class="manual-callout-tip">
            <strong>✨ Pristine Presentation:</strong> Collapsing all three panels gives you a clean, unobstructed studio view to admire your 4K PBR spacecraft and custom decals without interface distraction!
          </div>
        </div>
      `;
    }

    return '';
  }

  public startSpotlightTour(stepIndex = 0): void {
    const manualModal = document.getElementById('flight-manual-modal');
    if (manualModal) manualModal.style.display = 'none';

    this.isTourActive = true;
    this.currentTourStep = Math.max(0, Math.min(TOUR_STEPS.length - 1, stepIndex));
    this.playClickSound();

    const overlay = document.getElementById('spotlight-tour-overlay');
    if (overlay) overlay.style.display = 'block';

    if (!this.tourResizeListener) {
      this.tourResizeListener = () => this.updateTourSpotlight();
      window.addEventListener('resize', this.tourResizeListener);
    }
    if (!this.tourKeyListener) {
      this.tourKeyListener = (e: KeyboardEvent) => {
        if (!this.isTourActive) return;
        if (e.key === 'Escape') {
          this.endSpotlightTour();
        } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
          this.nextTourStep();
        } else if (e.key === 'ArrowLeft') {
          this.prevTourStep();
        }
      };
      window.addEventListener('keydown', this.tourKeyListener);
    }

    setTimeout(() => this.updateTourSpotlight(), 60);
  }

  public nextTourStep(): void {
    this.playClickSound();
    if (this.currentTourStep < TOUR_STEPS.length - 1) {
      this.currentTourStep++;
      this.updateTourSpotlight();
    } else {
      this.endSpotlightTour();
    }
  }

  public prevTourStep(): void {
    this.playClickSound();
    if (this.currentTourStep > 0) {
      this.currentTourStep--;
      this.updateTourSpotlight();
    }
  }

  public endSpotlightTour(): void {
    this.isTourActive = false;
    this.playClickSound();
    const overlay = document.getElementById('spotlight-tour-overlay');
    if (overlay) overlay.style.display = 'none';
    if (this.tourResizeListener) {
      window.removeEventListener('resize', this.tourResizeListener);
      this.tourResizeListener = null;
    }
    if (this.tourKeyListener) {
      window.removeEventListener('keydown', this.tourKeyListener);
      this.tourKeyListener = null;
    }
  }

  private updateTourSpotlight(): void {
    if (!this.isTourActive) return;
    const overlay = document.getElementById('spotlight-tour-overlay');
    const box = document.getElementById('spotlight-box');
    const tooltip = document.getElementById('spotlight-tooltip');
    if (!overlay || !box || !tooltip) return;

    const isVi = this.currentLanguage === 'vi';
    const step = TOUR_STEPS[this.currentTourStep];
    if (!step) {
      this.endSpotlightTour();
      return;
    }

    // Automatically expand any collapsed blade if targeted
    if (step.targetId === 'blade-missions') {
      const el = document.getElementById('blade-missions');
      if (el?.classList.contains('collapsed')) {
        el.classList.remove('collapsed');
        const icon = document.querySelector('#btn-toggle-blade-left .tab-icon');
        if (icon) icon.textContent = '◀';
      }
    } else if (step.targetId === 'blade-diagnostics') {
      const el = document.getElementById('blade-diagnostics');
      if (el?.classList.contains('collapsed')) {
        el.classList.remove('collapsed');
        const icon = document.querySelector('#btn-toggle-blade-right .tab-icon');
        if (icon) icon.textContent = '▶';
      }
    } else if (step.targetId === 'dock-bottom' || step.targetId === 'btn-approve-launch' || step.targetId === 'btn-toggle-dock-bottom') {
      const el = document.getElementById('dock-bottom');
      if (el?.classList.contains('collapsed')) {
        el.classList.remove('collapsed');
        const icon = document.querySelector('#btn-toggle-dock-bottom .dock-tab-icon');
        const label = document.querySelector('#btn-toggle-dock-bottom .dock-tab-label');
        if (icon) icon.textContent = '▼';
        if (label) label.textContent = isVi ? 'THU GỌN BẢNG' : 'HIDE DOCK';
      }
    }

    const target = document.getElementById(step.targetId);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const pad = 10;
    box.style.top = `${Math.max(0, rect.top - pad)}px`;
    box.style.left = `${Math.max(0, rect.left - pad)}px`;
    box.style.width = `${rect.width + pad * 2}px`;
    box.style.height = `${rect.height + pad * 2}px`;

    const badgeEl = document.getElementById('tour-step-badge');
    const titleEl = document.getElementById('tour-step-title');
    const descEl = document.getElementById('tour-step-desc');
    const hintEl = document.getElementById('tour-hint-text');
    const btnPrev = document.getElementById('btn-tour-prev') as HTMLButtonElement | null;
    const btnNext = document.getElementById('btn-tour-next') as HTMLButtonElement | null;
    const btnSkip = document.getElementById('btn-tour-skip') as HTMLButtonElement | null;

    if (badgeEl) badgeEl.textContent = isVi ? `BƯỚC ${this.currentTourStep + 1} / ${TOUR_STEPS.length}` : `STEP ${this.currentTourStep + 1} / ${TOUR_STEPS.length}`;
    if (titleEl) titleEl.textContent = isVi ? step.titleVi : step.titleEn;
    if (descEl) descEl.textContent = isVi ? step.descVi : step.descEn;
    if (hintEl) hintEl.textContent = isVi ? step.hintVi : step.hintEn;

    const dotsContainer = document.getElementById('tour-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = TOUR_STEPS.map((_, i) => 
        `<span class="spotlight-dot ${i === this.currentTourStep ? 'active' : ''}"></span>`
      ).join('');
    }

    if (btnPrev) {
      btnPrev.style.display = this.currentTourStep === 0 ? 'none' : 'inline-block';
      btnPrev.textContent = isVi ? '◀ Quay lại' : '◀ Prev';
    }
    if (btnNext) {
      const isLast = this.currentTourStep === TOUR_STEPS.length - 1;
      btnNext.textContent = isLast 
        ? (isVi ? 'Hoàn tất 🚀' : 'Finish 🚀') 
        : (isVi ? 'Tiếp tục ▶' : 'Next ▶');
    }
    if (btnSkip) {
      btnSkip.textContent = isVi ? 'Bỏ qua tour' : 'Skip tour';
    }

    const tooltipWidth = 360;
    const tooltipHeight = 220;
    let tLeft = 0;
    let tTop = 0;

    if (step.preferredPos === 'right') {
      tLeft = rect.right + 24;
      tTop = Math.max(80, Math.min(window.innerHeight - tooltipHeight - 30, rect.top));
    } else if (step.preferredPos === 'left') {
      tLeft = rect.left - tooltipWidth - 24;
      tTop = Math.max(80, Math.min(window.innerHeight - tooltipHeight - 30, rect.top));
    } else if (step.preferredPos === 'top') {
      tLeft = Math.max(20, Math.min(window.innerWidth - tooltipWidth - 20, rect.left + (rect.width - tooltipWidth) / 2));
      tTop = Math.max(20, rect.top - tooltipHeight - 24);
    } else {
      tLeft = Math.max(20, Math.min(window.innerWidth - tooltipWidth - 20, rect.left + (rect.width - tooltipWidth) / 2));
      tTop = Math.min(window.innerHeight - tooltipHeight - 20, rect.bottom + 20);
    }

    tLeft = Math.max(16, Math.min(window.innerWidth - tooltipWidth - 16, tLeft));
    tTop = Math.max(16, Math.min(window.innerHeight - tooltipHeight - 16, tTop));

    tooltip.style.left = `${tLeft}px`;
    tooltip.style.top = `${tTop}px`;
  }

  private updateHeaderShipInfo() {
    const t = getTexts(this.currentLanguage);
    const shipTitle = document.getElementById('hangar-ship-name');
    const shipClass = document.getElementById('hangar-ship-class');
    if (this.isCustomModelLoaded && this.customModelName) {
      if (shipTitle) shipTitle.textContent = this.customModelName.toUpperCase().replace(/\.[^/.]+$/, '');
      if (shipClass) shipClass.textContent = t.customAssetClass;
      return;
    }
    const craft = SPACECRAFT_FLEET.find(c => c.id === this.selectedChassisId);
    const loc = getSpacecraftText(this.selectedChassisId, this.currentLanguage);
    if (shipTitle) shipTitle.textContent = (loc ? loc.name : craft?.name || 'Orbital Spacecraft').toUpperCase();
    if (shipClass) shipClass.textContent = loc ? loc.desc : (craft?.desc || '');
  }

  private updatePhaBadgeLanguage() {
    if (this.lastPhaDistAU === null) return;
    const t = getTexts(this.currentLanguage);
    const badgeEl = document.getElementById('pha-hazard-badge');
    if (!badgeEl) return;
    if (this.lastPhaDistAU < 0.05) {
      badgeEl.textContent = t.hudPhaIntercept;
    } else if (this.lastPhaDistAU < 0.3) {
      badgeEl.textContent = t.hudPhaApproaching;
    } else {
      badgeEl.textContent = t.hudPhaTracking;
    }
  }

  private updateDebriefLanguage() {
    const t = getTexts(this.currentLanguage);
    const setTxt = (id: string, val: string) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    const debriefGenericView = document.getElementById('debrief-generic-view');
    const debriefDartView = document.getElementById('debrief-dart-view');

    if (this.selectedMission.id === 'nasa_dart') {
      if (debriefGenericView) debriefGenericView.style.display = 'none';
      if (debriefDartView) debriefDartView.style.display = 'block';

      setTxt('dart-debrief-title', t.dartDebriefTitle);
      setTxt('dart-lbl-sim-title', t.dartSimSectionTitle);
      setTxt('dart-lbl-field-body', t.dartFieldImpactBody);
      setTxt('dart-lbl-field-speed', t.dartFieldRelativeSpeed);
      setTxt('dart-lbl-field-pre', t.dartFieldPreOrbit);
      setTxt('dart-lbl-field-post', t.dartFieldPostOrbit);
      setTxt('dart-lbl-field-delta', t.dartFieldPeriodDelta);
      setTxt('dart-lbl-field-outcome', t.dartFieldOutcome);
      setTxt('dart-lbl-real-title', t.dartRealSectionTitle);
      setTxt('dart-txt-real-intro', t.dartRealContextIntro);
      setTxt('dart-txt-real-source', t.dartRealSourceRef);

      const realBaseEl = document.getElementById('dart-txt-real-baseline');
      if (realBaseEl) realBaseEl.innerHTML = `• <strong>${t.dartRealBaseline}</strong>`;
      const realInitEl = document.getElementById('dart-txt-real-initial');
      if (realInitEl) realInitEl.innerHTML = `• <strong>${t.dartRealInitialResult}</strong>`;
      const realUpdEl = document.getElementById('dart-txt-real-updated');
      if (realUpdEl) realUpdEl.innerHTML = `• <strong>${t.dartRealUpdatedStudy}</strong>`;

      setTxt('debrief-btn-dart-retry', t.dartBtnRetry);
      setTxt('debrief-btn-dart-restart', t.dartBtnReturnHangar);

      // Populate DART simulation metrics from dartSimulation.result
      const res = this.dartSimulation?.result;
      if (res) {
        let bodyName = '--';
        if (res.impactBodyId === 'dimorphos') bodyName = '🎯 Dimorphos';
        else if (res.impactBodyId === 'didymos') bodyName = '65803 Didymos';
        setTxt('dart-res-body', bodyName);
        setTxt('dart-res-speed', `${formatNum(res.impactSpeedKmS, this.currentLanguage, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km/s`);
        setTxt('dart-res-pre-orbit', res.preImpactOrbit.periodFormatted);
        setTxt('dart-res-post-orbit', res.postImpactOrbit ? res.postImpactOrbit.periodFormatted : '--');

        const deltaEl = document.getElementById('dart-res-delta');
        if (deltaEl) {
          if (res.periodChangeMinutes !== null && isFinite(res.periodChangeMinutes)) {
            const minStr = formatNum(Math.abs(res.periodChangeMinutes), this.currentLanguage, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
            const secStr = formatNum(Math.abs(res.periodChangeSeconds || 0), this.currentLanguage, { maximumFractionDigits: 0 });
            deltaEl.textContent = `${res.periodChangeMinutes <= 0 ? '-' : '+'}${minStr} min (${res.periodChangeMinutes <= 0 ? '-' : '+'}${secStr} s)`;
            deltaEl.style.color = res.periodChangeMinutes <= 0 ? '#4ade80' : '#ef4444';
          } else {
            deltaEl.textContent = '--';
            deltaEl.style.color = '#94a3b8';
          }
        }

        let outcomeText = t.dartOutcomeInvalid;
        let reasonText = '';
        let adviceText = '';

        if (res.state === 'completed') {
          outcomeText = t.dartOutcomeCompleted;
          reasonText = this.currentLanguage === 'vi'
            ? 'Va chạm động năng trực tiếp đối đầu đã truyền xung lực làm giảm vận tốc quỹ đạo của Dimorphos quanh Didymos, rút ngắn chu kỳ quỹ đạo thành công vượt ngưỡng 73 giây của NASA.'
            : 'Direct head-on retrograde kinetic impact transferred momentum, reducing orbital velocity and shortening the orbital period of Dimorphos around Didymos well beyond NASA\'s 73-second threshold.';
          adviceText = this.currentLanguage === 'vi'
            ? 'Tái hiện xuất sắc! Bạn có thể thử nghiệm tắt SMART Nav để tự tay điều khiển lái tàu thủ công.'
            : 'Excellent reconstruction! You can retry with SMART Nav disabled to test manual piloting.';
        } else if (res.state === 'insufficient_period_change') {
          outcomeText = t.dartOutcomeInsufficient;
          reasonText = this.currentLanguage === 'vi'
            ? 'Tàu đã va chạm Dimorphos nhưng góc tiếp cận hoặc hướng truyền xung không làm giảm chu kỳ đủ ngưỡng 73 giây yêu cầu.'
            : 'Spacecraft impacted Dimorphos, but the approach angle or impulse direction failed to shorten the orbit by the required 73-second threshold.';
          adviceText = this.currentLanguage === 'vi'
            ? 'Gợi ý: Căn chỉnh hướng tiếp cận trực diện đối đầu (retrograde) để triệt tiêu vận tốc quỹ đạo hiệu quả nhất.'
            : 'Tip: Align approach head-on (retrograde) against orbital motion to maximize speed reduction.';
        } else if (res.state === 'hit_wrong_body') {
          outcomeText = t.dartOutcomeWrongBody;
          reasonText = this.currentLanguage === 'vi'
            ? 'Tàu đã va chạm vào tiểu hành tinh chính Didymos thay vì vệ tinh nhỏ Dimorphos. Mục tiêu thử nghiệm làm đổi quỹ đạo không đạt được.'
            : 'The spacecraft impacted the primary asteroid Didymos instead of the moonlet Dimorphos. Deflection objective not met.';
          adviceText = this.currentLanguage === 'vi'
            ? 'Gợi ý: Hãy nhắm kỹ vào mục tiêu nhỏ Dimorphos quay quanh Didymos và bật hỗ trợ SMART Nav.'
            : 'Tip: Focus tracking on the smaller orbiting moonlet Dimorphos and keep SMART Nav enabled.';
        } else if (res.state === 'missed') {
          outcomeText = t.dartOutcomeMissed;
          reasonText = this.currentLanguage === 'vi'
            ? 'Tàu bay trượt qua cả Didymos và Dimorphos mà không xảy ra va chạm. Không có động năng nào được truyền.'
            : 'Spacecraft missed both Didymos and Dimorphos without impact. No kinetic momentum transfer occurred.';
          adviceText = this.currentLanguage === 'vi'
            ? 'Gợi ý: Bật chế độ hỗ trợ dẫn đường SMART Nav và giữ hướng ngắm trung tâm mục tiêu.'
            : 'Tip: Enable SMART Nav guidance assist and keep target centered in the approach corridor.';
        }

        setTxt('dart-res-outcome', outcomeText);
        setTxt('dart-res-reason', reasonText);
        setTxt('dart-res-advice', adviceText);
      }
      return;
    }

    // Generic debrief view for all other missions
    if (debriefGenericView) debriefGenericView.style.display = 'block';
    if (debriefDartView) debriefDartView.style.display = 'none';

    setTxt('debrief-title', t.debriefTitle);
    setTxt('debrief-lbl-science', t.debriefScienceLabel);
    setTxt('debrief-lbl-budget', t.debriefBudgetLabel);
    setTxt('debrief-lbl-reliability', t.debriefReliabilityLabel);
    setTxt('debrief-lbl-cert', t.debriefCertLabel);
    setTxt('debrief-btn-restart', t.debriefReturnBtn);
    setTxt('debrief-score-reliability', '3D SIM');

    const missionLoc = getMissionText(this.selectedMission.id, this.currentLanguage);
    const destination = missionLoc ? missionLoc.destination : this.selectedMission.destination;
    const isSuccess = this.currentScienceCollected >= this.selectedMission.minSciencePoints;
    const rankEl = document.getElementById('debrief-rank');
    const summaryEl = document.getElementById('debrief-summary');
    if (rankEl) rankEl.textContent = isSuccess ? t.debriefRankSuccess : t.debriefRankPartial;
    if (summaryEl) {
      const tpl = isSuccess ? t.debriefSummarySuccess : t.debriefSummaryPartial;
      summaryEl.innerHTML = formatTpl(tpl, {
        actual: formatNum(this.currentScienceCollected, this.currentLanguage),
        target: formatNum(this.selectedMission.minSciencePoints, this.currentLanguage),
        destination
      });
    }
  }

  public setLanguage(lang: string) {
    const resolved = setCurrentLang(lang);
    const t = getTexts(resolved);
    this.currentLanguage = resolved;

    const langSelect = document.getElementById('select-game-language') as HTMLSelectElement | null;
    if (langSelect && langSelect.value !== resolved) {
      langSelect.value = resolved;
    }

    const qualitySelect = document.getElementById('select-game-quality') as HTMLSelectElement | null;
    if (qualitySelect) {
      qualitySelect.title = t.qualityTitle;
      qualitySelect.setAttribute('aria-label', t.qualityTitle);
      const val = qualitySelect.value || getStoredQuality();
      qualitySelect.innerHTML = `
        <option value="low" ${val === 'low' ? 'selected' : ''}>${t.qualityLow}</option>
        <option value="balanced" ${val === 'balanced' ? 'selected' : ''}>${t.qualityBalanced}</option>
        <option value="high" ${val === 'high' ? 'selected' : ''}>${t.qualityHigh}</option>
      `;
    }


    // Topbar
    const brandSub = document.querySelector('.brand-sub');
    if (brandSub) brandSub.textContent = t.brandSub;
    const brandTag = document.getElementById('brand-tag');
    if (brandTag) brandTag.textContent = t.brandTag;
    const creditLabel = document.querySelector('.pill-label');
    if (creditLabel) creditLabel.textContent = t.creditsLabel;

    const langWrap = document.getElementById('lang-selector-wrap');
    if (langWrap) langWrap.title = t.langSelectorTitle;
    if (langSelect) langSelect.setAttribute('aria-label', t.langSelectorAria);

    const btnTour = document.getElementById('btn-start-spotlight-tour');
    if (btnTour) btnTour.textContent = t.spotlightTourBtn;

    if (this.isTourActive) {
      this.updateTourSpotlight();
    }

    const btnToggleCinematic = document.getElementById('btn-toggle-cinematic');
    if (btnToggleCinematic) { btnToggleCinematic.textContent = t.cinematicBtn; btnToggleCinematic.title = t.cinematicTitle; }
    const btnExitCinematic = document.getElementById('btn-exit-cinematic');
    if (btnExitCinematic) btnExitCinematic.textContent = t.restoreFlightBtn;

    this.updateHeaderShipInfo();

    const manualModal = document.getElementById('flight-manual-modal');
    if (manualModal && manualModal.style.display === 'flex') {
      this.renderFlightManualContent();
    }

    const isVi = lang === 'vi';
    const dockBottom = document.getElementById('dock-bottom');
    const isCollapsedDock = dockBottom?.classList.contains('collapsed');
    const dockLabel = document.querySelector('#btn-toggle-dock-bottom .dock-tab-label');
    if (dockLabel) {
      dockLabel.textContent = isCollapsedDock
        ? (isVi ? 'MỞ RỘNG BẢNG TRANG BỊ' : 'SHOW DOCK')
        : (isVi ? 'THU GỌN BẢNG' : 'HIDE DOCK');
    }

    const setTxt = (id: string, text: string) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    // Left Blade: Missions (both ID and class)
    setTxt('blade-missions-title', t.sectorOpsTitle);
    setTxt('blade-missions-badge', t.targetsBadge);
    const sectorTitle = document.querySelector('.hud-blade-left .blade-title, #blade-missions .blade-title');
    if (sectorTitle) sectorTitle.textContent = t.sectorOpsTitle;
    const sectorBadge = document.querySelector('.hud-blade-left .blade-badge, #blade-missions .blade-badge');
    if (sectorBadge) sectorBadge.textContent = t.targetsBadge;

    // Right Blade: Diagnostics (both ID and class)
    setTxt('blade-telemetry-title', t.avionicsDiagTitle);
    setTxt('blade-telemetry-badge', t.avionicsBadge);
    const avionicsTitle = document.querySelector('.hud-blade-right .blade-title, #blade-diagnostics .blade-title');
    if (avionicsTitle) avionicsTitle.textContent = t.avionicsDiagTitle;
    const avionicsBadge = document.querySelector('.hud-blade-right .blade-badge, #blade-diagnostics .blade-badge');
    if (avionicsBadge) avionicsBadge.textContent = t.avionicsBadge;

    // Gauge Labels
    setTxt('lbl-metric-budget', t.budgetSurplus);
    setTxt('lbl-metric-mass', t.totalMassLabel);
    setTxt('lbl-metric-power', t.powerBalance);
    setTxt('lbl-metric-deltav', t.calcDeltaV);
    setTxt('lbl-metric-science', t.scienceReturn);
    const metricLabels = document.querySelectorAll('.hud-blade-right .gauge-box .gauge-label > span:first-child');
    if (metricLabels.length >= 5) {
      metricLabels[0].textContent = t.budgetSurplus;
      metricLabels[1].textContent = t.totalMassLabel;
      metricLabels[2].textContent = t.powerBalance;
      metricLabels[3].textContent = t.calcDeltaV;
      metricLabels[4].textContent = t.scienceReturn;
    }

    // Category Tabs (both ID and attribute selector)
    setTxt('tab-btn-chassis', t.tabChassis);
    setTxt('tab-btn-flags', t.tabFlags);
    setTxt('tab-btn-power', t.tabPower);
    setTxt('tab-btn-tech', t.tabTech);
    setTxt('tab-btn-engines', t.tabEngines);
    setTxt('tab-btn-carriers', t.tabCarriers);
    const tabChassis = document.querySelector('[data-tab="chassis"]');
    if (tabChassis) tabChassis.textContent = t.tabChassis;
    const tabFlags = document.querySelector('[data-tab="flags"]');
    if (tabFlags) tabFlags.textContent = t.tabFlags;
    const tabPower = document.querySelector('[data-tab="power"]');
    if (tabPower) tabPower.textContent = t.tabPower;
    const tabTech = document.querySelector('[data-tab="tech"]');
    if (tabTech) tabTech.textContent = t.tabTech;
    const tabEngines = document.querySelector('[data-tab="engines"]');
    if (tabEngines) tabEngines.textContent = t.tabEngines;
    const tabCarriers = document.querySelector('[data-tab="carriers"]');
    if (tabCarriers) tabCarriers.textContent = t.tabCarriers;

    // Launch Button
    const launchBtn = document.getElementById('btn-approve-launch');
    if (launchBtn) launchBtn.innerHTML = `<span>⚡</span> ${t.launchBtn}`;

    // 3D Asset Vault Modal
    const setVaultTxt = (id: string, val: string, isHtml = false) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (isHtml) el.innerHTML = val;
      else el.textContent = val;
    };
    setVaultTxt('vault-title', t.vaultTitle);
    setVaultTxt('vault-subtitle', t.vaultSubtitle);
    setVaultTxt('vault-intro', t.vaultIntro, true);
    setVaultTxt('vault-src-nasa-title', t.vaultSourceNasaTitle);
    setVaultTxt('vault-src-nasa-desc', t.vaultSourceNasaDesc);
    setVaultTxt('vault-src-kenney-title', t.vaultSourceKenneyTitle);
    setVaultTxt('vault-src-kenney-desc', t.vaultSourceKenneyDesc);
    setVaultTxt('vault-src-smithsonian-title', t.vaultSourceSmithsonianTitle);
    setVaultTxt('vault-src-smithsonian-desc', t.vaultSourceSmithsonianDesc);
    setVaultTxt('vault-src-sketchfab-title', t.vaultSourceSketchfabTitle);
    setVaultTxt('vault-src-sketchfab-desc', t.vaultSourceSketchfabDesc);
    setVaultTxt('vault-btn-import-shortcut', t.vaultImportBtn);
    document.getElementById('vault-btn-close')?.setAttribute('aria-label', t.vaultCloseAria);

    // Flight HUD (actual selectors: #hud-flight-panel, #hud-body-content .hud-row > span:first-child)
    const missionLoc = getMissionText(this.selectedMission.id, resolved);
    const hudMissionEl = document.getElementById('hud-mission-name');
    if (hudMissionEl) hudMissionEl.textContent = (missionLoc ? missionLoc.title : this.selectedMission.title).toUpperCase();
    const hudTargetEl = document.getElementById('hud-target-name');
    if (hudTargetEl) hudTargetEl.textContent = missionLoc ? missionLoc.destination : this.selectedMission.destination;

    const hudTelemBadge = document.getElementById('hud-telemetry-badge');
    if (hudTelemBadge) hudTelemBadge.textContent = t.hudTelemetry;
    const hudDragHandle = document.getElementById('hud-drag-handle');
    if (hudDragHandle) hudDragHandle.title = t.hudDragTitle;
    const hudBtnMin = document.getElementById('hud-btn-minimize');
    if (hudBtnMin) hudBtnMin.title = t.hudMinimizeTitle;

    setTxt('hud-lbl-target', t.hudTargetSector);
    setTxt('hud-lbl-science', t.hudCosmicIntel);
    setTxt('hud-lbl-power', t.hudArcOutput);
    setTxt('hud-lbl-status', t.hudJarvisStatus);

    const hudLabels = document.querySelectorAll('#hud-body-content .hud-row > span:first-child');
    if (hudLabels.length >= 4) {
      hudLabels[0].textContent = t.hudTargetSector;
      hudLabels[1].textContent = t.hudCosmicIntel;
      hudLabels[2].textContent = t.hudArcOutput;
      hudLabels[3].textContent = t.hudJarvisStatus;
    }

    const hudStatusEl = document.getElementById('hud-status-text');
    if (hudStatusEl) {
      hudStatusEl.textContent = this.isTrajectoryLocked ? t.hudStatusLocked : t.hudStatusInitial;
    }

    setVaultTxt('hud-wsmv-header', t.hudWsmvHeader);
    setVaultTxt('wsmv-lbl-sma', t.hudWsmvSma);
    setVaultTxt('wsmv-lbl-ecc', t.hudWsmvEcc);
    setVaultTxt('wsmv-lbl-inc', t.hudWsmvInc);
    setVaultTxt('wsmv-lbl-node', t.hudWsmvNode);
    setVaultTxt('wsmv-lbl-peri', t.hudWsmvPeri);
    setVaultTxt('wsmv-lbl-head', t.hudWsmvHead);
    setVaultTxt('pha-nearest-label', t.hudNearestPha);
    setVaultTxt('pha-range-label', t.hudPhaRange);
    this.updatePhaBadgeLanguage();

    const btnDebrief = document.getElementById('hud-btn-debrief');
    if (btnDebrief) btnDebrief.textContent = t.hudIntelDebrief;
    const btnHangar = document.getElementById('hud-btn-reconfigure');
    if (btnHangar) btnHangar.textContent = t.hudStarkArmory;

    // Debrief Modal
    this.updateDebriefLanguage();

    // Re-render dynamic lists & avionics
    this.renderMissions();
    this.renderArmoryGrid();
    this.updateLiveTelemetry();
  }

  private launchHyperspace() {
    this.isHangarVisible = false;
    const t = getTexts(this.currentLanguage);
    const missionLoc = getMissionText(this.selectedMission.id, this.currentLanguage);

    const modal = document.getElementById('nasa-mission-modal');
    if (modal) modal.style.display = 'none';

    const hud = document.getElementById('nasa-flight-hud');
    if (hud) hud.style.display = 'flex';

    document.getElementById('hud-mission-name')!.textContent = (missionLoc ? missionLoc.title : this.selectedMission.title).toUpperCase();
    document.getElementById('hud-target-name')!.textContent = missionLoc ? missionLoc.destination : this.selectedMission.destination;

    if (this.missionTickerId) {
      clearInterval(this.missionTickerId);
      this.missionTickerId = null;
    }

    this.isMissionActive = true;
    this.isTrajectoryLocked = false;
    this.currentScienceCollected = 0;
    this.missionTimer = 0;
    this.dartImpactHandled = false;
    this.dartLastTelemetryTime = performance.now();

    const liveScoreInit = document.getElementById('hud-science-live');
    if (liveScoreInit) liveScoreInit.textContent = `0 pts`;
    const statusInit = document.getElementById('hud-status-text');
    if (statusInit) {
      statusInit.textContent = t.hudStatusInitial;
      statusInit.style.color = 'var(--stark-cyan)';
    }

    const dartGncEl = document.getElementById('dart-flight-gnc-section');
    const wsmvEl = document.querySelector('.nasa-wsmv-section') as HTMLElement | null;
    const sciRow = document.getElementById('hud-lbl-science')?.parentElement;
    const pwrRow = document.getElementById('hud-lbl-power')?.parentElement;

    if (this.selectedMission.id === 'nasa_dart') {
      if (!this.dartSimulation) this.dartSimulation = new DartSimulation();
      this.dartSimulation.resetToInitialConditions();

      if (dartGncEl) dartGncEl.style.display = 'block';
      if (wsmvEl) wsmvEl.style.display = 'none';
      if (sciRow) sciRow.style.display = 'none';
      if (pwrRow) pwrRow.style.display = 'none';

      // Update guidance button in HUD
      const gncBtn = document.getElementById('dart-btn-toggle-guidance-hud');
      if (gncBtn) {
        const isAct = this.dartSimulation.guidanceAssistEnabled;
        gncBtn.textContent = isAct ? t.dartGuidanceActive : t.dartGuidanceManual;
        gncBtn.style.borderColor = isAct ? '#22c55e' : '#94a3b8';
        gncBtn.style.color = isAct ? '#4ade80' : '#cbd5e1';
      }

      // Trigger WebGL-Orbiter to switch body and scenario
      this.onLaunchCallback(this.selectedMission, {
        scenarioName: this.selectedMission.scenarioName
      });
      return;
    }

    if (dartGncEl) dartGncEl.style.display = 'none';
    if (wsmvEl) wsmvEl.style.display = 'block';
    if (sciRow) sciRow.style.display = 'flex';
    if (pwrRow) pwrRow.style.display = 'flex';

    // Trigger WebGL-Orbiter to switch body and scenario
    this.onLaunchCallback(this.selectedMission, {
      scenarioName: this.selectedMission.scenarioName
    });

    // Background intel data collection
    this.missionTickerId = setInterval(() => {
      if (!this.isMissionActive) {
        if (this.missionTickerId) { clearInterval(this.missionTickerId); this.missionTickerId = null; }
        return;
      }
      this.missionTimer += 1;
      this.currentScienceCollected += Math.floor(Math.random() * 5) + 3;

      const liveScore = document.getElementById('hud-science-live');
      if (liveScore) {
        liveScore.textContent = `${formatNum(this.currentScienceCollected, this.currentLanguage)} pts`;
      }

      if (this.missionTimer === 12) {
        this.isTrajectoryLocked = true;
        const st = document.getElementById('hud-status-text');
        if (st) {
          st.textContent = getTexts(this.currentLanguage).hudStatusLocked;
        }
      }
    }, 1000);
  }

  private showLobby() {
    this.isMissionActive = false;
    this.isHangarVisible = true;
    this.onReturnToHangarCallback?.();
    document.getElementById('nasa-mission-modal')!.style.display = 'flex';
    document.getElementById('nasa-flight-hud')!.style.display = 'none';
  }

  private showDebrief() {
    this.isMissionActive = false;
    this.isHangarVisible = false;
    const debrief = document.getElementById('nasa-debrief-modal');
    if (!debrief) return;

    debrief.style.display = 'flex';
    document.getElementById('debrief-score-science')!.textContent = `${formatNum(this.currentScienceCollected, this.currentLanguage)} pts`;
    document.getElementById('debrief-score-budget')!.textContent = document.getElementById('metric-budget')!.textContent || '$0M';
    this.updateDebriefLanguage();
  }

  public updateFlightTelemetry(o: any, headingApoapsis: number) {
    if (!o) return;

    if (this.isMissionActive && this.selectedMission.id === 'nasa_dart' && this.dartSimulation) {
      const now = performance.now();
      const dt = Math.min(0.1, Math.max(0.001, (now - this.dartLastTelemetryTime) / 1000));
      this.dartLastTelemetryTime = now;

      if (!this.dartImpactHandled) {
        const impactRes = this.dartSimulation.step(dt);

        // Update live GNC HUD
        const distMeters = vDistance(this.dartSimulation.dartPos, this.dartSimulation.dimorphosPos);
        const relSpeed = vLength(vSub(this.dartSimulation.dartVel, this.dartSimulation.dimorphosVel));
        const tgo = distMeters / Math.max(10, relSpeed);

        const valRange = document.getElementById('dart-val-range');
        if (valRange) {
          valRange.textContent = distMeters > 1000
            ? `${(distMeters / 1000).toFixed(2)} km`
            : `${distMeters.toFixed(0)} m`;
        }

        const valSpeed = document.getElementById('dart-val-speed');
        if (valSpeed) {
          valSpeed.textContent = `${(relSpeed / 1000).toFixed(2)} km/s`;
        }

        const valTgo = document.getElementById('dart-val-tgo');
        if (valTgo) {
          valTgo.textContent = `${tgo.toFixed(1)} s`;
        }

        const valOrbit = document.getElementById('dart-val-orbit');
        if (valOrbit) {
          valOrbit.textContent = this.dartSimulation.postImpactOrbit
            ? this.dartSimulation.postImpactOrbit.periodFormatted
            : '11h 55m 12s';
        }

        if (impactRes) {
          this.dartImpactHandled = true;
          if (typeof o.controllable !== 'undefined') o.controllable = false;

          const st = document.getElementById('hud-status-text');
          const t = getTexts(this.currentLanguage);
          if (st) {
            st.textContent = impactRes.impactBodyId === 'dimorphos'
              ? t.dartHudImpactConfirmed
              : (impactRes.impactBodyId === 'didymos' ? t.dartOutcomeWrongBody : t.dartOutcomeMissed);
            st.style.color = impactRes.meetsSuccessCriteria ? '#4ade80' : '#ef4444';
          }

          this.onDartImpactCallback?.(impactRes);

          setTimeout(() => {
            if (this.isMissionActive && this.selectedMission.id === 'nasa_dart') {
              this.showDebrief();
            }
          }, 2600);
        }
      }
      return;
    }

    // Keplerian Elements from NASA WSMV
    const smaEl = document.getElementById('wsmv-a');
    const eccEl = document.getElementById('wsmv-e');
    const incEl = document.getElementById('wsmv-i');
    const nodeEl = document.getElementById('wsmv-node');
    const periEl = document.getElementById('wsmv-peri');
    const headEl = document.getElementById('wsmv-head');

    if (smaEl && o.orbitalElements) {
      const oe = o.orbitalElements;
      smaEl.textContent = `${(oe.semimajor_axis || 0).toFixed(4)} AU`;
      if (eccEl) eccEl.textContent = (oe.eccentricity || 0).toFixed(4);
      if (incEl) incEl.textContent = `${(((oe.inclination || 0) * 180) / Math.PI).toFixed(2)}°`;
      if (nodeEl) nodeEl.textContent = `${(((oe.ascending_node || 0) * 180) / Math.PI).toFixed(2)}°`;
      if (periEl) periEl.textContent = `${(((oe.argument_of_perihelion || 0) * 180) / Math.PI).toFixed(2)}°`;
      if (headEl) headEl.textContent = `${(headingApoapsis || 0).toFixed(2)}°`;
    }

    // Proximity Radar for NASA Potentially Hazardous Asteroids (PHAs)
    try {
      const phaNames = [
        '99942 Apophis',
        '101955 Bennu',
        '65803 Didymos',
        '1950 DA',
        '433 Eros'
      ];

      const shipPos = o.getWorldPosition ? o.getWorldPosition() : null;
      if (!shipPos) return;

      let nearestName = '--';
      let nearestDistAU = Infinity;

      for (const name of phaNames) {
        const body = CelestialBody.findBody(name);
        if (body && body.getWorldPosition) {
          const bodyPos = body.getWorldPosition();
          const distAU = shipPos.distanceTo(bodyPos);
          if (distAU < nearestDistAU) {
            nearestDistAU = distAU;
            nearestName = name;
          }
        }
      }

      if (nearestDistAU < Infinity) {
        const nearestEl = document.getElementById('pha-nearest-name');
        const distEl = document.getElementById('pha-nearest-dist');
        const badgeEl = document.getElementById('pha-hazard-badge');
        const barFill = document.getElementById('pha-radar-fill');

        if (nearestEl) nearestEl.textContent = nearestName;
        if (distEl) {
          if (nearestDistAU < 0.005) {
            distEl.textContent = `${(nearestDistAU * AU).toLocaleString(undefined, { maximumFractionDigits: 0 })} km`;
          } else {
            distEl.textContent = `${nearestDistAU.toFixed(4)} AU`;
          }
        }

        this.lastPhaDistAU = nearestDistAU;
        if (badgeEl && barFill) {
          const t = getTexts(this.currentLanguage);
          if (nearestDistAU < 0.05) {
            badgeEl.textContent = t.hudPhaIntercept;
            badgeEl.className = 'hazard-badge-danger';
            barFill.style.width = '100%';
            barFill.style.background = '#ef4444';
          } else if (nearestDistAU < 0.3) {
            badgeEl.textContent = t.hudPhaApproaching;
            badgeEl.className = 'hazard-badge-warn';
            barFill.style.width = `${Math.max(10, Math.min(100, (1 - nearestDistAU / 0.3) * 100))}%`;
            barFill.style.background = '#f59e0b';
          } else {
            badgeEl.textContent = t.hudPhaTracking;
            badgeEl.className = 'hazard-badge-safe';
            barFill.style.width = '15%';
            barFill.style.background = '#06b6d4';
          }
        }
      }
    } catch (e) {
      // ignore non-critical radar error
    }
  }
}
