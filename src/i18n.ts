export type SupportedLang =
  | 'en_us'
  | 'vi'
  | 'en_uk'
  | 'ja'
  | 'ko'
  | 'fr'
  | 'de'
  | 'it'
  | 'es';

export const SUPPORTED_LANGS: SupportedLang[] = [
  'en_us',
  'vi',
  'en_uk',
  'ja',
  'ko',
  'fr',
  'de',
  'it',
  'es'
];

export const LANG_BCP47: Record<SupportedLang, string> = {
  en_us: 'en-US',
  vi: 'vi',
  en_uk: 'en-GB',
  ja: 'ja',
  ko: 'ko',
  fr: 'fr',
  de: 'de',
  it: 'it',
  es: 'es'
};

export interface I18nTexts {
  // Topbar & Header
  brandSub: string;
  brandTag: string;
  creditsLabel: string;
  flightManualBtn: string;
  assetVaultBtn: string;
  assetVaultTitle: string;
  import3dBtn: string;
  import3dTitle: string;
  cinematicBtn: string;
  cinematicTitle: string;
  restoreFlightBtn: string;
  langSelectorTitle: string;
  langSelectorAria: string;
  customAssetClass: string;

  // Blades & Gauges
  sectorOpsTitle: string;
  targetsBadge: string;
  avionicsDiagTitle: string;
  avionicsBadge: string;
  budgetSurplus: string;
  totalMassLabel: string;
  massLimitMeta: string;
  massBreakdownMeta: string;
  powerBalance: string;
  powerDistMeta: string;
  calcDeltaV: string;
  deltaVReqMeta: string;
  scienceReturn: string;
  scienceTargetMeta: string;
  missionBudgetMeta: string;
  reqDeltaVMeta: string;

  // Tabs & Cards
  tabChassis: string;
  tabFlags: string;
  tabPower: string;
  tabTech: string;
  tabEngines: string;
  tabCarriers: string;
  equipped: string;
  equippedLivery: string;
  equippedScience: string;
  clickToEquip: string;
  clickToApply: string;
  cardChassisStats: string;
  cardFlagStats: string;
  cardPowerStats: string;
  cardTechStats: string;
  cardEngineStats: string;
  cardCarrierStats: string;

  // Launch & Validation
  launchBtn: string;
  statusNominal: string;
  errBudget: string;
  errOverweight: string;
  errPower: string;
  errDeltaV: string;
  errNoTech: string;
  errMaxTech: string;

  // 3D Import Toasts
  toastLoading: string;
  toastLoadedGltf: string;
  toastLoadedObj: string;
  toastErrParseGltf: string;
  toastErrReadGltf: string;
  toastErrParseObj: string;
  toastErrUnsupported: string;

  // 3D Asset Vault Modal
  vaultTitle: string;
  vaultSubtitle: string;
  vaultIntro: string;
  vaultSourceNasaTitle: string;
  vaultSourceNasaDesc: string;
  vaultSourceKenneyTitle: string;
  vaultSourceKenneyDesc: string;
  vaultSourceSmithsonianTitle: string;
  vaultSourceSmithsonianDesc: string;
  vaultSourceSketchfabTitle: string;
  vaultSourceSketchfabDesc: string;
  vaultImportBtn: string;
  vaultCloseAria: string;

  // In-Flight HUD
  hudTelemetry: string;
  hudDragTitle: string;
  hudMinimizeTitle: string;
  hudTargetSector: string;
  hudCosmicIntel: string;
  hudArcOutput: string;
  hudJarvisStatus: string;
  hudStatusInitial: string;
  hudStatusLocked: string;
  hudWsmvHeader: string;
  hudWsmvSma: string;
  hudWsmvEcc: string;
  hudWsmvInc: string;
  hudWsmvNode: string;
  hudWsmvPeri: string;
  hudWsmvHead: string;
  hudNearestPha: string;
  hudPhaRange: string;
  hudPhaTracking: string;
  hudPhaApproaching: string;
  hudPhaIntercept: string;
  hudIntelDebrief: string;
  hudStarkArmory: string;
  hudFlightMessage: string;

  // Debrief Modal
  debriefTitle: string;
  debriefScienceLabel: string;
  debriefBudgetLabel: string;
  debriefReliabilityLabel: string;
  debriefCertLabel: string;
  debriefRankSuccess: string;
  debriefRankPartial: string;
  debriefSummarySuccess: string;
  debriefSummaryPartial: string;
  debriefReturnBtn: string;
}

export interface ControlTexts {
  infoHtml: string;
  orbitTitle: string;
  settingsTitle: string;
  settingsLabels: string[];
  statsTitle: string;
  statsLabels: string[];
  bodiesTitle: string;
  orbitalElementsTitle: string;
  orbitalElementsLabels: {
    e: string;
    a: string;
    i: string;
    omega: string;
    w: string;
    periapsis: string;
    apoapsis: string;
    head: string;
  };
  timescalePrefix: string;
  saveTitle: string;
  saveNewLabel: string;
  saveBtn: string;
  saveSuccessMsg: string;
  loadTitle: string;
  loadSuccessMsg: string;
  deleteSuccessMsg: string;
  scenarioTitle: string;

  // Flight Deck Control
  flightDeckTitle: string;
  flightDeckToggleTitle: string;
  mainThrustTitle: string;
  throttleFullTitle: string;
  throttleHalfTitle: string;
  throttleCutTitle: string;
  throttleCutLabel: string;
  throttleStepUpTitle: string;
  throttleStepDownTitle: string;
  orbitSpeedLabel: string;
  autopilotTitle: string;
  sasStabPill: string;
  sasProgradePill: string;
  sasRetrogradePill: string;
  sasManualPill: string;
  sasStabMain: string;
  sasStabSub: string;
  sasStabTitle: string;
  sasProgradeMain: string;
  sasProgradeSub: string;
  sasProgradeTitle: string;
  sasRetrogradeMain: string;
  sasRetrogradeSub: string;
  sasRetrogradeTitle: string;
  sasManualMain: string;
  sasManualSub: string;
  sasManualTitle: string;
  pitchUpTitle: string;
  pitchDownTitle: string;
  yawLeftTitle: string;
  yawRightTitle: string;
  rollCcwTitle: string;
  rollCwTitle: string;
  sasEngagedMsg: string;
}

export const HANGAR_I18N: Record<SupportedLang, I18nTexts> = {
  en_us: {
    brandSub: 'MISSION CONTROL LAB — DESIGN & TEST A SPACE MISSION',
    brandTag: 'DEEP SPACE GNC',
    creditsLabel: 'BUDGET:',
    flightManualBtn: '📖 FLIGHT MANUAL',
    assetVaultBtn: '🌐 3D MODEL VAULT',
    assetVaultTitle: 'Browse free 3D spacecraft repositories',
    import3dBtn: '📂 IMPORT 3D',
    import3dTitle: 'Import a 3D spacecraft model (.glb, .gltf, .obj)',
    cinematicBtn: '👁 CINEMATIC VIEW',
    cinematicTitle: 'Hide panels to inspect the 3D spacecraft',
    restoreFlightBtn: '✕ RESTORE CONTROLS',
    langSelectorTitle: 'Select interface language',
    langSelectorAria: 'Game Language',
    customAssetClass: 'CUSTOM 3D MODEL',

    sectorOpsTitle: '01 // SELECT MISSION & TARGET',
    targetsBadge: 'MISSIONS',
    avionicsDiagTitle: '02 // TELEMETRY & LIMITS',
    avionicsBadge: 'MISSION CHECK',
    budgetSurplus: 'Remaining Budget',
    totalMassLabel: 'Total Launch Mass (Wet)',
    massLimitMeta: 'Max: {max} kg',
    massBreakdownMeta: 'Dry: {dry} kg • Fuel: {fuel} kg',
    powerBalance: 'Power Balance (1/r²)',
    powerDistMeta: '@ {au} AU (Gen: {gen} W, Use: {cons} W)',
    calcDeltaV: 'Delta-V Capability (Δv)',
    deltaVReqMeta: 'Req: {req} m/s',
    scienceReturn: 'Projected Science Data',
    scienceTargetMeta: 'Target: {target} pts',
    missionBudgetMeta: 'Budget: {budget}',
    reqDeltaVMeta: 'Req Δv: {req} m/s',

    tabChassis: '🚀 SPACECRAFT',
    tabFlags: '🇺🇸 INSIGNIA',
    tabPower: '⚛ POWER SOURCE',
    tabTech: '🔬 INSTRUMENTS',
    tabEngines: '⚡ ENGINES',
    tabCarriers: '🛸 LAUNCH VEHICLE',
    equipped: '● EQUIPPED',
    equippedLivery: '● EQUIPPED (4K DECAL)',
    equippedScience: '✓ EQUIPPED (+{points} PTS)',
    clickToEquip: 'CLICK TO EQUIP',
    clickToApply: 'CLICK TO APPLY',
    cardChassisStats: '{mass} kg dry • ${cost}M • Max {cap} slots',
    cardFlagStats: '4K Decal Ratio {ratio}:1 • {country}',
    cardPowerStats: '{mass} kg • ${cost}M • {power} W',
    cardTechStats: '{mass} kg • ${cost}M • Uses {power} W',
    cardEngineStats: 'Isp (efficiency): {isp} s • Fuel: {fuel} kg • ${cost}M',
    cardCarrierStats: 'Max Payload: {cap} kg • ${cost}M',

    launchBtn: 'START MISSION',
    statusNominal: '● ALL CHECKS PASSED — READY TO LAUNCH.',
    errBudget: '🔴 BUDGET EXCEEDED BY ${excess}M. Choose a cheaper part or launcher.',
    errOverweight: '🔴 OVERWEIGHT BY {excess} kg. Pick a stronger launch vehicle or lighter parts.',
    errPower: '🔴 POWER DEFICIT ({deficit} W) at {au} AU. Switch to a nuclear/reactor core or remove instruments.',
    errDeltaV: '🔴 INSUFFICIENT Δv: short by {deficit} m/s. Reduce dry mass or choose a higher-Isp engine.',
    errNoTech: '🔴 NO INSTRUMENTS EQUIPPED. Add at least one scientific instrument to collect data.',
    errMaxTech: '🔴 PAYLOAD BAY FULL: This spacecraft supports at most {max} instruments.',

    toastLoading: '⏳ Loading 3D model: {file}...',
    toastLoadedGltf: '✓ Loaded 3D model: {file}',
    toastLoadedObj: '✓ Loaded 3D OBJ model: {file}',
    toastErrParseGltf: '⚠️ Failed to parse GLTF/GLB: {err}',
    toastErrReadGltf: '⚠️ Failed to read GLTF file: {err}',
    toastErrParseObj: '⚠️ Failed to parse OBJ file: {err}',
    toastErrUnsupported: '⚠️ Unsupported format (.{ext}). Use .glb, .gltf, or .obj.',

    vaultTitle: 'FREE 3D SPACECRAFT REPOSITORIES',
    vaultSubtitle: 'Official NASA, Smithsonian & CC0 Public Archives',
    vaultIntro: 'This simulator includes built-in 3D models. You can also download a model from the archives below and load it with <strong>📂 IMPORT 3D</strong> (.glb, .gltf, .obj):',
    vaultSourceNasaTitle: '🚀 NASA 3D Resources (Public Domain)',
    vaultSourceNasaDesc: 'Official 3D models of the Space Shuttle, Apollo Lunar Module, Orion, Voyager, Hubble, Curiosity, and ISS.',
    vaultSourceKenneyTitle: '⚔️ Kenney Space Kit (CC0 Public Domain)',
    vaultSourceKenneyDesc: 'Free sci-fi spacecraft, cargo ships, interceptors, and modular space station parts.',
    vaultSourceSmithsonianTitle: '🏛️ Smithsonian 3D Digitization',
    vaultSourceSmithsonianDesc: 'High-resolution 3D scans of the Apollo 11 Command Module Columbia, Space Shuttle Discovery, and historic craft.',
    vaultSourceSketchfabTitle: '🪐 Sketchfab CC0 Spacecraft',
    vaultSourceSketchfabDesc: 'Community-shared sci-fi cruisers and concept spacecraft available under CC0 and CC-BY licenses.',
    vaultImportBtn: '📂 LOAD YOUR OWN 3D MODEL',
    vaultCloseAria: 'Close 3D asset vault',

    hudTelemetry: '● ORBITAL TELEMETRY',
    hudDragTitle: 'Drag to move Flight HUD',
    hudMinimizeTitle: 'Minimize or expand HUD',
    hudTargetSector: 'Target Destination:',
    hudCosmicIntel: 'Science Telemetry:',
    hudArcOutput: 'Electrical Power:',
    hudJarvisStatus: 'Flight Status:',
    hudStatusInitial: 'Trajectory Nominal • Tracking Active',
    hudStatusLocked: '📡 Telemetry Nominal • Orbit Locked',
    hudWsmvHeader: 'KEPLERIAN ORBIT & PHA RADAR',
    hudWsmvSma: 'SMA (a):',
    hudWsmvEcc: 'ECC (e):',
    hudWsmvInc: 'INC (i):',
    hudWsmvNode: 'NODE (Ω):',
    hudWsmvPeri: 'PERI (ω):',
    hudWsmvHead: 'HEAD:',
    hudNearestPha: 'NEAREST ASTEROID (PHA):',
    hudPhaRange: 'RANGE:',
    hudPhaTracking: 'TRACKING',
    hudPhaApproaching: 'APPROACHING',
    hudPhaIntercept: 'CLOSE RANGE',
    hudIntelDebrief: '📊 MISSION REPORT',
    hudStarkArmory: '⚙️ EDIT DESIGN',
    hudFlightMessage: 'Mission Active: {title} • Destination: {destination}',

    debriefTitle: 'EDUCATIONAL SIMULATION REPORT',
    debriefScienceLabel: 'Science Data Collected',
    debriefBudgetLabel: 'Remaining Budget',
    debriefReliabilityLabel: 'Model Mode',
    debriefCertLabel: 'Simulation Outcome',
    debriefRankSuccess: 'TARGET DATA THRESHOLD MET',
    debriefRankPartial: 'BELOW TARGET THRESHOLD',
    debriefSummarySuccess: '<strong>TARGET REACHED:</strong><br>Your spacecraft collected {actual} science pts (target: {target} pts) while flying the <em>{destination}</em> scenario. Note: in-flight orbit visuals are simplified for learning.',
    debriefSummaryPartial: '<strong>MORE DATA NEEDED:</strong><br>Collected {actual} of {target} science pts for <em>{destination}</em>. Wait longer in orbit or equip additional scientific instruments.',
    debriefReturnBtn: '↺ RETURN TO HANGAR'
  },

  vi: {
    brandSub: 'PHÒNG THÍ NGHIỆM THIẾT KẾ NHIỆM VỤ KHÔNG GIAN',
    brandTag: 'DẪN ĐƯỜNG KHÔNG GIAN SÂU',
    creditsLabel: 'NGÂN SÁCH:',
    flightManualBtn: '📖 HƯỚNG DẪN BAY',
    assetVaultBtn: '🌐 KHO MẪU 3D',
    assetVaultTitle: 'Xem nguồn tải mô hình tàu vũ trụ 3D miễn phí',
    import3dBtn: '📂 NHẬP MẪU 3D',
    import3dTitle: 'Tải mô hình tàu 3D từ máy (.glb, .gltf, .obj)',
    cinematicBtn: '👁 XEM TOÀN CẢNH 3D',
    cinematicTitle: 'Ẩn bảng điều khiển để quan sát tàu 3D',
    restoreFlightBtn: '✕ HIỆN LẠI BẢNG ĐIỀU KHIỂN',
    langSelectorTitle: 'Chọn ngôn ngữ hiển thị',
    langSelectorAria: 'Ngôn ngữ giao diện',
    customAssetClass: 'MÔ HÌNH 3D TỰ NHẬP',

    sectorOpsTitle: '01 // CHỌN NHIỆM VỤ & ĐÍCH ĐẾN',
    targetsBadge: 'NHIỆM VỤ',
    avionicsDiagTitle: '02 // THÔNG SỐ & GIỚI HẠN THIẾT KẾ',
    avionicsBadge: 'KIỂM TRA KỸ THUẬT',
    budgetSurplus: 'Ngân sách còn lại',
    totalMassLabel: 'Tổng khối lượng phóng (gồm chất đẩy)',
    massLimitMeta: 'Giới hạn tên lửa: {max} kg',
    massBreakdownMeta: 'Khô: {dry} kg • Chất đẩy: {fuel} kg',
    powerBalance: 'Cân bằng công suất (1/r²)',
    powerDistMeta: '@ {au} AU (Phát: {gen} W, Dùng: {cons} W)',
    calcDeltaV: 'Khả năng đổi vận tốc (Δv)',
    deltaVReqMeta: 'Yêu cầu: {req} m/s',
    scienceReturn: 'Dữ liệu khoa học dự kiến',
    scienceTargetMeta: 'Mục tiêu: {target} điểm',
    missionBudgetMeta: 'Ngân sách: {budget}',
    reqDeltaVMeta: 'Δv yêu cầu: {req} m/s',

    tabChassis: '🚀 TÀU VŨ TRỤ',
    tabFlags: '🇻🇳 CỜ & BIỂU TƯỢNG',
    tabPower: '⚛ NGUỒN ĐIỆN',
    tabTech: '🔬 THIẾT BỊ ĐO',
    tabEngines: '⚡ ĐỘNG CƠ',
    tabCarriers: '🛸 TÊN LỬA ĐẨY',
    equipped: '● ĐANG CHỌN',
    equippedLivery: '● ĐANG DÙNG (4K)',
    equippedScience: '✓ ĐÃ LẮP (+{points} ĐIỂM)',
    clickToEquip: 'BẤM ĐỂ CHỌN',
    clickToApply: 'BẤM ĐỂ ÁP DỤNG',
    cardChassisStats: '{mass} kg khô • ${cost}M • Tối đa {cap} khoang',
    cardFlagStats: 'Tỉ lệ cờ 4K {ratio}:1 • {country}',
    cardPowerStats: '{mass} kg • ${cost}M • {power} W',
    cardTechStats: '{mass} kg • ${cost}M • Tiêu thụ {power} W',
    cardEngineStats: 'Xung riêng Isp: {isp} s • Chất đẩy: {fuel} kg • ${cost}M',
    cardCarrierStats: 'Tải trọng tối đa: {cap} kg • ${cost}M',

    launchBtn: 'BẮT ĐẦU NHIỆM VỤ',
    statusNominal: '● ĐẠT MỌI ĐIỀU KIỆN — SẴN SÀNG PHÓNG.',
    errBudget: '🔴 VƯỢT NGÂN SÁCH ${excess}M. Hãy chọn thiết bị hoặc tên lửa rẻ hơn.',
    errOverweight: '🔴 VƯỢT TẢI TRỌNG {excess} kg. Hãy đổi tên lửa đẩy lớn hơn hoặc giảm khối lượng.',
    errPower: '🔴 THIẾU CÔNG SUẤT ({deficit} W) ở khoảng cách {au} AU. Hãy đổi nguồn điện hạt nhân hoặc giảm thiết bị đo.',
    errDeltaV: '🔴 Tàu còn thiếu {deficit} m/s khả năng cơ động (Δv). Thử giảm khối lượng hoặc đổi động cơ hiệu quả hơn.',
    errNoTech: '🔴 CHƯA LẮP THIẾT BỊ ĐO. Cần ít nhất một thiết bị khoa học để thu thập dữ liệu.',
    errMaxTech: '🔴 QUÁ SỐ KHOANG CHỨA: Thân tàu này chỉ lắp được tối đa {max} thiết bị đo.',

    toastLoading: '⏳ Đang tải mô hình 3D: {file}...',
    toastLoadedGltf: '✓ Đã nạp mô hình 3D: {file}',
    toastLoadedObj: '✓ Đã nạp mô hình OBJ: {file}',
    toastErrParseGltf: '⚠️ Lỗi đọc cấu trúc GLTF/GLB: {err}',
    toastErrReadGltf: '⚠️ Không đọc được tệp GLTF: {err}',
    toastErrParseObj: '⚠️ Lỗi đọc tệp OBJ: {err}',
    toastErrUnsupported: '⚠️ Định dạng .{ext} chưa hỗ trợ. Hãy dùng .glb, .gltf hoặc .obj.',

    vaultTitle: 'KHO MÔ HÌNH TÀU VŨ TRỤ 3D MIỄN PHÍ',
    vaultSubtitle: 'Nguồn mở chính thức từ NASA, Smithsonian & CC0',
    vaultIntro: 'Trò chơi đã có sẵn các mẫu tàu 3D. Bạn cũng có thể tải thêm mô hình từ các kho bên dưới rồi nạp bằng nút <strong>📂 NHẬP MẪU 3D</strong> (.glb, .gltf, .obj):',
    vaultSourceNasaTitle: '🚀 Kho 3D chính thức của NASA (Public Domain)',
    vaultSourceNasaDesc: 'Mô hình Space Shuttle, tàu đổ bộ Mặt Trăng Apollo, Orion, Voyager, Hubble, Curiosity và trạm ISS.',
    vaultSourceKenneyTitle: '⚔️ Kenney Space Kit (CC0 Public Domain)',
    vaultSourceKenneyDesc: 'Bộ mô hình tàu vũ trụ, tàu vận tải, tàu trinh sát và mô-đun trạm không gian miễn phí.',
    vaultSourceSmithsonianTitle: '🏛️ Kho số hóa 3D Smithsonian',
    vaultSourceSmithsonianDesc: 'Bản quét 3D độ phân giải cao của tàu chỉ huy Apollo 11 Columbia và tàu con thoi Discovery.',
    vaultSourceSketchfabTitle: '🪐 Sketchfab CC0 Spacecraft',
    vaultSourceSketchfabDesc: 'Hàng nghìn mẫu tàu vũ trụ cộng đồng chia sẻ theo giấy phép CC0 và CC-BY.',
    vaultImportBtn: '📂 TẢI MÔ HÌNH 3D CỦA BẠN',
    vaultCloseAria: 'Đóng kho mẫu 3D',

    hudTelemetry: '● ĐO ĐẠC QUỸ ĐẠO',
    hudDragTitle: 'Kéo để di chuyển bảng thông số bay',
    hudMinimizeTitle: 'Thu gọn hoặc mở rộng bảng',
    hudTargetSector: 'Đích đến:',
    hudCosmicIntel: 'Dữ liệu khoa học:',
    hudArcOutput: 'Công suất nguồn:',
    hudJarvisStatus: 'Trạng thái bay:',
    hudStatusInitial: 'Quỹ đạo ổn định • Đang theo dõi',
    hudStatusLocked: '📡 Tín hiệu ổn định • Đã khóa quỹ đạo',
    hudWsmvHeader: 'THÔNG SỐ QUỸ ĐẠO & RADAR TIỂU HÀNH TINH',
    hudWsmvSma: 'Bán trục lớn (a):',
    hudWsmvEcc: 'Độ lệch tâm (e):',
    hudWsmvInc: 'Độ nghiêng (i):',
    hudWsmvNode: 'Điểm nút (Ω):',
    hudWsmvPeri: 'Cận điểm (ω):',
    hudWsmvHead: 'Hướng bay:',
    hudNearestPha: 'TIỂU HÀNH TINH GẦN NHẤT:',
    hudPhaRange: 'KHOẢNG CÁCH:',
    hudPhaTracking: 'ĐANG THEO DÕI',
    hudPhaApproaching: 'ĐANG TIẾP CẬN',
    hudPhaIntercept: 'CỰ LY GẦN',
    hudIntelDebrief: '📊 BÁO CÁO KẾT QUẢ',
    hudStarkArmory: '⚙️ CHỈNH THIẾT KẾ',
    hudFlightMessage: 'Đang bay nhiệm vụ: {title} • Đích: {destination}',

    debriefTitle: 'KẾT QUẢ MÔ PHỎNG GIÁO DỤC',
    debriefScienceLabel: 'Dữ liệu khoa học thu được',
    debriefBudgetLabel: 'Ngân sách còn lại',
    debriefReliabilityLabel: 'Chế độ mô phỏng',
    debriefCertLabel: 'Đánh giá ngưỡng mục tiêu',
    debriefRankSuccess: 'ĐẠT NGƯỠNG DỮ LIỆU MỤC TIÊU',
    debriefRankPartial: 'CHƯA ĐẠT NGƯỠNG MỤC TIÊU',
    debriefSummarySuccess: '<strong>HOÀN THÀNH MỤC TIÊU DỮ LIỆU:</strong><br>Tàu đã thu thập {actual} điểm dữ liệu (mục tiêu: {target} điểm) trong kịch bản <em>{destination}</em>. Lưu ý: quỹ đạo 3D được giản lược để phục vụ học tập.',
    debriefSummaryPartial: '<strong>CẦN THU THÊM DỮ LIỆU:</strong><br>Mới thu được {actual}/{target} điểm dữ liệu cho <em>{destination}</em>. Hãy bay thêm thời gian trên quỹ đạo hoặc lắp thêm thiết bị đo.',
    debriefReturnBtn: '↺ QUAY LẠI CHỈNH THIẾT KẾ'
  },

  en_uk: {
    brandSub: 'MISSION CONTROL LAB — DESIGN & TEST A SPACE MISSION',
    brandTag: 'DEEP SPACE GNC',
    creditsLabel: 'BUDGET:',
    flightManualBtn: '📖 FLIGHT MANUAL',
    assetVaultBtn: '🌐 3D MODEL VAULT',
    assetVaultTitle: 'Browse free 3D spacecraft repositories',
    import3dBtn: '📂 IMPORT 3D',
    import3dTitle: 'Import a 3D spacecraft model (.glb, .gltf, .obj)',
    cinematicBtn: '👁 CINEMATIC VIEW',
    cinematicTitle: 'Hide panels to inspect the 3D spacecraft',
    restoreFlightBtn: '✕ RESTORE CONTROLS',
    langSelectorTitle: 'Select interface language',
    langSelectorAria: 'Game Language',
    customAssetClass: 'CUSTOM 3D MODEL',

    sectorOpsTitle: '01 // SELECT MISSION & TARGET',
    targetsBadge: 'MISSIONS',
    avionicsDiagTitle: '02 // TELEMETRY & LIMITS',
    avionicsBadge: 'MISSION CHECK',
    budgetSurplus: 'Remaining Budget',
    totalMassLabel: 'Total Launch Mass (Wet)',
    massLimitMeta: 'Max: {max} kg',
    massBreakdownMeta: 'Dry: {dry} kg • Propellant: {fuel} kg',
    powerBalance: 'Power Balance (1/r²)',
    powerDistMeta: '@ {au} AU (Gen: {gen} W, Use: {cons} W)',
    calcDeltaV: 'Delta-V Capability (Δv)',
    deltaVReqMeta: 'Req: {req} m/s',
    scienceReturn: 'Projected Science Data',
    scienceTargetMeta: 'Target: {target} pts',
    missionBudgetMeta: 'Budget: {budget}',
    reqDeltaVMeta: 'Req Δv: {req} m/s',

    tabChassis: '🚀 SPACECRAFT',
    tabFlags: '🇬🇧 INSIGNIA',
    tabPower: '⚛ POWER SOURCE',
    tabTech: '🔬 INSTRUMENTS',
    tabEngines: '⚡ ENGINES',
    tabCarriers: '🛸 LAUNCH VEHICLE',
    equipped: '● EQUIPPED',
    equippedLivery: '● EQUIPPED (4K DECAL)',
    equippedScience: '✓ EQUIPPED (+{points} PTS)',
    clickToEquip: 'CLICK TO EQUIP',
    clickToApply: 'CLICK TO APPLY',
    cardChassisStats: '{mass} kg dry • ${cost}M • Max {cap} bays',
    cardFlagStats: '4K Decal Ratio {ratio}:1 • {country}',
    cardPowerStats: '{mass} kg • ${cost}M • {power} W',
    cardTechStats: '{mass} kg • ${cost}M • Uses {power} W',
    cardEngineStats: 'Isp (efficiency): {isp} s • Propellant: {fuel} kg • ${cost}M',
    cardCarrierStats: 'Max Payload: {cap} kg • ${cost}M',

    launchBtn: 'START MISSION',
    statusNominal: '● ALL CHECKS PASSED — READY FOR LAUNCH.',
    errBudget: '🔴 BUDGET EXCEEDED BY ${excess}M. Choose a lower-cost part or launcher.',
    errOverweight: '🔴 OVERWEIGHT BY {excess} kg. Select a heavier launch vehicle or lighter parts.',
    errPower: '🔴 POWER DEFICIT ({deficit} W) at {au} AU. Switch to a nuclear/reactor core or remove instruments.',
    errDeltaV: '🔴 INSUFFICIENT Δv: short by {deficit} m/s. Reduce dry mass or choose a higher-Isp engine.',
    errNoTech: '🔴 NO INSTRUMENTS EQUIPPED. Add at least one scientific instrument to gather data.',
    errMaxTech: '🔴 PAYLOAD BAY FULL: This hull supports at most {max} instruments.',

    toastLoading: '⏳ Loading 3D model: {file}...',
    toastLoadedGltf: '✓ Loaded 3D model: {file}',
    toastLoadedObj: '✓ Loaded 3D OBJ model: {file}',
    toastErrParseGltf: '⚠️ Failed to parse GLTF/GLB: {err}',
    toastErrReadGltf: '⚠️ Failed to read GLTF file: {err}',
    toastErrParseObj: '⚠️ Failed to parse OBJ file: {err}',
    toastErrUnsupported: '⚠️ Unsupported format (.{ext}). Use .glb, .gltf, or .obj.',

    vaultTitle: 'FREE 3D SPACECRAFT REPOSITORIES',
    vaultSubtitle: 'Official NASA, Smithsonian & CC0 Public Archives',
    vaultIntro: 'This simulator includes built-in 3D models. You can also download a model from the archives below and load it with <strong>📂 IMPORT 3D</strong> (.glb, .gltf, .obj):',
    vaultSourceNasaTitle: '🚀 NASA 3D Resources (Public Domain)',
    vaultSourceNasaDesc: 'Official 3D models of the Space Shuttle, Apollo Lunar Module, Orion, Voyager, Hubble, Curiosity, and ISS.',
    vaultSourceKenneyTitle: '⚔️ Kenney Space Kit (CC0 Public Domain)',
    vaultSourceKenneyDesc: 'Free sci-fi spacecraft, cargo ships, interceptors, and modular space station parts.',
    vaultSourceSmithsonianTitle: '🏛️ Smithsonian 3D Digitisation',
    vaultSourceSmithsonianDesc: 'High-resolution 3D scans of the Apollo 11 Command Module Columbia, Space Shuttle Discovery, and historic craft.',
    vaultSourceSketchfabTitle: '🪐 Sketchfab CC0 Spacecraft',
    vaultSourceSketchfabDesc: 'Community-shared sci-fi cruisers and concept spacecraft available under CC0 and CC-BY licences.',
    vaultImportBtn: '📂 LOAD YOUR OWN 3D MODEL',
    vaultCloseAria: 'Close 3D asset vault',

    hudTelemetry: '● ORBITAL TELEMETRY',
    hudDragTitle: 'Drag to move Flight HUD',
    hudMinimizeTitle: 'Minimise or expand HUD',
    hudTargetSector: 'Target Destination:',
    hudCosmicIntel: 'Science Telemetry:',
    hudArcOutput: 'Electrical Power:',
    hudJarvisStatus: 'Flight Status:',
    hudStatusInitial: 'Trajectory Nominal • Tracking Active',
    hudStatusLocked: '📡 Telemetry Nominal • Orbit Locked',
    hudWsmvHeader: 'KEPLERIAN ORBIT & PHA RADAR',
    hudWsmvSma: 'SMA (a):',
    hudWsmvEcc: 'ECC (e):',
    hudWsmvInc: 'INC (i):',
    hudWsmvNode: 'NODE (Ω):',
    hudWsmvPeri: 'PERI (ω):',
    hudWsmvHead: 'HEAD:',
    hudNearestPha: 'NEAREST ASTEROID (PHA):',
    hudPhaRange: 'RANGE:',
    hudPhaTracking: 'TRACKING',
    hudPhaApproaching: 'APPROACHING',
    hudPhaIntercept: 'CLOSE RANGE',
    hudIntelDebrief: '📊 MISSION REPORT',
    hudStarkArmory: '⚙️ EDIT DESIGN',
    hudFlightMessage: 'Mission Active: {title} • Destination: {destination}',

    debriefTitle: 'EDUCATIONAL SIMULATION REPORT',
    debriefScienceLabel: 'Science Data Collected',
    debriefBudgetLabel: 'Remaining Budget',
    debriefReliabilityLabel: 'Model Mode',
    debriefCertLabel: 'Simulation Outcome',
    debriefRankSuccess: 'TARGET DATA THRESHOLD MET',
    debriefRankPartial: 'BELOW TARGET THRESHOLD',
    debriefSummarySuccess: '<strong>TARGET REACHED:</strong><br>Your spacecraft collected {actual} science pts (target: {target} pts) while flying the <em>{destination}</em> scenario. Note: in-flight orbit visuals are simplified for learning.',
    debriefSummaryPartial: '<strong>MORE DATA NEEDED:</strong><br>Collected {actual} of {target} science pts for <em>{destination}</em>. Remain in orbit longer or equip additional scientific instruments.',
    debriefReturnBtn: '↺ RETURN TO HANGAR'
  },

  ja: {
    brandSub: '宇宙ミッション設計ラボ — 設計と飛行テスト',
    brandTag: '深宇宙誘導制御',
    creditsLabel: '予算:',
    flightManualBtn: '📖 フライトマニュアル',
    assetVaultBtn: '🌐 3Dモデル保管庫',
    assetVaultTitle: '無料の3D宇宙船モデル配布サイトを表示',
    import3dBtn: '📂 3D読込',
    import3dTitle: '3D宇宙船モデルを読み込む (.glb, .gltf, .obj)',
    cinematicBtn: '👁 3D全体表示',
    cinematicTitle: 'パネルを隠して3D機体を観察する',
    restoreFlightBtn: '✕ パネルを再表示',
    langSelectorTitle: '表示言語を選択',
    langSelectorAria: '表示言語',
    customAssetClass: 'カスタム3Dモデル',

    sectorOpsTitle: '01 // ミッションと目的地を選択',
    targetsBadge: 'ミッション',
    avionicsDiagTitle: '02 // 設計数値と制限チェック',
    avionicsBadge: '技術確認',
    budgetSurplus: '残余予算',
    totalMassLabel: '打ち上げ総質量（推進剤込み）',
    massLimitMeta: 'ロケット上限: {max} kg',
    massBreakdownMeta: '乾燥質量: {dry} kg • 推進剤: {fuel} kg',
    powerBalance: '電力収支 (1/r²)',
    powerDistMeta: '@ {au} AU (発電: {gen} W, 消費: {cons} W)',
    calcDeltaV: '速度増分能力 (Δv)',
    deltaVReqMeta: '必要値: {req} m/s',
    scienceReturn: '予想科学データ量',
    scienceTargetMeta: '目標: {target} pts',
    missionBudgetMeta: '予算: {budget}',
    reqDeltaVMeta: '必要Δv: {req} m/s',

    tabChassis: '🚀 宇宙船',
    tabFlags: '🇯🇵 国旗・標識',
    tabPower: '⚛ 電源装置',
    tabTech: '🔬 観測機器',
    tabEngines: '⚡ エンジン',
    tabCarriers: '🛸 打ち上げロケット',
    equipped: '● 装備中',
    equippedLivery: '● 適用中 (4K)',
    equippedScience: '✓ 搭載中 (+{points} PTS)',
    clickToEquip: 'クリックで装備',
    clickToApply: 'クリックで適用',
    cardChassisStats: '乾燥 {mass} kg • ${cost}M • 最大 {cap} 基',
    cardFlagStats: '4Kデカール比 {ratio}:1 • {country}',
    cardPowerStats: '{mass} kg • ${cost}M • {power} W',
    cardTechStats: '{mass} kg • ${cost}M • 消費 {power} W',
    cardEngineStats: '比推力 Isp: {isp} s • 推進剤: {fuel} kg • ${cost}M',
    cardCarrierStats: '最大積載量: {cap} kg • ${cost}M',

    launchBtn: 'ミッション開始',
    statusNominal: '● 全条件クリア — 打ち上げ可能です。',
    errBudget: '🔴 予算を ${excess}M 超過しています。安価な部品やロケットに変更してください。',
    errOverweight: '🔴 積載上限を {excess} kg 超過しています。大型ロケットにするか軽量化してください。',
    errPower: '🔴 {au} AU で電力が {deficit} W 不足しています。原子力電源へ変更するか観測機器を減らしてください。',
    errDeltaV: '🔴 Δv（軌道変更能力）が {deficit} m/s 不足しています。質量を減らすか高Ispエンジンを選んでください。',
    errNoTech: '🔴 観測機器が未搭載です。データを収集するため1つ以上装備してください。',
    errMaxTech: '🔴 搭載枠上限です。この船体には最大 {max} 基まで搭載できます。',

    toastLoading: '⏳ 3Dモデル読込中: {file}...',
    toastLoadedGltf: '✓ 3Dモデル読込完了: {file}',
    toastLoadedObj: '✓ OBJモデル読込完了: {file}',
    toastErrParseGltf: '⚠️ GLTF/GLBの解析に失敗しました: {err}',
    toastErrReadGltf: '⚠️ GLTFファイルの読込に失敗しました: {err}',
    toastErrParseObj: '⚠️ OBJファイルの解析に失敗しました: {err}',
    toastErrUnsupported: '⚠️ 非対応形式 (.{ext}) です。.glb / .gltf / .obj を使用してください。',

    vaultTitle: '無料3D宇宙船モデル保管庫',
    vaultSubtitle: 'NASA・スミソニアン・CC0 公開アーカイブ',
    vaultIntro: '標準モデルに加え、下記サイトからモデルを入手して <strong>📂 3D読込</strong> ボタンで読み込めます（.glb, .gltf, .obj）：',
    vaultSourceNasaTitle: '🚀 NASA 3D Resources（パブリックドメイン）',
    vaultSourceNasaDesc: 'スペースシャトル、アポロ月着陸船、オリオン、ボイジャー、ハッブル、ISSなどの公式3Dモデル。',
    vaultSourceKenneyTitle: '⚔️ Kenney Space Kit（CC0 パブリックドメイン）',
    vaultSourceKenneyDesc: '宇宙船、輸送船、迎撃機、宇宙ステーション用モジュールなどの無料モデル集。',
    vaultSourceSmithsonianTitle: '🏛️ Smithsonian 3D Digitization',
    vaultSourceSmithsonianDesc: 'アポロ11号司令船コロンビアやディスカバリー号の高精細3Dスキャンデータ。',
    vaultSourceSketchfabTitle: '🪐 Sketchfab CC0 宇宙船モデル',
    vaultSourceSketchfabDesc: 'CC0およびCC-BYライセンスで公開されたコミュニティ制作の宇宙船モデル。',
    vaultImportBtn: '📂 自分の3Dモデルを読み込む',
    vaultCloseAria: '3Dモデル保管庫を閉じる',

    hudTelemetry: '● 軌道テレメトリー',
    hudDragTitle: 'ドラッグしてHUDを移動',
    hudMinimizeTitle: 'HUDを最小化／展開',
    hudTargetSector: '目的地:',
    hudCosmicIntel: '科学データ:',
    hudArcOutput: '供給電力:',
    hudJarvisStatus: '飛行状態:',
    hudStatusInitial: '軌道正常 • 追跡中',
    hudStatusLocked: '📡 テレメトリー正常 • 軌道安定',
    hudWsmvHeader: 'ケプラー軌道要素 ＆ 小惑星レーダー',
    hudWsmvSma: '軌道長半径 (a):',
    hudWsmvEcc: '離心率 (e):',
    hudWsmvInc: '軌道傾斜角 (i):',
    hudWsmvNode: '昇交点黄経 (Ω):',
    hudWsmvPeri: '近日点引数 (ω):',
    hudWsmvHead: '機首方位:',
    hudNearestPha: '最接近小惑星 (PHA):',
    hudPhaRange: '距離:',
    hudPhaTracking: '追跡中',
    hudPhaApproaching: '接近中',
    hudPhaIntercept: '至近距離',
    hudIntelDebrief: '📊 ミッション報告',
    hudStarkArmory: '⚙️ 設計に戻る',
    hudFlightMessage: 'ミッション実行中: {title} • 目的地: {destination}',

    debriefTitle: '教育用シミュレーション結果',
    debriefScienceLabel: '取得した科学データ',
    debriefBudgetLabel: '残余予算',
    debriefReliabilityLabel: 'モデル種別',
    debriefCertLabel: '目標達成判定',
    debriefRankSuccess: '目標データ量に到達',
    debriefRankPartial: '目標データ量に未達',
    debriefSummarySuccess: '<strong>目標データ量に到達しました：</strong><br><em>{destination}</em> シナリオで {actual} pts（目標 {target} pts）のデータを取得しました。※軌道表示は学習用に簡略化されています。',
    debriefSummaryPartial: '<strong>データが不足しています：</strong><br><em>{destination}</em> での取得量は {actual}/{target} pts です。軌道上でさらに観測するか観測機器を追加してください。',
    debriefReturnBtn: '↺ ハンガーに戻って再設計'
  },

  ko: {
    brandSub: '우주 임무 설계 연구소 — 설계 및 비행 테스트',
    brandTag: '심우주 유도 제어',
    creditsLabel: '예산:',
    flightManualBtn: '📖 비행 매뉴얼',
    assetVaultBtn: '🌐 3D 모델 보관소',
    assetVaultTitle: '무료 3D 우주선 모델 저장소 보기',
    import3dBtn: '📂 3D 불러오기',
    import3dTitle: '3D 우주선 모델 불러오기 (.glb, .gltf, .obj)',
    cinematicBtn: '👁 3D 전체 보기',
    cinematicTitle: '패널을 숨기고 3D 기체를 살펴봅니다',
    restoreFlightBtn: '✕ 패널 다시 표시',
    langSelectorTitle: '표시 언어 선택',
    langSelectorAria: '게임 언어',
    customAssetClass: '사용자 3D 모델',

    sectorOpsTitle: '01 // 임무 및 목표 선택',
    targetsBadge: '임무 목록',
    avionicsDiagTitle: '02 // 설계 수치 및 제한 확인',
    avionicsBadge: '기술 점검',
    budgetSurplus: '남은 예산',
    totalMassLabel: '총 발사 질량(추진제 포함)',
    massLimitMeta: '발사체 한계: {max} kg',
    massBreakdownMeta: '건조 질량: {dry} kg • 추진제: {fuel} kg',
    powerBalance: '전력 수지 (1/r²)',
    powerDistMeta: '@ {au} AU (발전: {gen} W, 소비: {cons} W)',
    calcDeltaV: '속도 변화 능력 (Δv)',
    deltaVReqMeta: '요구치: {req} m/s',
    scienceReturn: '예상 과학 데이터',
    scienceTargetMeta: '목표: {target} pts',
    missionBudgetMeta: '예산: {budget}',
    reqDeltaVMeta: '요구 Δv: {req} m/s',

    tabChassis: '🚀 우주선',
    tabFlags: '🇰🇷 국기 및 표식',
    tabPower: '⚛ 전원 장치',
    tabTech: '🔬 관측 장비',
    tabEngines: '⚡ 엔진',
    tabCarriers: '🛸 발사체',
    equipped: '● 장착됨',
    equippedLivery: '● 적용됨 (4K)',
    equippedScience: '✓ 장착됨 (+{points} PTS)',
    clickToEquip: '클릭하여 장착',
    clickToApply: '클릭하여 적용',
    cardChassisStats: '건조 {mass} kg • ${cost}M • 최대 {cap} 슬롯',
    cardFlagStats: '4K 데칼 비율 {ratio}:1 • {country}',
    cardPowerStats: '{mass} kg • ${cost}M • {power} W',
    cardTechStats: '{mass} kg • ${cost}M • 소비 {power} W',
    cardEngineStats: '비추력 Isp: {isp} s • 추진제: {fuel} kg • ${cost}M',
    cardCarrierStats: '최대 탑재량: {cap} kg • ${cost}M',

    launchBtn: '임무 시작',
    statusNominal: '● 모든 조건 충족 — 발사 준비 완료.',
    errBudget: '🔴 예산을 ${excess}M 초과했습니다. 더 저렴한 부품이나 발사체를 선택하세요.',
    errOverweight: '🔴 탑재 한계를 {excess} kg 초과했습니다. 더 큰 발사체를 고르거나 무게를 줄이세요.',
    errPower: '🔴 {au} AU 거리에서 전력이 {deficit} W 부족합니다. 원자력 전원으로 바꾸거나 장비를 줄이세요.',
    errDeltaV: '🔴 Δv(기동 능력)가 {deficit} m/s 부족합니다. 질량을 줄이거나 Isp가 높은 엔진을 선택하세요.',
    errNoTech: '🔴 장착된 관측 장비가 없습니다. 데이터를 수집하려면 장비를 최소 1개 장착하세요.',
    errMaxTech: '🔴 탑재 공간 초과: 이 선체는 최대 {max}개의 장비만 장착할 수 있습니다.',

    toastLoading: '⏳ 3D 모델 불러오는 중: {file}...',
    toastLoadedGltf: '✓ 3D 모델 불러오기 완료: {file}',
    toastLoadedObj: '✓ OBJ 모델 불러오기 완료: {file}',
    toastErrParseGltf: '⚠️ GLTF/GLB 구문 분석 오류: {err}',
    toastErrReadGltf: '⚠️ GLTF 파일 읽기 오류: {err}',
    toastErrParseObj: '⚠️ OBJ 파일 구문 분석 오류: {err}',
    toastErrUnsupported: '⚠️ 지원하지 않는 형식(.{ext})입니다. .glb, .gltf, .obj를 사용하세요.',

    vaultTitle: '무료 3D 우주선 모델 보관소',
    vaultSubtitle: '공식 NASA, 스미스소니언 및 CC0 공개 자료실',
    vaultIntro: '기본 내장 모델 외에 아래 자료실에서 모델을 받아 <strong>📂 3D 불러오기</strong> 버튼으로 바로 적용할 수 있습니다 (.glb, .gltf, .obj):',
    vaultSourceNasaTitle: '🚀 NASA 3D 자료실 (퍼블릭 도메인)',
    vaultSourceNasaDesc: '우주왕복선, 아폴로 달 착륙선, 오리온, 보이저, 허블, 큐리오시티, ISS 공식 3D 모델.',
    vaultSourceKenneyTitle: '⚔️ Kenney Space Kit (CC0 퍼블릭 도메인)',
    vaultSourceKenneyDesc: 'SF 우주선, 화물선, 요격기, 모듈식 우주 정거장 부품 무료 제공.',
    vaultSourceSmithsonianTitle: '🏛️ 스미스소니언 3D 디지털화 자료',
    vaultSourceSmithsonianDesc: '아폴로 11호 사령선 컬럼비아와 디스커버리 우주왕복선의 고정밀 3D 스캔 모델.',
    vaultSourceSketchfabTitle: '🪐 Sketchfab CC0 우주선 모델',
    vaultSourceSketchfabDesc: 'CC0 및 CC-BY 라이선스로 공유된 다양한 우주선 3D 모델.',
    vaultImportBtn: '📂 내 3D 모델 불러오기',
    vaultCloseAria: '3D 모델 보관소 닫기',

    hudTelemetry: '● 궤도 원격 측정',
    hudDragTitle: '드래그하여 비행 HUD 이동',
    hudMinimizeTitle: 'HUD 접기 / 펼치기',
    hudTargetSector: '목표 지점:',
    hudCosmicIntel: '과학 데이터:',
    hudArcOutput: '전력 출력:',
    hudJarvisStatus: '비행 상태:',
    hudStatusInitial: '궤도 정상 • 추적 활성',
    hudStatusLocked: '📡 원격 측정 정상 • 궤도 고정',
    hudWsmvHeader: '케플러 궤도 및 근접 소행성 레이더',
    hudWsmvSma: '긴반지름 (a):',
    hudWsmvEcc: '이심률 (e):',
    hudWsmvInc: '궤도 경사 (i):',
    hudWsmvNode: '승교점 경도 (Ω):',
    hudWsmvPeri: '근일점 편각 (ω):',
    hudWsmvHead: '기수 방위:',
    hudNearestPha: '가장 가까운 소행성 (PHA):',
    hudPhaRange: '거리:',
    hudPhaTracking: '추적 중',
    hudPhaApproaching: '접근 중',
    hudPhaIntercept: '근접 거리',
    hudIntelDebrief: '📊 임무 보고서',
    hudStarkArmory: '⚙️ 설계 수정',
    hudFlightMessage: '임무 진행 중: {title} • 목표: {destination}',

    debriefTitle: '교육용 시뮬레이션 보고서',
    debriefScienceLabel: '수집된 과학 데이터',
    debriefBudgetLabel: '남은 예산',
    debriefReliabilityLabel: '시뮬레이션 모드',
    debriefCertLabel: '목표 달성 여부',
    debriefRankSuccess: '목표 데이터 기준 달성',
    debriefRankPartial: '목표 데이터 기준 미달',
    debriefSummarySuccess: '<strong>목표 데이터 달성:</strong><br><em>{destination}</em> 시나리오에서 {actual} pts(목표 {target} pts)를 수집했습니다. 참고: 궤도 3D 화면은 학습을 위해 단순화되었습니다.',
    debriefSummaryPartial: '<strong>추가 데이터 필요:</strong><br><em>{destination}</em> 목표치 {target} pts 중 {actual} pts를 수집했습니다. 궤도에 더 머물거나 관측 장비를 추가해 보세요.',
    debriefReturnBtn: '↺ 격납고로 돌아가기'
  },

  fr: {
    brandSub: 'LABORATOIRE DE MISSION SPATIALE — CONCEPTION & ESSAI',
    brandTag: 'GUIDAGE SPATIAL',
    creditsLabel: 'BUDGET :',
    flightManualBtn: '📖 MANUEL DE VOL',
    assetVaultBtn: '🌐 MODÈLES 3D',
    assetVaultTitle: 'Parcourir les archives gratuites de vaisseaux 3D',
    import3dBtn: '📂 IMPORTER 3D',
    import3dTitle: 'Importer un modèle 3D (.glb, .gltf, .obj)',
    cinematicBtn: '👁 VUE 3D',
    cinematicTitle: 'Masquer les panneaux pour inspecter le vaisseau',
    restoreFlightBtn: '✕ AFFICHER LES CONTRÔLES',
    langSelectorTitle: 'Choisir la langue',
    langSelectorAria: 'Langue du jeu',
    customAssetClass: 'MODÈLE 3D IMPORTÉ',

    sectorOpsTitle: '01 // CHOISIR LA MISSION',
    targetsBadge: 'MISSIONS',
    avionicsDiagTitle: '02 // BILAN TECHNIQUE',
    avionicsBadge: 'VÉRIFICATION',
    budgetSurplus: 'Budget restant',
    totalMassLabel: 'Masse totale au lancement (ergols inclus)',
    massLimitMeta: 'Limite : {max} kg',
    massBreakdownMeta: 'À sec : {dry} kg • Ergols : {fuel} kg',
    powerBalance: 'Bilan de puissance (1/r²)',
    powerDistMeta: '@ {au} UA (Prod : {gen} W, Conso : {cons} W)',
    calcDeltaV: 'Capacité Delta-V (Δv)',
    deltaVReqMeta: 'Requis : {req} m/s',
    scienceReturn: 'Données scientifiques prévues',
    scienceTargetMeta: 'Objectif : {target} pts',
    missionBudgetMeta: 'Budget : {budget}',
    reqDeltaVMeta: 'Δv requis : {req} m/s',

    tabChassis: '🚀 VAISSEAU',
    tabFlags: '🇫🇷 INSIGNE',
    tabPower: '⚛ ÉNERGIE',
    tabTech: '🔬 INSTRUMENTS',
    tabEngines: '⚡ PROPULSION',
    tabCarriers: '🛸 LANCEUR',
    equipped: '● ÉQUIPÉ',
    equippedLivery: '● APPLIQUÉ (4K)',
    equippedScience: '✓ INSTALLÉ (+{points} PTS)',
    clickToEquip: 'CLIQUER POUR ÉQUIPER',
    clickToApply: 'CLIQUER POUR APPLIQUER',
    cardChassisStats: '{mass} kg à sec • {cost} M$ • Max {cap} baies',
    cardFlagStats: 'Ratio 4K {ratio}:1 • {country}',
    cardPowerStats: '{mass} kg • {cost} M$ • {power} W',
    cardTechStats: '{mass} kg • {cost} M$ • Conso {power} W',
    cardEngineStats: 'Isp (efficacité) : {isp} s • Ergols : {fuel} kg • {cost} M$',
    cardCarrierStats: 'Charge utile max : {cap} kg • {cost} M$',

    launchBtn: 'DÉMARRER LA MISSION',
    statusNominal: '● TOUS LES CONTRÔLES SONT VALIDES — PRÊT AU LANCEMENT.',
    errBudget: '🔴 BUDGET DÉPASSÉ DE {excess} M$. Choisissez un composant ou un lanceur moins coûteux.',
    errOverweight: '🔴 SURCHARGE DE {excess} kg. Choisissez un lanceur plus puissant ou allégez le vaisseau.',
    errPower: '🔴 DÉFICIT DE PUISSANCE ({deficit} W) à {au} UA. Passez au réacteur ou retirez des instruments.',
    errDeltaV: '🔴 Δv INSUFFISANT : il manque {deficit} m/s. Réduisez la masse ou choisissez un moteur à Isp plus élevé.',
    errNoTech: '🔴 AUCUN INSTRUMENT INSTALLÉ. Ajoutez au moins un capteur scientifique.',
    errMaxTech: '🔴 CAPACITÉ DÉPASSÉE : ce vaisseau accepte au maximum {max} instruments.',

    toastLoading: '⏳ Chargement du modèle 3D : {file}...',
    toastLoadedGltf: '✓ Modèle 3D chargé : {file}',
    toastLoadedObj: '✓ Modèle OBJ chargé : {file}',
    toastErrParseGltf: '⚠️ Erreur de lecture GLTF/GLB : {err}',
    toastErrReadGltf: '⚠️ Impossible de lire le fichier GLTF : {err}',
    toastErrParseObj: '⚠️ Erreur de lecture OBJ : {err}',
    toastErrUnsupported: '⚠️ Format .{ext} non pris en charge. Utilisez .glb, .gltf ou .obj.',

    vaultTitle: 'ARCHIVES DE MODÈLES 3D GRATUITS',
    vaultSubtitle: 'Sources officielles NASA, Smithsonian et CC0',
    vaultIntro: 'Le jeu inclut des modèles 3D intégrés. Vous pouvez aussi télécharger un modèle ci-dessous et l’ouvrir via <strong>📂 IMPORTER 3D</strong> (.glb, .gltf, .obj) :',
    vaultSourceNasaTitle: '🚀 NASA 3D Resources (Domaine public)',
    vaultSourceNasaDesc: 'Modèles officiels : Navette spatiale, Module lunaire Apollo, Orion, Voyager, Hubble, Curiosity et ISS.',
    vaultSourceKenneyTitle: '⚔️ Kenney Space Kit (CC0 Domaine public)',
    vaultSourceKenneyDesc: 'Vaisseaux, cargos, intercepteurs et modules de station spatiale gratuits.',
    vaultSourceSmithsonianTitle: '🏛️ Smithsonian 3D Digitization',
    vaultSourceSmithsonianDesc: 'Numérisations 3D haute précision du module Columbia d’Apollo 11 et de la navette Discovery.',
    vaultSourceSketchfabTitle: '🪐 Sketchfab CC0 Spacecraft',
    vaultSourceSketchfabDesc: 'Vaisseaux de science-fiction partagés par la communauté sous licences CC0 et CC-BY.',
    vaultImportBtn: '📂 CHARGER VOTRE MODÈLE 3D',
    vaultCloseAria: 'Fermer la bibliothèque 3D',

    hudTelemetry: '● TÉLÉMÉTRIE ORBITALE',
    hudDragTitle: 'Glisser pour déplacer le panneau',
    hudMinimizeTitle: 'Réduire ou agrandir le panneau',
    hudTargetSector: 'Destination :',
    hudCosmicIntel: 'Données scientifiques :',
    hudArcOutput: 'Puissance électrique :',
    hudJarvisStatus: 'État du vol :',
    hudStatusInitial: 'Trajectoire nominale • Suivi actif',
    hudStatusLocked: '📡 Télémétrie nominale • Orbite verrouillée',
    hudWsmvHeader: 'PARAMÈTRES KÉPLÉRIENS & RADAR PHA',
    hudWsmvSma: 'Demi-grand axe (a) :',
    hudWsmvEcc: 'Excentricité (e) :',
    hudWsmvInc: 'Inclinaison (i) :',
    hudWsmvNode: 'Nœud (Ω) :',
    hudWsmvPeri: 'Périastre (ω) :',
    hudWsmvHead: 'Cap :',
    hudNearestPha: 'ASTÉROÏDE PROCHE (PHA) :',
    hudPhaRange: 'DISTANCE :',
    hudPhaTracking: 'SUIVI',
    hudPhaApproaching: 'APPROCHE',
    hudPhaIntercept: 'PROXIMITÉ',
    hudIntelDebrief: '📊 RAPPORT',
    hudStarkArmory: '⚙️ MODIFIER',
    hudFlightMessage: 'Mission active : {title} • Destination : {destination}',

    debriefTitle: 'RAPPORT DE SIMULATION ÉDUCATIVE',
    debriefScienceLabel: 'Données collectées',
    debriefBudgetLabel: 'Budget restant',
    debriefReliabilityLabel: 'Mode du modèle',
    debriefCertLabel: 'Résultat de l’objectif',
    debriefRankSuccess: 'SEUIL DE DONNÉES ATTEINT',
    debriefRankPartial: 'SOUS LE SEUIL CIBLE',
    debriefSummarySuccess: '<strong>OBJECTIF ATTEINT :</strong><br>Votre vaisseau a recueilli {actual} pts (objectif : {target} pts) pour <em>{destination}</em>. Remarque : la vue 3D est simplifiée à des fins pédagogiques.',
    debriefSummaryPartial: '<strong>DONNÉES INSUFFISANTES :</strong><br>{actual} sur {target} pts recueillis pour <em>{destination}</em>. Restez plus longtemps en orbite ou ajoutez des instruments.',
    debriefReturnBtn: '↺ RETOUR AU HANGAR'
  },

  de: {
    brandSub: 'RAUMFAHRT-MISSIONS-LABOR — ENTWURF & TEST',
    brandTag: 'TIEFRAUM-STEUERUNG',
    creditsLabel: 'BUDGET:',
    flightManualBtn: '📖 FLUGHANDBUCH',
    assetVaultBtn: '🌐 3D-ARCHIV',
    assetVaultTitle: 'Kostenlose 3D-Raumschiff-Archive ansehen',
    import3dBtn: '📂 3D IMPORTIEREN',
    import3dTitle: '3D-Modell importieren (.glb, .gltf, .obj)',
    cinematicBtn: '👁 3D-ANSICHT',
    cinematicTitle: 'Bedienfelder für freie 3D-Ansicht ausblenden',
    restoreFlightBtn: '✕ STEUERUNG ANZEIGEN',
    langSelectorTitle: 'Sprache auswählen',
    langSelectorAria: 'Spielsprache',
    customAssetClass: 'EIGENES 3D-MODELL',

    sectorOpsTitle: '01 // MISSION & ZIEL WÄHLEN',
    targetsBadge: 'MISSIONEN',
    avionicsDiagTitle: '02 // TELEMETRIE & GRENZWERTE',
    avionicsBadge: 'SYSTEMCHECK',
    budgetSurplus: 'Verbleibendes Budget',
    totalMassLabel: 'Start-Gesamtmasse (inkl. Treibstoff)',
    massLimitMeta: 'Limit: {max} kg',
    massBreakdownMeta: 'Trocken: {dry} kg • Treibstoff: {fuel} kg',
    powerBalance: 'Leistungsbilanz (1/r²)',
    powerDistMeta: '@ {au} AE (Erz.: {gen} W, Verbr.: {cons} W)',
    calcDeltaV: 'Delta-V-Vermögen (Δv)',
    deltaVReqMeta: 'Erf.: {req} m/s',
    scienceReturn: 'Erwartete Forschungsdaten',
    scienceTargetMeta: 'Ziel: {target} Pkt.',
    missionBudgetMeta: 'Budget: {budget}',
    reqDeltaVMeta: 'Erf. Δv: {req} m/s',

    tabChassis: '🚀 RAUMSCHIFF',
    tabFlags: '🇩🇪 HOHEITSZEICHEN',
    tabPower: '⚛ ENERGIEQUELLE',
    tabTech: '🔬 INSTRUMENTE',
    tabEngines: '⚡ TRIEBWERKE',
    tabCarriers: '🛸 TRÄGERRAKETE',
    equipped: '● AUSGERÜSTET',
    equippedLivery: '● AKTIV (4K-DEKAL)',
    equippedScience: '✓ INSTALLIERT (+{points} PKT)',
    clickToEquip: 'ZUM AUSRÜSTEN KLICKEN',
    clickToApply: 'ZUM ANWENDEN KLICKEN',
    cardChassisStats: '{mass} kg trocken • {cost} Mio.$ • Max. {cap} Plätze',
    cardFlagStats: '4K-Verhältnis {ratio}:1 • {country}',
    cardPowerStats: '{mass} kg • {cost} Mio.$ • {power} W',
    cardTechStats: '{mass} kg • {cost} Mio.$ • Bedarf {power} W',
    cardEngineStats: 'Isp (Effizienz): {isp} s • Treibstoff: {fuel} kg • {cost} Mio.$',
    cardCarrierStats: 'Max. Nutzlast: {cap} kg • {cost} Mio.$',

    launchBtn: 'MISSION STARTEN',
    statusNominal: '● ALLE PRÜFUNGEN BESTANDEN — STARTBEREIT.',
    errBudget: '🔴 BUDGET UM {excess} Mio.$ ÜBERSCHRITTEN. Günstigere Teile oder Rakete wählen.',
    errOverweight: '🔴 ÜBERGEWICHT UM {excess} kg. Stärkere Trägerrakete wählen oder Masse reduzieren.',
    errPower: '🔴 LEISTUNGSMANGEL ({deficit} W) bei {au} AE. Reaktor wählen oder Instrumente entfernen.',
    errDeltaV: '🔴 ZU WENIG Δv: Es fehlen {deficit} m/s. Masse verringern oder effizienteres Triebwerk wählen.',
    errNoTech: '🔴 KEINE INSTRUMENTE. Mindestens ein Messgerät für Daten einbauen.',
    errMaxTech: '🔴 NUTZLASTBUCHT VOLL: Dieses Schiff trägt maximal {max} Instrumente.',

    toastLoading: '⏳ Lade 3D-Modell: {file}...',
    toastLoadedGltf: '✓ 3D-Modell geladen: {file}',
    toastLoadedObj: '✓ OBJ-Modell geladen: {file}',
    toastErrParseGltf: '⚠️ GLTF/GLB-Fehler: {err}',
    toastErrReadGltf: '⚠️ GLTF-Datei nicht lesbar: {err}',
    toastErrParseObj: '⚠️ OBJ-Lesefehler: {err}',
    toastErrUnsupported: '⚠️ Format .{ext} nicht unterstützt. Bitte .glb, .gltf oder .obj nutzen.',

    vaultTitle: 'KOSTENLOSE 3D-RAUMSCHIFF-ARCHIVE',
    vaultSubtitle: 'Offizielle NASA-, Smithsonian- & CC0-Archive',
    vaultIntro: 'Dieses Programm enthält integrierte 3D-Modelle. Weitere Modelle können Sie unten laden und über <strong>📂 3D IMPORTIEREN</strong> (.glb, .gltf, .obj) einbinden:',
    vaultSourceNasaTitle: '🚀 NASA 3D Resources (Public Domain)',
    vaultSourceNasaDesc: 'Offizielle 3D-Modelle von Space Shuttle, Apollo-Mondlandefähre, Orion, Voyager, Hubble, Curiosity und ISS.',
    vaultSourceKenneyTitle: '⚔️ Kenney Space Kit (CC0 Public Domain)',
    vaultSourceKenneyDesc: 'Kostenlose Sci-Fi-Raumschiffe, Frachter, Abfangjäger und Raumstationsteile.',
    vaultSourceSmithsonianTitle: '🏛️ Smithsonian 3D Digitization',
    vaultSourceSmithsonianDesc: 'Hochauflösende 3D-Scans der Apollo-11-Kommandokapsel Columbia und des Space Shuttle Discovery.',
    vaultSourceSketchfabTitle: '🪐 Sketchfab CC0 Raumschiffe',
    vaultSourceSketchfabDesc: 'Von der Community geteilte Raumschiffe unter CC0- und CC-BY-Lizenz.',
    vaultImportBtn: '📂 EIGENES 3D-MODELL LADEN',
    vaultCloseAria: '3D-Archiv schließen',

    hudTelemetry: '● ORBIT-TELEMETRIE',
    hudDragTitle: 'Ziehen, um Flug-HUD zu verschieben',
    hudMinimizeTitle: 'HUD minimieren oder erweitern',
    hudTargetSector: 'Ziel:',
    hudCosmicIntel: 'Forschungsdaten:',
    hudArcOutput: 'Elektrische Leistung:',
    hudJarvisStatus: 'Flugstatus:',
    hudStatusInitial: 'Flugbahn nominal • Verfolgung aktiv',
    hudStatusLocked: '📡 Telemetrie nominal • Orbit stabil',
    hudWsmvHeader: 'KEPLER-BAHN & ASTEROIDEN-RADAR',
    hudWsmvSma: 'Große Halbachse (a):',
    hudWsmvEcc: 'Exzentrizität (e):',
    hudWsmvInc: 'Bahnneigung (i):',
    hudWsmvNode: 'Knoten (Ω):',
    hudWsmvPeri: 'Periapsis (ω):',
    hudWsmvHead: 'Kurs:',
    hudNearestPha: 'NÄCHSTER ASTEROID (PHA):',
    hudPhaRange: 'ENTFERNUNG:',
    hudPhaTracking: 'VERFOLGUNG',
    hudPhaApproaching: 'ANNÄHERUNG',
    hudPhaIntercept: 'NAHBEREICH',
    hudIntelDebrief: '📊 BERICHT',
    hudStarkArmory: '⚙️ ENTWURF ÄNDERN',
    hudFlightMessage: 'Aktive Mission: {title} • Ziel: {destination}',

    debriefTitle: 'BILDUNGS-SIMULATIONSBERICHT',
    debriefScienceLabel: 'Gesammelte Daten',
    debriefBudgetLabel: 'Verbleibendes Budget',
    debriefReliabilityLabel: 'Modellmodus',
    debriefCertLabel: 'Zielbewertung',
    debriefRankSuccess: 'DATENZIEL ERREICHT',
    debriefRankPartial: 'UNTER DEM DATENZIEL',
    debriefSummarySuccess: '<strong>ZIEL ERREICHT:</strong><br>Ihr Raumschiff sammelte {actual} Pkt. (Ziel: {target} Pkt.) im Szenario <em>{destination}</em>. Hinweis: Die 3D-Flugbahn ist für Lernzwecke vereinfacht.',
    debriefSummaryPartial: '<strong>MEHR DATEN NÖTIG:</strong><br>{actual} von {target} Pkt. für <em>{destination}</em> gesammelt. Länger im Orbit bleiben oder mehr Instrumente einbauen.',
    debriefReturnBtn: '↺ ZURÜCK ZUM HANGAR'
  },

  it: {
    brandSub: 'LABORATORIO MISSIONI SPAZIALI — PROGETTO E TEST',
    brandTag: 'GUIDA SPAZIALE',
    creditsLabel: 'BUDGET:',
    flightManualBtn: '📖 MANUALE DI VOLO',
    assetVaultBtn: '🌐 ARCHIVIO MODELLI 3D',
    assetVaultTitle: 'Esplora archivi gratuiti di modelli 3D',
    import3dBtn: '📂 IMPORTA 3D',
    import3dTitle: 'Importa un modello 3D (.glb, .gltf, .obj)',
    cinematicBtn: '👁 VISTA 3D',
    cinematicTitle: 'Nascondi i pannelli per osservare il modello 3D',
    restoreFlightBtn: '✕ MOSTRA CONTROLLI',
    langSelectorTitle: 'Seleziona lingua',
    langSelectorAria: 'Lingua di gioco',
    customAssetClass: 'MODELLO 3D PERSONALIZZATO',

    sectorOpsTitle: '01 // SCEGLI MISSIONE E META',
    targetsBadge: 'MISSIONI',
    avionicsDiagTitle: '02 // TELEMETRIA E LIMITI',
    avionicsBadge: 'CONTROLLO TECNICO',
    budgetSurplus: 'Budget rimanente',
    totalMassLabel: 'Massa totale al lancio (con propellente)',
    massLimitMeta: 'Limite: {max} kg',
    massBreakdownMeta: 'A secco: {dry} kg • Propellente: {fuel} kg',
    powerBalance: 'Bilancio di potenza (1/r²)',
    powerDistMeta: '@ {au} UA (Gen.: {gen} W, Uso: {cons} W)',
    calcDeltaV: 'Capacità Delta-V (Δv)',
    deltaVReqMeta: 'Richiesto: {req} m/s',
    scienceReturn: 'Dati scientifici previsti',
    scienceTargetMeta: 'Obiettivo: {target} pt',
    missionBudgetMeta: 'Budget: {budget}',
    reqDeltaVMeta: 'Δv rich.: {req} m/s',

    tabChassis: '🚀 VEICOLO',
    tabFlags: '🇮🇹 INSEGNA',
    tabPower: '⚛ ENERGIA',
    tabTech: '🔬 STRUMENTI',
    tabEngines: '⚡ MOTORI',
    tabCarriers: '🛸 LANCIATORE',
    equipped: '● EQUIPAGGIATO',
    equippedLivery: '● APPLICATO (4K)',
    equippedScience: '✓ INSTALLATO (+{points} PT)',
    clickToEquip: 'CLICCA PER EQUIPAGGIARE',
    clickToApply: 'CLICCA PER APPLICARE',
    cardChassisStats: '{mass} kg a secco • ${cost}M • Max {cap} vani',
    cardFlagStats: 'Rapporto 4K {ratio}:1 • {country}',
    cardPowerStats: '{mass} kg • ${cost}M • {power} W',
    cardTechStats: '{mass} kg • ${cost}M • Consumo {power} W',
    cardEngineStats: 'Isp (efficienza): {isp} s • Propellente: {fuel} kg • ${cost}M',
    cardCarrierStats: 'Carico max: {cap} kg • ${cost}M',

    launchBtn: 'AVVIA MISSIONE',
    statusNominal: '● TUTTI I CONTROLLI SUPERATI — PRONTO AL LANCIO.',
    errBudget: '🔴 BUDGET SUPERATO DI ${excess}M. Scegli componenti o un lanciatore più economici.',
    errOverweight: '🔴 SOVRAPPESO DI {excess} kg. Scegli un lanciatore più potente o alleggerisci il carico.',
    errPower: '🔴 POTENZA INSUFFICIENTE ({deficit} W) a {au} UA. Passa a un reattore o rimuovi strumenti.',
    errDeltaV: '🔴 Δv INSUFFICIENTE: mancano {deficit} m/s. Riduci la massa o usa un motore con Isp maggiore.',
    errNoTech: '🔴 NESSUNO STRUMENTO INSTALLATO. Aggiungi almeno un sensore scientifico.',
    errMaxTech: '🔴 VANO PIENO: questo scafo supporta al massimo {max} strumenti.',

    toastLoading: '⏳ Caricamento modello 3D: {file}...',
    toastLoadedGltf: '✓ Modello 3D caricato: {file}',
    toastLoadedObj: '✓ Modello OBJ caricato: {file}',
    toastErrParseGltf: '⚠️ Errore lettura GLTF/GLB: {err}',
    toastErrReadGltf: '⚠️ Impossibile leggere il file GLTF: {err}',
    toastErrParseObj: '⚠️ Errore lettura file OBJ: {err}',
    toastErrUnsupported: '⚠️ Formato .{ext} non supportato. Usa .glb, .gltf o .obj.',

    vaultTitle: 'ARCHIVI GRATUITI DI MODELLI 3D',
    vaultSubtitle: 'Archivi ufficiali NASA, Smithsonian e CC0',
    vaultIntro: 'Il simulatore include modelli 3D pronti. Puoi anche scaricarne altri qui sotto e caricarli con <strong>📂 IMPORTA 3D</strong> (.glb, .gltf, .obj):',
    vaultSourceNasaTitle: '🚀 NASA 3D Resources (Pubblico Dominio)',
    vaultSourceNasaDesc: 'Modelli ufficiali di Space Shuttle, Modulo Lunare Apollo, Orion, Voyager, Hubble, Curiosity e ISS.',
    vaultSourceKenneyTitle: '⚔️ Kenney Space Kit (CC0 Pubblico Dominio)',
    vaultSourceKenneyDesc: 'Navicelle, navi cargo, intercettori e moduli per stazioni spaziali gratuiti.',
    vaultSourceSmithsonianTitle: '🏛️ Smithsonian 3D Digitization',
    vaultSourceSmithsonianDesc: 'Scansioni 3D ad alta precisione del modulo Columbia di Apollo 11 e dello Shuttle Discovery.',
    vaultSourceSketchfabTitle: '🪐 Sketchfab CC0 Spacecraft',
    vaultSourceSketchfabDesc: 'Modelli condivisi dalla community con licenze CC0 e CC-BY.',
    vaultImportBtn: '📂 CARICA IL TUO MODELLO 3D',
    vaultCloseAria: 'Chiudi archivio 3D',

    hudTelemetry: '● TELEMETRIA ORBITALE',
    hudDragTitle: 'Trascina per spostare il pannello di volo',
    hudMinimizeTitle: 'Riduci o espandi il pannello',
    hudTargetSector: 'Destinazione:',
    hudCosmicIntel: 'Dati scientifici:',
    hudArcOutput: 'Potenza elettrica:',
    hudJarvisStatus: 'Stato del volo:',
    hudStatusInitial: 'Traiettoria nominale • Tracciamento attivo',
    hudStatusLocked: '📡 Telemetria nominale • Orbita stabile',
    hudWsmvHeader: 'ELEMENTI KEPLERIANI & RADAR ASTEROIDI',
    hudWsmvSma: 'Semiasse magg. (a):',
    hudWsmvEcc: 'Eccentricità (e):',
    hudWsmvInc: 'Inclinazione (i):',
    hudWsmvNode: 'Nodo (Ω):',
    hudWsmvPeri: 'Periasse (ω):',
    hudWsmvHead: 'Rotta:',
    hudNearestPha: 'ASTEROIDE PIÙ VICINO (PHA):',
    hudPhaRange: 'DISTANZA:',
    hudPhaTracking: 'TRACCIAMENTO',
    hudPhaApproaching: 'AVVICINAMENTO',
    hudPhaIntercept: 'DISTANZA RAVVICINATA',
    hudIntelDebrief: '📊 RAPPORTO',
    hudStarkArmory: '⚙️ MODIFICA',
    hudFlightMessage: 'Missione attiva: {title} • Meta: {destination}',

    debriefTitle: 'RAPPORTO DI SIMULAZIONE EDUCATIVA',
    debriefScienceLabel: 'Dati raccolti',
    debriefBudgetLabel: 'Budget rimanente',
    debriefReliabilityLabel: 'Modalità modello',
    debriefCertLabel: 'Esito obiettivo',
    debriefRankSuccess: 'SOGLIA DATI RAGGIUNTA',
    debriefRankPartial: 'SOTTO LA SOGLIA OBIETTIVO',
    debriefSummarySuccess: '<strong>OBIETTIVO RAGGIUNTO:</strong><br>Il veicolo ha raccolto {actual} pt (obiettivo: {target} pt) nello scenario <em>{destination}</em>. Nota: la grafica orbitale è semplificata per scopi didattici.',
    debriefSummaryPartial: '<strong>SERVONO PIÙ DATI:</strong><br>Raccolti {actual} su {target} pt per <em>{destination}</em>. Resta più a lungo in orbita o aggiungi strumenti scientifici.',
    debriefReturnBtn: '↺ TORNA ALL’HANGAR'
  },

  es: {
    brandSub: 'LABORATORIO DE MISIONES ESPACIALES — DISEÑO Y PRUEBA',
    brandTag: 'NAVEGACIÓN ESPACIAL',
    creditsLabel: 'PRESUPUESTO:',
    flightManualBtn: '📖 MANUAL DE VUELO',
    assetVaultBtn: '🌐 ARCHIVO 3D',
    assetVaultTitle: 'Ver repositorios gratuitos de modelos 3D',
    import3dBtn: '📂 IMPORTAR 3D',
    import3dTitle: 'Importar modelo 3D (.glb, .gltf, .obj)',
    cinematicBtn: '👁 VISTA 3D',
    cinematicTitle: 'Ocultar paneles para inspeccionar la nave 3D',
    restoreFlightBtn: '✕ MOSTRAR CONTROLES',
    langSelectorTitle: 'Seleccionar idioma',
    langSelectorAria: 'Idioma del juego',
    customAssetClass: 'MODELO 3D PERSONALIZADO',

    sectorOpsTitle: '01 // ELEGIR MISIÓN Y DESTINO',
    targetsBadge: 'MISIONES',
    avionicsDiagTitle: '02 // TELEMETRÍA Y LÍMITES',
    avionicsBadge: 'REVISIÓN TÉCNICA',
    budgetSurplus: 'Presupuesto restante',
    totalMassLabel: 'Masa total al lanzamiento (con propelente)',
    massLimitMeta: 'Límite: {max} kg',
    massBreakdownMeta: 'En seco: {dry} kg • Propelente: {fuel} kg',
    powerBalance: 'Balance de potencia (1/r²)',
    powerDistMeta: '@ {au} UA (Gen.: {gen} W, Uso: {cons} W)',
    calcDeltaV: 'Capacidad Delta-V (Δv)',
    deltaVReqMeta: 'Req.: {req} m/s',
    scienceReturn: 'Datos científicos previstos',
    scienceTargetMeta: 'Objetivo: {target} pts',
    missionBudgetMeta: 'Presupuesto: {budget}',
    reqDeltaVMeta: 'Δv req.: {req} m/s',

    tabChassis: '🚀 NAVE',
    tabFlags: '🇪🇸 INSIGNIA',
    tabPower: '⚛ ENERGÍA',
    tabTech: '🔬 INSTRUMENTOS',
    tabEngines: '⚡ MOTORES',
    tabCarriers: '🛸 LANZADOR',
    equipped: '● EQUIPADO',
    equippedLivery: '● APLICADO (4K)',
    equippedScience: '✓ INSTALADO (+{points} PTS)',
    clickToEquip: 'CLIC PARA EQUIPAR',
    clickToApply: 'CLIC PARA APLICAR',
    cardChassisStats: '{mass} kg en seco • ${cost}M • Máx. {cap} bahías',
    cardFlagStats: 'Proporción 4K {ratio}:1 • {country}',
    cardPowerStats: '{mass} kg • ${cost}M • {power} W',
    cardTechStats: '{mass} kg • ${cost}M • Consumo {power} W',
    cardEngineStats: 'Isp (eficiencia): {isp} s • Propelente: {fuel} kg • ${cost}M',
    cardCarrierStats: 'Carga útil máx.: {cap} kg • ${cost}M',

    launchBtn: 'INICIAR MISIÓN',
    statusNominal: '● TODAS LAS COMPROBACIONES CORRECTAS — LISTO PARA DESPEGAR.',
    errBudget: '🔴 PRESUPUESTO EXCEDIDO EN ${excess}M. Elige piezas o lanzador más económicos.',
    errOverweight: '🔴 SOBREPESO DE {excess} kg. Elige un lanzador mayor o reduce masa.',
    errPower: '🔴 DÉFICIT DE POTENCIA ({deficit} W) a {au} UA. Usa un reactor o quita instrumentos.',
    errDeltaV: '🔴 Δv INSUFICIENTE: faltan {deficit} m/s. Reduce masa o elige un motor con mayor Isp.',
    errNoTech: '🔴 SIN INSTRUMENTOS. Instala al menos un sensor científico para recoger datos.',
    errMaxTech: '🔴 BAHÍA LLENA: esta nave admite como máximo {max} instrumentos.',

    toastLoading: '⏳ Cargando modelo 3D: {file}...',
    toastLoadedGltf: '✓ Modelo 3D cargado: {file}',
    toastLoadedObj: '✓ Modelo OBJ cargado: {file}',
    toastErrParseGltf: '⚠️ Error al analizar GLTF/GLB: {err}',
    toastErrReadGltf: '⚠️ No se pudo leer el archivo GLTF: {err}',
    toastErrParseObj: '⚠️ Error al analizar el archivo OBJ: {err}',
    toastErrUnsupported: '⚠️ Formato .{ext} no compatible. Usa .glb, .gltf u .obj.',

    vaultTitle: 'REPOSITORIOS GRATUITOS DE NAVES 3D',
    vaultSubtitle: 'Archivos oficiales de NASA, Smithsonian y CC0',
    vaultIntro: 'El simulador incluye modelos 3D integrados. También puedes descargar otros abajo y cargarlos con <strong>📂 IMPORTAR 3D</strong> (.glb, .gltf, .obj):',
    vaultSourceNasaTitle: '🚀 NASA 3D Resources (Dominio público)',
    vaultSourceNasaDesc: 'Modelos oficiales del Transbordador Espacial, Módulo Lunar Apolo, Orión, Voyager, Hubble, Curiosity e ISS.',
    vaultSourceKenneyTitle: '⚔️ Kenney Space Kit (CC0 Dominio público)',
    vaultSourceKenneyDesc: 'Naves espaciales, cargueros, interceptores y módulos de estación espacial gratuitos.',
    vaultSourceSmithsonianTitle: '🏛️ Smithsonian 3D Digitization',
    vaultSourceSmithsonianDesc: 'Escaneos 3D de alta precisión del módulo Columbia del Apolo 11 y del transbordador Discovery.',
    vaultSourceSketchfabTitle: '🪐 Sketchfab CC0 Spacecraft',
    vaultSourceSketchfabDesc: 'Naves compartidas por la comunidad bajo licencias CC0 y CC-BY.',
    vaultImportBtn: '📂 CARGAR TU PROPIO MODELO 3D',
    vaultCloseAria: 'Cerrar archivo 3D',

    hudTelemetry: '● TELEMETRÍA ORBITAL',
    hudDragTitle: 'Arrastra para mover el HUD de vuelo',
    hudMinimizeTitle: 'Minimizar o expandir el HUD',
    hudTargetSector: 'Destino:',
    hudCosmicIntel: 'Datos científicos:',
    hudArcOutput: 'Potencia eléctrica:',
    hudJarvisStatus: 'Estado de vuelo:',
    hudStatusInitial: 'Trayectoria nominal • Seguimiento activo',
    hudStatusLocked: '📡 Telemetría nominal • Órbita fijada',
    hudWsmvHeader: 'ÓRBITA KEPLERIANA Y RADAR PHA',
    hudWsmvSma: 'Semieje mayor (a):',
    hudWsmvEcc: 'Excentricidad (e):',
    hudWsmvInc: 'Inclinación (i):',
    hudWsmvNode: 'Nodo (Ω):',
    hudWsmvPeri: 'Periapsis (ω):',
    hudWsmvHead: 'Rumbo:',
    hudNearestPha: 'ASTEROIDE CERCANO (PHA):',
    hudPhaRange: 'DISTANCIA:',
    hudPhaTracking: 'RASTREANDO',
    hudPhaApproaching: 'ACERCÁNDOSE',
    hudPhaIntercept: 'ALCANCE CERCANO',
    hudIntelDebrief: '📊 INFORME',
    hudStarkArmory: '⚙️ EDITAR DISEÑO',
    hudFlightMessage: 'Misión activa: {title} • Destino: {destination}',

    debriefTitle: 'INFORME DE SIMULACIÓN EDUCATIVA',
    debriefScienceLabel: 'Datos recogidos',
    debriefBudgetLabel: 'Presupuesto restante',
    debriefReliabilityLabel: 'Modo de modelo',
    debriefCertLabel: 'Resultado del objetivo',
    debriefRankSuccess: 'UMBRAL DE DATOS ALCANZADO',
    debriefRankPartial: 'POR DEBAJO DEL UMBRAL',
    debriefSummarySuccess: '<strong>OBJETIVO ALCANZADO:</strong><br>Tu nave recopiló {actual} pts (objetivo: {target} pts) en el escenario <em>{destination}</em>. Nota: la vista orbital está simplificada para aprendizaje.',
    debriefSummaryPartial: '<strong>FALTAN DATOS:</strong><br>Recopilados {actual} de {target} pts para <em>{destination}</em>. Permanece más tiempo en órbita o añade instrumentos científicos.',
    debriefReturnBtn: '↺ VOLVER AL HANGAR'
  }
};

export const CONTROLS_I18N: Record<SupportedLang, ControlTexts> = {
  en_us: {
    infoHtml: 'Orbital mission simulator — powered by <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a>',
    orbitTitle: 'Orbit',
    settingsTitle: 'Settings',
    settingsLabels: ['Show grid (G)', 'Chase camera (H)', 'Nonlinear scale (N)', 'Units in km (K)', 'Show name labels (L)', 'Show marker (M)', 'Center selected (C)'],
    statsTitle: 'Statistics',
    statsLabels: ['Mission Time', 'Delta-V', 'Ignition Count'],
    bodiesTitle: 'Celestial Bodies',
    orbitalElementsTitle: 'Orbital Elements',
    orbitalElementsLabels: { e: 'e', a: 'a', i: 'i', omega: 'Ω', w: 'ω', periapsis: 'Periapsis', apoapsis: 'Apoapsis', head: 'Heading' },
    timescalePrefix: 'Timescale: x',
    saveTitle: 'Save data',
    saveNewLabel: 'New Save Name',
    saveBtn: 'Save',
    saveSuccessMsg: 'Game State Saved!',
    loadTitle: 'Load data',
    loadSuccessMsg: 'Game State Loaded!',
    deleteSuccessMsg: 'Game State Deleted!',
    scenarioTitle: 'Scenario Selector',
    flightDeckTitle: 'FLIGHT DECK',
    flightDeckToggleTitle: 'Toggle Flight Deck View',
    mainThrustTitle: 'MAIN THRUST',
    throttleFullTitle: 'Full Throttle (Z key)',
    throttleHalfTitle: '50% Throttle',
    throttleCutTitle: 'Cut Engine (X key)',
    throttleCutLabel: 'CUT',
    throttleStepUpTitle: 'Throttle Up (+10% / Shift)',
    throttleStepDownTitle: 'Throttle Down (-10% / Ctrl)',
    orbitSpeedLabel: 'ORBIT SPEED',
    autopilotTitle: 'AUTOPILOT / SAS',
    sasStabPill: 'STAB LOCK',
    sasProgradePill: 'PROGRADE',
    sasRetrogradePill: 'RETROGRADE',
    sasManualPill: 'MANUAL',
    sasStabMain: 'STAB LOCK',
    sasStabSub: 'Kill Rotation',
    sasStabTitle: 'Stability Lock / Gyro Dampening - Stops tumbling immediately',
    sasProgradeMain: 'PROGRADE',
    sasProgradeSub: 'Boost V+',
    sasProgradeTitle: 'Align Nose Forward Along Orbital Velocity (V+ Boost)',
    sasRetrogradeMain: 'RETROGRADE',
    sasRetrogradeSub: 'Brake V-',
    sasRetrogradeTitle: 'Align Nose Backward Opposite Orbital Velocity (V- Brake)',
    sasManualMain: 'MANUAL',
    sasManualSub: 'Direct RCS',
    sasManualTitle: 'Manual Unassisted RCS',
    pitchUpTitle: 'Pitch Up (W key)',
    pitchDownTitle: 'Pitch Down (S key)',
    yawLeftTitle: 'Yaw Left (A key)',
    yawRightTitle: 'Yaw Right (D key)',
    rollCcwTitle: 'Roll CCW (Q key)',
    rollCwTitle: 'Roll CW (E key)',
    sasEngagedMsg: 'SAS Autopilot: {mode}'
  },
  vi: {
    infoHtml: 'Mô phỏng quỹ đạo không gian — chạy trên <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a>',
    orbitTitle: 'Quỹ đạo',
    settingsTitle: 'Cài đặt',
    settingsLabels: ['Hiện lưới tọa độ (G)', 'Camera bám tàu (H)', 'Tỉ lệ phi tuyến (N)', 'Đơn vị km (K)', 'Hiện tên thiên thể (L)', 'Hiện điểm đánh dấu (M)', 'Căn giữa mục tiêu (C)'],
    statsTitle: 'Thống kê',
    statsLabels: ['Thời gian nhiệm vụ', 'Delta-V đã dùng', 'Số lần bật động cơ'],
    bodiesTitle: 'Thiên thể',
    orbitalElementsTitle: 'Thông số quỹ đạo',
    orbitalElementsLabels: { e: 'e', a: 'a', i: 'i', omega: 'Ω', w: 'ω', periapsis: 'Cận điểm', apoapsis: 'Viễn điểm', head: 'Hướng' },
    timescalePrefix: 'Tốc độ thời gian: x',
    saveTitle: 'Lưu trạng thái',
    saveNewLabel: 'Tên bản lưu mới',
    saveBtn: 'Lưu',
    saveSuccessMsg: 'Đã lưu trạng thái!',
    loadTitle: 'Tải trạng thái',
    loadSuccessMsg: 'Đã tải trạng thái!',
    deleteSuccessMsg: 'Đã xóa bản lưu!',
    scenarioTitle: 'Chọn kịch bản',
    flightDeckTitle: 'BÀN ĐIỀU KHIỂN BAY',
    flightDeckToggleTitle: 'Thu nhỏ / Mở rộng Bàn điều khiển bay',
    mainThrustTitle: 'LỰC ĐẨY ĐỘNG CƠ',
    throttleFullTitle: 'Công suất tối đa 100% (Phím Z)',
    throttleHalfTitle: 'Công suất 50%',
    throttleCutTitle: 'Ngắt động cơ (Phím X)',
    throttleCutLabel: 'NGẮT',
    throttleStepUpTitle: 'Tăng ga (+10% / Shift)',
    throttleStepDownTitle: 'Giảm ga (-10% / Ctrl)',
    orbitSpeedLabel: 'VẬN TỐC QUỸ ĐẠO',
    autopilotTitle: 'LÁI TỰ ĐỘNG / SAS',
    sasStabPill: 'KHÓA ỔN ĐỊNH',
    sasProgradePill: 'THUẬN QUỸ ĐẠO',
    sasRetrogradePill: 'NGHỊCH QUỸ ĐẠO',
    sasManualPill: 'THỦ CÔNG',
    sasStabMain: 'KHÓA ỔN ĐỊNH',
    sasStabSub: 'Triệt tiêu xoay',
    sasStabTitle: 'Ổn định góc quay con quay hồi chuyển - Dừng xoay thân tàu',
    sasProgradeMain: 'THUẬN HƯỚNG',
    sasProgradeSub: 'Tăng tốc V+',
    sasProgradeTitle: 'Hướng mũi tàu theo vectơ vận tốc (Tăng quỹ đạo V+)',
    sasRetrogradeMain: 'NGƯỢC HƯỚNG',
    sasRetrogradeSub: 'Hãm phanh V-',
    sasRetrogradeTitle: 'Hướng mũi tàu ngược vectơ vận tốc (Hãm phanh V-)',
    sasManualMain: 'THỦ CÔNG',
    sasManualSub: 'Điều khiển RCS',
    sasManualTitle: 'Điều khiển trực tiếp thủ công bằng động cơ RCS',
    pitchUpTitle: 'Ngóc mũi lên (Phím W)',
    pitchDownTitle: 'Cúi mũi xuống (Phím S)',
    yawLeftTitle: 'Lượn trái (Phím A)',
    yawRightTitle: 'Lượn phải (Phím D)',
    rollCcwTitle: 'Lăn ngược chiều kim đồng hồ (Phím Q)',
    rollCwTitle: 'Lăn theo chiều kim đồng hồ (Phím E)',
    sasEngagedMsg: 'Lái tự động SAS: {mode}'
  },
  en_uk: {
    infoHtml: 'Orbital mission simulator — powered by <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a>',
    orbitTitle: 'Orbit',
    settingsTitle: 'Settings',
    settingsLabels: ['Show grid (G)', 'Chase camera (H)', 'Nonlinear scale (N)', 'Units in km (K)', 'Show name labels (L)', 'Show marker (M)', 'Centre selected (C)'],
    statsTitle: 'Statistics',
    statsLabels: ['Mission Time', 'Delta-V', 'Ignition Count'],
    bodiesTitle: 'Celestial Bodies',
    orbitalElementsTitle: 'Orbital Elements',
    orbitalElementsLabels: { e: 'e', a: 'a', i: 'i', omega: 'Ω', w: 'ω', periapsis: 'Periapsis', apoapsis: 'Apoapsis', head: 'Heading' },
    timescalePrefix: 'Timescale: x',
    saveTitle: 'Save data',
    saveNewLabel: 'New Save Name',
    saveBtn: 'Save',
    saveSuccessMsg: 'Game State Saved!',
    loadTitle: 'Load data',
    loadSuccessMsg: 'Game State Loaded!',
    deleteSuccessMsg: 'Game State Deleted!',
    scenarioTitle: 'Scenario Selector',
    flightDeckTitle: 'FLIGHT DECK',
    flightDeckToggleTitle: 'Toggle Flight Deck View',
    mainThrustTitle: 'MAIN THRUST',
    throttleFullTitle: 'Full Throttle (Z key)',
    throttleHalfTitle: '50% Throttle',
    throttleCutTitle: 'Cut Engine (X key)',
    throttleCutLabel: 'CUT',
    throttleStepUpTitle: 'Throttle Up (+10% / Shift)',
    throttleStepDownTitle: 'Throttle Down (-10% / Ctrl)',
    orbitSpeedLabel: 'ORBIT SPEED',
    autopilotTitle: 'AUTOPILOT / SAS',
    sasStabPill: 'STAB LOCK',
    sasProgradePill: 'PROGRADE',
    sasRetrogradePill: 'RETROGRADE',
    sasManualPill: 'MANUAL',
    sasStabMain: 'STAB LOCK',
    sasStabSub: 'Kill Rotation',
    sasStabTitle: 'Stability Lock / Gyro Dampening - Stops tumbling immediately',
    sasProgradeMain: 'PROGRADE',
    sasProgradeSub: 'Boost V+',
    sasProgradeTitle: 'Align Nose Forward Along Orbital Velocity (V+ Boost)',
    sasRetrogradeMain: 'RETROGRADE',
    sasRetrogradeSub: 'Brake V-',
    sasRetrogradeTitle: 'Align Nose Backward Opposite Orbital Velocity (V- Brake)',
    sasManualMain: 'MANUAL',
    sasManualSub: 'Direct RCS',
    sasManualTitle: 'Manual Unassisted RCS',
    pitchUpTitle: 'Pitch Up (W key)',
    pitchDownTitle: 'Pitch Down (S key)',
    yawLeftTitle: 'Yaw Left (A key)',
    yawRightTitle: 'Yaw Right (D key)',
    rollCcwTitle: 'Roll CCW (Q key)',
    rollCwTitle: 'Roll CW (E key)',
    sasEngagedMsg: 'SAS Autopilot: {mode}'
  },
  ja: {
    infoHtml: '軌道シミュレーション — <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> 搭載',
    orbitTitle: '軌道',
    settingsTitle: '設定',
    settingsLabels: ['グリッド表示 (G)', '追跡カメラ (H)', '非線形スケール (N)', 'km単位表示 (K)', '天体名表示 (L)', 'マーカー表示 (M)', '選択天体を中央に (C)'],
    statsTitle: '統計',
    statsLabels: ['経過時間', 'デルタV', '点火回数'],
    bodiesTitle: '天体一覧',
    orbitalElementsTitle: '軌道要素',
    orbitalElementsLabels: { e: 'e', a: 'a', i: 'i', omega: 'Ω', w: 'ω', periapsis: '近点', apoapsis: '遠点', head: '方位' },
    timescalePrefix: '時間倍率: x',
    saveTitle: 'データ保存',
    saveNewLabel: '新規保存名',
    saveBtn: '保存',
    saveSuccessMsg: '状態を保存しました！',
    loadTitle: 'データ読込',
    loadSuccessMsg: '状態を読み込みました！',
    deleteSuccessMsg: '保存データを削除しました！',
    scenarioTitle: 'シナリオ選択',
    flightDeckTitle: 'フライトデッキ',
    flightDeckToggleTitle: 'フライトデッキの表示切替',
    mainThrustTitle: '主推進推力',
    throttleFullTitle: '全開スロットル 100%（Zキー）',
    throttleHalfTitle: '推力 50%',
    throttleCutTitle: '推進停止（Xキー）',
    throttleCutLabel: '停止',
    throttleStepUpTitle: '推力増加 (+10% / Shift)',
    throttleStepDownTitle: '推力減少 (-10% / Ctrl)',
    orbitSpeedLabel: '軌道速度',
    autopilotTitle: '自動操縦 / SAS',
    sasStabPill: '姿勢安定',
    sasProgradePill: '進行方向',
    sasRetrogradePill: '逆行方向',
    sasManualPill: '手動制御',
    sasStabMain: '姿勢安定',
    sasStabSub: '回転停止',
    sasStabTitle: 'ジャイロ制動による姿勢安定ロック',
    sasProgradeMain: '進行方向',
    sasProgradeSub: '加速 V+',
    sasProgradeTitle: '軌道速度ベクトルへ機首を整列（加速）',
    sasRetrogradeMain: '逆行方向',
    sasRetrogradeSub: '減速 V-',
    sasRetrogradeTitle: '軌道速度の逆方向へ機首を整列（減速・逆噴射）',
    sasManualMain: '手動',
    sasManualSub: '直接RCS',
    sasManualTitle: '補助なしの手動RCS制御',
    pitchUpTitle: 'ピッチアップ（Wキー）',
    pitchDownTitle: 'ピッチダウン（Sキー）',
    yawLeftTitle: 'ヨー左（Aキー）',
    yawRightTitle: 'ヨー右（Dキー）',
    rollCcwTitle: '左ロール（Qキー）',
    rollCwTitle: '右ロール（Eキー）',
    sasEngagedMsg: 'SAS 自動操縦作動: {mode}'
  },
  ko: {
    infoHtml: '궤도 임무 시뮬레이터 — <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> 기반',
    orbitTitle: '궤도',
    settingsTitle: '설정',
    settingsLabels: ['그리드 표시 (G)', '추적 카메라 (H)', '비선형 축척 (N)', 'km 단위 (K)', '이름 라벨 표시 (L)', '마커 표시 (M)', '선택 천체 중앙 정렬 (C)'],
    statsTitle: '통계',
    statsLabels: ['임무 시간', 'Delta-V', '점화 횟수'],
    bodiesTitle: '천체 목록',
    orbitalElementsTitle: '궤도 요소',
    orbitalElementsLabels: { e: 'e', a: 'a', i: 'i', omega: 'Ω', w: 'ω', periapsis: '근일점', apoapsis: '원일점', head: '방위' },
    timescalePrefix: '시간 배속: x',
    saveTitle: '데이터 저장',
    saveNewLabel: '새 저장 이름',
    saveBtn: '저장',
    saveSuccessMsg: '상태가 저장되었습니다!',
    loadTitle: '데이터 불러오기',
    loadSuccessMsg: '상태를 불러왔습니다!',
    deleteSuccessMsg: '저장 데이터가 삭제되었습니다!',
    scenarioTitle: '시나리오 선택',
    flightDeckTitle: '비행 제어 콘솔',
    flightDeckToggleTitle: '비행 제어 콘솔 접기 / 펼치기',
    mainThrustTitle: '주 추진력',
    throttleFullTitle: '최대 출력 100% (Z 키)',
    throttleHalfTitle: '출력 50%',
    throttleCutTitle: '엔진 차단 (X 키)',
    throttleCutLabel: '차단',
    throttleStepUpTitle: '출력 증가 (+10% / Shift)',
    throttleStepDownTitle: '출력 감소 (-10% / Ctrl)',
    orbitSpeedLabel: '궤도 속도',
    autopilotTitle: '오토파일럿 / SAS',
    sasStabPill: '자세 고정',
    sasProgradePill: '순행 방향',
    sasRetrogradePill: '역행 방향',
    sasManualPill: '수동 제어',
    sasStabMain: '자세 고정',
    sasStabSub: '회전 정지',
    sasStabTitle: '자이로 댐핑을 통한 자세 안정화',
    sasProgradeMain: '순행 방향',
    sasProgradeSub: '가속 V+',
    sasProgradeTitle: '궤도 속도 벡터 방향으로 기수 정렬 (가속 V+)',
    sasRetrogradeMain: '역행 방향',
    sasRetrogradeSub: '감속 V-',
    sasRetrogradeTitle: '궤도 속도 반대 방향으로 기수 정렬 (감속 V-)',
    sasManualMain: '수동',
    sasManualSub: '직접 RCS',
    sasManualTitle: '수동 직접 RCS 제어',
    pitchUpTitle: '기수 올림 (W 키)',
    pitchDownTitle: '기수 내림 (S 키)',
    yawLeftTitle: '좌회전 (A 키)',
    yawRightTitle: '우회전 (D 키)',
    rollCcwTitle: '반시계방향 롤 (Q 키)',
    rollCwTitle: '시계방향 롤 (E 키)',
    sasEngagedMsg: 'SAS 오토파일럿 활성화: {mode}'
  },
  fr: {
    infoHtml: 'Simulateur orbital — propulsé par <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a>',
    orbitTitle: 'Orbite',
    settingsTitle: 'Paramètres',
    settingsLabels: ['Afficher la grille (G)', 'Caméra de poursuite (H)', 'Échelle non linéaire (N)', 'Unités en km (K)', 'Afficher les noms (L)', 'Afficher le marqueur (M)', 'Centrer la sélection (C)'],
    statsTitle: 'Statistiques',
    statsLabels: ['Temps de mission', 'Delta-V', 'Allumages'],
    bodiesTitle: 'Corps célestes',
    orbitalElementsTitle: 'Éléments orbitaux',
    orbitalElementsLabels: { e: 'e', a: 'a', i: 'i', omega: 'Ω', w: 'ω', periapsis: 'Périapse', apoapsis: 'Apoapse', head: 'Cap' },
    timescalePrefix: 'Vitesse du temps : x',
    saveTitle: 'Sauvegarder',
    saveNewLabel: 'Nom de la sauvegarde',
    saveBtn: 'Enregistrer',
    saveSuccessMsg: 'Partie sauvegardée !',
    loadTitle: 'Charger',
    loadSuccessMsg: 'Partie chargée !',
    deleteSuccessMsg: 'Sauvegarde supprimée !',
    scenarioTitle: 'Sélecteur de scénario',
    flightDeckTitle: 'PONT DE VOL',
    flightDeckToggleTitle: 'Afficher / Masquer le pont de vol',
    mainThrustTitle: 'POUSSÉE PRINCIPALE',
    throttleFullTitle: 'Plein gaz 100% (Touche Z)',
    throttleHalfTitle: 'Poussée 50%',
    throttleCutTitle: 'Couper moteur (Touche X)',
    throttleCutLabel: 'COUPER',
    throttleStepUpTitle: 'Augmenter poussée (+10% / Shift)',
    throttleStepDownTitle: 'Réduire poussée (-10% / Ctrl)',
    orbitSpeedLabel: 'VITESSE ORBITALE',
    autopilotTitle: 'PILOTE AUTO / SAS',
    sasStabPill: 'STABILITÉ',
    sasProgradePill: 'PROGRADE',
    sasRetrogradePill: 'RÉTROGRADE',
    sasManualPill: 'MANUEL',
    sasStabMain: 'STABILITÉ',
    sasStabSub: 'Arrêter rotation',
    sasStabTitle: 'Verrouillage de stabilité gyroscopique',
    sasProgradeMain: 'PROGRADE',
    sasProgradeSub: 'Accélération V+',
    sasProgradeTitle: 'Aligner le nez dans le sens de la vitesse orbitale (V+)',
    sasRetrogradeMain: 'RÉTROGRADE',
    sasRetrogradeSub: 'Freinage V-',
    sasRetrogradeTitle: 'Aligner le nez à l’opposé de la vitesse orbitale (V-)',
    sasManualMain: 'MANUEL',
    sasManualSub: 'RCS direct',
    sasManualTitle: 'Pilotage RCS manuel sans assistance',
    pitchUpTitle: 'Cabrer (Touche W)',
    pitchDownTitle: 'Piquer (Touche S)',
    yawLeftTitle: 'Lacet gauche (Touche A)',
    yawRightTitle: 'Lacet droite (Touche D)',
    rollCcwTitle: 'Roulis antihoraire (Touche Q)',
    rollCwTitle: 'Roulis horaire (Touche E)',
    sasEngagedMsg: 'Pilote auto SAS : {mode}'
  },
  de: {
    infoHtml: 'Orbitsimulator — unterstützt durch <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a>',
    orbitTitle: 'Orbit',
    settingsTitle: 'Einstellungen',
    settingsLabels: ['Gitter anzeigen (G)', 'Verfolgerkamera (H)', 'Nichtlineare Skala (N)', 'Einheiten in km (K)', 'Namen anzeigen (L)', 'Markierung anzeigen (M)', 'Auswahl zentrieren (C)'],
    statsTitle: 'Statistik',
    statsLabels: ['Missionszeit', 'Delta-V', 'Zündungen'],
    bodiesTitle: 'Himmelskörper',
    orbitalElementsTitle: 'Bahnelemente',
    orbitalElementsLabels: { e: 'e', a: 'a', i: 'i', omega: 'Ω', w: 'ω', periapsis: 'Periapsis', apoapsis: 'Apoapsis', head: 'Kurs' },
    timescalePrefix: 'Zeitfaktor: x',
    saveTitle: 'Speichern',
    saveNewLabel: 'Speichername',
    saveBtn: 'Speichern',
    saveSuccessMsg: 'Spielstand gespeichert!',
    loadTitle: 'Laden',
    loadSuccessMsg: 'Spielstand geladen!',
    deleteSuccessMsg: 'Spielstand gelöscht!',
    scenarioTitle: 'Szenarioauswahl',
    flightDeckTitle: 'FLUGDECK',
    flightDeckToggleTitle: 'Flugdeck-Ansicht ein-/ausblenden',
    mainThrustTitle: 'HAUPTSCHUB',
    throttleFullTitle: 'Vollschub 100% (Taste Z)',
    throttleHalfTitle: '50% Schub',
    throttleCutTitle: 'Triebwerk abschalten (Taste X)',
    throttleCutLabel: 'STOPP',
    throttleStepUpTitle: 'Schub erhöhen (+10% / Umschalt)',
    throttleStepDownTitle: 'Schub verringern (-10% / Strg)',
    orbitSpeedLabel: 'ORBITALGESCHWINDIGKEIT',
    autopilotTitle: 'AUTOPILOT / SAS',
    sasStabPill: 'STABILISIERUNG',
    sasProgradePill: 'PROGRAD',
    sasRetrogradePill: 'RETROGRAD',
    sasManualPill: 'MANUELL',
    sasStabMain: 'STABILISIERUNG',
    sasStabSub: 'Drehung stoppen',
    sasStabTitle: 'Gyrostabilisierung stoppt jede Eigendrehung',
    sasProgradeMain: 'PROGRAD',
    sasProgradeSub: 'Schub V+',
    sasProgradeTitle: 'Bug entlang des Geschwindigkeitsvektors ausrichten (V+)',
    sasRetrogradeMain: 'RETROGRAD',
    sasRetrogradeSub: 'Bremsen V-',
    sasRetrogradeTitle: 'Bug entgegen dem Geschwindigkeitsvektor ausrichten (V-)',
    sasManualMain: 'MANUELL',
    sasManualSub: 'Direktes RCS',
    sasManualTitle: 'Manuelle RCS-Steuerung ohne Assistenz',
    pitchUpTitle: 'Nase hoch (Taste W)',
    pitchDownTitle: 'Nase runter (Taste S)',
    yawLeftTitle: 'Gieren links (Taste A)',
    yawRightTitle: 'Gieren rechts (Taste D)',
    rollCcwTitle: 'Rollen gegen Uhrzeigersinn (Taste Q)',
    rollCwTitle: 'Rollen im Uhrzeigersinn (Taste E)',
    sasEngagedMsg: 'SAS-Autopilot: {mode}'
  },
  it: {
    infoHtml: 'Simulatore orbitale — basato su <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a>',
    orbitTitle: 'Orbita',
    settingsTitle: 'Impostazioni',
    settingsLabels: ['Mostra griglia (G)', 'Camera inseguimento (H)', 'Scala non lineare (N)', 'Unità in km (K)', 'Mostra etichette (L)', 'Mostra marcatore (M)', 'Centra selezione (C)'],
    statsTitle: 'Statistiche',
    statsLabels: ['Tempo missione', 'Delta-V', 'Accensioni'],
    bodiesTitle: 'Corpi celesti',
    orbitalElementsTitle: 'Elementi orbitali',
    orbitalElementsLabels: { e: 'e', a: 'a', i: 'i', omega: 'Ω', w: 'ω', periapsis: 'Periasse', apoapsis: 'Apoasse', head: 'Rotta' },
    timescalePrefix: 'Scala temporale: x',
    saveTitle: 'Salva dati',
    saveNewLabel: 'Nome salvataggio',
    saveBtn: 'Salva',
    saveSuccessMsg: 'Stato salvato!',
    loadTitle: 'Carica dati',
    loadSuccessMsg: 'Stato caricato!',
    deleteSuccessMsg: 'Salvataggio eliminato!',
    scenarioTitle: 'Selettore scenario',
    flightDeckTitle: 'PONTE DI VOLO',
    flightDeckToggleTitle: 'Mostra / Nascondi pannello di volo',
    mainThrustTitle: 'SPINTA PRINCIPALE',
    throttleFullTitle: 'Spinta massima 100% (Tasto Z)',
    throttleHalfTitle: 'Spinta 50%',
    throttleCutTitle: 'Spegni motore (Tasto X)',
    throttleCutLabel: 'STOP',
    throttleStepUpTitle: 'Aumenta spinta (+10% / Shift)',
    throttleStepDownTitle: 'Riduci spinta (-10% / Ctrl)',
    orbitSpeedLabel: 'VELOCITÀ ORBITALE',
    autopilotTitle: 'PILOTA AUTOMATICO / SAS',
    sasStabPill: 'STABILITÀ',
    sasProgradePill: 'PROGRADO',
    sasRetrogradePill: 'RETROGRADO',
    sasManualPill: 'MANUALE',
    sasStabMain: 'STABILITÀ',
    sasStabSub: 'Ferma rotazione',
    sasStabTitle: 'Blocco giroscopico di stabilità - ferma subito le oscillazioni',
    sasProgradeMain: 'PROGRADO',
    sasProgradeSub: 'Spinta V+',
    sasProgradeTitle: 'Allinea il muso verso il vettore di velocità orbitale (V+)',
    sasRetrogradeMain: 'RETROGRADO',
    sasRetrogradeSub: 'Freno V-',
    sasRetrogradeTitle: 'Allinea il muso in direzione opposta alla velocità orbitale (V-)',
    sasManualMain: 'MANUALE',
    sasManualSub: 'RCS diretto',
    sasManualTitle: 'Controllo RCS manuale non assistito',
    pitchUpTitle: 'Muso su (Tasto W)',
    pitchDownTitle: 'Muso giù (Tasto S)',
    yawLeftTitle: 'Imbardata a sinistra (Tasto A)',
    yawRightTitle: 'Imbardata a destra (Tasto D)',
    rollCcwTitle: 'Rollio antiorario (Tasto Q)',
    rollCwTitle: 'Rollio orario (Tasto E)',
    sasEngagedMsg: 'Pilota automatico SAS: {mode}'
  },
  es: {
    infoHtml: 'Simulador orbital — con tecnología <a href="http://threejs.org" target="_blank" rel="noopener">three.js</a>',
    orbitTitle: 'Órbita',
    settingsTitle: 'Ajustes',
    settingsLabels: ['Mostrar cuadrícula (G)', 'Cámara de seguimiento (H)', 'Escala no lineal (N)', 'Unidades en km (K)', 'Mostrar etiquetas (L)', 'Mostrar marcador (M)', 'Centrar selección (C)'],
    statsTitle: 'Estadísticas',
    statsLabels: ['Tiempo de misión', 'Delta-V', 'Encendidos'],
    bodiesTitle: 'Cuerpos celestes',
    orbitalElementsTitle: 'Elementos orbitales',
    orbitalElementsLabels: { e: 'e', a: 'a', i: 'i', omega: 'Ω', w: 'ω', periapsis: 'Periapsis', apoapsis: 'Apoapsis', head: 'Rumbo' },
    timescalePrefix: 'Escala de tiempo: x',
    saveTitle: 'Guardar datos',
    saveNewLabel: 'Nuevo nombre',
    saveBtn: 'Guardar',
    saveSuccessMsg: '¡Estado guardado!',
    loadTitle: 'Cargar datos',
    loadSuccessMsg: '¡Estado cargado!',
    deleteSuccessMsg: '¡Partida eliminada!',
    scenarioTitle: 'Selector de escenario',
    flightDeckTitle: 'CONSOLA DE VUELO',
    flightDeckToggleTitle: 'Mostrar / Ocultar consola de vuelo',
    mainThrustTitle: 'EMPUJE PRINCIPAL',
    throttleFullTitle: 'Empuje máximo 100% (Tecla Z)',
    throttleHalfTitle: 'Empuje 50%',
    throttleCutTitle: 'Cortar motor (Tecla X)',
    throttleCutLabel: 'CORTE',
    throttleStepUpTitle: 'Aumentar empuje (+10% / Shift)',
    throttleStepDownTitle: 'Reducir empuje (-10% / Ctrl)',
    orbitSpeedLabel: 'VELOCIDAD ORBITAL',
    autopilotTitle: 'PILOTO AUTOMÁTICO / SAS',
    sasStabPill: 'ESTABILIDAD',
    sasProgradePill: 'PROGRADO',
    sasRetrogradePill: 'RETROGRADO',
    sasManualPill: 'MANUAL',
    sasStabMain: 'ESTABILIDAD',
    sasStabSub: 'Frenar giro',
    sasStabTitle: 'Estabilización giroscópica - detiene el cabeceo o rotación',
    sasProgradeMain: 'PROGRADO',
    sasProgradeSub: 'Impulso V+',
    sasProgradeTitle: 'Alinear proa hacia el vector de velocidad orbital (V+)',
    sasRetrogradeMain: 'RETROGRADO',
    sasRetrogradeSub: 'Frenado V-',
    sasRetrogradeTitle: 'Alinear proa en sentido opuesto a la velocidad orbital (V-)',
    sasManualMain: 'MANUAL',
    sasManualSub: 'RCS directo',
    sasManualTitle: 'Control manual directo por RCS',
    pitchUpTitle: 'Subir proa (Tecla W)',
    pitchDownTitle: 'Bajar proa (Tecla S)',
    yawLeftTitle: 'Guiñada izquierda (Tecla A)',
    yawRightTitle: 'Guiñada derecha (Tecla D)',
    rollCcwTitle: 'Alabeo antihorario (Tecla Q)',
    rollCwTitle: 'Alabeo horario (Tecla E)',
    sasEngagedMsg: 'Piloto automático SAS: {mode}'
  }
};

export function normalizeLang(lang: string | null | undefined): SupportedLang {
  if (lang && (SUPPORTED_LANGS as string[]).includes(lang)) {
    return lang as SupportedLang;
  }
  return 'en_us';
}

let activeLang: SupportedLang = 'en_us';
try {
  if (typeof localStorage !== 'undefined') {
    activeLang = normalizeLang(localStorage.getItem('nasa_game_lang'));
  }
} catch (e) {
  activeLang = 'en_us';
}

const langListeners: Set<(lang: SupportedLang) => void> = new Set();

export function getCurrentLang(): SupportedLang {
  return activeLang;
}

export function setCurrentLang(lang: string): SupportedLang {
  const normalized = normalizeLang(lang);
  activeLang = normalized;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nasa_game_lang', normalized);
    }
  } catch (e) {}
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = LANG_BCP47[normalized];
  }
  langListeners.forEach(cb => {
    try {
      cb(normalized);
    } catch (e) {
      // ignore listener errors
    }
  });
  return normalized;
}

export function onLangChange(listener: (lang: SupportedLang) => void): () => void {
  langListeners.add(listener);
  return () => {
    langListeners.delete(listener);
  };
}

export function getTexts(lang?: SupportedLang): I18nTexts {
  const resolved = normalizeLang(lang || activeLang);
  return HANGAR_I18N[resolved] || HANGAR_I18N.en_us;
}

export function getControlTexts(lang?: SupportedLang): ControlTexts {
  const resolved = normalizeLang(lang || activeLang);
  return CONTROLS_I18N[resolved] || CONTROLS_I18N.en_us;
}

export function formatTpl(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => {
    if (Object.prototype.hasOwnProperty.call(vars, key) && vars[key] !== undefined && vars[key] !== null) {
      return String(vars[key]);
    }
    return '';
  });
}

export function formatNum(value: number, lang?: SupportedLang, options?: Intl.NumberFormatOptions): string {
  const resolved = normalizeLang(lang || activeLang);
  const locale = LANG_BCP47[resolved] || 'en-US';
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch (e) {
    return value.toLocaleString(undefined, options);
  }
}
