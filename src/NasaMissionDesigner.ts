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
    name: 'Quinjet Mk-VII (Avengers Stealth)',
    category: 'marvel',
    mass: 520,
    cost: 85,
    cap: 4,
    rarity: 'legendary',
    badge: '🛡️ AVENGERS',
    desc: 'Hợp kim Vibranium tàng hình đa năng với cánh swept-delta gập và quạt nâng VTOL kép.'
  },
  {
    id: 'milano',
    name: 'The Milano (Guardians Scout)',
    category: 'marvel',
    mass: 120,
    cost: 25,
    cap: 2,
    rarity: 'epic',
    badge: '🪐 GUARDIANS',
    desc: 'Chiến hạm thám hiểm siêu cơ động của Star-Lord với cánh chim và góc lượn linh hoạt.'
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
    desc: 'Tàu tuần dương chỉ huy liên sao viễn không với 4 cánh quét dài và cầu chỉ huy trung tâm.'
  },
  {
    id: 'sanctuary',
    name: 'Sanctuary Flagship (Titan Dreadnought)',
    category: 'marvel',
    mass: 6500,
    cost: 600,
    cap: 6,
    rarity: 'mythic',
    badge: '👑 DREADNOUGHT',
    desc: 'Siêu pháo đài vũ trụ Dreadnought hạng nặng bọc giáp kiên cố, mang tối đa 6 khí tài.'
  },

  // 2. Tàu tự thiết kế độc quyền (Custom High-End Flagships)
  {
    id: 'hyperion',
    name: 'Hyperion Interstellar Exploration Flagship',
    category: 'custom',
    mass: 5800,
    cost: 520,
    cap: 6,
    rarity: 'mythic',
    badge: '🌌 FLAGSHIP',
    desc: 'Soái hạm thám hiểm vũ trụ với sống pháo từ tính, dàn cảm biến và 4 động cơ đẩy ion.'
  },
  {
    id: 'ghostwing',
    name: 'Ghostwing Orbital Reconnaissance Interceptor',
    category: 'custom',
    mass: 310,
    cost: 65,
    cap: 3,
    rarity: 'legendary',
    badge: '⚡ INTERCEPTOR',
    desc: 'Tàu trinh sát đánh chặn siêu thanh cánh vát ngược với laser thông tin quang tử.'
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
    desc: 'Tàu con thoi không gian chính thức của NASA với cánh delta khí động học và gạch gốm tản nhiệt.',
    modelUrl: shuttleUrl
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
    desc: 'Tàu đổ bộ Mặt Trăng lịch sử Apollo 11 với chân đáp giảm chấn và lớp chắn bức xạ vàng.',
    modelUrl: apolloLmUrl
  },
  {
    id: 'voyager',
    name: 'NASA Voyager 1 Interstellar Explorer',
    category: 'nasa',
    mass: 350,
    cost: 45,
    cap: 3,
    rarity: 'legendary',
    badge: '📡 NASA PROBE',
    desc: 'Tàu thám hiểm không gian sâu Voyager với chảo phản xạ parabol đường kính lớn và Đĩa Vàng.',
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
    destination: '65803 Didymos (Planetary Defense)',
    scenarioName: 'NASA DART: 65803 Didymos Intercept',
    distanceAU: 1.64,
    budgetCredits: 1450,
    reqDeltaV: 5200,
    minSciencePoints: 320,
    description: 'NASA Double Asteroid Redirection Test (DART): High-speed kinetic impactor to alter the orbital trajectory of hazardous binary asteroid Didymos.',
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

export interface I18nTexts {
  brandSub: string;
  creditsLabel: string;
  assetVaultBtn: string;
  import3dBtn: string;
  cinematicBtn: string;
  restoreFlightBtn: string;
  sectorOpsTitle: string;
  targetsBadge: string;
  avionicsDiagTitle: string;
  budgetSurplus: string;
  dryMass: string;
  powerBalance: string;
  calcDeltaV: string;
  scienceReturn: string;
  tabChassis: string;
  tabFlags: string;
  tabPower: string;
  tabTech: string;
  tabEngines: string;
  tabCarriers: string;
  launchBtn: string;
  equipped: string;
  clickToEquip: string;
  clickToApply: string;
  hudTelemetry: string;
  hudTargetSector: string;
  hudCosmicIntel: string;
  hudArcOutput: string;
  hudJarvisStatus: string;
  hudIntelDebrief: string;
  hudStarkArmory: string;
}

export const HANGAR_I18N: Record<string, I18nTexts> = {
  en_us: {
    brandSub: 'NASA DEEP SPACE FLIGHT ARCHITECTURE & KEPLERIAN DYNAMICS',
    creditsLabel: 'BUDGET:',
    assetVaultBtn: '🌐 3D ASSET VAULT',
    import3dBtn: '📂 IMPORT 3D',
    cinematicBtn: '👁 CINEMATIC VIEW',
    restoreFlightBtn: '✕ RESTORE FLIGHT CONTROLS',
    sectorOpsTitle: '01 // FLIGHT MANIFEST & TARGETS',
    targetsBadge: 'TARGETS',
    avionicsDiagTitle: '02 // AVIONICS & FLIGHT DYNAMICS',
    budgetSurplus: 'Budget Surplus',
    dryMass: 'Dry Mass vs Limit',
    powerBalance: 'Power Balance (1 AU)',
    calcDeltaV: 'Calculated Delta-V',
    scienceReturn: 'Projected Science Return',
    tabChassis: '🚀 SPACECRAFT FLEET',
    tabFlags: '🇺🇸 NATIONAL INSIGNIA',
    tabPower: '⚛ POWER & PROPULSION CORE',
    tabTech: '🔬 SCIENTIFIC AVIONICS',
    tabEngines: '⚡ PROPULSION ENGINES',
    tabCarriers: '🛸 LAUNCH VEHICLE',
    launchBtn: 'AUTHORIZE & INITIATE LAUNCH',
    equipped: '● EQUIPPED',
    clickToEquip: 'CLICK TO EQUIP',
    clickToApply: 'CLICK TO APPLY',
    hudTelemetry: '● ORBITAL TELEMETRY',
    hudTargetSector: 'Target Destination:',
    hudCosmicIntel: 'Science Telemetry:',
    hudArcOutput: 'Electrical Bus Output:',
    hudJarvisStatus: 'Flight Controller:',
    hudIntelDebrief: '📊 MISSION DEBRIEF',
    hudStarkArmory: '⚙️ SPACECRAFT HANGAR'
  },
  vi: {
    brandSub: 'HÀNG KHÔNG VŨ TRỤ VÀ ĐỘNG LỰC HỌC QUỸ ĐẠO NASA',
    creditsLabel: 'NGÂN SÁCH:',
    assetVaultBtn: '🌐 KHO MẪU 3D',
    import3dBtn: '📂 TẢI MẪU 3D',
    cinematicBtn: '👁 GÓC QUAN SÁT ĐIỆN ẢNH',
    restoreFlightBtn: '✕ QUAY LẠI ĐIỀU KHIỂN BAY',
    sectorOpsTitle: '01 // LỊCH TRÌNH VÀ MỤC TIÊU BAY',
    targetsBadge: 'MỤC TIÊU',
    avionicsDiagTitle: '02 // ĐIỀU HÀNH ĐỘNG LỰC HỌC BAY',
    budgetSurplus: 'Thặng Dư Ngân Sách',
    dryMass: 'Khối Lượng Thô vs Tải Trọng',
    powerBalance: 'Cân Bằng Năng Lượng (1 AU)',
    calcDeltaV: 'Vận Tốc Delta-V Dự Tính',
    scienceReturn: 'Điểm Khoa Học Dự Kiến',
    tabChassis: '🚀 HẠM ĐỘI TÀU VŨ TRỤ',
    tabFlags: '🇻🇳 CỜ QUỐC GIA & NASA',
    tabPower: '⚛ LÕI NĂNG LƯỢNG & ĐỘNG CƠ',
    tabTech: '🔬 KHÍ TÀI ĐO ĐẠC KHOA HỌC',
    tabEngines: '⚡ ĐỘNG CƠ ĐẨY PHẢN LỰC',
    tabCarriers: '🛸 TÊN LỬA ĐẨY & BỆ PHÓNG',
    launchBtn: 'PHÊ DUYỆT & PHÓNG PHI THUYỀN',
    equipped: '● ĐÃ TRANG BỊ',
    clickToEquip: 'NHẤP ĐỂ TRANG BỊ',
    clickToApply: 'NHẤP ĐỂ SƠN CỜ',
    hudTelemetry: '● ĐO ĐẠC QUỸ ĐẠO VŨ TRỤ',
    hudTargetSector: 'Mục Tiêu Đến:',
    hudCosmicIntel: 'Dữ Liệu Khoa Học:',
    hudArcOutput: 'Công Suất Nguồn Điện:',
    hudJarvisStatus: 'Kiểm Soát Chuyến Bay:',
    hudIntelDebrief: '📊 BÁO CÁO NHIỆM VỤ',
    hudStarkArmory: '⚙️ NHÀ VÒM TÀU VŨ TRỤ'
  },
  en_uk: {
    brandSub: 'ADVANCED AEROSPACE & INTERSTELLAR FLIGHT ARCHITECT',
    creditsLabel: 'BUDGET:',
    assetVaultBtn: '🌐 3D ASSET VAULT',
    import3dBtn: '📂 IMPORT 3D',
    cinematicBtn: '👁 CINEMATIC VIEW',
    restoreFlightBtn: '✕ RESTORE FLIGHT CONTROLS',
    sectorOpsTitle: '01 // SECTOR OPERATIONS',
    targetsBadge: 'TARGETS',
    avionicsDiagTitle: '02 // AVIONICS DIAGNOSTICS',
    budgetSurplus: 'Budget Surplus',
    dryMass: 'Dry Mass vs Limit',
    powerBalance: 'Power Balance (1 AU)',
    calcDeltaV: 'Calculated Delta-V',
    scienceReturn: 'Projected Science Return',
    tabChassis: '🚀 SPACECRAFT HULL',
    tabFlags: '🇬🇧 NATIONAL INSIGNIA',
    tabPower: '⚛ ARC & QUANTUM POWER',
    tabTech: '🔬 SCIENTIFIC AVIONICS',
    tabEngines: '⚡ PROPULSION & WARP',
    tabCarriers: '🛸 LAUNCH VEHICLE',
    launchBtn: 'AUTHORISE & INITIATE LAUNCH',
    equipped: '● EQUIPPED',
    clickToEquip: 'CLICK TO EQUIP',
    clickToApply: 'CLICK TO APPLY',
    hudTelemetry: '● ORBITAL TELEMETRY',
    hudTargetSector: 'Target Sector:',
    hudCosmicIntel: 'Cosmic Intel Data:',
    hudArcOutput: 'Electrical Bus Output:',
    hudJarvisStatus: 'Flight Controller:',
    hudIntelDebrief: '📊 MISSION DEBRIEF',
    hudStarkArmory: '⚙️ SPACECRAFT HANGAR'
  },
  ja: {
    brandSub: '最先端航空宇宙＆恒星間飛行アーキテクト',
    creditsLabel: '予算クレジット:',
    assetVaultBtn: '🌐 3Dアセット保管庫',
    import3dBtn: '📂 3Dモデル読込',
    cinematicBtn: '👁 シネマティック視点',
    restoreFlightBtn: '✕ 飛行制御に戻る',
    sectorOpsTitle: '01 // 宇宙セクター作戦',
    targetsBadge: '作戦目標',
    avionicsDiagTitle: '02 // アビオニクス診断',
    budgetSurplus: '予算残高',
    dryMass: '乾燥重量 / 許容積載',
    powerBalance: '電力バランス (1 AU)',
    calcDeltaV: '計算デルタV',
    scienceReturn: '予想科学探査ポイント',
    tabChassis: '🚀 宇宙船・戦艦船体',
    tabFlags: '🇯🇵 国旗＆NASA標識',
    tabPower: '⚛ 電源・推進炉',
    tabTech: '🔬 科学観測計器',
    tabEngines: '⚡ 推進＆ワープ機関',
    tabCarriers: '🛸 母艦・ロケット',
    launchBtn: '承認して打ち上げ開始',
    equipped: '● 装備中',
    clickToEquip: 'クリックで装備',
    clickToApply: 'クリックで適用',
    hudTelemetry: '● 軌道テレメトリー',
    hudTargetSector: '目標セクター:',
    hudCosmicIntel: '宇宙探査データ:',
    hudArcOutput: '電源システム出力:',
    hudJarvisStatus: '管制ステータス:',
    hudIntelDebrief: '📊 任務報告',
    hudStarkArmory: '⚙️ 宇宙船ハンガー'
  },
  ko: {
    brandSub: '첨단 항공우주 및 성간 비행 아키텍트',
    creditsLabel: '예산 크레딧:',
    assetVaultBtn: '🌐 3D 자산 보관소',
    import3dBtn: '📂 3D 모델 불러오기',
    cinematicBtn: '👁 시네마틱 뷰',
    restoreFlightBtn: '✕ 비행 제어로 복귀',
    sectorOpsTitle: '01 // 우주 섹터 작전',
    targetsBadge: '작전 목표',
    avionicsDiagTitle: '02 // 항공전자 진단',
    budgetSurplus: '예산 흑자',
    dryMass: '건조 중량 / 허용 한도',
    powerBalance: '전력 수지 (1 AU)',
    calcDeltaV: '계산된 델타-V',
    scienceReturn: '예상 과학 탐사치',
    tabChassis: '🚀 우주선 및 전함 선체',
    tabFlags: '🇰🇷 국기 및 NASA 휘장',
    tabPower: '⚛ 동력 및 추진 코어',
    tabTech: '🔬 과학 항법 장비',
    tabEngines: '⚡ 추진 및 워프 엔진',
    tabCarriers: '🛸 모함 및 발사체',
    launchBtn: '승인 및 출격 개시',
    equipped: '● 장착됨',
    clickToEquip: '클릭하여 장착',
    clickToApply: '클릭하여 적용',
    hudTelemetry: '● 궤도 원격 측정',
    hudTargetSector: '목표 섹터:',
    hudCosmicIntel: '우주 정보 데이터:',
    hudArcOutput: '전력 버스 출력:',
    hudJarvisStatus: '비행 관제 상태:',
    hudIntelDebrief: '📊 브리핑',
    hudStarkArmory: '⚙️ 우주선 격납고'
  },
  fr: {
    brandSub: 'ARCHITECTE AÉROSPATIAL ET VOL INTERSTELLAIRE AVANCÉ',
    creditsLabel: 'CRÉDITS:',
    assetVaultBtn: '🌐 COFFRE 3D',
    import3dBtn: '📂 IMPORTER 3D',
    cinematicBtn: '👁 VUE CINÉMATIQUE',
    restoreFlightBtn: '✕ RESTAURER COMMANDES',
    sectorOpsTitle: '01 // OPÉRATIONS DE SECTEUR',
    targetsBadge: 'CIBLES',
    avionicsDiagTitle: '02 // DIAGNOSTIC AVIONIQUE',
    budgetSurplus: 'Surplus Budgétaire',
    dryMass: 'Masse à Vide vs Limite',
    powerBalance: 'Bilan Électrique (1 AU)',
    calcDeltaV: 'Delta-V Calculé',
    scienceReturn: 'Rendement Scientifique',
    tabChassis: '🚀 COQUE DU VAISSEAU',
    tabFlags: '🇫🇷 INSIGNES NATIONAUX',
    tabPower: '⚛ CŒUR ÉNERGIE & PROPULSION',
    tabTech: '🔬 AVIONIQUE SCIENTIFIQUE',
    tabEngines: '⚡ PROPULSION & DISTORSION',
    tabCarriers: '🛸 VAISSEAU MÈRE',
    launchBtn: 'APPROUVER & LANCER LE VOL',
    equipped: '● ÉQUIPÉ',
    clickToEquip: 'CLIQUER POUR ÉQUIPER',
    clickToApply: 'CLIQUER POUR APPLIQUER',
    hudTelemetry: '● TÉLÉMÉTRIE ORBITALE',
    hudTargetSector: 'Secteur Cible:',
    hudCosmicIntel: 'Données Spatiales:',
    hudArcOutput: 'Puissance Bus Électrique:',
    hudJarvisStatus: 'Contrôleur de Vol:',
    hudIntelDebrief: '📊 DÉBRIEF MISSION',
    hudStarkArmory: '⚙️ HANGAR SPATIAL'
  },
  de: {
    brandSub: 'FORTSCHRITTLICHE LUFT- UND RAUMFAHRT & INTERSTELLARE ARCHITEKTUR',
    creditsLabel: 'BUDGET:',
    assetVaultBtn: '🌐 3D-ASSET-TRESOR',
    import3dBtn: '📂 3D IMPORTIEREN',
    cinematicBtn: '👁 KINO-ANSICHT',
    restoreFlightBtn: '✕ FLUGSTEUERUNG WIEDERHERSTELLEN',
    sectorOpsTitle: '01 // SEKTOR-OPERATIONEN',
    targetsBadge: 'ZIELE',
    avionicsDiagTitle: '02 // AVIONIK-DIAGNOSE',
    budgetSurplus: 'Budgetüberschuss',
    dryMass: 'Trockenmasse vs Limit',
    powerBalance: 'Leistungsbilanz (1 AU)',
    calcDeltaV: 'Berechnetes Delta-V',
    scienceReturn: 'Wissenschaftsertrag',
    tabChassis: '🚀 SCHIFFSRUMPF',
    tabFlags: '🇩🇪 NATIONALE ABZEICHEN',
    tabPower: '⚛ ENERGIE & PROPULSIONSKERN',
    tabTech: '🔬 WISSENSCHAFTLICHE AVIONIK',
    tabEngines: '⚡ ANTRIEB & WARP',
    tabCarriers: '🛸 TRÄGERSYSTEM',
    launchBtn: 'FLUG GENEHMIGEN & STARTEN',
    equipped: '● AUSGERÜSTET',
    clickToEquip: 'ZUM AUSRÜSTEN KLICKEN',
    clickToApply: 'ZUM ANWENDEN KLICKEN',
    hudTelemetry: '● ORBITALE TELEMETRIE',
    hudTargetSector: 'Zielsektor:',
    hudCosmicIntel: 'Missionsdaten:',
    hudArcOutput: 'Stromversorgungsbus:',
    hudJarvisStatus: 'Flugleitung-Status:',
    hudIntelDebrief: '📊 DEBRIEFING',
    hudStarkArmory: '⚙️ RAUMSCHIFF-HANGAR'
  },
  it: {
    brandSub: 'ARCHITETTO AEROSPAZIALE E VOLO INTERSTELLARE AVANZATO',
    creditsLabel: 'CREDITI:',
    assetVaultBtn: '🌐 CAVEAU 3D',
    import3dBtn: '📂 IMPORTA 3D',
    cinematicBtn: '👁 VISTA CINEMATOGRAFICA',
    restoreFlightBtn: '✕ RIPRISTINA COMANDI',
    sectorOpsTitle: '01 // OPERAZIONI DI SETTORE',
    targetsBadge: 'OBIETTIVI',
    avionicsDiagTitle: '02 // DIAGNOSTICA AVIONICA',
    budgetSurplus: 'Surplus di Bilancio',
    dryMass: 'Massa a Secco vs Limite',
    powerBalance: 'Bilancio Energetico (1 AU)',
    calcDeltaV: 'Delta-V Calcolato',
    scienceReturn: 'Rendimento Scientifico',
    tabChassis: '🚀 SCAFO ASTRONAVE',
    tabFlags: '🇮🇹 INSEGNE NAZIONALI',
    tabPower: '⚛ REATTORE & PROPULSIONE',
    tabTech: '🔬 AVIONICA SCIENTIFICA',
    tabEngines: '⚡ PROPULSIONE & WARP',
    tabCarriers: '🛸 NAVE MADRE',
    launchBtn: 'APPROVA & INIZIA IL VOLO',
    equipped: '● EQUIPAGGIATO',
    clickToEquip: 'CLICCA PER EQUIPAGGIARE',
    clickToApply: 'CLICCA PER APPLICARE',
    hudTelemetry: '● TELEMETRIA ORBITALE',
    hudTargetSector: 'Settore Obiettivo:',
    hudCosmicIntel: 'Dati di Missione:',
    hudArcOutput: 'Potenza Bus Elettrico:',
    hudJarvisStatus: 'Controllo di Volo:',
    hudIntelDebrief: '📊 REPORT MISSIONE',
    hudStarkArmory: '⚙️ HANGAR SPAZIALE'
  },
  es: {
    brandSub: 'ARQUITECTO AEROESPACIAL Y DE VUELO INTERESTELAR AVANZADO',
    creditsLabel: 'CRÉDITOS:',
    assetVaultBtn: '🌐 BÓVEDA 3D',
    import3dBtn: '📂 IMPORTAR 3D',
    cinematicBtn: '👁 VISTA CINEMATOGRÁFICA',
    restoreFlightBtn: '✕ RESTAURAR MANDOS DE VUELO',
    sectorOpsTitle: '01 // OPERACIONES DE SECTOR',
    targetsBadge: 'OBJETIVOS',
    avionicsDiagTitle: '02 // DIAGNÓSTICO AVIONICO',
    budgetSurplus: 'Superávit Presupuestario',
    dryMass: 'Masa en Seco vs Límite',
    powerBalance: 'Balance de Energía (1 AU)',
    calcDeltaV: 'Delta-V Calculado',
    scienceReturn: 'Rendimiento Científico',
    tabChassis: '🚀 CASCO DE NAVE',
    tabFlags: '🇪🇸 INSIGNIAS NACIONALES',
    tabPower: '⚛ REACTOR DE ENERGÍA',
    tabTech: '🔬 AVIONICA SCIENTIFICA',
    tabEngines: '⚡ PROPULSIÓN & WARP',
    tabCarriers: '🛸 NAVE NODRIZA',
    launchBtn: 'APROBAR & INICIAR LANZAMIENTO',
    equipped: '● EQUIPADO',
    clickToEquip: 'CLIC PARA EQUIPAR',
    clickToApply: 'CLIC PARA APLICAR',
    hudTelemetry: '● TELEMETRÍA ORBITAL',
    hudTargetSector: 'Sector Objetivo:',
    hudCosmicIntel: 'Datos Cósmicos:',
    hudArcOutput: 'Potencia Barra Eléctrica:',
    hudJarvisStatus: 'Control de Vuelo:',
    hudIntelDebrief: '📊 INFORME DE MISIÓN',
    hudStarkArmory: '⚙️ HANGAR ESPACIAL'
  }
};

export class NasaMissionDesigner {
  private currentLanguage: string = 'en_us';
  private selectedMission: NasaMission = NASA_MISSIONS[0];
  
  // Active equipped inventory items
  private selectedChassisId = 'quinjet';
  private selectedFlagId = 'usa_nasa';
  private selectedPowerId = 'arc_reactor';
  private selectedEngineId = 'tesseract_drive';
  private selectedCarrierId = 'sls_artemis';
  private selectedTechIds: Set<string> = new Set(['dark_matter', 'cerebro']);

  private activeTab: 'chassis' | 'flags' | 'power' | 'tech' | 'engines' | 'carriers' = 'chassis';

  // 3D GLB Spacecraft & Battleship Fleet Cache
  private loadedGlbCache: Map<string, THREE.Object3D> = new Map();

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

  constructor(
    private onLaunchCallback: (mission: NasaMission, telemetry: any) => void,
    private onShipChangedCallback?: () => void
  ) {
    try {
      const savedLang = localStorage.getItem('nasa_game_lang');
      if (savedLang && HANGAR_I18N[savedLang]) {
        this.currentLanguage = savedLang;
      }
    } catch (e) {}

    this.createLobbyDOM();
    this.initAudio();
    this.preloadGlbFleet();
    this.init3DHangar();
    this.renderMissions();
    this.renderArmoryGrid();
    this.updateLiveTelemetry();
    this.setLanguage(this.currentLanguage);
    this.isInitialized = true;
  }

  private preloadGlbFleet() {
    const loader = new GLTFLoader();
    SPACECRAFT_FLEET.forEach(craft => {
      if (!craft.modelUrl) return;
      loader.load(craft.modelUrl, (gltf) => {
        const model = gltf.scene;
        // Normalize size & centering
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
        const targetScale = 3.2 / maxDim;
        model.position.set(-center.x * targetScale, -center.y * targetScale + 0.15, -center.z * targetScale);
        model.scale.set(targetScale, targetScale, targetScale);
        
        model.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material && child.material.map) {
              child.material.map.anisotropy = 16;
            }
          }
        });

        this.loadedGlbCache.set(craft.id, model);
        // If this model is currently selected, rebuild the 3D ship immediately and synchronize flight ship
        if (this.selectedChassisId === craft.id && !this.isCustomModelLoaded) {
          this.rebuild3DShipModel();
          this.onShipChangedCallback?.();
        }
      }, undefined, (err) => {
        console.warn('Failed to load GLB model for ' + craft.id, err);
      });
    });
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
              <div class="brand-name">NASA <span>MISSION-VIZ</span> <span class="tag-sword" style="background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3);">DEEP SPACE GNC</span></div>
              <div class="brand-sub">INTERSTELLAR FLIGHT ARCHITECTURE & KEPLERIAN DYNAMICS</div>
            </div>
          </div>

          <div class="topbar-center">
            <div class="ship-callsign-pill">
              <span class="pulse-indicator"></span>
              <span id="hangar-ship-name">NASA SPACE SHUTTLE ORBITER</span>
              <span class="sep">•</span>
              <span id="hangar-ship-class" class="ship-class-text">DISCOVERY OV-103 (4K PBR)</span>
            </div>
          </div>

          <div class="topbar-right">
            <div class="telemetry-pill">
              <span class="pill-label">CREDITS:</span>
              <strong id="mission-budget-display" class="pill-val">$480.0M</strong>
            </div>
            <div class="lang-selector-wrap" title="Select Game Language / Lựa chọn ngôn ngữ">
              <span class="lang-icon">🌐</span>
              <select id="select-game-language" class="select-game-language" aria-label="Game Language">
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
            <button id="btn-resource-vault" class="btn-resource-mode" title="Free 3D Spacecraft & Battleship Repositories">
              🌐 3D ASSET VAULT
            </button>
            <button id="btn-import-3d" class="btn-import-mode" title="Import 3D spacecraft model (.glb, .gltf, .obj)">
              📂 IMPORT 3D
            </button>
            <input type="file" id="input-import-3d" accept=".glb,.gltf,.obj" style="display: none;" />
            <button id="btn-toggle-cinematic" class="btn-cinematic-mode" title="Full-screen cinematic spacecraft inspection">
              👁 CINEMATIC VIEW
            </button>
          </div>
        </header>

        <!-- 3D Import Notification Toast -->
        <div id="import-3d-toast" class="import-toast" style="display: none;"></div>

        <!-- Free 3D Resources & Asset Vault Modal -->
        <div id="resource-vault-modal" class="cosmic-dossier-modal" style="display: none;">
          <div class="dossier-card" style="max-width: 680px;">
            <div class="dossier-header">
              <div class="dossier-title-wrap">
                <span class="dossier-avatar">🌐</span>
                <div>
                  <div style="font-family: var(--font-tech); font-size: 1.45rem; color: #fff; font-weight: 700;">FREE 3D SPACECRAFT & BATTLESHIP ASSETS</div>
                  <div style="font-size: 0.85rem; color: var(--stark-cyan); margin-top: 2px;">Official NASA, Smithsonian & CC0 Sci-Fi Repositories</div>
                </div>
              </div>
              <button class="dossier-close-btn" id="vault-btn-close">✕</button>
            </div>
            
            <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px;">
              The game includes built-in models downloaded directly from official open-source archives. You can also download any model from the sources below and load it instantly using the <strong>📂 IMPORT 3D</strong> button (.glb, .gltf, .obj):
            </p>

            <div class="vault-sources-list">
              <div class="vault-source-item">
                <div class="vault-source-title">🚀 NASA 3D Resources (Official Public Domain)</div>
                <div class="vault-source-desc">Official 3D models of Space Shuttle, Apollo Lunar Module, Orion Artemis, Voyager, Hubble, Curiosity, and ISS.</div>
                <div class="vault-links">
                  <a href="https://github.com/nasa/NASA-3D-Resources" target="_blank" rel="noopener">GitHub: nasa/NASA-3D-Resources ↗</a>
                  <a href="https://nasa3d.arc.nasa.gov/" target="_blank" rel="noopener">NASA 3D Portal: nasa3d.arc.nasa.gov ↗</a>
                </div>
              </div>

              <div class="vault-source-item">
                <div class="vault-source-title">⚔️ Kenney Space Kit (CC0 Public Domain)</div>
                <div class="vault-source-desc">High-quality sci-fi battleships, speeders, cargo cruisers, interceptors, and modular space stations. 100% free for any project.</div>
                <div class="vault-links">
                  <a href="https://kenney.nl/assets/space-kit" target="_blank" rel="noopener">Kenney.nl Space Kit ↗</a>
                  <a href="https://github.com/shorepine/kenney" target="_blank" rel="noopener">GitHub: shorepine/kenney ↗</a>
                </div>
              </div>

              <div class="vault-source-item">
                <div class="vault-source-title">🏛️ Smithsonian 3D Digitization</div>
                <div class="vault-source-desc">High-precision 3D scans of Apollo 11 Command Module "Columbia", Space Shuttle Discovery, and historic spacecraft.</div>
                <div class="vault-links">
                  <a href="https://3d.si.edu/" target="_blank" rel="noopener">Smithsonian 3D Collection ↗</a>
                </div>
              </div>

              <div class="vault-source-item">
                <div class="vault-source-title">🪐 Sketchfab Creative Commons Spacecraft</div>
                <div class="vault-source-desc">Thousands of community-created sci-fi cruisers, battle dreadnoughts, and concept spacecraft available under CC0 and CC-BY licenses.</div>
                <div class="vault-links">
                  <a href="https://sketchfab.com/search?q=spaceship&type=models&licenses=cc0" target="_blank" rel="noopener">Sketchfab CC0 Spaceships ↗</a>
                </div>
              </div>
            </div>

            <div style="margin-top: 20px; text-align: center;">
              <button class="dossier-act-btn primary" id="vault-btn-import-shortcut">
                📂 LOAD YOUR OWN 3D MODEL NOW
              </button>
            </div>
          </div>
        </div>

        <!-- Left Operations Blade: Sector Missions -->
        <aside class="hud-blade hud-blade-left">
          <div class="blade-header">
            <div class="blade-title">01 // SECTOR OPERATIONS</div>
            <div class="blade-badge">TARGETS</div>
          </div>
          <div class="blade-content" id="marvel-missions-list"></div>
        </aside>

        <!-- Right Avionics Blade: Realtime Telemetry & Diagnostics -->
        <aside class="hud-blade hud-blade-right">
          <div class="blade-header">
            <div class="blade-title">02 // AVIONICS & FLIGHT DYNAMICS</div>
            <div class="blade-badge">FLIGHT DYNAMICS</div>
          </div>
          <div class="blade-content">
            <!-- Remaining Stark Budget -->
            <div class="gauge-box">
              <div class="gauge-label">
                <span>Budget Surplus</span>
                <span id="metric-budget-percent" class="mono-tag">100%</span>
              </div>
              <div class="gauge-value" id="metric-budget">$0.0M</div>
              <div class="gauge-track"><div class="gauge-fill" id="bar-budget"></div></div>
            </div>

            <!-- Mass vs Carrier Limit -->
            <div class="gauge-box">
              <div class="gauge-label">
                <span>Dry Mass vs Limit</span>
                <span id="metric-mass-limit" class="mono-tag">LIMIT: 16,000 kg</span>
              </div>
              <div class="gauge-value" id="metric-mass">0 kg</div>
              <div class="gauge-track"><div class="gauge-fill" id="bar-mass"></div></div>
            </div>

            <!-- Power Core Balance -->
            <div class="gauge-box">
              <div class="gauge-label">
                <span>Power Balance (1/r²)</span>
                <span id="metric-power-distance" class="mono-tag">@ 1.0 AU</span>
              </div>
              <div class="gauge-value" id="metric-power">+0 W</div>
              <div class="gauge-track"><div class="gauge-fill" id="bar-power"></div></div>
            </div>

            <!-- Warp Delta-V Output -->
            <div class="gauge-box">
              <div class="gauge-label">
                <span>Calculated Delta-V</span>
                <span id="metric-deltav-req" class="mono-tag">REQ: 3900 m/s</span>
              </div>
              <div class="gauge-value" id="metric-deltav">0 m/s</div>
              <div class="gauge-track"><div class="gauge-fill" id="bar-deltav"></div></div>
            </div>

            <!-- Cosmic Intel Return -->
            <div class="gauge-box">
              <div class="gauge-label">
                <span>Projected Science Return</span>
                <span id="metric-science-target" class="mono-tag">TARGET: 120 pts</span>
              </div>
              <div class="gauge-value" id="metric-science">0 pts</div>
              <div class="gauge-track"><div class="gauge-fill" id="bar-science"></div></div>
            </div>
          </div>
        </aside>

        <!-- Bottom Subsystem Armory Dock & Launch Control -->
        <footer class="hud-dock-bottom">
          <div class="dock-tabs-row">
            <button class="inv-tab-btn active" data-tab="chassis">🚀 SPACECRAFT HULL</button>
            <button class="inv-tab-btn" data-tab="flags">🇺🇸 NATIONAL INSIGNIA</button>
            <button class="inv-tab-btn" data-tab="power">⚛ ARC & QUANTUM POWER</button>
            <button class="inv-tab-btn" data-tab="tech">🔬 SCIENTIFIC AVIONICS</button>
            <button class="inv-tab-btn" data-tab="engines">⚡ PROPULSION & WARP</button>
            <button class="inv-tab-btn" data-tab="carriers">🛸 LAUNCH VEHICLE</button>
          </div>

          <!-- Horizontal Scroll Armory Shelf -->
          <div class="dock-shelf-container">
            <div class="inventory-items-grid" id="armory-items-grid"></div>
          </div>

          <!-- Launch Bar -->
          <div class="dock-launch-bar">
            <div class="jarvis-status" id="validation-msg">
              <span class="status-dot"></span> FLIGHT CONTROL: ALL SYSTEMS NOMINAL • MISSION PROFILE APPROVED.
            </div>
            <button id="btn-approve-launch" class="btn-hyperspace-launch">
              <span>⚡</span> AUTHORIZE & INITIATE LAUNCH
            </button>
          </div>
        </footer>
      </div>

      <!-- Quick Exit Button for Cinematic Mode -->
      <button id="btn-exit-cinematic" class="btn-exit-cinematic">
        ✕ RESTORE FLIGHT CONTROLS
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
            <span style="color: var(--stark-cyan); font-size: 0.72rem;">● ORBITAL TELEMETRY</span>
            <button id="hud-btn-minimize" class="hud-mini-btn" title="Minimize / Expand">—</button>
          </div>
        </div>
        <div id="hud-body-content" class="hud-body-content">
          <div class="hud-row"><span>Target Destination:</span><strong id="hud-target-name">65803 Didymos</strong></div>
          <div class="hud-row"><span>Science Telemetry:</span><strong id="hud-science-live" style="color: var(--stark-gold);">0 pts</strong></div>
          <div class="hud-row"><span>Electrical Bus Output:</span><strong id="hud-power-live">2,200 W</strong></div>
          <div class="hud-row"><span>Flight Status:</span><strong id="hud-status-text" style="color: var(--stark-cyan);">Trajectory Nominal • Orbit Tracking Active</strong></div>
          
          <!-- NASA WSMV (Web-based Space Mission Visualization) Telemetry & PHA Radar -->
          <div class="nasa-wsmv-section">
            <div class="nasa-wsmv-header">
              <span class="nasa-badge">NASA WSMV</span>
              <span style="letter-spacing: 0.5px;">KEPLERIAN TELEMETRY & PHA RADAR</span>
            </div>
            
            <div class="wsmv-telemetry-grid">
              <div class="wsmv-item"><span class="wsmv-lbl">SMA (a):</span><span class="wsmv-val" id="wsmv-a">1.000 AU</span></div>
              <div class="wsmv-item"><span class="wsmv-lbl">ECC (e):</span><span class="wsmv-val" id="wsmv-e">0.0000</span></div>
              <div class="wsmv-item"><span class="wsmv-lbl">INC (i):</span><span class="wsmv-val" id="wsmv-i">0.00°</span></div>
              <div class="wsmv-item"><span class="wsmv-lbl">NODE (Ω):</span><span class="wsmv-val" id="wsmv-node">0.00°</span></div>
              <div class="wsmv-item"><span class="wsmv-lbl">PERI (ω):</span><span class="wsmv-val" id="wsmv-peri">0.00°</span></div>
              <div class="wsmv-item"><span class="wsmv-lbl">HEAD:</span><span class="wsmv-val" id="wsmv-head">0.00°</span></div>
            </div>

            <!-- Proximity Radar for Potentially Hazardous Asteroids (PHAs) -->
            <div class="pha-radar-box">
              <div class="pha-radar-header">
                <span class="radar-ping-icon">📡</span>
                <span>NEAREST PHA:</span>
                <span id="pha-nearest-name" class="pha-name-tag">99942 Apophis</span>
              </div>
              <div class="pha-distance-row">
                <span class="pha-dist-lbl">RANGE:</span>
                <strong id="pha-nearest-dist" class="pha-dist-val">-- AU</strong>
                <span id="pha-hazard-badge" class="hazard-badge-safe">TRACKING</span>
              </div>
              <div class="pha-radar-bar">
                <div class="pha-radar-fill" id="pha-radar-fill"></div>
              </div>
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
      <div class="debrief-box">
        <div style="font-size: 3.5rem; margin-bottom: 8px;">🛡️</div>
        <div style="font-family: var(--font-tech); font-size: 1.6rem; color: var(--stark-gold); margin-bottom: 12px;">
          S.W.O.R.D. & NASA MISSION SUMMARY
        </div>
        <p style="color: #a0b5d0; font-size: 0.95rem; line-height: 1.6;" id="debrief-summary"></p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; text-align: left;">
          <div class="gauge-box">
            <div class="gauge-label">Cosmic Intel Data</div>
            <div class="gauge-value" style="color: var(--stark-gold);" id="debrief-score-science">0 pts</div>
          </div>
          <div class="gauge-box">
            <div class="gauge-label">Mission Budget Preserved</div>
            <div class="gauge-value" style="color: var(--stark-cyan);" id="debrief-score-budget">$0M</div>
          </div>
          <div class="gauge-box">
            <div class="gauge-label">Hull & Systems Integrity</div>
            <div class="gauge-value" style="color: #2ecc71;" id="debrief-score-reliability">99.2%</div>
          </div>
          <div class="gauge-box">
            <div class="gauge-label">NASA Flight Certification</div>
            <div class="gauge-value" style="color: var(--stark-cyan);" id="debrief-rank">NASA FLIGHT DIRECTOR</div>
          </div>
        </div>
        <button id="debrief-btn-restart" class="btn-hyperspace-launch" style="font-size: 0.9rem; padding: 10px 28px; margin: 0 auto;">
          ↺ RETURN TO HANGAR ARMORY
        </button>
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

    // Super-Sampling 4K: Tối thiểu 2x hoặc tỷ lệ màn hình 4K native
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
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
    });
  }

  /**
   * Dựng mô hình 3D chiến hạm Marvel Ultra HD 4K với vật liệu PBR, vân kim loại và chi tiết giáp siêu mịn
   */
  private rebuild3DShipModel() {
    if (!this.shipGroup) return;
    while (this.shipGroup.children.length > 0) {
      this.shipGroup.remove(this.shipGroup.children[0]);
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
    if (this.selectedChassisId === 'milano') {
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

    showToast(`⏳ Loading 3D model: ${file.name}...`);

    if (ext === 'glb' || ext === 'gltf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const loader = new GLTFLoader();
          loader.parse(buffer, '', (gltf) => {
            this.applyCustom3DModel(gltf.scene, file.name);
            showToast(`✓ LOADED 3D ASSET: ${file.name.toUpperCase()}`);
          }, (err: any) => {
            console.error(err);
            showToast(`⚠️ Error parsing GLTF/GLB: ${err?.message || err}`, true);
          });
        } catch (err) {
          console.error(err);
          showToast(`⚠️ Error reading GLTF file: ${(err as any)?.message || err}`, true);
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
          showToast(`✓ LOADED 3D OBJ ASSET: ${file.name.toUpperCase()}`);
        } catch (err) {
          console.error(err);
          showToast(`⚠️ Error parsing OBJ file: ${(err as any)?.message || err}`, true);
        }
      };
      reader.readAsText(file);
    } else {
      showToast(`⚠️ Unsupported file format: .${ext}. Please use .glb, .gltf, or .obj`, true);
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
    if (shipClass) shipClass.textContent = 'CUSTOM 3D ASSET';
    this.playEquipSound();
  }

  public getSelectedCraftName(): string {
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

      if (this.selectedChassisId === 'milano') {
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

    NASA_MISSIONS.forEach(m => {
      const item = document.createElement('div');
      item.className = `nasa-mission-item ${m.id === this.selectedMission.id ? 'active' : ''}`;
      item.innerHTML = `
        <div style="font-size: 0.72rem; color: var(--stark-gold); font-weight: 700; margin-bottom: 2px;">${m.badge}</div>
        <div class="mission-name">${m.title}</div>
        <div class="mission-dest">📍 ${m.destination}</div>
        <div class="mission-meta">
          <span>Mission Budget: <strong>$${m.budgetCredits}M</strong></span>
          <span>Req Δv: <strong>${m.reqDeltaV} m/s</strong></span>
        </div>
      `;
      item.onclick = () => {
        this.selectedMission = m;
        this.playClickSound();
        this.renderMissions();
        this.updateLiveTelemetry();
      };
      list.appendChild(item);
    });

    const creditEl = document.getElementById('mission-budget-display');
    if (creditEl) creditEl.textContent = `$${this.selectedMission.budgetCredits.toFixed(1)}M`;
  }

  private renderArmoryGrid() {
    const grid = document.getElementById('armory-items-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const t = HANGAR_I18N[this.currentLanguage] || HANGAR_I18N['en_us'];

    if (this.activeTab === 'chassis') {
      SPACECRAFT_FLEET.forEach(it => {
        const isEq = it.id === this.selectedChassisId;
        const card = document.createElement('div');
        card.className = `armory-card ${it.rarity} ${isEq ? 'equipped' : ''}`;
        card.innerHTML = `
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
              <span class="armory-item-name">${it.name}</span>
              <span class="armory-item-badge" style="font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; background: rgba(56, 189, 248, 0.15); color: #00f0ff; font-family: monospace; font-weight: 700;">${it.badge}</span>
            </div>
            <div class="armory-item-stats">${it.mass.toLocaleString()} kg • $${it.cost}M • Max ${it.cap} Modules</div>
            <div style="font-size: 0.7rem; color: #a0b5d0; margin-top: 4px;">${it.desc}</div>
          </div>
          <div class="armory-item-perk">${isEq ? t.equipped : t.clickToEquip}</div>
        `;
        card.onclick = () => {
          this.isCustomModelLoaded = false;
          this.selectedChassisId = it.id;
          this.playEquipSound();
          this.rebuild3DShipModel();
          const shipTitle = document.getElementById('hangar-ship-name');
          const shipClass = document.getElementById('hangar-ship-class');
          if (shipTitle) shipTitle.textContent = it.name.toUpperCase();
          if (shipClass) shipClass.textContent = it.desc;
          this.renderArmoryGrid();
          this.updateLiveTelemetry();
          this.onShipChangedCallback?.();
        };
        grid.appendChild(card);
      });
    } else if (this.activeTab === 'flags') {
      SUPPORTED_FLAGS.forEach(flag => {
        const isEq = flag.id === this.selectedFlagId;
        const card = document.createElement('div');
        card.className = `armory-card legendary ${isEq ? 'equipped' : ''}`;
        card.innerHTML = `
          <div style="display: flex; gap: 12px; align-items: center;">
            <span style="font-size: 2.2rem;">${flag.badge.split(' ')[0]}</span>
            <div>
              <div class="armory-item-name">${flag.name}</div>
              <div class="armory-item-stats" style="color: var(--stark-cyan);">${flag.agency}</div>
              <div style="font-size: 0.7rem; color: #a0b5d0; margin-top: 4px;">Official 4K Decal Ratio ${flag.ratio}:1 • ${flag.country}</div>
            </div>
          </div>
          <div class="armory-item-perk" style="color: ${isEq ? 'var(--stark-cyan)' : 'var(--stark-gold)'};">
            ${isEq ? `${t.equipped} (4K LIVERY)` : t.clickToApply}
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
        { id: 'solar_wings', name: 'UltraFlex Celestial Solar Wings', mass: 85, cost: 35, power: 1500, isSolar: true, rarity: 'epic', desc: 'Pin năng lượng mặt trời (1,500W ở 1 AU, giảm nhanh ở xa).' },
        { id: 'arc_reactor', name: 'Stark Arc Reactor Mark 85', mass: 180, cost: 195, power: 2200, isSolar: false, rarity: 'mythic', desc: 'Lò phản ứng hạt nhân nano phát điện 2,200W vĩnh viễn ở mọi cự ly!' },
        { id: 'vibranium_core', name: 'Wakandan Vibranium Matrix', mass: 130, cost: 220, power: 1900, isSolar: false, rarity: 'legendary', desc: 'Ma trận hấp thụ động năng và bức xạ vũ trụ phát 1,900W siêu ổn định.' },
        { id: 'tesseract_core', name: 'Tesseract Space Stone Siphon', mass: 280, cost: 380, power: 4500, isSolar: false, rarity: 'mythic', desc: 'Khai thác chiều không gian vô tận sinh 4,500W nuôi toàn bộ hệ thống.' }
      ];

      items.forEach(it => {
        const isEq = it.id === this.selectedPowerId;
        const card = document.createElement('div');
        card.className = `armory-card ${it.rarity} ${isEq ? 'equipped' : ''}`;
        card.innerHTML = `
          <div>
            <div class="armory-item-name">${it.name}</div>
            <div class="armory-item-stats">${it.mass} kg • $${it.cost}M • ${it.power}W</div>
            <div style="font-size: 0.7rem; color: #a0b5d0; margin-top: 4px;">${it.desc}</div>
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
        { id: 'cerebro', name: 'Cerebro Bio-Scanner', mass: 40, cost: 35, power: 70, points: 45, rarity: 'epic', desc: 'Quét sóng ý thức và dạng sống sinh học ngoài hành tinh.' },
        { id: 'dark_matter', name: 'Dark Matter Detector (Rocket Mod)', mass: 65, cost: 65, power: 140, points: 70, rarity: 'legendary', desc: 'Cảm biến vật chất tối nâng cấp bởi Rocket Raccoon.' },
        { id: 'sonic_radar', name: 'Vibranium Sonic Radar (Shuri Tech)', mass: 120, cost: 110, power: 280, points: 110, rarity: 'legendary', desc: 'Sóng âm siêu thanh xuyên qua lớp vỏ băng dày hàng chục km.' },
        { id: 'pym_bay', name: 'Pym Particle Compression Chamber', mass: 90, cost: 140, power: 310, points: 130, rarity: 'mythic', desc: 'Thu nhỏ mẫu vật chất vũ trụ, nhân đôi điểm dữ liệu khoa học!' },
        { id: 'kree_array', name: 'Kree Subspace Jump Communicator', mass: 30, cost: 28, power: 45, points: 40, rarity: 'epic', desc: 'Truyền tín hiệu tức thời không độ trễ qua mạng lưới Jump-point.' }
      ];

      items.forEach(it => {
        const isEq = this.selectedTechIds.has(it.id);
        const card = document.createElement('div');
        card.className = `armory-card ${it.rarity} ${isEq ? 'equipped' : ''}`;
        card.innerHTML = `
          <div>
            <div class="armory-item-name">${it.name}</div>
            <div class="armory-item-stats">${it.mass} kg • $${it.cost}M • ${it.power}W</div>
            <div style="font-size: 0.7rem; color: #a0b5d0; margin-top: 4px;">${it.desc}</div>
          </div>
          <div class="armory-item-perk" style="color: var(--stark-cyan);">${isEq ? `✓ ${t.equipped} (+${it.points} PTS)` : `+ ${t.clickToEquip}`}</div>
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
        { id: 'repulsor', name: 'Stark Repulsor Thrusters', dryMass: 40, fuelMass: 850, cost: 25, isp: 260, rarity: 'epic', desc: 'Động cơ phản lực sóng Repulsor công nghệ Iron Man.' },
        { id: 'tesseract_drive', name: 'Hydra Tesseract Pulse Engine', dryMass: 90, fuelMass: 2400, cost: 80, isp: 345, rarity: 'legendary', desc: 'Xung năng lượng xanh Tesseract cho lực đẩy liên hành tinh mạnh mẽ.' },
        { id: 'nova_warp', name: 'Nova Corps Graviton Warp Drive', dryMass: 65, fuelMass: 550, cost: 160, isp: 4400, rarity: 'mythic', desc: 'Động cơ bẻ cong trọng lực Nova Corps cho Delta-V vượt trội (>7,000 m/s)!' }
      ];

      items.forEach(it => {
        const isEq = it.id === this.selectedEngineId;
        const card = document.createElement('div');
        card.className = `armory-card ${it.rarity} ${isEq ? 'equipped' : ''}`;
        card.innerHTML = `
          <div>
            <div class="armory-item-name">${it.name}</div>
            <div class="armory-item-stats">Isp: ${it.isp}s • Nhiên liệu: ${it.fuelMass.toLocaleString()} kg • $${it.cost}M</div>
            <div style="font-size: 0.7rem; color: #a0b5d0; margin-top: 4px;">${it.desc}</div>
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
        { id: 'sls_artemis', name: 'NASA Space Launch System (SLS) Block 1', cost: 95, cap: 27000, rarity: 'legendary', desc: 'Heavy lunar exploration launch vehicle lifting Orion spacecraft to Trans-Lunar Injection (TLI).' },
        { id: 'saturn_v', name: 'NASA Saturn V Apollo Super Heavy Moon Rocket', cost: 120, cap: 45000, rarity: 'mythic', desc: 'Historic 3-stage super heavy-lift rocket with 7.5 million pounds of thrust.' },
        { id: 'falcon_heavy', name: 'SpaceX Falcon Heavy Triple-Core Booster', cost: 65, cap: 22000, rarity: 'epic', desc: 'Three reusable Falcon 9 cores strapped together for high-energy interplanetary trajectories.' },
        { id: 'starship_superheavy', name: 'Fully Reusable Starship & Super Heavy System', cost: 150, cap: 150000, rarity: 'mythic', desc: 'Next-generation orbital refueled transit architecture capable of massive payloads.' }
      ];

      items.forEach(it => {
        const isEq = it.id === this.selectedCarrierId;
        const card = document.createElement('div');
        card.className = `armory-card ${it.rarity} ${isEq ? 'equipped' : ''}`;
        card.innerHTML = `
          <div>
            <div class="armory-item-name">${it.name}</div>
            <div class="armory-item-stats">Payload Capacity: ${it.cap.toLocaleString()} kg • $${it.cost}M</div>
            <div style="font-size: 0.7rem; color: #a0b5d0; margin-top: 4px;">${it.desc}</div>
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

    // Update Telemetry Elements
    const budgetEl = document.getElementById('metric-budget');
    const budgetBar = document.getElementById('bar-budget');
    if (budgetEl && budgetBar) {
      budgetEl.textContent = `$${remainingBudget.toFixed(1)}M / $${this.selectedMission.budgetCredits}M`;
      budgetEl.style.color = remainingBudget >= 0 ? '#00f0ff' : '#e23636';
      budgetBar.style.background = remainingBudget >= 0 ? '#00f0ff' : '#e23636';
      budgetBar.style.width = `${Math.max(0, Math.min(100, (remainingBudget / this.selectedMission.budgetCredits) * 100))}%`;
    }

    const massEl = document.getElementById('metric-mass');
    const massBar = document.getElementById('bar-mass');
    const massLimitEl = document.getElementById('metric-mass-limit');
    if (massEl && massBar && massLimitEl) {
      massLimitEl.textContent = `Max: ${carrier.cap.toLocaleString()} kg`;
      massEl.textContent = `${totalMass.toLocaleString()} kg`;
      const isMassOk = totalMass <= carrier.cap;
      massEl.style.color = isMassOk ? '#00f0ff' : '#e23636';
      massBar.style.background = isMassOk ? '#00f0ff' : '#e23636';
      massBar.style.width = `${Math.min(100, (totalMass / carrier.cap) * 100)}%`;
    }

    const powerEl = document.getElementById('metric-power');
    const powerBar = document.getElementById('bar-power');
    const powerDistEl = document.getElementById('metric-power-distance');
    if (powerEl && powerBar && powerDistEl) {
      powerDistEl.textContent = `@ ${this.selectedMission.distanceAU} AU (Core: ${powerGenerated}W, Cons: ${totalPowerConsumed}W)`;
      powerEl.textContent = `${powerBalance >= 0 ? '+' : ''}${powerBalance} W`;
      const isPowerOk = powerBalance >= 0;
      powerEl.style.color = isPowerOk ? '#00f0ff' : '#e23636';
      powerBar.style.background = isPowerOk ? '#00f0ff' : '#e23636';
      powerBar.style.width = `${Math.min(100, Math.max(5, (powerGenerated / (totalPowerConsumed || 1)) * 50))}%`;
    }

    const deltaVEl = document.getElementById('metric-deltav');
    const deltaVBar = document.getElementById('bar-deltav');
    const deltaVReqEl = document.getElementById('metric-deltav-req');
    if (deltaVEl && deltaVBar && deltaVReqEl) {
      deltaVReqEl.textContent = `Req: ${this.selectedMission.reqDeltaV} m/s`;
      deltaVEl.textContent = `${deltaV} m/s`;
      const isDeltaVOk = deltaV >= this.selectedMission.reqDeltaV;
      deltaVEl.style.color = isDeltaVOk ? '#00f0ff' : '#e23636';
      deltaVBar.style.background = isDeltaVOk ? '#00f0ff' : '#e23636';
      deltaVBar.style.width = `${Math.min(100, (deltaV / this.selectedMission.reqDeltaV) * 100)}%`;
    }

    const scienceEl = document.getElementById('metric-science');
    const scienceBar = document.getElementById('bar-science');
    const scienceTargetEl = document.getElementById('metric-science-target');
    if (scienceEl && scienceBar && scienceTargetEl) {
      scienceTargetEl.textContent = `Target: ${this.selectedMission.minSciencePoints} pts`;
      scienceEl.textContent = `${totalScience} pts`;
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
      errorReason = `🔴 FLIGHT CONTROLLER: MISSION BUDGET EXCEEDED BY $${Math.abs(remainingBudget).toFixed(1)}M. Reconfigure spacecraft payload or launch booster.`;
    } else if (totalMass > carrier.cap) {
      errorReason = `🔴 FLIGHT CONTROLLER: PAYLOAD OVERWEIGHT BY ${(totalMass - carrier.cap).toLocaleString()} kg. Launch vehicle capacity exceeded!`;
    } else if (powerBalance < 0) {
      errorReason = `🔴 FLIGHT CONTROLLER: ELECTRICAL POWER DEFICIT (${powerBalance}W). Solar array output insufficient at ${this.selectedMission.distanceAU} AU! Equip RTG or reactor.`;
    } else if (deltaV < this.selectedMission.reqDeltaV) {
      errorReason = `🔴 FLIGHT CONTROLLER: INSUFFICIENT ORBITAL DELTA-V (Deficit: ${this.selectedMission.reqDeltaV - deltaV} m/s). Cannot achieve injection orbit!`;
    } else if (this.selectedTechIds.size === 0) {
      errorReason = `🔴 FLIGHT CONTROLLER: NO SCIENTIFIC AVIONICS INSTALLED. Spacecraft cannot collect mission telemetry!`;
    } else if (this.selectedTechIds.size > chassis.cap) {
      errorReason = `🔴 FLIGHT CONTROLLER: PAYLOAD BAY CAPACITY EXCEEDED: Hull supports a maximum of ${chassis.cap} avionics bays.`;
    }

    if (errorReason) {
      if (msgEl) msgEl.innerHTML = errorReason;
      if (btnLaunch) btnLaunch.disabled = true;
    } else {
      if (msgEl) {
        msgEl.innerHTML = `<span style="color: #10b981;">●</span> FLIGHT DIRECTOR: ALL SYSTEMS NOMINAL • LAUNCH PROFILE AUTHORIZED`;
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

    // 3D Asset Vault Modal
    const vaultModal = document.getElementById('resource-vault-modal');
    const btnVault = document.getElementById('btn-resource-vault');
    const btnVaultClose = document.getElementById('vault-btn-close');
    const btnVaultImport = document.getElementById('vault-btn-import-shortcut');

    btnVault?.addEventListener('click', () => {
      this.playClickSound();
      if (vaultModal) vaultModal.style.display = 'flex';
    });

    btnVaultClose?.addEventListener('click', () => {
      this.playClickSound();
      if (vaultModal) vaultModal.style.display = 'none';
    });

    vaultModal?.addEventListener('click', (e) => {
      if (e.target === vaultModal) {
        vaultModal.style.display = 'none';
      }
    });

    btnVaultImport?.addEventListener('click', () => {
      if (vaultModal) vaultModal.style.display = 'none';
      inputImport?.click();
    });

    // 3D Model Importer (.glb, .gltf, .obj)
    const btnImport = document.getElementById('btn-import-3d');
    const inputImport = document.getElementById('input-import-3d') as HTMLInputElement | null;
    btnImport?.addEventListener('click', () => {
      this.playClickSound();
      inputImport?.click();
    });

    inputImport?.addEventListener('change', (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        this.loadCustom3DModel(file);
      }
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

    // Language Selector
    const langSelect = document.getElementById('select-game-language') as HTMLSelectElement | null;
    if (langSelect) {
      langSelect.value = this.currentLanguage;
      langSelect.addEventListener('change', () => {
        this.setLanguage(langSelect.value);
      });
    }
  }

  public setLanguage(lang: string) {
    if (!HANGAR_I18N[lang]) {
      lang = 'en_us';
    }
    this.currentLanguage = lang;
    try {
      localStorage.setItem('nasa_game_lang', lang);
    } catch (e) {}

    const langSelect = document.getElementById('select-game-language') as HTMLSelectElement | null;
    if (langSelect && langSelect.value !== lang) {
      langSelect.value = lang;
    }

    const t = HANGAR_I18N[lang] || HANGAR_I18N['en_us'];

    // Topbar
    const brandSub = document.querySelector('.brand-sub');
    if (brandSub) brandSub.textContent = t.brandSub;

    const creditLabel = document.querySelector('.pill-label');
    if (creditLabel) creditLabel.textContent = t.creditsLabel;

    const btnVault = document.getElementById('btn-resource-vault');
    if (btnVault) btnVault.textContent = t.assetVaultBtn;

    const btnImport = document.getElementById('btn-import-3d');
    if (btnImport) btnImport.textContent = t.import3dBtn;

    const btnToggleCinematic = document.getElementById('btn-toggle-cinematic');
    if (btnToggleCinematic) btnToggleCinematic.textContent = t.cinematicBtn;

    const btnExitCinematic = document.getElementById('btn-exit-cinematic');
    if (btnExitCinematic) btnExitCinematic.textContent = t.restoreFlightBtn;

    // Sector Operations Blade
    const sectorTitle = document.querySelector('#blade-missions .blade-title');
    if (sectorTitle) {
      sectorTitle.innerHTML = `${t.sectorOpsTitle} <span class="badge-accent">${t.targetsBadge}</span>`;
    }

    // Avionics Blade
    const avionicsTitle = document.querySelector('#blade-diagnostics .blade-title');
    if (avionicsTitle) {
      avionicsTitle.innerHTML = `${t.avionicsDiagTitle} <span class="badge-jarvis">NASA GNC</span>`;
    }

    const metricLabels = document.querySelectorAll('#blade-diagnostics .gauge-box .gauge-label > span:first-child');
    if (metricLabels.length >= 5) {
      metricLabels[0].textContent = t.budgetSurplus;
      metricLabels[1].textContent = t.dryMass;
      metricLabels[2].textContent = t.powerBalance;
      metricLabels[3].textContent = t.calcDeltaV;
      metricLabels[4].textContent = t.scienceReturn;
    }

    // Category Tabs
    const tabChassis = document.querySelector('[data-tab="chassis"]');
    if (tabChassis) tabChassis.innerHTML = t.tabChassis;

    const tabFlags = document.querySelector('[data-tab="flags"]');
    if (tabFlags) tabFlags.innerHTML = t.tabFlags;

    const tabPower = document.querySelector('[data-tab="power"]');
    if (tabPower) tabPower.innerHTML = t.tabPower;

    const tabTech = document.querySelector('[data-tab="tech"]');
    if (tabTech) tabTech.innerHTML = t.tabTech;

    const tabEngines = document.querySelector('[data-tab="engines"]');
    if (tabEngines) tabEngines.innerHTML = t.tabEngines;

    const tabCarriers = document.querySelector('[data-tab="carriers"]');
    if (tabCarriers) tabCarriers.innerHTML = t.tabCarriers;

    // Launch Button
    const launchBtn = document.getElementById('btn-approve-launch');
    if (launchBtn) {
      launchBtn.innerHTML = `<span>⚡</span> ${t.launchBtn}`;
    }

    // Flight HUD
    const hudTelem = document.querySelector('.hud-header-title');
    if (hudTelem) {
      hudTelem.innerHTML = `${t.hudTelemetry} • <span id="hud-mission-name" style="color: var(--stark-cyan);">${this.selectedMission.title.toUpperCase()}</span>`;
    }

    const hudLabels = document.querySelectorAll('#hud-body-content .hud-info-row .hud-k');
    if (hudLabels.length >= 4) {
      hudLabels[0].textContent = t.hudTargetSector;
      hudLabels[1].textContent = t.hudCosmicIntel;
      hudLabels[2].textContent = t.hudArcOutput;
      hudLabels[3].textContent = t.hudJarvisStatus;
    }

    const btnDebrief = document.getElementById('hud-btn-debrief');
    if (btnDebrief) btnDebrief.textContent = t.hudIntelDebrief;

    const btnHangar = document.getElementById('hud-btn-reconfigure');
    if (btnHangar) btnHangar.textContent = t.hudStarkArmory;

    // Re-render items and avionics
    this.renderMissions();
    this.renderArmoryGrid();
    this.updateLiveTelemetry();
  }

  private launchHyperspace() {
    const modal = document.getElementById('nasa-mission-modal');
    if (modal) modal.style.display = 'none';

    const hud = document.getElementById('nasa-flight-hud');
    if (hud) hud.style.display = 'flex';

    document.getElementById('hud-mission-name')!.textContent = this.selectedMission.title.toUpperCase();
    document.getElementById('hud-target-name')!.textContent = this.selectedMission.destination;

    this.isMissionActive = true;
    this.currentScienceCollected = 0;
    this.missionTimer = 0;

    // Trigger WebGL-Orbiter to switch body and scenario
    this.onLaunchCallback(this.selectedMission, {
      scenarioName: this.selectedMission.scenarioName
    });

    // Background intel data collection
    const ticker = setInterval(() => {
      if (!this.isMissionActive) {
        clearInterval(ticker);
        return;
      }
      this.missionTimer += 1;
      this.currentScienceCollected += Math.floor(Math.random() * 5) + 3;

      const liveScore = document.getElementById('hud-science-live');
      if (liveScore) {
        liveScore.textContent = `${this.currentScienceCollected} pts`;
      }

      if (this.missionTimer === 12) {
        const st = document.getElementById('hud-status-text');
        if (st) {
          st.innerHTML = `<span style="color: var(--stark-cyan);">📡 ORBITAL TELEMETRY NOMINAL • TRAJECTORY LOCKED</span>`;
        }
      }
    }, 1000);
  }

  private showLobby() {
    this.isMissionActive = false;
    document.getElementById('nasa-mission-modal')!.style.display = 'flex';
    document.getElementById('nasa-flight-hud')!.style.display = 'none';
  }

  private showDebrief() {
    this.isMissionActive = false;
    const debrief = document.getElementById('nasa-debrief-modal');
    if (!debrief) return;

    debrief.style.display = 'flex';
    document.getElementById('debrief-score-science')!.textContent = `${this.currentScienceCollected} pts`;
    document.getElementById('debrief-score-budget')!.textContent = document.getElementById('metric-budget')!.textContent || '$0M';
    document.getElementById('debrief-score-reliability')!.textContent = '99.4%';

    const isSuccess = this.currentScienceCollected >= this.selectedMission.minSciencePoints;
    const rankEl = document.getElementById('debrief-rank');
    const summaryEl = document.getElementById('debrief-summary');

    if (isSuccess) {
      if (rankEl) rankEl.textContent = 'SUPREME COSMIC COMMANDER';
      if (summaryEl) {
        summaryEl.innerHTML = `
          <strong>MISSION OBJECTIVES ACCOMPLISHED WITH DISTINCTION!</strong><br>
          Your spacecraft successfully executed the orbital transfer to <em>${this.selectedMission.destination}</em>, 
          harvested full deep-space telemetry, and preserved maximum NASA operational mission budget reserves.
        `;
      }
    } else {
      if (rankEl) rankEl.textContent = 'S.W.O.R.D. ORBITAL SPECIALIST';
      if (summaryEl) {
        summaryEl.innerHTML = `
          <strong>PARTIAL MISSION SUCCESS:</strong><br>
          The spacecraft safely reached target orbital proximity, but extended orbital dwell time is required to extract complete science telemetry.
        `;
      }
    }
  }

  public updateFlightTelemetry(o: any, headingApoapsis: number) {
    if (!o) return;

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

        if (badgeEl && barFill) {
          if (nearestDistAU < 0.05) {
            badgeEl.textContent = 'INTERCEPT RANGE';
            badgeEl.className = 'hazard-badge-danger';
            barFill.style.width = '100%';
            barFill.style.background = '#ef4444';
          } else if (nearestDistAU < 0.3) {
            badgeEl.textContent = 'APPROACHING';
            badgeEl.className = 'hazard-badge-warn';
            barFill.style.width = `${Math.max(10, Math.min(100, (1 - nearestDistAU / 0.3) * 100))}%`;
            barFill.style.background = '#f59e0b';
          } else {
            badgeEl.textContent = 'TRACKING';
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
