import { SupportedLang, getCurrentLang, normalizeLang } from './i18n';

export interface LocalizedItemText {
  name: string;
  desc: string;
  badge?: string;
}

export interface LocalizedMissionText {
  title: string;
  destination: string;
  description: string;
  badge: string;
}

export interface LocalizedFlagText {
  name: string;
  agency: string;
  country: string;
}

export interface OrreryTexts {
  title: string;
  toggleTitle: string;
  tabSolar: string;
  tabExtrasolar: string;
  tabDeepCosmos: string;
  highlightsTitle: string;
  btnFocus: string;
  btnTeleport: string;
  closeAria: string;
  metricDiameter: string;
  metricMass: string;
  metricTemp: string;
  metricGravity: string;
  metricRotation: string;
  metricOrbit: string;
  metricAtmosphere: string;
  focusMessage: string;
  targets: Record<string, { label: string; title: string }>;
}

export const MISSIONS_I18N: Record<SupportedLang, Record<string, LocalizedMissionText>> = {
  en_us: {
    nasa_dart: {
      title: 'NASA DART: Kinetic Impactor',
      destination: 'Didymos / Dimorphos (Planetary Defense)',
      badge: '🎯 NASA DART',
      description: 'Double Asteroid Redirection Test: high-speed impactor targeting Dimorphos around asteroid Didymos.'
    },
    nasa_osiris_rex: {
      title: 'NASA OSIRIS-REx: Bennu Sample Return',
      destination: '101955 Bennu (Near-Earth Asteroid)',
      badge: '☄️ OSIRIS-REx',
      description: 'Rendezvous with asteroid 101955 Bennu, map its surface, and collect dust samples.'
    },
    nasa_apophis: {
      title: 'NASA 99942 Apophis: Planetary Defense',
      destination: '99942 Apophis (Earth-Crossing Asteroid)',
      badge: '⚠️ PHA DEFENSE',
      description: 'Track and study asteroid 99942 Apophis ahead of its 2029 close flyby.'
    },
    nasa_artemis_tli: {
      title: 'NASA Artemis: Trans-Lunar Injection',
      destination: 'The Moon (Lunar Transfer Orbit)',
      badge: '🚀 ARTEMIS TLI',
      description: 'Perform a Trans-Lunar Injection burn from Low Earth Orbit toward lunar orbit.'
    },
    voyager_heliopause: {
      title: 'NASA Voyager 1: Interstellar Boundary',
      destination: 'Heliopause (Outer Solar System)',
      badge: '🛰️ VOYAGER 1',
      description: 'Cross the heliopause boundary to measure cosmic rays and magnetic fields.'
    },
    new_horizons_kuiper: {
      title: 'NASA New Horizons: Kuiper Belt Survey',
      destination: 'Pluto & Arrokoth (Kuiper Belt)',
      badge: '🪐 NEW HORIZONS',
      description: 'Map surface ice geology and atmosphere of Pluto and distant Kuiper Belt objects.'
    },
    juno_jupiter_polar: {
      title: 'NASA Juno: Jupiter Polar Orbit',
      destination: 'Jupiter Polar Magnetosphere',
      badge: '⚡ JUNO JUPITER',
      description: 'Enter a polar orbit around Jupiter to study gravity, water abundance, and auroras.'
    },
    jwst_deep_cosmos: {
      title: 'NASA JWST: Deep Cosmos Observatory',
      destination: 'Sun-Earth L2 Halo Orbit',
      badge: '🔭 NASA JWST',
      description: 'Deploy an infrared space telescope at Sun-Earth L2 to observe early galaxies.'
    }
  },
  vi: {
    nasa_dart: {
      title: 'NASA DART: Va chạm đổi hướng tiểu hành tinh',
      destination: 'Didymos / Dimorphos (Phòng vệ hành tinh)',
      badge: '🎯 NASA DART',
      description: 'Thử nghiệm va chạm động năng tốc độ cao vào vệ tinh Dimorphos quanh tiểu hành tinh Didymos.'
    },
    nasa_osiris_rex: {
      title: 'NASA OSIRIS-REx: Lấy mẫu từ Bennu',
      destination: '101955 Bennu (Tiểu hành tinh gần Trái Đất)',
      badge: '☄️ OSIRIS-REx',
      description: 'Tiếp cận tiểu hành tinh 101955 Bennu, lập bản đồ bề mặt và thu thập mẫu bụi.'
    },
    nasa_apophis: {
      title: 'NASA 99942 Apophis: Phòng vệ hành tinh',
      destination: '99942 Apophis (Tiểu hành tinh cắt quỹ đạo Trái Đất)',
      badge: '⚠️ PHÒNG VỆ PHA',
      description: 'Theo dõi và khảo sát tiểu hành tinh 99942 Apophis trước lần bay sượt qua Trái Đất năm 2029.'
    },
    nasa_artemis_tli: {
      title: 'NASA Artemis: Chuyển quỹ đạo tới Mặt Trăng',
      destination: 'Mặt Trăng (Quỹ đạo chuyển tiếp TLI)',
      badge: '🚀 ARTEMIS TLI',
      description: 'Đốt động cơ rời quỹ đạo Trái Đất thấp để đưa tàu bay theo quỹ đạo chuyển tiếp tới Mặt Trăng.'
    },
    voyager_heliopause: {
      title: 'NASA Voyager 1: Ranh giới liên sao',
      destination: 'Nhật mãn / Không gian liên sao',
      badge: '🛰️ VOYAGER 1',
      description: 'Vượt qua ranh giới nhật mãn để đo tia vũ trụ và từ trường ngoài Hệ Mặt Trời.'
    },
    new_horizons_kuiper: {
      title: 'NASA New Horizons: Khảo sát vành đai Kuiper',
      destination: 'Sao Diêm Vương & Arrokoth (Vành đai Kuiper)',
      badge: '🪐 NEW HORIZONS',
      description: 'Chụp ảnh địa chất băng và đo khí quyển của Sao Diêm Vương cùng các thiên thể vành đai Kuiper.'
    },
    juno_jupiter_polar: {
      title: 'NASA Juno: Quỹ đạo cực Sao Mộc',
      destination: 'Từ quyển cực Sao Mộc',
      badge: '⚡ JUNO SAO MỘC',
      description: 'Bay vào quỹ đạo cực quanh Sao Mộc để đo trường hấp dẫn, lượng nước và cực quang.'
    },
    jwst_deep_cosmos: {
      title: 'NASA JWST: Kính viễn vọng không gian sâu',
      destination: 'Quỹ đạo điểm L2 Mặt Trời–Trái Đất',
      badge: '🔭 NASA JWST',
      description: 'Triển khai kính thiên văn hồng ngoại tại điểm L2 để quan sát các thiên hà sơ khai.'
    }
  },
  en_uk: {
    nasa_dart: {
      title: 'NASA DART: Kinetic Impactor',
      destination: 'Didymos / Dimorphos (Planetary Defence)',
      badge: '🎯 NASA DART',
      description: 'Double Asteroid Redirection Test: high-speed impactor targeting Dimorphos around asteroid Didymos.'
    },
    nasa_osiris_rex: {
      title: 'NASA OSIRIS-REx: Bennu Sample Return',
      destination: '101955 Bennu (Near-Earth Asteroid)',
      badge: '☄️ OSIRIS-REx',
      description: 'Rendezvous with asteroid 101955 Bennu, map its surface, and collect dust samples.'
    },
    nasa_apophis: {
      title: 'NASA 99942 Apophis: Planetary Defence',
      destination: '99942 Apophis (Earth-Crossing Asteroid)',
      badge: '⚠️ PHA DEFENCE',
      description: 'Track and study asteroid 99942 Apophis ahead of its 2029 close flyby.'
    },
    nasa_artemis_tli: {
      title: 'NASA Artemis: Trans-Lunar Injection',
      destination: 'The Moon (Lunar Transfer Orbit)',
      badge: '🚀 ARTEMIS TLI',
      description: 'Perform a Trans-Lunar Injection burn from Low Earth Orbit toward lunar orbit.'
    },
    voyager_heliopause: {
      title: 'NASA Voyager 1: Interstellar Boundary',
      destination: 'Heliopause (Outer Solar System)',
      badge: '🛰️ VOYAGER 1',
      description: 'Cross the heliopause boundary to measure cosmic rays and magnetic fields.'
    },
    new_horizons_kuiper: {
      title: 'NASA New Horizons: Kuiper Belt Survey',
      destination: 'Pluto & Arrokoth (Kuiper Belt)',
      badge: '🪐 NEW HORIZONS',
      description: 'Map surface ice geology and atmosphere of Pluto and distant Kuiper Belt objects.'
    },
    juno_jupiter_polar: {
      title: 'NASA Juno: Jupiter Polar Orbit',
      destination: 'Jupiter Polar Magnetosphere',
      badge: '⚡ JUNO JUPITER',
      description: 'Enter a polar orbit around Jupiter to study gravity, water abundance, and aurorae.'
    },
    jwst_deep_cosmos: {
      title: 'NASA JWST: Deep Cosmos Observatory',
      destination: 'Sun-Earth L2 Halo Orbit',
      badge: '🔭 NASA JWST',
      description: 'Deploy an infrared space telescope at Sun-Earth L2 to observe early galaxies.'
    }
  },
  ja: {
    nasa_dart: {
      title: 'NASA DART：小惑星軌道変更実験',
      destination: 'ディディモス / ディモルフォス（惑星防衛）',
      badge: '🎯 NASA DART',
      description: '小惑星ディディモスを周回するディモルフォスへ高速衝突し、軌道変化を検証します。'
    },
    nasa_osiris_rex: {
      title: 'NASA OSIRIS-REx：ベンヌ試料回収',
      destination: '101955 ベンヌ（地球近傍小惑星）',
      badge: '☄️ OSIRIS-REx',
      description: '小惑星ベンヌに接近して表面を観測し、表層ダストのサンプルを採取します。'
    },
    nasa_apophis: {
      title: 'NASA 99942 アポフィス：惑星防衛監視',
      destination: '99942 アポフィス（地球軌道交差小惑星）',
      badge: '⚠️ PHA防衛',
      description: '2029年の地球最接近に備え、小惑星アポフィスの軌道を追跡・調査します。'
    },
    nasa_artemis_tli: {
      title: 'NASA アルテミス：月遷移軌道投入',
      destination: '月（月遷移楕円軌道）',
      badge: '🚀 ARTEMIS TLI',
      description: '地球低軌道からエンジンを噴射し、月へ向かう遷移軌道（TLI）へ投入します。'
    },
    voyager_heliopause: {
      title: 'NASA ボイジャー1号：星間境界探査',
      destination: 'ヘリオポーズ（太陽圏外縁）',
      badge: '🛰️ VOYAGER 1',
      description: '太陽圏の境界ヘリオポーズを越え、宇宙線や星間磁場を測定します。'
    },
    new_horizons_kuiper: {
      title: 'NASA ニュー・ホライズンズ：カイパーベルト探査',
      destination: '冥王星 ＆ アロコス',
      badge: '🪐 NEW HORIZONS',
      description: '冥王星や遠方のカイパーベルト天体の氷地質と大気を観測します。'
    },
    juno_jupiter_polar: {
      title: 'NASA ジュノー：木星極軌道探査',
      destination: '木星極域磁気圏',
      badge: '⚡ JUNO 木星',
      description: '木星の極軌道に入り、重力場・水分量・オーロラ現象を観測します。'
    },
    jwst_deep_cosmos: {
      title: 'NASA JWST：深宇宙赤外線観測',
      destination: '太陽-地球 L2 ハロー軌道',
      badge: '🔭 NASA JWST',
      description: 'ラグランジュ点L2に赤外線宇宙望遠鏡を展開し、初期銀河を観測します。'
    }
  },
  ko: {
    nasa_dart: {
      title: 'NASA DART: 소행성 궤도 변경 실험',
      destination: '디디모스 / 디모르포스 (행성 방어)',
      badge: '🎯 NASA DART',
      description: '디디모스 주위를 도는 위성 디모르포스에 고속 충돌해 궤도를 바꾸는 임무입니다.'
    },
    nasa_osiris_rex: {
      title: 'NASA OSIRIS-REx: 베누 시료 채취',
      destination: '101955 베누 (근지구 소행성)',
      badge: '☄️ OSIRIS-REx',
      description: '소행성 베누에 랑데부하여 표면을 촬영하고 먼지 시료를 채취합니다.'
    },
    nasa_apophis: {
      title: 'NASA 99942 아포피스: 행성 방어 감시',
      destination: '99942 아포피스 (지구 횡단 소행성)',
      badge: '⚠️ PHA 방어',
      description: '2029년 지구 근접 비행에 앞서 소행성 아포피스의 궤도를 추적·관측합니다.'
    },
    nasa_artemis_tli: {
      title: 'NASA 아르테미스: 달 전이 궤도 진입',
      destination: '달 (달 전이 타원 궤도)',
      badge: '🚀 ARTEMIS TLI',
      description: '지구 저궤도에서 엔진을 점화해 달로 향하는 전이 궤도(TLI)에 진입합니다.'
    },
    voyager_heliopause: {
      title: 'NASA 보이저 1호: 성간 경계 탐사',
      destination: '헬리오포즈 (태양권 경계)',
      badge: '🛰️ VOYAGER 1',
      description: '태양권 경계를 넘어 우주선과 성간 자기장을 측정합니다.'
    },
    new_horizons_kuiper: {
      title: 'NASA 뉴 허라이즌스: 카이퍼 벨트 탐사',
      destination: '명왕성 및 아로코스',
      badge: '🪐 NEW HORIZONS',
      description: '명왕성과 카이퍼 벨트 천체의 얼음 지질과 대기를 관측합니다.'
    },
    juno_jupiter_polar: {
      title: 'NASA 주노: 목성 극궤도 탐사',
      destination: '목성 극지방 자기권',
      badge: '⚡ JUNO 목성',
      description: '목성 극궤도를 돌며 중력장, 수분 분포, 오로라를 조사합니다.'
    },
    jwst_deep_cosmos: {
      title: 'NASA JWST: 심우주 적외선 관측',
      destination: '태양-지구 L2 헤일로 궤도',
      badge: '🔭 NASA JWST',
      description: '라그랑주 L2 지점에 적외선 우주망원경을 배치해 초기 은하를 관측합니다.'
    }
  },
  fr: {
    nasa_dart: {
      title: 'NASA DART : Impacteur cinétique',
      destination: 'Didymos / Dimorphos (Défense planétaire)',
      badge: '🎯 NASA DART',
      description: 'Test de déviation d’astéroïde visant la lune Dimorphos autour de Didymos.'
    },
    nasa_osiris_rex: {
      title: 'NASA OSIRIS-REx : Échantillon de Bennu',
      destination: '101955 Bennu (Astéroïde géocroiseur)',
      badge: '☄️ OSIRIS-REx',
      description: 'Rendez-vous avec l’astéroïde Bennu pour cartographier sa surface et prélever de la poussière.'
    },
    nasa_apophis: {
      title: 'NASA 99942 Apophis : Défense planétaire',
      destination: '99942 Apophis (Astéroïde géocroiseur)',
      badge: '⚠️ DÉFENSE PHA',
      description: 'Suivre et étudier l’astéroïde Apophis avant son passage rapproché de 2029.'
    },
    nasa_artemis_tli: {
      title: 'NASA Artemis : Injection trans-lunaire',
      destination: 'La Lune (Orbite de transfert TLI)',
      badge: '🚀 ARTEMIS TLI',
      description: 'Allumer les moteurs depuis l’orbite basse terrestre vers une orbite lunaire.'
    },
    voyager_heliopause: {
      title: 'NASA Voyager 1 : Frontière interstellaire',
      destination: 'Héliopause (Espace interstellaire)',
      badge: '🛰️ VOYAGER 1',
      description: 'Franchir l’héliopause pour mesurer les rayons cosmiques et les champs magnétiques.'
    },
    new_horizons_kuiper: {
      title: 'NASA New Horizons : Ceinture de Kuiper',
      destination: 'Pluton & Arrokoth (Ceinture de Kuiper)',
      badge: '🪐 NEW HORIZONS',
      description: 'Étudier la géologie glaciaire et l’atmosphère de Pluton et des objets lointains.'
    },
    juno_jupiter_polar: {
      title: 'NASA Juno : Orbite polaire de Jupiter',
      destination: 'Magnétosphère polaire de Jupiter',
      badge: '⚡ JUNO JUPITER',
      description: 'Observer la gravité, l’eau et les aurores de Jupiter depuis une orbite polaire.'
    },
    jwst_deep_cosmos: {
      title: 'NASA JWST : Observatoire spatial profond',
      destination: 'Orbite de halo Soleil-Terre L2',
      badge: '🔭 NASA JWST',
      description: 'Déployer un télescope infrarouge au point L2 pour observer les premières galaxies.'
    }
  },
  de: {
    nasa_dart: {
      title: 'NASA DART: Kinetischer Impaktor',
      destination: 'Didymos / Dimorphos (Planetenverteidigung)',
      badge: '🎯 NASA DART',
      description: 'Hochgeschwindigkeitseinschlag auf Dimorphos zur Ablenkung des Doppelasteroiden Didymos.'
    },
    nasa_osiris_rex: {
      title: 'NASA OSIRIS-REx: Bennu-Probenrückführung',
      destination: '101955 Bennu (Erdnaher Asteroid)',
      badge: '☄️ OSIRIS-REx',
      description: 'Rendezvous mit Asteroid Bennu zur Oberflächenkartierung und Staubprobenentnahme.'
    },
    nasa_apophis: {
      title: 'NASA 99942 Apophis: Planetenverteidigung',
      destination: '99942 Apophis (Erdnaher Asteroid)',
      badge: '⚠️ PHA-ABWEHR',
      description: 'Beobachtung des Asteroiden Apophis vor seinem nahen Vorbeiflug im Jahr 2029.'
    },
    nasa_artemis_tli: {
      title: 'NASA Artemis: Translunare Injektion',
      destination: 'Der Mond (Mondtransferbahn)',
      badge: '🚀 ARTEMIS TLI',
      description: 'Zündung der Transferstufe aus der niedrigen Erdumlaufbahn Richtung Mond.'
    },
    voyager_heliopause: {
      title: 'NASA Voyager 1: Interstellare Grenze',
      destination: 'Heliopause (Äußeres Sonnensystem)',
      badge: '🛰️ VOYAGER 1',
      description: 'Überqueren der Heliopause zur Messung kosmischer Strahlung und Magnetfelder.'
    },
    new_horizons_kuiper: {
      title: 'NASA New Horizons: Kuipergürtel-Erkundung',
      destination: 'Pluto & Arrokoth (Kuipergürtel)',
      badge: '🪐 NEW HORIZONS',
      description: 'Kartierung von Eisgeologie und Atmosphäre auf Pluto und fernen Objekten.'
    },
    juno_jupiter_polar: {
      title: 'NASA Juno: Jupiter-Polarorbit',
      destination: 'Polare Magnetosphäre des Jupiter',
      badge: '⚡ JUNO JUPITER',
      description: 'Untersuchung von Schwerkraft, Wassergehalt und Polarlichtern des Jupiter.'
    },
    jwst_deep_cosmos: {
      title: 'NASA JWST: Tiefraum-Observatorium',
      destination: 'Sonne-Erde L2 Halo-Orbit',
      badge: '🔭 NASA JWST',
      description: 'Einsatz eines Infrarot-Weltraumteleskops am Punkt L2 zur Beobachtung früher Galaxien.'
    }
  },
  it: {
    nasa_dart: {
      title: 'NASA DART: Impattore cinetico',
      destination: 'Didymos / Dimorphos (Difesa planetaria)',
      badge: '🎯 NASA DART',
      description: 'Impatto ad alta velocità su Dimorphos per modificare l’orbita attorno a Didymos.'
    },
    nasa_osiris_rex: {
      title: 'NASA OSIRIS-REx: Campioni da Bennu',
      destination: '101955 Bennu (Asteroide near-Earth)',
      badge: '☄️ OSIRIS-REx',
      description: 'Rendezvous con l’asteroide Bennu per mappare la superficie e raccogliere polveri.'
    },
    nasa_apophis: {
      title: 'NASA 99942 Apophis: Difesa planetaria',
      destination: '99942 Apophis (Asteroide near-Earth)',
      badge: '⚠️ DIFESA PHA',
      description: 'Monitoraggio dell’asteroide Apophis prima del passaggio ravvicinato del 2029.'
    },
    nasa_artemis_tli: {
      title: 'NASA Artemis: Iniezione translunare',
      destination: 'La Luna (Orbita di trasferimento TLI)',
      badge: '🚀 ARTEMIS TLI',
      description: 'Accensione dall’orbita terrestre bassa per inviare il veicolo verso la Luna.'
    },
    voyager_heliopause: {
      title: 'NASA Voyager 1: Confine interstellare',
      destination: 'Eliopausa (Spazio interstellare)',
      badge: '🛰️ VOYAGER 1',
      description: 'Attraversamento dell’eliopausa per misurare raggi cosmici e campi magnetici.'
    },
    new_horizons_kuiper: {
      title: 'NASA New Horizons: Fascia di Kuiper',
      destination: 'Plutone e Arrokoth (Fascia di Kuiper)',
      badge: '🪐 NEW HORIZONS',
      description: 'Studio della geologia ghiacciata e dell’atmosfera di Plutone e dei corpi remoti.'
    },
    juno_jupiter_polar: {
      title: 'NASA Juno: Orbita polare di Giove',
      destination: 'Magnetosfera polare di Giove',
      badge: '⚡ JUNO GIOVE',
      description: 'Orbita polare attorno a Giove per studiare gravità, acqua e aurore.'
    },
    jwst_deep_cosmos: {
      title: 'NASA JWST: Osservatorio del cosmo profondo',
      destination: 'Orbita halo Sole-Terra L2',
      badge: '🔭 NASA JWST',
      description: 'Telescopio spaziale a infrarossi nel punto L2 per osservare le prime galassie.'
    }
  },
  es: {
    nasa_dart: {
      title: 'NASA DART: Impactador cinético',
      destination: 'Didymos / Dimorphos (Defensa planetaria)',
      badge: '🎯 NASA DART',
      description: 'Prueba de redirección de asteroide mediante impacto de alta velocidad contra Dimorphos.'
    },
    nasa_osiris_rex: {
      title: 'NASA OSIRIS-REx: Muestras de Bennu',
      destination: '101955 Bennu (Asteroide cercano a la Tierra)',
      badge: '☄️ OSIRIS-REx',
      description: 'Encuentro con el asteroide Bennu para cartografiar su superficie y recoger polvo.'
    },
    nasa_apophis: {
      title: 'NASA 99942 Apophis: Defensa planetaria',
      destination: '99942 Apophis (Asteroide cercano)',
      badge: '⚠️ DEFENSA PHA',
      description: 'Seguimiento del asteroide Apophis antes de su aproximación a la Tierra en 2029.'
    },
    nasa_artemis_tli: {
      title: 'NASA Artemis: Inyección translunar',
      destination: 'La Luna (Órbita de transferencia TLI)',
      badge: '🚀 ARTEMIS TLI',
      description: 'Encendido desde órbita terrestre baja para viajar en elipse balística hacia la Luna.'
    },
    voyager_heliopause: {
      title: 'NASA Voyager 1: Frontera interestelar',
      destination: 'Heliopausa (Espacio interestelar)',
      badge: '🛰️ VOYAGER 1',
      description: 'Cruzar la heliopausa para medir rayos cósmicos y campos magnéticos.'
    },
    new_horizons_kuiper: {
      title: 'NASA New Horizons: Cinturón de Kuiper',
      destination: 'Plutón y Arrokoth (Cinturón de Kuiper)',
      badge: '🪐 NEW HORIZONS',
      description: 'Estudiar la geología de hielo y atmósfera de Plutón y cuerpos lejanos.'
    },
    juno_jupiter_polar: {
      title: 'NASA Juno: Órbita polar de Júpiter',
      destination: 'Magnetosfera polar de Júpiter',
      badge: '⚡ JUNO JÚPITER',
      description: 'Explorar la gravedad, el agua y las auroras de Júpiter desde una órbita polar.'
    },
    jwst_deep_cosmos: {
      title: 'NASA JWST: Observatorio del cosmos profundo',
      destination: 'Órbita de halo Sol-Tierra L2',
      badge: '🔭 NASA JWST',
      description: 'Desplegar un telescopio infrarrojo en el punto L2 para observar galaxias primitivas.'
    }
  }
};

export const SPACECRAFT_I18N: Record<SupportedLang, Record<string, LocalizedItemText>> = {
  en_us: {
    quinjet: { name: 'Quinjet Mk-VII (Stealth Concept)', badge: '🛡️ STEALTH', desc: 'Fictional stealth VTOL hull with folding delta wings. Balanced mass and 4 instrument bays.' },
    milano: { name: 'The Milano (Light Scout)', badge: '🪐 SCOUT', desc: 'Lightweight fictional scout hull with low dry mass (120 kg) and 2 instrument bays.' },
    benatar: { name: 'The Benatar (Heavy Cruiser)', badge: '🚀 CRUISER', desc: 'Medium-heavy fictional deep-space cruiser with 5 instrument bays.' },
    sanctuary: { name: 'Sanctuary Flagship (Dreadnought)', badge: '👑 HEAVY', desc: 'Massive fictional armored hull supporting up to 6 scientific instruments.' },
    hyperion: { name: 'Hyperion Exploration Flagship', badge: '🌌 FLAGSHIP', desc: 'Heavy deep-space hull with 6 instrument bays and sensor spine.' },
    ghostwing: { name: 'Ghostwing Recon Interceptor', badge: '⚡ RECON', desc: 'Light forward-swept reconnaissance hull with 3 instrument bays.' },
    shuttle: { name: 'NASA Space Shuttle Orbiter (Discovery OV-103)', badge: '🚀 NASA ORBITER', desc: 'Official NASA winged orbiter model with delta wings and thermal tiles (5 bays).' },
    apollo_lm: { name: 'NASA Apollo 11 Lunar Module (Eagle)', badge: '🌙 APOLLO 11', desc: 'Historic lunar lander with shock-absorbing legs and gold thermal foil (4 bays).' },
    voyager: { name: 'NASA Voyager 1 Interstellar Probe', badge: '📡 NASA PROBE', desc: 'Deep-space probe with high-gain parabolic dish and Golden Record (3 bays).' }
  },
  vi: {
    quinjet: { name: 'Quinjet Mk-VII (Khái niệm tàng hình)', badge: '🛡️ TÀNG HÌNH', desc: 'Thân tàu hư cấu có cánh delta gập. Khối lượng cân bằng, lắp tối đa 4 thiết bị đo.' },
    milano: { name: 'The Milano (Tàu trinh sát nhẹ)', badge: '🪐 TRINH SÁT', desc: 'Thân tàu hư cấu rất nhẹ (120 kg khô), cơ động cao, lắp tối đa 2 thiết bị đo.' },
    benatar: { name: 'The Benatar (Tàu tuần dương)', badge: '🚀 TUẦN DƯƠNG', desc: 'Thân tàu hư cấu cỡ lớn đi không gian sâu, lắp tối đa 5 thiết bị đo.' },
    sanctuary: { name: 'Sanctuary Flagship (Tàu hạng nặng)', badge: '👑 HẠNG NẶNG', desc: 'Thân tàu hư cấu bọc giáp nặng, mang được tối đa 6 thiết bị đo.' },
    hyperion: { name: 'Hyperion Exploration Flagship', badge: '🌌 SOÁI HẠM', desc: 'Thân tàu thám hiểm cỡ lớn với 6 khoang lắp thiết bị khoa học.' },
    ghostwing: { name: 'Ghostwing Recon Interceptor', badge: '⚡ TRINH SÁT', desc: 'Thân tàu trinh sát nhẹ cánh vát ngược, lắp tối đa 3 thiết bị đo.' },
    shuttle: { name: 'Tàu con thoi NASA Discovery (OV-103)', badge: '🚀 NASA ORBITER', desc: 'Mô hình tàu con thoi chính thức của NASA với cánh delta và gạch chịu nhiệt (5 khoang).' },
    apollo_lm: { name: 'Tàu đổ bộ Mặt Trăng NASA Apollo 11 (Eagle)', badge: '🌙 APOLLO 11', desc: 'Mô-đun đổ bộ lịch sử với chân đáp giảm chấn và lớp chắn nhiệt vàng (4 khoang).' },
    voyager: { name: 'Tàu thám hiểm NASA Voyager 1', badge: '📡 NASA PROBE', desc: 'Tàu thăm dò không gian sâu với ăng-ten parabol lớn và Đĩa Vàng (3 khoang).' }
  },
  en_uk: {
    quinjet: { name: 'Quinjet Mk-VII (Stealth Concept)', badge: '🛡️ STEALTH', desc: 'Fictional stealth VTOL hull with folding delta wings. Balanced mass and 4 instrument bays.' },
    milano: { name: 'The Milano (Light Scout)', badge: '🪐 SCOUT', desc: 'Lightweight fictional scout hull with low dry mass (120 kg) and 2 instrument bays.' },
    benatar: { name: 'The Benatar (Heavy Cruiser)', badge: '🚀 CRUISER', desc: 'Medium-heavy fictional deep-space cruiser with 5 instrument bays.' },
    sanctuary: { name: 'Sanctuary Flagship (Dreadnought)', badge: '👑 HEAVY', desc: 'Massive fictional armoured hull supporting up to 6 scientific instruments.' },
    hyperion: { name: 'Hyperion Exploration Flagship', badge: '🌌 FLAGSHIP', desc: 'Heavy deep-space hull with 6 instrument bays and sensor spine.' },
    ghostwing: { name: 'Ghostwing Recon Interceptor', badge: '⚡ RECON', desc: 'Light forward-swept reconnaissance hull with 3 instrument bays.' },
    shuttle: { name: 'NASA Space Shuttle Orbiter (Discovery OV-103)', badge: '🚀 NASA ORBITER', desc: 'Official NASA winged orbiter model with delta wings and thermal tiles (5 bays).' },
    apollo_lm: { name: 'NASA Apollo 11 Lunar Module (Eagle)', badge: '🌙 APOLLO 11', desc: 'Historic lunar lander with shock-absorbing legs and gold thermal foil (4 bays).' },
    voyager: { name: 'NASA Voyager 1 Interstellar Probe', badge: '📡 NASA PROBE', desc: 'Deep-space probe with high-gain parabolic dish and Golden Record (3 bays).' }
  },
  ja: {
    quinjet: { name: 'Quinjet Mk-VII（ステルス機体）', badge: '🛡️ ステルス', desc: '折りたたみ式デルタ翼を持つ架空のVTOL船体。最大4基の観測機器を搭載可能。' },
    milano: { name: 'The Milano（軽量偵察機）', badge: '🪐 偵察', desc: '乾燥質量120 kgの軽量な架空偵察船体。最大2基の観測機器を搭載可能。' },
    benatar: { name: 'The Benatar（大型巡洋船）', badge: '🚀 巡洋船', desc: '深宇宙向けの中大型架空船体。最大5基の観測機器を搭載可能。' },
    sanctuary: { name: 'Sanctuary Flagship（重装甲艦）', badge: '👑 重型', desc: '最大6基の科学観測機器を搭載できる大型の架空船体。' },
    hyperion: { name: 'Hyperion 探査旗艦', badge: '🌌 旗艦', desc: '6基の観測機器スロットを備えた大型深宇宙探査船体。' },
    ghostwing: { name: 'Ghostwing 偵察迎撃機', badge: '⚡ 偵察', desc: '前進翼を備えた軽量の偵察船体。最大3基の観測機器を搭載可能。' },
    shuttle: { name: 'NASA スペースシャトル Discovery (OV-103)', badge: '🚀 NASA ORBITER', desc: 'デルタ翼と耐熱タイルを備えたNASA公式オービターモデル（最大5基）。' },
    apollo_lm: { name: 'NASA アポロ11号 月着陸船 (Eagle)', badge: '🌙 APOLLO 11', desc: '着陸脚と金色の断熱材を備えた歴史的な月着陸船（最大4基）。' },
    voyager: { name: 'NASA ボイジャー1号 探査機', badge: '📡 NASA PROBE', desc: '大型パラボラアンテナとゴールデンレコードを備えた深宇宙探査機（最大3基）。' }
  },
  ko: {
    quinjet: { name: 'Quinjet Mk-VII (스텔스 콘셉트)', badge: '🛡️ 스텔스', desc: '접이식 델타 날개를 갖춘 가상 선체. 균형 잡힌 질량과 최대 4개 장비 슬롯.' },
    milano: { name: 'The Milano (경량 정찰선)', badge: '🪐 정찰', desc: '건조 질량 120 kg의 가벼운 가상 정찰 선체. 최대 2개 장비 장착.' },
    benatar: { name: 'The Benatar (중형 순양선)', badge: '🚀 순양선', desc: '최대 5개의 관측 장비를 실을 수 있는 심우주용 중형 선체.' },
    sanctuary: { name: 'Sanctuary Flagship (중장갑 기함)', badge: '👑 대형', desc: '최대 6개의 과학 관측 장비를 지원하는 대형 가상 선체.' },
    hyperion: { name: 'Hyperion 탐사 기함', badge: '🌌 기함', desc: '6개 장비 슬롯을 갖춘 대형 심우주 탐사 선체.' },
    ghostwing: { name: 'Ghostwing 정찰 요격선', badge: '⚡ 정찰', desc: '최대 3개의 장비를 탑재하는 경량 정찰 선체.' },
    shuttle: { name: 'NASA 우주왕복선 Discovery (OV-103)', badge: '🚀 NASA ORBITER', desc: '델타 날개와 내열 타일을 갖춘 공식 NASA 우주왕복선 모델 (최대 5슬롯).' },
    apollo_lm: { name: 'NASA 아폴로 11호 달 착륙선 (Eagle)', badge: '🌙 APOLLO 11', desc: '충격 흡수 다리와 금박 단열재를 갖춘 역사적인 달 착륙선 (최대 4슬롯).' },
    voyager: { name: 'NASA 보이저 1호 성간 탐사선', badge: '📡 NASA PROBE', desc: '대형 파라볼라 안테나와 골든 레코드를 탑재한 심우주 탐사선 (최대 3슬롯).' }
  },
  fr: {
    quinjet: { name: 'Quinjet Mk-VII (Concept furtif)', badge: '🛡️ FURTIF', desc: 'Coque fictive à ailes delta repliables. Masse équilibrée et 4 baies d’instruments.' },
    milano: { name: 'The Milano (Éclaireur léger)', badge: '🪐 ÉCLAIREUR', desc: 'Coque fictive très légère (120 kg à sec) avec 2 baies d’instruments.' },
    benatar: { name: 'The Benatar (Croiseur lourd)', badge: '🚀 CROISEUR', desc: 'Croiseur fictif pour l’espace profond doté de 5 baies d’instruments.' },
    sanctuary: { name: 'Sanctuary Flagship (Cuirassé)', badge: '👑 LOURD', desc: 'Immense coque fictive blindée pouvant accueillir jusqu’à 6 instruments.' },
    hyperion: { name: 'Hyperion (Vaisseau amiral)', badge: '🌌 AMIRAL', desc: 'Coque d’exploration lourde dotée de 6 emplacements scientifiques.' },
    ghostwing: { name: 'Ghostwing (Intercepteur)', badge: '⚡ RECON', desc: 'Coque légère de reconnaissance à 3 baies d’instruments.' },
    shuttle: { name: 'Navette spatiale NASA Discovery (OV-103)', badge: '🚀 NASA ORBITER', desc: 'Modèle officiel de navette NASA avec ailes delta et tuiles thermiques (5 baies).' },
    apollo_lm: { name: 'Module lunaire NASA Apollo 11 (Eagle)', badge: '🌙 APOLLO 11', desc: 'Atterrisseur lunaire historique avec trains amortisseurs et feuille d’or (4 baies).' },
    voyager: { name: 'Sonde interstellaire NASA Voyager 1', badge: '📡 NASA PROBE', desc: 'Sonde lointaine avec antenne parabolique et Disque d’or (3 baies).' }
  },
  de: {
    quinjet: { name: 'Quinjet Mk-VII (Tarnkappen-Konzept)', badge: '🛡️ STEALTH', desc: 'Fiktiver Rumpf mit klappbaren Deltaflügeln. Ausgewogene Masse und 4 Geräteplätze.' },
    milano: { name: 'The Milano (Leichter Aufklärer)', badge: '🪐 SPÄHER', desc: 'Sehr leichter fiktiver Rumpf (120 kg trocken) mit 2 Geräteplätzen.' },
    benatar: { name: 'The Benatar (Schwerer Kreuzer)', badge: '🚀 KREUZER', desc: 'Schwerer fiktiver Tiefraumkreuzer mit 5 Geräteplätzen.' },
    sanctuary: { name: 'Sanctuary Flagship (Großschiff)', badge: '👑 SCHWER', desc: 'Massiver fiktiver Rumpf für bis zu 6 wissenschaftliche Instrumente.' },
    hyperion: { name: 'Hyperion Forschungsschiff', badge: '🌌 FLAGGSCHIFF', desc: 'Schweres Tiefraumschiff mit 6 Plätzen für Messgeräte.' },
    ghostwing: { name: 'Ghostwing Aufklärer', badge: '⚡ AUFKLÄRUNG', desc: 'Leichter Aufklärer mit 3 Geräteplätzen.' },
    shuttle: { name: 'NASA Space Shuttle Discovery (OV-103)', badge: '🚀 NASA ORBITER', desc: 'Offizielles NASA-Orbiter-Modell mit Deltaflügeln und Hitzeschutzkacheln (5 Plätze).' },
    apollo_lm: { name: 'NASA Apollo 11 Mondlandefähre (Eagle)', badge: '🌙 APOLLO 11', desc: 'Historische Mondfähre mit Landebeinen und Goldfolie (4 Plätze).' },
    voyager: { name: 'NASA Voyager 1 Raumsonde', badge: '📡 NASA PROBE', desc: 'Tiefraumsonde mit Parabolantenne und Golden Record (3 Plätze).' }
  },
  it: {
    quinjet: { name: 'Quinjet Mk-VII (Concetto stealth)', badge: '🛡️ STEALTH', desc: 'Scafo fittizio con ali a delta pieghevoli. Massa bilanciata e 4 vani strumenti.' },
    milano: { name: 'The Milano (Ricognitore leggero)', badge: '🪐 RICOGNITORE', desc: 'Scafo leggero (120 kg a secco) con 2 vani strumenti.' },
    benatar: { name: 'The Benatar (Incrociatore pesante)', badge: '🚀 INCROCIATORE', desc: 'Incrociatore fittizio per spazio profondo con 5 vani strumenti.' },
    sanctuary: { name: 'Sanctuary Flagship (Corazzata)', badge: '👑 PESANTE', desc: 'Grande scafo fittizio corazzato con supporto fino a 6 strumenti.' },
    hyperion: { name: 'Nave ammiraglia Hyperion', badge: '🌌 AMMIRAGLIA', desc: 'Scafo da esplorazione pesante con 6 vani per sensori.' },
    ghostwing: { name: 'Intercettore Ghostwing', badge: '⚡ RICOGNIZIONE', desc: 'Scafo leggero da ricognizione con 3 vani strumenti.' },
    shuttle: { name: 'Space Shuttle NASA Discovery (OV-103)', badge: '🚀 NASA ORBITER', desc: 'Modello ufficiale NASA con ali a delta e piastrelle termiche (5 vani).' },
    apollo_lm: { name: 'Modulo Lunare NASA Apollo 11 (Eagle)', badge: '🌙 APOLLO 11', desc: 'Storico lander lunare con gambe ammortizzate e lamina d’oro (4 vani).' },
    voyager: { name: 'Sonda NASA Voyager 1', badge: '📡 NASA PROBE', desc: 'Sonda per lo spazio profondo con antenna parabolica e Golden Record (3 vani).' }
  },
  es: {
    quinjet: { name: 'Quinjet Mk-VII (Diseño furtivo)', badge: '🛡️ FURTIVO', desc: 'Casco ficticio con alas delta plegables. Masa equilibrada y 4 bahías de instrumentos.' },
    milano: { name: 'The Milano (Explorador ligero)', badge: '🪐 EXPLORADOR', desc: 'Casco ligero (120 kg en seco) con 2 bahías de instrumentos.' },
    benatar: { name: 'The Benatar (Crucero pesado)', badge: '🚀 CRUCERO', desc: 'Crucero ficticio de espacio profundo con 5 bahías de instrumentos.' },
    sanctuary: { name: 'Sanctuary Flagship (Acorazado)', badge: '👑 PESADO', desc: 'Enorme casco ficticio blindado con capacidad para 6 instrumentos.' },
    hyperion: { name: 'Buque insignia Hyperion', badge: '🌌 INSIGNIA', desc: 'Casco pesado de exploración con 6 bahías científicas.' },
    ghostwing: { name: 'Interceptor Ghostwing', badge: '⚡ RECON', desc: 'Nave ligera de reconocimiento con 3 bahías de instrumentos.' },
    shuttle: { name: 'Transbordador NASA Discovery (OV-103)', badge: '🚀 NASA ORBITER', desc: 'Modelo oficial de la NASA con alas delta y losetas térmicas (5 bahías).' },
    apollo_lm: { name: 'Módulo Lunar NASA Apolo 11 (Eagle)', badge: '🌙 APOLLO 11', desc: 'Histórico módulo lunar con patas amortiguadoras y lámina dorada (4 bahías).' },
    voyager: { name: 'Sonda NASA Voyager 1', badge: '📡 NASA PROBE', desc: 'Sonda interestelar con antena parabólica y Disco de Oro (3 bahías).' }
  }
};

export const POWER_CORES_I18N: Record<SupportedLang, Record<string, LocalizedItemText>> = {
  en_us: {
    solar_wings: { name: 'UltraFlex Solar Arrays', desc: 'Solar panels generating 1,500 W at 1 AU. Output drops with distance squared (1/r²).' },
    arc_reactor: { name: 'Compact Fusion Core (Fictional)', desc: 'Fictional compact reactor delivering a constant 2,200 W at any distance.' },
    vibranium_core: { name: 'Kinetic Matrix Core (Fictional)', desc: 'Fictional radiation-absorbing power unit providing a steady 1,900 W.' },
    tesseract_core: { name: 'High-Output Quantum Core (Fictional)', desc: 'Fictional high-power source generating 4,500 W for heavy instrument loads.' }
  },
  vi: {
    solar_wings: { name: 'Cánh pin Mặt Trời UltraFlex', desc: 'Tạo công suất 1.500 W ở 1 AU (khoảng cách Trái Đất–Mặt Trời). Công suất giảm nhanh khi bay xa (theo tỉ lệ 1/r²).' },
    arc_reactor: { name: 'Lò phản ứng thu nhỏ (Hư cấu)', desc: 'Nguồn điện hạt nhân hư cấu phát ổn định 2.200 W ở mọi khoảng cách.' },
    vibranium_core: { name: 'Lõi ma trận năng lượng (Hư cấu)', desc: 'Nguồn điện hư cấu phát ổn định 1.900 W, không phụ thuộc ánh sáng Mặt Trời.' },
    tesseract_core: { name: 'Lõi lượng tử công suất lớn (Hư cấu)', desc: 'Nguồn điện hư cấu phát tới 4.500 W để cấp cho nhiều thiết bị đo nặng.' }
  },
  en_uk: {
    solar_wings: { name: 'UltraFlex Solar Arrays', desc: 'Solar panels generating 1,500 W at 1 AU. Output drops with distance squared (1/r²).' },
    arc_reactor: { name: 'Compact Fusion Core (Fictional)', desc: 'Fictional compact reactor delivering a constant 2,200 W at any distance.' },
    vibranium_core: { name: 'Kinetic Matrix Core (Fictional)', desc: 'Fictional radiation-absorbing power unit providing a steady 1,900 W.' },
    tesseract_core: { name: 'High-Output Quantum Core (Fictional)', desc: 'Fictional high-power source generating 4,500 W for heavy instrument loads.' }
  },
  ja: {
    solar_wings: { name: 'UltraFlex 太陽電池パドル', desc: '1 AU（太陽-地球間距離）で1,500 Wを発電。遠くへ行くほど出力が急減します（1/r²則）。' },
    arc_reactor: { name: '小型核融合コア（架空）', desc: '太陽からの距離に関係なく常時2,200 Wを供給する架空の電源装置。' },
    vibranium_core: { name: '高安定マトリクス電源（架空）', desc: '遠宇宙でも安定して1,900 Wを供給する架空の電源モジュール。' },
    tesseract_core: { name: '高出力量子コア（架空）', desc: '多数の観測機器を同時に動かせる4,500 Wの架空高出力電源。' }
  },
  ko: {
    solar_wings: { name: 'UltraFlex 태양 전지판', desc: '1 AU(지구-태양 거리)에서 1,500 W를 발전합니다. 태양에서 멀어질수록 출력이 급감합니다(1/r²).' },
    arc_reactor: { name: '소형 핵융합 코어 (가상)', desc: '거리와 무관하게 2,200 W를 일정하게 공급하는 가상 전원 장치입니다.' },
    vibranium_core: { name: '고안정 매트릭스 코어 (가상)', desc: '안정적으로 1,900 W를 공급하는 가상 방사선 에너지 전원입니다.' },
    tesseract_core: { name: '고출력 양자 코어 (가상)', desc: '고전력 장비를 위해 4,500 W를 공급하는 가상 전원 장치입니다.' }
  },
  fr: {
    solar_wings: { name: 'Panneaux solaires UltraFlex', desc: 'Produit 1 500 W à 1 UA (distance Terre-Soleil). La puissance chute selon 1/r².' },
    arc_reactor: { name: 'Réacteur compact (Fictif)', desc: 'Source nucléaire fictive fournissant 2 200 W constants à toute distance.' },
    vibranium_core: { name: 'Matrice énergétique (Fictive)', desc: 'Unité fictive stable produisant 1 900 W indépendamment du Soleil.' },
    tesseract_core: { name: 'Cœur quantique haute puissance (Fictif)', desc: 'Source fictive de 4 500 W adaptée aux charges scientifiques lourdes.' }
  },
  de: {
    solar_wings: { name: 'UltraFlex-Solarmodule', desc: 'Liefert 1.500 W bei 1 AE (Abstand Erde–Sonne). Leistung sinkt mit 1/r².' },
    arc_reactor: { name: 'Kompakt-Fusionskern (Fiktiv)', desc: 'Fiktiver Reaktor mit konstanten 2.200 W in jeder Entfernung.' },
    vibranium_core: { name: 'Matrix-Energiekern (Fiktiv)', desc: 'Fiktive Energiequelle mit stabilen 1.900 W unabhängig von Sonnenlicht.' },
    tesseract_core: { name: 'Hochleistungs-Quantenkern (Fiktiv)', desc: 'Fiktive Quelle mit 4.500 W für viele Messinstrumente.' }
  },
  it: {
    solar_wings: { name: 'Pannelli solari UltraFlex', desc: 'Genera 1.500 W a 1 UA (distanza Terra-Sole). La potenza cala con 1/r².' },
    arc_reactor: { name: 'Reattore compatto (Fittizio)', desc: 'Generatore fittizio da 2.200 W costanti a qualsiasi distanza.' },
    vibranium_core: { name: 'Nucleo a matrice (Fittizio)', desc: 'Unità fittizia stabile da 1.900 W indipendente dalla luce solare.' },
    tesseract_core: { name: 'Nucleo quantistico (Fittizio)', desc: 'Fonte fittizia ad alta potenza da 4.500 W per carichi pesanti.' }
  },
  es: {
    solar_wings: { name: 'Paneles solares UltraFlex', desc: 'Genera 1.500 W a 1 UA (distancia Tierra-Sol). La potencia cae según 1/r².' },
    arc_reactor: { name: 'Reactor compacto (Ficticio)', desc: 'Fuente ficticia que entrega 2.200 W constantes a cualquier distancia.' },
    vibranium_core: { name: 'Núcleo matricial (Ficticio)', desc: 'Unidad ficticia estable de 1.900 W independiente de la luz solar.' },
    tesseract_core: { name: 'Núcleo cuántico (Ficticio)', desc: 'Fuente ficticia de 4.500 W para alimentar múltiples instrumentos.' }
  }
};

export const TECH_MODULES_I18N: Record<SupportedLang, Record<string, LocalizedItemText>> = {
  en_us: {
    cerebro: { name: 'Bio-Signature Scanner', desc: 'Detects organic molecules and potential biosignatures.' },
    dark_matter: { name: 'Particle & Dust Spectrometer', desc: 'Measures cosmic dust and high-energy particle flux.' },
    sonic_radar: { name: 'Ice-Penetrating Radar', desc: 'Maps subsurface ice layers and rocky terrain.' },
    pym_bay: { name: 'Automated Sample Compression Bay', desc: 'Stores and analyzes collected planetary samples (+130 pts).' },
    kree_array: { name: 'High-Gain Telemetry Antenna', desc: 'Improves deep-space data downlink reliability.' }
  },
  vi: {
    cerebro: { name: 'Máy quét dấu hiệu sinh học', desc: 'Phát hiện phân tử hữu cơ và dấu hiệu môi trường sống.' },
    dark_matter: { name: 'Phổ kế hạt & bụi vũ trụ', desc: 'Đo mật độ bụi liên hành tinh và dòng hạt năng lượng cao.' },
    sonic_radar: { name: 'Radar xuyên băng bề mặt', desc: 'Lập bản đồ lớp băng dưới bề mặt và địa hình đá.' },
    pym_bay: { name: 'Khoang nén & lưu mẫu tự động', desc: 'Lưu trữ và phân tích mẫu vật thu thập được (+130 điểm).' },
    kree_array: { name: 'Ăng-ten truyền dữ liệu độ lợi cao', desc: 'Tăng khả năng gửi dữ liệu từ khoảng cách xa về Trái Đất.' }
  },
  en_uk: {
    cerebro: { name: 'Bio-Signature Scanner', desc: 'Detects organic molecules and potential biosignatures.' },
    dark_matter: { name: 'Particle & Dust Spectrometer', desc: 'Measures cosmic dust and high-energy particle flux.' },
    sonic_radar: { name: 'Ice-Penetrating Radar', desc: 'Maps subsurface ice layers and rocky terrain.' },
    pym_bay: { name: 'Automated Sample Compression Bay', desc: 'Stores and analyses collected planetary samples (+130 pts).' },
    kree_array: { name: 'High-Gain Telemetry Antenna', desc: 'Improves deep-space data downlink reliability.' }
  },
  ja: {
    cerebro: { name: '生体分子スキャナー', desc: '有機分子や生命活動の痕跡を探索します。' },
    dark_matter: { name: '粒子・宇宙塵分光計', desc: '惑星間塵や高エネルギー粒子を計測します。' },
    sonic_radar: { name: '氷床透過レーダー', desc: '表面下の氷層や岩石地形をマッピングします。' },
    pym_bay: { name: '自動サンプル圧縮保管室', desc: '採取した試料を保管・分析します（+130 pts）。' },
    kree_array: { name: '高利得テレメトリーアンテナ', desc: '深宇宙からのデータ通信性能を向上させます。' }
  },
  ko: {
    cerebro: { name: '생체 신호 스캐너', desc: '유기 분자와 생명체 흔적을 탐지합니다.' },
    dark_matter: { name: '입자·우주먼지 분광기', desc: '우주 먼지와 고에너지 입자 흐름을 측정합니다.' },
    sonic_radar: { name: '얼음 투과 레이더', desc: '표면 아래 얼음층과 암석 지형을 탐사합니다.' },
    pym_bay: { name: '자동 시료 압축 보관함', desc: '채취한 시료를 저장하고 분석합니다 (+130 pts).' },
    kree_array: { name: '고이득 원격 통신 안테나', desc: '심우주 데이터 송신 성능을 높입니다.' }
  },
  fr: {
    cerebro: { name: 'Scanner de biosignatures', desc: 'Détecte les molécules organiques et indices biologiques.' },
    dark_matter: { name: 'Spectromètre à particules', desc: 'Mesure la poussière cosmique et le flux de particules.' },
    sonic_radar: { name: 'Radar pénétrant la glace', desc: 'Cartographie les couches de glace souterraines.' },
    pym_bay: { name: 'Baie de stockage d’échantillons', desc: 'Conserve et analyse les échantillons collectés (+130 pts).' },
    kree_array: { name: 'Antenne de télémétrie haut gain', desc: 'Améliore la transmission des données vers la Terre.' }
  },
  de: {
    cerebro: { name: 'Biosignatur-Scanner', desc: 'Erkennt organische Moleküle und Lebensspuren.' },
    dark_matter: { name: 'Partikel- & Staubspektrometer', desc: 'Misst kosmischen Staub und hochenergetische Teilchen.' },
    sonic_radar: { name: 'Eis-Durchdringungsradar', desc: 'Kartiert unterirdische Eisschichten und Gesteinsstrukturen.' },
    pym_bay: { name: 'Proben-Speicherkammer', desc: 'Lagert und analysiert gesammelte Bodenproben (+130 Pkt.).' },
    kree_array: { name: 'Hochleistungs-Telemetrieantenne', desc: 'Verbessert die Datenübertragung aus dem Tiefraum.' }
  },
  it: {
    cerebro: { name: 'Scanner di biofirme', desc: 'Rileva molecole organiche e possibili tracce biologiche.' },
    dark_matter: { name: 'Spettrometro di particelle', desc: 'Misura polvere cosmica e flusso di particelle energetiche.' },
    sonic_radar: { name: 'Radar penetra-ghiaccio', desc: 'Mappa gli strati di ghiaccio nel sottosuolo.' },
    pym_bay: { name: 'Camera di raccolta campioni', desc: 'Conserva e analizza i campioni raccolti (+130 pt).' },
    kree_array: { name: 'Antenna telemetrica ad alto guadagno', desc: 'Migliora la trasmissione dati dallo spazio profondo.' }
  },
  es: {
    cerebro: { name: 'Escáner de biofirmas', desc: 'Detecta moléculas orgánicas y posibles señales de vida.' },
    dark_matter: { name: 'Espectrómetro de partículas', desc: 'Mide el polvo cósmico y el flujo de partículas.' },
    sonic_radar: { name: 'Radar penetrador de hielo', desc: 'Cartografía capas de hielo subterráneas y terreno rocoso.' },
    pym_bay: { name: 'Bahía de muestras automatizada', desc: 'Almacena y analiza muestras planetarias (+130 pts).' },
    kree_array: { name: 'Antena de telemetría de alta ganancia', desc: 'Mejora el envío de datos desde el espacio profundo.' }
  }
};

export const ENGINES_I18N: Record<SupportedLang, Record<string, LocalizedItemText>> = {
  en_us: {
    repulsor: { name: 'Compact Repulsor Thruster', desc: 'Low-cost light thruster (Isp 260 s) for short-range orbits.' },
    tesseract_drive: { name: 'High-Thrust Pulse Engine', desc: 'Balanced interplanetary engine (Isp 345 s, 2,400 kg propellant).' },
    nova_warp: { name: 'High-Isp Ion / Graviton Drive', desc: 'Ultra-efficient engine (Isp 4,400 s) giving high Δv with little propellant.' }
  },
  vi: {
    repulsor: { name: 'Động cơ đẩy nhẹ Repulsor', desc: 'Động cơ gọn nhẹ, chi phí thấp (xung riêng Isp 260 s) cho quỹ đạo gần.' },
    tesseract_drive: { name: 'Động cơ xung lực đẩy mạnh', desc: 'Động cơ liên hành tinh cân bằng (Isp 345 s, mang 2.400 kg chất đẩy).' },
    nova_warp: { name: 'Động cơ ion xung riêng siêu cao', desc: 'Hiệu quả sử dụng chất đẩy cực cao (Isp 4.400 s), tạo Δv lớn chỉ với ít chất đẩy.' }
  },
  en_uk: {
    repulsor: { name: 'Compact Repulsor Thruster', desc: 'Low-cost light thruster (Isp 260 s) for short-range orbits.' },
    tesseract_drive: { name: 'High-Thrust Pulse Engine', desc: 'Balanced interplanetary engine (Isp 345 s, 2,400 kg propellant).' },
    nova_warp: { name: 'High-Isp Ion / Graviton Drive', desc: 'Ultra-efficient engine (Isp 4,400 s) giving high Δv with little propellant.' }
  },
  ja: {
    repulsor: { name: '小型リパルサースラスター', desc: '近距離軌道向けの低コスト・軽量エンジン（比推力 Isp 260 s）。' },
    tesseract_drive: { name: '高推力パルスエンジン', desc: 'バランスの良い惑星間エンジン（Isp 345 s、推進剤 2,400 kg）。' },
    nova_warp: { name: '高比推力イオン駆動エンジン', desc: '少ない推進剤で大きなΔvを生み出す超高効率エンジン（Isp 4,400 s）。' }
  },
  ko: {
    repulsor: { name: '소형 리펄서 추력기', desc: '근거리 궤도용 저비용 경량 엔진 (비추력 Isp 260 s).' },
    tesseract_drive: { name: '고추력 펄스 엔진', desc: '균형 잡힌 행성 간 엔진 (Isp 345 s, 추진제 2,400 kg).' },
    nova_warp: { name: '고비추력 이온 추진 엔진', desc: '적은 추진제로 높은 Δv를 내는 초고효율 엔진 (Isp 4,400 s).' }
  },
  fr: {
    repulsor: { name: 'Propulseur léger Repulsor', desc: 'Moteur économique (Isp 260 s) adapté aux orbites proches.' },
    tesseract_drive: { name: 'Moteur à impulsions', desc: 'Moteur interplanétaire équilibré (Isp 345 s, 2 400 kg d’ergols).' },
    nova_warp: { name: 'Propulseur ionique haute efficacité', desc: 'Très grande efficacité (Isp 4 400 s) offrant un Δv élevé avec peu d’ergols.' }
  },
  de: {
    repulsor: { name: 'Leichtes Repulsor-Triebwerk', desc: 'Kostengünstiges Triebwerk (Isp 260 s) für nahe Umlaufbahnen.' },
    tesseract_drive: { name: 'Schubstarkes Pulstriebwerk', desc: 'Ausgewogenes Interplanetar-Triebwerk (Isp 345 s, 2.400 kg Treibstoff).' },
    nova_warp: { name: 'Hocheffizienter Ionenantrieb', desc: 'Extrem sparsamer Antrieb (Isp 4.400 s) für hohes Δv bei wenig Treibstoff.' }
  },
  it: {
    repulsor: { name: 'Propulsore leggero Repulsor', desc: 'Motore economico (Isp 260 s) adatto a orbite ravvicinate.' },
    tesseract_drive: { name: 'Motore a impulsi ad alta spinta', desc: 'Motore interplanetario bilanciato (Isp 345 s, 2.400 kg di propellente).' },
    nova_warp: { name: 'Propulsore ionico ad alto Isp', desc: 'Motore ultra-efficiente (Isp 4.400 s) per ottenere un Δv elevato.' }
  },
  es: {
    repulsor: { name: 'Propulsor ligero Repulsor', desc: 'Motor económico (Isp 260 s) para órbitas cercanas.' },
    tesseract_drive: { name: 'Motor de pulso de alto empuje', desc: 'Motor interplanetario equilibrado (Isp 345 s, 2.400 kg de propelente).' },
    nova_warp: { name: 'Motor iónico de alto Isp', desc: 'Motor ultraeficiente (Isp 4.400 s) que logra gran Δv con poco propelente.' }
  }
};

export const CARRIERS_I18N: Record<SupportedLang, Record<string, LocalizedItemText>> = {
  en_us: {
    sls_artemis: { name: 'NASA Space Launch System (SLS) Block 1', desc: 'Heavy lunar launch vehicle built for Artemis missions.' },
    saturn_v: { name: 'NASA Saturn V Heavy Rocket', desc: 'Historic 3-stage Apollo Moon rocket with 45,000 kg payload capacity.' },
    falcon_heavy: { name: 'SpaceX Falcon Heavy', desc: 'Triple-core heavy-lift rocket for high-energy trajectories.' },
    starship_superheavy: { name: 'Starship & Super Heavy', desc: 'Ultra-heavy reusable launch system with 150,000 kg capacity.' }
  },
  vi: {
    sls_artemis: { name: 'Tên lửa NASA SLS Block 1', desc: 'Tên lửa đẩy hạng nặng của NASA dùng cho chương trình Artemis tới Mặt Trăng.' },
    saturn_v: { name: 'Tên lửa NASA Saturn V', desc: 'Tên lửa 3 tầng lịch sử của chương trình Apollo, tải trọng tới 45.000 kg.' },
    falcon_heavy: { name: 'Tên lửa SpaceX Falcon Heavy', desc: 'Tên lửa đẩy 3 lõi tái sử dụng cho các quỹ đạo liên hành tinh năng lượng cao.' },
    starship_superheavy: { name: 'Hệ thống Starship & Super Heavy', desc: 'Tên lửa siêu nặng tái sử dụng toàn phần, tải trọng lên tới 150.000 kg.' }
  },
  en_uk: {
    sls_artemis: { name: 'NASA Space Launch System (SLS) Block 1', desc: 'Heavy lunar launch vehicle built for Artemis missions.' },
    saturn_v: { name: 'NASA Saturn V Heavy Rocket', desc: 'Historic 3-stage Apollo Moon rocket with 45,000 kg payload capacity.' },
    falcon_heavy: { name: 'SpaceX Falcon Heavy', desc: 'Triple-core heavy-lift rocket for high-energy trajectories.' },
    starship_superheavy: { name: 'Starship & Super Heavy', desc: 'Ultra-heavy reusable launch system with 150,000 kg capacity.' }
  },
  ja: {
    sls_artemis: { name: 'NASA SLS Block 1 ロケット', desc: 'アルテミス計画向けに開発された大型月探査ロケット。' },
    saturn_v: { name: 'NASA サターンV 大型ロケット', desc: 'アポロ計画で使用された積載量45,000 kgの歴史的3段式ロケット。' },
    falcon_heavy: { name: 'SpaceX ファルコンヘビー', desc: '3基のブースターを備えた高エネルギー軌道向け大型ロケット。' },
    starship_superheavy: { name: 'スターシップ ＆ スーパーヘビー', desc: '最大150,000 kgを打ち上げ可能な次世代完全再使用型ロケット。' }
  },
  ko: {
    sls_artemis: { name: 'NASA SLS Block 1 발사체', desc: '아르테미스 달 탐사 임무를 위해 개발된 대형 로켓입니다.' },
    saturn_v: { name: 'NASA 새턴 V 대형 로켓', desc: '아폴로 계획에 사용된 45,000 kg급 역사적인 3단 로켓입니다.' },
    falcon_heavy: { name: 'SpaceX 팰컨 헤비', desc: '고에너지 행성 간 궤도를 위한 3코어 대형 발사체입니다.' },
    starship_superheavy: { name: '스타십 & 슈퍼 헤비', desc: '최대 150,000 kg을 실을 수 있는 차세대 완전 재사용 발사체입니다.' }
  },
  fr: {
    sls_artemis: { name: 'Lanceur NASA SLS Block 1', desc: 'Lanceur lourd lunaire conçu pour les missions Artemis.' },
    saturn_v: { name: 'Fusée NASA Saturn V', desc: 'Fusée lunaire historique Apollo à 3 étages (45 000 kg de charge utile).' },
    falcon_heavy: { name: 'SpaceX Falcon Heavy', desc: 'Lanceur lourd triple corps pour trajectoires interplanétaires.' },
    starship_superheavy: { name: 'Starship & Super Heavy', desc: 'Système de lancement super-lourd réutilisable (150 000 kg).' }
  },
  de: {
    sls_artemis: { name: 'NASA Space Launch System (SLS) Block 1', desc: 'Schwere Mondrakete für das Artemis-Programm.' },
    saturn_v: { name: 'NASA Saturn V Schwerlastrakete', desc: 'Historische 3-stufige Apollo-Rakete mit 45.000 kg Nutzlast.' },
    falcon_heavy: { name: 'SpaceX Falcon Heavy', desc: 'Dreikern-Schwerlastrakete für energiereiche Bahnen.' },
    starship_superheavy: { name: 'Starship & Super Heavy', desc: 'Wiederverwendbares Superschwerlast-System bis 150.000 kg.' }
  },
  it: {
    sls_artemis: { name: 'Lanciatore NASA SLS Block 1', desc: 'Lanciatore pesante lunare sviluppato per le missioni Artemis.' },
    saturn_v: { name: 'Razzo NASA Saturn V', desc: 'Storico razzo lunare Apollo a 3 stadi con 45.000 kg di capacità.' },
    falcon_heavy: { name: 'SpaceX Falcon Heavy', desc: 'Lanciatore pesante a tre stadi principali per orbite interplanetarie.' },
    starship_superheavy: { name: 'Starship & Super Heavy', desc: 'Sistema riutilizzabile super-pesante da 150.000 kg.' }
  },
  es: {
    sls_artemis: { name: 'Cohete NASA SLS Block 1', desc: 'Lanzador pesado lunar diseñado para las misiones Artemis.' },
    saturn_v: { name: 'Cohete NASA Saturno V', desc: 'Histórico cohete lunar Apolo de 3 etapas con 45.000 kg de carga.' },
    falcon_heavy: { name: 'SpaceX Falcon Heavy', desc: 'Cohete pesado de tres núcleos para trayectorias interplanetarias.' },
    starship_superheavy: { name: 'Starship & Super Heavy', desc: 'Sistema superpesado reutilizable de hasta 150.000 kg.' }
  }
};

export const FLAGS_I18N: Record<SupportedLang, Record<string, LocalizedFlagText>> = {
  en_us: {
    usa_nasa: { name: 'USA • NASA Artemis', agency: 'National Aeronautics and Space Administration', country: 'United States' },
    usa_apollo: { name: 'USA • Apollo Heritage', agency: 'NASA Manned Spacecraft Center', country: 'United States' },
    vietnam: { name: 'Vietnam • VNSC Aerospace', agency: 'Vietnam National Space Center', country: 'Vietnam' },
    japan: { name: 'Japan • JAXA Orbital', agency: 'Japan Aerospace Exploration Agency', country: 'Japan' },
    uk: { name: 'United Kingdom • UKSA', agency: 'UK Space Agency', country: 'United Kingdom' },
    south_korea: { name: 'South Korea • KARI', agency: 'Korea Aerospace Research Institute', country: 'South Korea' },
    canada: { name: 'Canada • CSA Artemis II', agency: 'Canadian Space Agency', country: 'Canada' },
    australia: { name: 'Australia • ASA Deep Space', agency: 'Australian Space Agency', country: 'Australia' },
    germany: { name: 'Germany • DLR Aerospace', agency: 'German Aerospace Center', country: 'Germany' },
    france: { name: 'France • CNES Orbital', agency: 'Centre National d’Études Spatiales', country: 'France' },
    italy: { name: 'Italy • ASI Deep Space', agency: 'Agenzia Spaziale Italiana', country: 'Italy' },
    india: { name: 'India • ISRO Exploration', agency: 'Indian Space Research Organisation', country: 'India' },
    esa: { name: 'Europe • ESA Artemis', agency: 'European Space Agency', country: 'European Union' }
  },
  vi: {
    usa_nasa: { name: 'Hoa Kỳ • NASA Artemis', agency: 'Cơ quan Hàng không & Vũ trụ Hoa Kỳ', country: 'Hoa Kỳ' },
    usa_apollo: { name: 'Hoa Kỳ • Di sản Apollo', agency: 'Trung tâm Tàu vũ trụ Có người lái NASA', country: 'Hoa Kỳ' },
    vietnam: { name: 'Việt Nam • VNSC', agency: 'Trung tâm Vũ trụ Việt Nam', country: 'Việt Nam' },
    japan: { name: 'Nhật Bản • JAXA', agency: 'Cơ quan Thám hiểm Hàng không Vũ trụ Nhật Bản', country: 'Nhật Bản' },
    uk: { name: 'Vương quốc Anh • UKSA', agency: 'Cơ quan Vũ trụ Vương quốc Anh', country: 'Vương quốc Anh' },
    south_korea: { name: 'Hàn Quốc • KARI', agency: 'Viện Nghiên cứu Hàng không Vũ trụ Hàn Quốc', country: 'Hàn Quốc' },
    canada: { name: 'Canada • CSA Artemis II', agency: 'Cơ quan Vũ trụ Canada', country: 'Canada' },
    australia: { name: 'Úc • ASA', agency: 'Cơ quan Vũ trụ Úc', country: 'Úc' },
    germany: { name: 'Đức • DLR', agency: 'Trung tâm Hàng không Vũ trụ Đức', country: 'Đức' },
    france: { name: 'Pháp • CNES', agency: 'Trung tâm Nghiên cứu Vũ trụ Quốc gia Pháp', country: 'Pháp' },
    italy: { name: 'Ý • ASI', agency: 'Cơ quan Vũ trụ Ý', country: 'Ý' },
    india: { name: 'Ấn Độ • ISRO', agency: 'Tổ chức Nghiên cứu Vũ trụ Ấn Độ', country: 'Ấn Độ' },
    esa: { name: 'Châu Âu • ESA Artemis', agency: 'Cơ quan Vũ trụ Châu Âu', country: 'Châu Âu' }
  },
  en_uk: {
    usa_nasa: { name: 'USA • NASA Artemis', agency: 'National Aeronautics and Space Administration', country: 'United States' },
    usa_apollo: { name: 'USA • Apollo Heritage', agency: 'NASA Manned Spacecraft Centre', country: 'United States' },
    vietnam: { name: 'Vietnam • VNSC Aerospace', agency: 'Vietnam National Space Centre', country: 'Vietnam' },
    japan: { name: 'Japan • JAXA Orbital', agency: 'Japan Aerospace Exploration Agency', country: 'Japan' },
    uk: { name: 'United Kingdom • UKSA', agency: 'UK Space Agency', country: 'United Kingdom' },
    south_korea: { name: 'South Korea • KARI', agency: 'Korea Aerospace Research Institute', country: 'South Korea' },
    canada: { name: 'Canada • CSA Artemis II', agency: 'Canadian Space Agency', country: 'Canada' },
    australia: { name: 'Australia • ASA Deep Space', agency: 'Australian Space Agency', country: 'Australia' },
    germany: { name: 'Germany • DLR Aerospace', agency: 'German Aerospace Centre', country: 'Germany' },
    france: { name: 'France • CNES Orbital', agency: 'Centre National d’Études Spatiales', country: 'France' },
    italy: { name: 'Italy • ASI Deep Space', agency: 'Agenzia Spaziale Italiana', country: 'Italy' },
    india: { name: 'India • ISRO Exploration', agency: 'Indian Space Research Organisation', country: 'India' },
    esa: { name: 'Europe • ESA Artemis', agency: 'European Space Agency', country: 'Europe' }
  },
  ja: {
    usa_nasa: { name: '米国 • NASA Artemis', agency: 'アメリカ航空宇宙局', country: 'アメリカ合衆国' },
    usa_apollo: { name: '米国 • Apollo Heritage', agency: 'NASA 有人宇宙船センター', country: 'アメリカ合衆国' },
    vietnam: { name: 'ベトナム • VNSC', agency: 'ベトナム国家宇宙センター', country: 'ベトナム' },
    japan: { name: '日本 • JAXA', agency: '宇宙航空研究開発機構', country: '日本' },
    uk: { name: '英国 • UKSA', agency: 'イギリス宇宙庁', country: 'イギリス' },
    south_korea: { name: '韓国 • KARI', agency: '韓国航空宇宙研究院', country: '大韓民国' },
    canada: { name: 'カナダ • CSA Artemis II', agency: 'カナダ宇宙庁', country: 'カナダ' },
    australia: { name: '豪州 • ASA', agency: 'オーストラリア宇宙庁', country: 'オーストラリア' },
    germany: { name: 'ドイツ • DLR', agency: 'ドイツ航空宇宙センター', country: 'ドイツ' },
    france: { name: 'フランス • CNES', agency: 'フランス国立宇宙研究センター', country: 'フランス' },
    italy: { name: 'イタリア • ASI', agency: 'イタリア宇宙機関', country: 'イタリア' },
    india: { name: 'インド • ISRO', agency: 'インド宇宙研究機関', country: 'インド' },
    esa: { name: '欧州 • ESA Artemis', agency: '欧州宇宙機関', country: 'ヨーロッパ' }
  },
  ko: {
    usa_nasa: { name: '미국 • NASA Artemis', agency: '미국 항공우주국', country: '미국' },
    usa_apollo: { name: '미국 • Apollo Heritage', agency: 'NASA 유인우주선 센터', country: '미국' },
    vietnam: { name: '베트남 • VNSC', agency: '베트남 국가우주센터', country: '베트남' },
    japan: { name: '일본 • JAXA', agency: '일본 우주항공연구개발기구', country: '일본' },
    uk: { name: '영국 • UKSA', agency: '영국 우주국', country: '영국' },
    south_korea: { name: '대한민국 • KARI', agency: '한국항공우주연구원', country: '대한민국' },
    canada: { name: '캐나다 • CSA Artemis II', agency: '캐나다 우주국', country: '캐나다' },
    australia: { name: '호주 • ASA', agency: '호주 우주국', country: '호주' },
    germany: { name: '독일 • DLR', agency: '독일 항공우주센터', country: '독일' },
    france: { name: '프랑스 • CNES', agency: '프랑스 국립우주연구센터', country: '프랑스' },
    italy: { name: '이탈리아 • ASI', agency: '이탈리아 우주국', country: '이탈리아' },
    india: { name: '인도 • ISRO', agency: '인도 우주연구기구', country: '인도' },
    esa: { name: '유럽 • ESA Artemis', agency: '유럽우주국', country: '유럽' }
  },
  fr: {
    usa_nasa: { name: 'États-Unis • NASA Artemis', agency: 'NASA', country: 'États-Unis' },
    usa_apollo: { name: 'États-Unis • Apollo', agency: 'Centre spatial habité NASA', country: 'États-Unis' },
    vietnam: { name: 'Vietnam • VNSC', agency: 'Centre spatial national du Vietnam', country: 'Vietnam' },
    japan: { name: 'Japon • JAXA', agency: 'Agence d’exploration aérospatiale japonaise', country: 'Japon' },
    uk: { name: 'Royaume-Uni • UKSA', agency: 'Agence spatiale britannique', country: 'Royaume-Uni' },
    south_korea: { name: 'Corée du Sud • KARI', agency: 'Institut coréen de recherche aérospatiale', country: 'Corée du Sud' },
    canada: { name: 'Canada • ASC Artemis II', agency: 'Agence spatiale canadienne', country: 'Canada' },
    australia: { name: 'Australie • ASA', agency: 'Agence spatiale australienne', country: 'Australie' },
    germany: { name: 'Allemagne • DLR', agency: 'Centre aérospatial allemand', country: 'Allemagne' },
    france: { name: 'France • CNES', agency: 'Centre national d’études spatiales', country: 'France' },
    italy: { name: 'Italie • ASI', agency: 'Agence spatiale italienne', country: 'Italie' },
    india: { name: 'Inde • ISRO', agency: 'Organisation indienne de recherche spatiale', country: 'Inde' },
    esa: { name: 'Europe • ESA Artemis', agency: 'Agence spatiale européenne', country: 'Europe' }
  },
  de: {
    usa_nasa: { name: 'USA • NASA Artemis', agency: 'NASA', country: 'USA' },
    usa_apollo: { name: 'USA • Apollo', agency: 'NASA Manned Spacecraft Center', country: 'USA' },
    vietnam: { name: 'Vietnam • VNSC', agency: 'Vietnam National Space Center', country: 'Vietnam' },
    japan: { name: 'Japan • JAXA', agency: 'Japanische Raumfahrtagentur', country: 'Japan' },
    uk: { name: 'Vereinigtes Königreich • UKSA', agency: 'Britische Raumfahrtagentur', country: 'Vereinigtes Königreich' },
    south_korea: { name: 'Südkorea • KARI', agency: 'Korea Aerospace Research Institute', country: 'Südkorea' },
    canada: { name: 'Kanada • CSA Artemis II', agency: 'Kanadische Raumfahrtagentur', country: 'Kanada' },
    australia: { name: 'Australien • ASA', agency: 'Australische Raumfahrtagentur', country: 'Australien' },
    germany: { name: 'Deutschland • DLR', agency: 'Deutsches Zentrum für Luft- und Raumfahrt', country: 'Deutschland' },
    france: { name: 'Frankreich • CNES', agency: 'Centre national d’études spatiales', country: 'Frankreich' },
    italy: { name: 'Italien • ASI', agency: 'Italienische Raumfahrtagentur', country: 'Italien' },
    india: { name: 'Indien • ISRO', agency: 'Indische Weltraumforschungsorganisation', country: 'Indien' },
    esa: { name: 'Europa • ESA Artemis', agency: 'Europäische Weltraumorganisation', country: 'Europa' }
  },
  it: {
    usa_nasa: { name: 'USA • NASA Artemis', agency: 'NASA', country: 'Stati Uniti' },
    usa_apollo: { name: 'USA • Apollo', agency: 'NASA Manned Spacecraft Center', country: 'Stati Uniti' },
    vietnam: { name: 'Vietnam • VNSC', agency: 'Centro Spaziale Nazionale del Vietnam', country: 'Vietnam' },
    japan: { name: 'Giappone • JAXA', agency: 'Agenzia Spaziale Giapponese', country: 'Giappone' },
    uk: { name: 'Regno Unito • UKSA', agency: 'Agenzia Spaziale Britannica', country: 'Regno Unito' },
    south_korea: { name: 'Corea del Sud • KARI', agency: 'Istituto Coreano di Ricerca Aerospaziale', country: 'Corea del Sud' },
    canada: { name: 'Canada • CSA Artemis II', agency: 'Agenzia Spaziale Canadese', country: 'Canada' },
    australia: { name: 'Australia • ASA', agency: 'Agenzia Spaziale Australiana', country: 'Australia' },
    germany: { name: 'Germania • DLR', agency: 'Centro Aerospaziale Tedesco', country: 'Germania' },
    france: { name: 'Francia • CNES', agency: 'Centre National d’Études Spatiales', country: 'Francia' },
    italy: { name: 'Italia • ASI', agency: 'Agenzia Spaziale Italiana', country: 'Italia' },
    india: { name: 'India • ISRO', agency: 'Organizzazione Indiana per la Ricerca Spaziale', country: 'India' },
    esa: { name: 'Europa • ESA Artemis', agency: 'Agenzia Spaziale Europea', country: 'Europa' }
  },
  es: {
    usa_nasa: { name: 'EE. UU. • NASA Artemis', agency: 'NASA', country: 'Estados Unidos' },
    usa_apollo: { name: 'EE. UU. • Apolo', agency: 'Centro de Naves Tripuladas de la NASA', country: 'Estados Unidos' },
    vietnam: { name: 'Vietnam • VNSC', agency: 'Centro Espacial Nacional de Vietnam', country: 'Vietnam' },
    japan: { name: 'Japón • JAXA', agency: 'Agencia Japonesa de Exploración Aeroespacial', country: 'Japón' },
    uk: { name: 'Reino Unido • UKSA', agency: 'Agencia Espacial del Reino Unido', country: 'Reino Unido' },
    south_korea: { name: 'Corea del Sur • KARI', agency: 'Instituto de Investigación Aeroespacial de Corea', country: 'Corea del Sur' },
    canada: { name: 'Canadá • CSA Artemis II', agency: 'Agencia Espacial Canadiense', country: 'Canadá' },
    australia: { name: 'Australia • ASA', agency: 'Agencia Espacial Australiana', country: 'Australia' },
    germany: { name: 'Alemania • DLR', agency: 'Centro Aeroespacial Alemán', country: 'Alemania' },
    france: { name: 'Francia • CNES', agency: 'Centro Nacional de Estudios Espaciales', country: 'Francia' },
    italy: { name: 'Italia • ASI', agency: 'Agencia Espacial Italiana', country: 'Italia' },
    india: { name: 'India • ISRO', agency: 'Organización de Investigación Espacial de la India', country: 'India' },
    esa: { name: 'Europa • ESA Artemis', agency: 'Agencia Espacial Europea', country: 'Europa' }
  }
};

export const ORRERY_I18N: Record<SupportedLang, OrreryTexts> = {
  en_us: {
    title: 'COSMIC ORRERY',
    toggleTitle: 'Toggle Cosmic Orrery Dock',
    tabSolar: '☀️ SOLAR SYSTEM',
    tabExtrasolar: '🌌 EXTRASOLAR STARS',
    tabDeepCosmos: '🌀 DEEP COSMOS',
    highlightsTitle: '✨ ASTRONOMICAL HIGHLIGHTS & OBSERVATIONS:',
    btnFocus: '🔭 CLOSE-UP 3D OBSERVATION',
    btnTeleport: '🚀 ESTABLISH ORBIT HERE',
    closeAria: 'Close celestial dossier',
    metricDiameter: 'Mean Diameter',
    metricMass: 'Total Mass',
    metricTemp: 'Surface Temperature',
    metricGravity: 'Surface Gravity',
    metricRotation: 'Rotation Period',
    metricOrbit: 'Orbital Period',
    metricAtmosphere: 'Atmospheric Composition',
    focusMessage: '🔭 Optical Lock: Focused on {name}',
    targets: {
      sun: { label: 'The Sun', title: 'The Sun' },
      mercury: { label: 'Mercury', title: 'Mercury' },
      venus: { label: 'Venus', title: 'Venus' },
      earth: { label: 'Earth', title: 'Earth' },
      moon: { label: 'Moon', title: 'The Moon' },
      mars: { label: 'Mars', title: 'Mars' },
      asteroid_belt: { label: 'Asteroids', title: 'Main Asteroid Belt' },
      jupiter: { label: 'Jupiter', title: 'Jupiter' },
      saturn: { label: 'Saturn', title: 'Saturn' },
      uranus: { label: 'Uranus', title: 'Uranus' },
      neptune: { label: 'Neptune', title: 'Neptune' },
      halley: { label: 'Halley', title: 'Comet 1P/Halley' },
      phas: { label: 'NASA PHAs', title: 'Potentially Hazardous Asteroids' },
      rocket: { label: 'Spacecraft', title: 'Active Spacecraft' },
      alpha_centauri: { label: 'Alpha Centauri', title: 'Alpha Centauri' },
      trappist1: { label: 'TRAPPIST-1', title: 'TRAPPIST-1' },
      sirius: { label: 'Sirius A & B', title: 'Sirius A & B' },
      betelgeuse: { label: 'Betelgeuse', title: 'Betelgeuse' },
      sagittarius_a: { label: 'Sagittarius A*', title: 'Sagittarius A*' },
      pillars_of_creation: { label: 'Pillars (M16)', title: 'Pillars of Creation (M16)' },
      crab_pulsar: { label: 'Crab Pulsar', title: 'Crab Nebula Pulsar' },
      blackhole: { label: 'Gargantua', title: 'Gargantua Black Hole' }
    }
  },
  vi: {
    title: 'BẢN ĐỒ HỆ MẶT TRỜI',
    toggleTitle: 'Thu gọn hoặc mở thanh thiên thể',
    tabSolar: '☀️ HỆ MẶT TRỜI',
    tabExtrasolar: '🌌 SAO NGOẠI HỆ',
    tabDeepCosmos: '🌀 VŨ TRỤ SÂU',
    highlightsTitle: '✨ ĐẶC ĐIỂM THIÊN VĂN NỔI BẬT:',
    btnFocus: '🔭 QUAN SÁT 3D CẬN CẢNH',
    btnTeleport: '🚀 ĐƯA TÀU VÀO QUỸ ĐẠO',
    closeAria: 'Đóng thông tin thiên thể',
    metricDiameter: 'Đường kính trung bình',
    metricMass: 'Tổng khối lượng',
    metricTemp: 'Nhiệt độ bề mặt',
    metricGravity: 'Trọng lực bề mặt',
    metricRotation: 'Chu kỳ tự quay',
    metricOrbit: 'Chu kỳ quỹ đạo',
    metricAtmosphere: 'Thành phần khí quyển',
    focusMessage: '🔭 Đã khóa camera: Đang quan sát {name}',
    targets: {
      sun: { label: 'Mặt Trời', title: 'Mặt Trời' },
      mercury: { label: 'Sao Thủy', title: 'Sao Thủy' },
      venus: { label: 'Sao Kim', title: 'Sao Kim' },
      earth: { label: 'Trái Đất', title: 'Trái Đất' },
      moon: { label: 'Mặt Trăng', title: 'Mặt Trăng' },
      mars: { label: 'Sao Hỏa', title: 'Sao Hỏa' },
      asteroid_belt: { label: 'Tiểu hành tinh', title: 'Vành đai tiểu hành tinh' },
      jupiter: { label: 'Sao Mộc', title: 'Sao Mộc' },
      saturn: { label: 'Sao Thổ', title: 'Sao Thổ' },
      uranus: { label: 'Sao Thiên Vương', title: 'Sao Thiên Vương' },
      neptune: { label: 'Sao Hải Vương', title: 'Sao Hải Vương' },
      halley: { label: 'Halley', title: 'Sao chổi 1P/Halley' },
      phas: { label: 'NASA PHAs', title: 'Tiểu hành tinh gần Trái Đất' },
      rocket: { label: 'Tàu vũ trụ', title: 'Tàu đang bay' },
      alpha_centauri: { label: 'Alpha Centauri', title: 'Alpha Centauri' },
      trappist1: { label: 'TRAPPIST-1', title: 'TRAPPIST-1' },
      sirius: { label: 'Sirius A & B', title: 'Sirius A & B' },
      betelgeuse: { label: 'Betelgeuse', title: 'Betelgeuse' },
      sagittarius_a: { label: 'Sagittarius A*', title: 'Hố đen Sagittarius A*' },
      pillars_of_creation: { label: 'Pillars (M16)', title: 'Tinh vân Đại bàng (M16)' },
      crab_pulsar: { label: 'Crab Pulsar', title: 'Sao xung Con Cua' },
      blackhole: { label: 'Gargantua', title: 'Hố đen Gargantua' }
    }
  },
  en_uk: {
    title: 'COSMIC ORRERY',
    toggleTitle: 'Toggle Cosmic Orrery Dock',
    tabSolar: '☀️ SOLAR SYSTEM',
    tabExtrasolar: '🌌 EXTRASOLAR STARS',
    tabDeepCosmos: '🌀 DEEP COSMOS',
    highlightsTitle: '✨ ASTRONOMICAL HIGHLIGHTS & OBSERVATIONS:',
    btnFocus: '🔭 CLOSE-UP 3D OBSERVATION',
    btnTeleport: '🚀 ESTABLISH ORBIT HERE',
    closeAria: 'Close celestial dossier',
    metricDiameter: 'Mean Diameter',
    metricMass: 'Total Mass',
    metricTemp: 'Surface Temperature',
    metricGravity: 'Surface Gravity',
    metricRotation: 'Rotation Period',
    metricOrbit: 'Orbital Period',
    metricAtmosphere: 'Atmospheric Composition',
    focusMessage: '🔭 Optical Lock: Focused on {name}',
    targets: {
      sun: { label: 'The Sun', title: 'The Sun' },
      mercury: { label: 'Mercury', title: 'Mercury' },
      venus: { label: 'Venus', title: 'Venus' },
      earth: { label: 'Earth', title: 'Earth' },
      moon: { label: 'Moon', title: 'The Moon' },
      mars: { label: 'Mars', title: 'Mars' },
      asteroid_belt: { label: 'Asteroids', title: 'Main Asteroid Belt' },
      jupiter: { label: 'Jupiter', title: 'Jupiter' },
      saturn: { label: 'Saturn', title: 'Saturn' },
      uranus: { label: 'Uranus', title: 'Uranus' },
      neptune: { label: 'Neptune', title: 'Neptune' },
      halley: { label: 'Halley', title: 'Comet 1P/Halley' },
      phas: { label: 'NASA PHAs', title: 'Potentially Hazardous Asteroids' },
      rocket: { label: 'Spacecraft', title: 'Active Spacecraft' },
      alpha_centauri: { label: 'Alpha Centauri', title: 'Alpha Centauri' },
      trappist1: { label: 'TRAPPIST-1', title: 'TRAPPIST-1' },
      sirius: { label: 'Sirius A & B', title: 'Sirius A & B' },
      betelgeuse: { label: 'Betelgeuse', title: 'Betelgeuse' },
      sagittarius_a: { label: 'Sagittarius A*', title: 'Sagittarius A*' },
      pillars_of_creation: { label: 'Pillars (M16)', title: 'Pillars of Creation (M16)' },
      crab_pulsar: { label: 'Crab Pulsar', title: 'Crab Nebula Pulsar' },
      blackhole: { label: 'Gargantua', title: 'Gargantua Black Hole' }
    }
  },
  ja: {
    title: '太陽系・宇宙マップ',
    toggleTitle: '天体ドックを開閉',
    tabSolar: '☀️ 太陽系',
    tabExtrasolar: '🌌 系外恒星',
    tabDeepCosmos: '🌀 深宇宙',
    highlightsTitle: '✨ 天文データと観測ポイント：',
    btnFocus: '🔭 3Dでクローズアップ',
    btnTeleport: '🚀 この天体の軌道へ',
    closeAria: '天体データを閉じる',
    metricDiameter: '平均直径',
    metricMass: '質量',
    metricTemp: '表面温度',
    metricGravity: '表面重力',
    metricRotation: '自転周期',
    metricOrbit: '公転周期',
    metricAtmosphere: '大気組成',
    focusMessage: '🔭 カメラロック：{name} を表示中',
    targets: {
      sun: { label: '太陽', title: '太陽' },
      mercury: { label: '水星', title: '水星' },
      venus: { label: '金星', title: '金星' },
      earth: { label: '地球', title: '地球' },
      moon: { label: '月', title: '月' },
      mars: { label: '火星', title: '火星' },
      asteroid_belt: { label: '小惑星帯', title: '小惑星帯' },
      jupiter: { label: '木星', title: '木星' },
      saturn: { label: '土星', title: '土星' },
      uranus: { label: '天王星', title: '天王星' },
      neptune: { label: '海王星', title: '海王星' },
      halley: { label: 'ハレー彗星', title: 'ハレー彗星' },
      phas: { label: 'NASA PHAs', title: '潜在的に危険な小惑星' },
      rocket: { label: '宇宙船', title: '飛行中の宇宙船' },
      alpha_centauri: { label: 'アルファ・ケンタウリ', title: 'アルファ・ケンタウリ' },
      trappist1: { label: 'TRAPPIST-1', title: 'TRAPPIST-1' },
      sirius: { label: 'シリウス A & B', title: 'シリウス A & B' },
      betelgeuse: { label: 'ベテルギウス', title: 'ベテルギウス' },
      sagittarius_a: { label: 'いて座A*', title: 'いて座A*' },
      pillars_of_creation: { label: '創造の柱 (M16)', title: '創造の柱 (M16)' },
      crab_pulsar: { label: 'かにパルサー', title: 'かに星雲パルサー' },
      blackhole: { label: 'ガルガンチュア', title: 'ガルガンチュア' }
    }
  },
  ko: {
    title: '우주 천체 지도',
    toggleTitle: '천체 도크 접기/펼치기',
    tabSolar: '☀️ 태양계',
    tabExtrasolar: '🌌 외계 항성',
    tabDeepCosmos: '🌀 심우주',
    highlightsTitle: '✨ 천문학적 주요 특징:',
    btnFocus: '🔭 3D 근접 관찰',
    btnTeleport: '🚀 이곳에 궤도 설정',
    closeAria: '천체 정보 닫기',
    metricDiameter: '평균 지름',
    metricMass: '질량',
    metricTemp: '표면 온도',
    metricGravity: '표면 중력',
    metricRotation: '자전 주기',
    metricOrbit: '공전 주기',
    metricAtmosphere: '대기 구성',
    focusMessage: '🔭 카메라 고정: {name} 관찰 중',
    targets: {
      sun: { label: '태양', title: '태양' },
      mercury: { label: '수성', title: '수성' },
      venus: { label: '금성', title: '금성' },
      earth: { label: '지구', title: '지구' },
      moon: { label: '달', title: '달' },
      mars: { label: '화성', title: '화성' },
      asteroid_belt: { label: '소행성대', title: '주 소행성대' },
      jupiter: { label: '목성', title: '목성' },
      saturn: { label: '토성', title: '토성' },
      uranus: { label: '천왕성', title: '천왕성' },
      neptune: { label: '해왕성', title: '해왕성' },
      halley: { label: '핼리 혜성', title: '1P/핼리 혜성' },
      phas: { label: 'NASA PHAs', title: '잠재적 위험 소행성' },
      rocket: { label: '우주선', title: '비행 중인 우주선' },
      alpha_centauri: { label: '알파 센타우리', title: '알파 센타우리' },
      trappist1: { label: 'TRAPPIST-1', title: 'TRAPPIST-1' },
      sirius: { label: '시리우스 A & B', title: '시리우스 A & B' },
      betelgeuse: { label: '베텔게우스', title: '베텔게우스' },
      sagittarius_a: { label: '궁수자리 A*', title: '궁수자리 A*' },
      pillars_of_creation: { label: '창조의 기둥 (M16)', title: '창조의 기둥 (M16)' },
      crab_pulsar: { label: '게 성운 펄사', title: '게 성운 펄사' },
      blackhole: { label: '가르강튀아', title: '가르강튀아 블랙홀' }
    }
  },
  fr: {
    title: 'PLANÉTARIUM 3D',
    toggleTitle: 'Afficher ou masquer la barre des astres',
    tabSolar: '☀️ SYSTÈME SOLAIRE',
    tabExtrasolar: '🌌 ÉTOILES VOISINES',
    tabDeepCosmos: '🌀 COSMOS PROFOND',
    highlightsTitle: '✨ POINTS CLÉS ASTRONOMIQUES :',
    btnFocus: '🔭 OBSERVATION 3D RAPPROCHÉE',
    btnTeleport: '🚀 PLACER EN ORBITE ICI',
    closeAria: 'Fermer la fiche céleste',
    metricDiameter: 'Diamètre moyen',
    metricMass: 'Masse totale',
    metricTemp: 'Température de surface',
    metricGravity: 'Gravité de surface',
    metricRotation: 'Période de rotation',
    metricOrbit: 'Période orbitale',
    metricAtmosphere: 'Composition atmosphérique',
    focusMessage: '🔭 Caméra verrouillée sur : {name}',
    targets: {
      sun: { label: 'Soleil', title: 'Le Soleil' },
      mercury: { label: 'Mercure', title: 'Mercure' },
      venus: { label: 'Vénus', title: 'Vénus' },
      earth: { label: 'Terre', title: 'La Terre' },
      moon: { label: 'Lune', title: 'La Lune' },
      mars: { label: 'Mars', title: 'Mars' },
      asteroid_belt: { label: 'Astéroïdes', title: 'Ceinture d’astéroïdes' },
      jupiter: { label: 'Jupiter', title: 'Jupiter' },
      saturn: { label: 'Saturne', title: 'Saturne' },
      uranus: { label: 'Uranus', title: 'Uranus' },
      neptune: { label: 'Neptune', title: 'Neptune' },
      halley: { label: 'Halley', title: 'Comète 1P/Halley' },
      phas: { label: 'NASA PHAs', title: 'Astéroïdes potentiellement dangereux' },
      rocket: { label: 'Vaisseau', title: 'Vaisseau actif' },
      alpha_centauri: { label: 'Alpha Centauri', title: 'Alpha du Centaure' },
      trappist1: { label: 'TRAPPIST-1', title: 'TRAPPIST-1' },
      sirius: { label: 'Sirius A & B', title: 'Sirius A & B' },
      betelgeuse: { label: 'Bételgeuse', title: 'Bételgeuse' },
      sagittarius_a: { label: 'Sagittarius A*', title: 'Sagittarius A*' },
      pillars_of_creation: { label: 'Piliers (M16)', title: 'Piliers de la Création (M16)' },
      crab_pulsar: { label: 'Pulsar du Crabe', title: 'Pulsar du Crabe' },
      blackhole: { label: 'Gargantua', title: 'Trou noir Gargantua' }
    }
  },
  de: {
    title: 'KOSMISCHES ORRERY',
    toggleTitle: 'Himmelskörper-Leiste umschalten',
    tabSolar: '☀️ SONNENSYSTEM',
    tabExtrasolar: '🌌 EXOSONNEN',
    tabDeepCosmos: '🌀 TIEFRAUM',
    highlightsTitle: '✨ ASTRONOMISCHE BESONDERHEITEN:',
    btnFocus: '🔭 3D-NAHAUFNAHME',
    btnTeleport: '🚀 HIER ORBIT EINNEHMEN',
    closeAria: 'Himmelskörper-Info schließen',
    metricDiameter: 'Mittlerer Durchmesser',
    metricMass: 'Gesamtmasse',
    metricTemp: 'Oberflächentemperatur',
    metricGravity: 'Oberflächengravitation',
    metricRotation: 'Rotationsdauer',
    metricOrbit: 'Umlaufzeit',
    metricAtmosphere: 'Atmosphäre',
    focusMessage: '🔭 Kamerafokus auf: {name}',
    targets: {
      sun: { label: 'Sonne', title: 'Die Sonne' },
      mercury: { label: 'Merkur', title: 'Merkur' },
      venus: { label: 'Venus', title: 'Venus' },
      earth: { label: 'Erde', title: 'Erde' },
      moon: { label: 'Mond', title: 'Der Mond' },
      mars: { label: 'Mars', title: 'Mars' },
      asteroid_belt: { label: 'Asteroiden', title: 'Asteroidengürtel' },
      jupiter: { label: 'Jupiter', title: 'Jupiter' },
      saturn: { label: 'Saturn', title: 'Saturn' },
      uranus: { label: 'Uranus', title: 'Uranus' },
      neptune: { label: 'Neptun', title: 'Neptun' },
      halley: { label: 'Halley', title: 'Komet 1P/Halley' },
      phas: { label: 'NASA PHAs', title: 'Erdnahe Asteroiden' },
      rocket: { label: 'Raumschiff', title: 'Aktives Raumschiff' },
      alpha_centauri: { label: 'Alpha Centauri', title: 'Alpha Centauri' },
      trappist1: { label: 'TRAPPIST-1', title: 'TRAPPIST-1' },
      sirius: { label: 'Sirius A & B', title: 'Sirius A & B' },
      betelgeuse: { label: 'Beteigeuze', title: 'Beteigeuze' },
      sagittarius_a: { label: 'Sagittarius A*', title: 'Sagittarius A*' },
      pillars_of_creation: { label: 'Säulen (M16)', title: 'Säulen der Schöpfung (M16)' },
      crab_pulsar: { label: 'Krebspulsar', title: 'Krebspulsar' },
      blackhole: { label: 'Gargantua', title: 'Schwarzes Loch Gargantua' }
    }
  },
  it: {
    title: 'PLANETARIO COSMICO',
    toggleTitle: 'Mostra o nascondi barra celeste',
    tabSolar: '☀️ SISTEMA SOLARE',
    tabExtrasolar: '🌌 STELLE VICINE',
    tabDeepCosmos: '🌀 COSMO PROFONDO',
    highlightsTitle: '✨ DETTAGLI ASTRONOMICI PRINCIPALI:',
    btnFocus: '🔭 OSSERVAZIONE 3D RAVVICINATA',
    btnTeleport: '🚀 STABILISCI ORBITA QUI',
    closeAria: 'Chiudi scheda celeste',
    metricDiameter: 'Diametro medio',
    metricMass: 'Massa totale',
    metricTemp: 'Temperatura superficiale',
    metricGravity: 'Gravità superficiale',
    metricRotation: 'Periodo di rotazione',
    metricOrbit: 'Periodo orbitale',
    metricAtmosphere: 'Composizione atmosferica',
    focusMessage: '🔭 Obiettivo puntato su: {name}',
    targets: {
      sun: { label: 'Sole', title: 'Il Sole' },
      mercury: { label: 'Mercurio', title: 'Mercurio' },
      venus: { label: 'Venere', title: 'Venere' },
      earth: { label: 'Terra', title: 'Terra' },
      moon: { label: 'Luna', title: 'La Luna' },
      mars: { label: 'Marte', title: 'Marte' },
      asteroid_belt: { label: 'Asteroidi', title: 'Fascia degli asteroidi' },
      jupiter: { label: 'Giove', title: 'Giove' },
      saturn: { label: 'Saturno', title: 'Saturno' },
      uranus: { label: 'Urano', title: 'Urano' },
      neptune: { label: 'Nettuno', title: 'Nettuno' },
      halley: { label: 'Halley', title: 'Cometa 1P/Halley' },
      phas: { label: 'NASA PHAs', title: 'Asteroidi potenzialmente pericolosi' },
      rocket: { label: 'Veicolo', title: 'Veicolo attivo' },
      alpha_centauri: { label: 'Alpha Centauri', title: 'Alpha Centauri' },
      trappist1: { label: 'TRAPPIST-1', title: 'TRAPPIST-1' },
      sirius: { label: 'Sirio A & B', title: 'Sirio A & B' },
      betelgeuse: { label: 'Betelgeuse', title: 'Betelgeuse' },
      sagittarius_a: { label: 'Sagittarius A*', title: 'Sagittarius A*' },
      pillars_of_creation: { label: 'Pilastri (M16)', title: 'Pilastri della Creazione (M16)' },
      crab_pulsar: { label: 'Pulsar del Granchio', title: 'Pulsar del Granchio' },
      blackhole: { label: 'Gargantua', title: 'Buco nero Gargantua' }
    }
  },
  es: {
    title: 'PLANETARIO CÓSMICO',
    toggleTitle: 'Mostrar u ocultar barra celeste',
    tabSolar: '☀️ SISTEMA SOLAR',
    tabExtrasolar: '🌌 ESTRELLAS VECINAS',
    tabDeepCosmos: '🌀 COSMOS PROFUNDO',
    highlightsTitle: '✨ ASPECTOS ASTRONÓMICOS DESTACADOS:',
    btnFocus: '🔭 OBSERVACIÓN 3D CERCANA',
    btnTeleport: '🚀 ESTABLECER ÓRBITA AQUÍ',
    closeAria: 'Cerrar ficha celeste',
    metricDiameter: 'Diámetro medio',
    metricMass: 'Masa total',
    metricTemp: 'Temperatura superficial',
    metricGravity: 'Gravedad superficial',
    metricRotation: 'Período de rotación',
    metricOrbit: 'Período orbital',
    metricAtmosphere: 'Composición atmosférica',
    focusMessage: '🔭 Cámara enfocada en: {name}',
    targets: {
      sun: { label: 'El Sol', title: 'El Sol' },
      mercury: { label: 'Mercurio', title: 'Mercurio' },
      venus: { label: 'Venus', title: 'Venus' },
      earth: { label: 'Tierra', title: 'La Tierra' },
      moon: { label: 'Luna', title: 'La Luna' },
      mars: { label: 'Marte', title: 'Marte' },
      asteroid_belt: { label: 'Asteroides', title: 'Cinturón de asteroides' },
      jupiter: { label: 'Júpiter', title: 'Júpiter' },
      saturn: { label: 'Saturno', title: 'Saturno' },
      uranus: { label: 'Urano', title: 'Urano' },
      neptune: { label: 'Neptuno', title: 'Neptuno' },
      halley: { label: 'Halley', title: 'Cometa 1P/Halley' },
      phas: { label: 'NASA PHAs', title: 'Asteroides potencialmente peligrosos' },
      rocket: { label: 'Nave', title: 'Nave activa' },
      alpha_centauri: { label: 'Alpha Centauri', title: 'Alfa Centauri' },
      trappist1: { label: 'TRAPPIST-1', title: 'TRAPPIST-1' },
      sirius: { label: 'Sirio A & B', title: 'Sirio A & B' },
      betelgeuse: { label: 'Betelgeuse', title: 'Betelgeuse' },
      sagittarius_a: { label: 'Sagittarius A*', title: 'Sagittarius A*' },
      pillars_of_creation: { label: 'Pilares (M16)', title: 'Pilares de la Creación (M16)' },
      crab_pulsar: { label: 'Púlsar del Cangrejo', title: 'Púlsar del Cangrejo' },
      blackhole: { label: 'Gargantua', title: 'Agujero negro Gargantua' }
    }
  }
};

export function getMissionText(id: string, lang?: SupportedLang): LocalizedMissionText | undefined {
  const l = normalizeLang(lang || getCurrentLang());
  return MISSIONS_I18N[l]?.[id] || MISSIONS_I18N.en_us[id];
}

export function getSpacecraftText(id: string, lang?: SupportedLang): LocalizedItemText | undefined {
  const l = normalizeLang(lang || getCurrentLang());
  return SPACECRAFT_I18N[l]?.[id] || SPACECRAFT_I18N.en_us[id];
}

export function getPowerText(id: string, lang?: SupportedLang): LocalizedItemText | undefined {
  const l = normalizeLang(lang || getCurrentLang());
  return POWER_CORES_I18N[l]?.[id] || POWER_CORES_I18N.en_us[id];
}

export function getTechText(id: string, lang?: SupportedLang): LocalizedItemText | undefined {
  const l = normalizeLang(lang || getCurrentLang());
  return TECH_MODULES_I18N[l]?.[id] || TECH_MODULES_I18N.en_us[id];
}

export function getEngineText(id: string, lang?: SupportedLang): LocalizedItemText | undefined {
  const l = normalizeLang(lang || getCurrentLang());
  return ENGINES_I18N[l]?.[id] || ENGINES_I18N.en_us[id];
}

export function getCarrierText(id: string, lang?: SupportedLang): LocalizedItemText | undefined {
  const l = normalizeLang(lang || getCurrentLang());
  return CARRIERS_I18N[l]?.[id] || CARRIERS_I18N.en_us[id];
}

export function getFlagText(id: string, lang?: SupportedLang): LocalizedFlagText | undefined {
  const l = normalizeLang(lang || getCurrentLang());
  return FLAGS_I18N[l]?.[id] || FLAGS_I18N.en_us[id];
}

export function getOrreryTexts(lang?: SupportedLang): OrreryTexts {
  const l = normalizeLang(lang || getCurrentLang());
  return ORRERY_I18N[l] || ORRERY_I18N.en_us;
}
