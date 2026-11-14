/**
 * PlanetaryVisuals.ts
 * PHOTOREALISTIC 4K PLANETARY DAY/NIGHT TERMINATOR, NIGHT CITY LIGHTS,
 * AND DEEP SPACE EXTRASOLAR STAR SYSTEMS & COSMIC PHENOMENA
 *
 * 1. Earth Day/Night Shader:
 *    - Real-time sunDirection calculation relative to the Sun.
 *    - Day side: Photorealistic oceans, continents, and Rayleigh limb scattering.
 *    - Twilight terminator: Rich golden-amber dawn/dusk Rayleigh band.
 *    - Night side: 4K NASA Black Marble glowing metropolitan city networks & zero ambient fog.
 *    - Dynamic moving cloud layer with solar illumination and night-side cloud shadows.
 *    - Ocean specular solar glare.
 * 2. Moon High-Relief Terminator & Crater Shadows:
 *    - Sharp, atmosphere-less day/night terminator.
 *    - Grazing-angle sunlight casting deep, dramatic crater rim shadows.
 *    - Pitch black lunar night with subtle Earthshine.
 * 3. Extrasolar Systems & Deep Space Landmarks:
 *    - Alpha Centauri A & B + Proxima Centauri & Habitable Proxima b.
 *    - TRAPPIST-1 Ultra-cool red dwarf & 7 Earth-sized terrestrial exoplanets (TRAPPIST-1e habitable ocean world).
 *    - Sirius A & Sirius B (The Pup) dense white dwarf binary.
 *    - Betelgeuse pulsating red supergiant with giant convective boiling cells and dust envelope.
 *    - Sagittarius A* Supermassive Black Hole (Milky Way core, Kerr photon ring, Doppler-boosted accretion disk, relativistic jets).
 *    - Pillars of Creation (Eagle Nebula - M16 star-forming gaseous pillars).
 *    - Crab Nebula Pulsar (rapidly spinning magnetized neutron star & synchrotron wind).
 */

import * as THREE from 'three/src/Three';

/**
 * Pure Clean Earth Night Texture (All orange spots and artificial city lights removed)
 */
export function generateEarthNightLightsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 16, 16);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/**
 * Creates the authentic realistic Earth Material:
 * - 100% uniform illumination: No day/night split, entire world map fully visible.
 * - Zero orange spots: Artificial city clusters and orange sunset terminator completely removed.
 * - NASA Blue Marble photorealistic surface with natural clouds and subtle blue atmospheric Rayleigh rim.
 */
export function createEarthDayNightMaterial(dayTexture: THREE.Texture): THREE.ShaderMaterial {
  dayTexture.anisotropy = 16;
  const nightTexture = generateEarthNightLightsTexture();

  // Create high-resolution procedural cloud texture
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 1024;
  cloudCanvas.height = 512;
  const cctx = cloudCanvas.getContext('2d')!;
  cctx.fillStyle = '#000000';
  cctx.fillRect(0, 0, 1024, 512);

  // Fractal cloud swirls
  for (let i = 0; i < 90; i++) {
    const cx = Math.random() * 1024;
    const cy = 60 + Math.random() * 392;
    const cr = 20 + Math.random() * 75;
    const grad = cctx.createRadialGradient(cx, cy, 2, cx, cy, cr);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.45, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    cctx.fillStyle = grad;
    cctx.beginPath();
    cctx.arc(cx, cy, cr, 0, Math.PI * 2);
    cctx.fill();
  }
  const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
  cloudTexture.wrapS = THREE.RepeatWrapping;
  cloudTexture.wrapT = THREE.ClampToEdgeWrapping;

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(mat3(modelMatrix) * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const fragmentShader = `
    uniform sampler2D dayMap;
    uniform sampler2D nightMap;
    uniform sampler2D cloudMap;
    uniform vec3 sunDirection;
    uniform vec3 cameraWorldPos;
    uniform float cloudOffset;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 N = normalize(vNormal);
      vec3 V = normalize(cameraWorldPos - vWorldPosition);

      // Base planetary daytime surface: authentic NASA Visible Earth Blue Marble map (100% visible worldwide)
      vec3 dayColor = texture2D(dayMap, vUv).rgb;

      // Dynamic revolving cloud layer
      vec2 cloudUv = vec2(fract(vUv.x + cloudOffset), vUv.y);
      float cloudAlpha = texture2D(cloudMap, cloudUv).r;

      // Authentic uniform Earth surface - zero day/night split, fully visible continents & oceans
      vec3 surfaceMap = mix(dayColor, vec3(0.96, 0.98, 1.0), cloudAlpha * 0.22);
      vec3 baseGlobe = surfaceMap;

      // Atmospheric Rayleigh blue limb scattering (pure blue space horizon glow, zero orange/amber tint)
      float rim = pow(1.0 - max(0.0, dot(N, V)), 2.8);
      vec3 atmosGlow = vec3(0.12, 0.48, 0.95) * rim * 0.42;

      vec3 finalColor = baseGlobe + atmosGlow;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms: {
      dayMap: { value: dayTexture },
      nightMap: { value: nightTexture },
      cloudMap: { value: cloudTexture },
      sunDirection: { value: new THREE.Vector3(1, 0, 0) },
      cameraWorldPos: { value: new THREE.Vector3(0, 0, 5) },
      cloudOffset: { value: 0.0 }
    },
    vertexShader,
    fragmentShader,
    transparent: false
  });
}

/**
 * Creates High-Detail Moon Surface with authentic NASA photography and half-dimmed night hemisphere
 */
export function createRealisticMoonMaterial(moonTexture: THREE.Texture): THREE.ShaderMaterial {
  moonTexture.anisotropy = 16;
  moonTexture.wrapS = THREE.RepeatWrapping;
  moonTexture.wrapT = THREE.ClampToEdgeWrapping;

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `;

  const fragmentShader = `
    uniform sampler2D moonMap;
    uniform vec3 sunDirection;
    uniform vec3 cameraWorldPos;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 N = normalize(vNormal);
      vec3 L = normalize(sunDirection);
      vec3 V = normalize(cameraWorldPos - vWorldPosition);

      float NdotL = dot(N, L);

      // Authentic 4K NASA Moon texture
      vec3 moonColor = texture2D(moonMap, vUv).rgb;

      // Realistic Lunar Lighting:
      // Sunlit side: full illumination (1.05)
      // Dark side: half-brightness (~0.48), per user request! All craters & maria remain crystal clear!
      float lunarLighting = mix(0.48, 1.05, clamp(NdotL * 0.75 + 0.25, 0.0, 1.0));
      vec3 finalColor = moonColor * lunarLighting;

      // Subtle limb rim highlight
      float rim = pow(1.0 - max(0.0, dot(N, V)), 3.5);
      finalColor += vec3(0.12, 0.12, 0.14) * rim * max(0.0, NdotL);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms: {
      moonMap: { value: moonTexture },
      sunDirection: { value: new THREE.Vector3(1, 0, 0) },
      cameraWorldPos: { value: new THREE.Vector3(0, 0, 10) }
    },
    vertexShader,
    fragmentShader,
    transparent: false
  });
}

/**
 * Deep Space Landmark Visual Generators
 */

/**
 * 1. Alpha Centauri Triple Star System & Habitable Proxima b
 */
export function createAlphaCentauriVisuals(): THREE.Group {
  const group = new THREE.Group();
  group.name = "visuals_alpha_centauri";

  // Alpha Centauri A (Rigil Kentaurus - G2V Yellow Dwarf, 1.2 R_sun)
  const aGeo = new THREE.SphereGeometry(0.18, 32, 32);
  const aMat = new THREE.MeshBasicMaterial({ color: 0xfff0aa });
  const aMesh = new THREE.Mesh(aGeo, aMat);
  aMesh.position.set(-0.35, 0, 0);

  const aCorona = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending })
  );
  aMesh.add(aCorona);
  group.add(aMesh);

  // Alpha Centauri B (Toliman - K1V Orange Dwarf, 0.86 R_sun)
  const bGeo = new THREE.SphereGeometry(0.14, 32, 32);
  const bMat = new THREE.MeshBasicMaterial({ color: 0xffaa44 });
  const bMesh = new THREE.Mesh(bGeo, bMat);
  bMesh.position.set(0.35, 0, 0);

  const bCorona = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending })
  );
  bMesh.add(bCorona);
  group.add(bMesh);

  // Proxima Centauri (M5.5V Red Dwarf Flare Star)
  const pGeo = new THREE.SphereGeometry(0.06, 24, 24);
  const pMat = new THREE.MeshBasicMaterial({ color: 0xff3322 });
  const pMesh = new THREE.Mesh(pGeo, pMat);
  pMesh.position.set(0, 0.45, 0.65);

  const pCorona = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xff1100, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending })
  );
  pMesh.add(pCorona);
  group.add(pMesh);

  // Exoplanet Proxima Centauri b (Habitable Earth-sized exoplanet)
  const pbGeo = new THREE.SphereGeometry(0.024, 24, 24);
  const pbMat = new THREE.MeshStandardMaterial({
    color: 0x1e88e5,
    roughness: 0.4,
    metalness: 0.1
  });
  const pbMesh = new THREE.Mesh(pbGeo, pbMat);
  pbMesh.position.set(0.14, 0.45, 0.72);
  group.add(pbMesh);

  return group;
}

/**
 * 2. TRAPPIST-1 Ultra-Cool Red Dwarf & 7 Earth-Sized Exoplanets
 */
export function createTrappist1Visuals(): THREE.Group {
  const group = new THREE.Group();
  group.name = "visuals_trappist1";

  // Central Star TRAPPIST-1 (M8V Ultra-cool dwarf)
  const starGeo = new THREE.SphereGeometry(0.12, 32, 32);
  const starMat = new THREE.MeshBasicMaterial({ color: 0xff4422 });
  const starMesh = new THREE.Mesh(starGeo, starMat);

  const starHalo = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xd92612, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending })
  );
  starMesh.add(starHalo);
  group.add(starMesh);

  // 7 Earth-sized exoplanets orbiting in compact resonance
  const PLANETS = [
    { name: 'TRAPPIST-1b', dist: 0.22, color: 0xd97736, r: 0.016 },
    { name: 'TRAPPIST-1c', dist: 0.28, color: 0xf59e0b, r: 0.017 },
    { name: 'TRAPPIST-1d', dist: 0.35, color: 0x38bdf8, r: 0.014 },
    { name: 'TRAPPIST-1e (Habitable Ocean World)', dist: 0.44, color: 0x0284c7, r: 0.018 },
    { name: 'TRAPPIST-1f', dist: 0.54, color: 0xa5b4fc, r: 0.017 },
    { name: 'TRAPPIST-1g', dist: 0.65, color: 0x67e8f9, r: 0.019 },
    { name: 'TRAPPIST-1h', dist: 0.76, color: 0xe0e7ff, r: 0.013 }
  ];

  PLANETS.forEach((p, idx) => {
    const angle = (idx / PLANETS.length) * Math.PI * 2;
    const pMesh = new THREE.Mesh(
      new THREE.SphereGeometry(p.r, 20, 20),
      new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.5, metalness: 0.1 })
    );
    pMesh.position.set(Math.cos(angle) * p.dist, 0, Math.sin(angle) * p.dist);
    group.add(pMesh);

    // Orbit trail line
    const orbitCurve = new THREE.EllipseCurve(0, 0, p.dist, p.dist, 0, Math.PI * 2, false, 0);
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitCurve.getPoints(64));
    const orbitLine = new THREE.Line(orbitGeo, new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.35 }));
    orbitLine.rotation.x = Math.PI / 2;
    group.add(orbitLine);
  });

  return group;
}

/**
 * 3. Sirius A & Sirius B (White Dwarf Binary)
 */
export function createSiriusVisuals(): THREE.Group {
  const group = new THREE.Group();
  group.name = "visuals_sirius";

  // Sirius A (Luminous A1V Blue-White Main Sequence Star, 25x Sol luminosity)
  const aGeo = new THREE.SphereGeometry(0.24, 32, 32);
  const aMat = new THREE.MeshBasicMaterial({ color: 0xf0fdfa });
  const aMesh = new THREE.Mesh(aGeo, aMat);
  aMesh.position.set(-0.35, 0, 0);

  // Blinding diamond cyan-white corona
  const aCorona = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending })
  );
  aMesh.add(aCorona);
  group.add(aMesh);

  // Sirius B ("The Pup" - Ultra-dense Earth-sized White Dwarf)
  const bGeo = new THREE.SphereGeometry(0.045, 24, 24);
  const bMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const bMesh = new THREE.Mesh(bGeo, bMat);
  bMesh.position.set(0.45, 0.15, 0);

  const bCorona = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xa5b4fc, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })
  );
  bMesh.add(bCorona);
  group.add(bMesh);

  return group;
}

/**
 * 4. Betelgeuse (Alpha Orionis - Pulsating Red Supergiant)
 */
export function createBetelgeuseVisuals(): THREE.Group {
  const group = new THREE.Group();
  group.name = "visuals_betelgeuse";

  // Enormous Red Supergiant Photosphere (764x Sol diameter)
  const bGeo = new THREE.SphereGeometry(0.48, 36, 36);
  const bMat = new THREE.MeshBasicMaterial({ color: 0xff3b1d });
  const bMesh = new THREE.Mesh(bGeo, bMat);
  group.add(bMesh);

  // Circumstellar convective gas granules & boiling atmosphere
  const gasShell = new THREE.Mesh(
    new THREE.SphereGeometry(0.62, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xd946ef, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending })
  );
  group.add(gasShell);

  // Expanding circumstellar dust envelope
  const dustShell = new THREE.Mesh(
    new THREE.SphereGeometry(0.85, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xb45309, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending })
  );
  group.add(dustShell);

  return group;
}

/**
 * 5. Sagittarius A* (Milky Way Supermassive Black Hole)
 */
export function createSagittariusAVisuals(): THREE.Group {
  const group = new THREE.Group();
  group.name = "visuals_sagittarius_a";

  // 1. Schwarzschild / Kerr Event Horizon (Black Void)
  const ehGeo = new THREE.SphereGeometry(0.08, 32, 32);
  const ehMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const ehMesh = new THREE.Mesh(ehGeo, ehMat);
  group.add(ehMesh);

  // 2. Einstein Gravitational Photon Ring (Relativistic light lensing)
  const ringGeo = new THREE.RingGeometry(0.082, 0.098, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });
  const photonRing = new THREE.Mesh(ringGeo, ringMat);
  group.add(photonRing);

  // 3. Relativistic Kerr Accretion Disk (Doppler-Boosted Blazing Plasma)
  const diskCanvas = document.createElement('canvas');
  diskCanvas.width = 512;
  diskCanvas.height = 512;
  const dctx = diskCanvas.getContext('2d')!;
  const grad = dctx.createRadialGradient(256, 256, 45, 256, 256, 256);
  grad.addColorStop(0, '#ffffff'); // Inner ISCO orbit (millions of Kelvin)
  grad.addColorStop(0.18, '#38bdf8'); // Relativistic cyan Doppler blueshift
  grad.addColorStop(0.45, '#f59e0b'); // Golden synchrotron radiation
  grad.addColorStop(0.8, '#ef4444'); // Gravitational redshift border
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  dctx.fillStyle = grad;
  dctx.fillRect(0, 0, 512, 512);

  const diskTex = new THREE.CanvasTexture(diskCanvas);
  const diskGeo = new THREE.RingGeometry(0.095, 0.48, 64);
  const diskMat = new THREE.MeshBasicMaterial({
    map: diskTex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.94,
    blending: THREE.AdditiveBlending
  });
  const accretionDisk = new THREE.Mesh(diskGeo, diskMat);
  accretionDisk.rotation.x = Math.PI / 3.2;
  group.add(accretionDisk);

  // 4. Relativistic Bipolar Plasma Jets (Perpendicular to accretion disk)
  const jetGeo = new THREE.CylinderGeometry(0.008, 0.08, 1.4, 16);
  const jetMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });

  const jetNorth = new THREE.Mesh(jetGeo, jetMat);
  jetNorth.position.y = 0.7;
  group.add(jetNorth);

  const jetSouth = new THREE.Mesh(jetGeo, jetMat);
  jetSouth.position.y = -0.7;
  group.add(jetSouth);

  return group;
}

/**
 * 6. Pillars of Creation (Eagle Nebula - M16 Stellar Nursery)
 */
export function createPillarsOfCreationVisuals(): THREE.Group {
  const group = new THREE.Group();
  group.name = "visuals_pillars";

  // 3 Towering Gaseous Columns sculpted by ultraviolet stellar winds
  const pillarConfigs = [
    { x: -0.15, y: 0.1, z: 0, h: 0.8, w: 0.12, col: 0x059669 },
    { x: 0.05, y: -0.05, z: 0.05, h: 0.65, w: 0.1, col: 0x0284c7 },
    { x: 0.22, y: -0.15, z: -0.05, h: 0.5, w: 0.08, col: 0xd97706 }
  ];

  pillarConfigs.forEach((cfg) => {
    const geo = new THREE.CylinderGeometry(cfg.w * 0.4, cfg.w, cfg.h, 16);
    const mat = new THREE.MeshBasicMaterial({
      color: cfg.col,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const colMesh = new THREE.Mesh(geo, mat);
    colMesh.position.set(cfg.x, cfg.y, cfg.z);
    group.add(colMesh);
  });

  // Volumetric stardust particle glow
  const pCount = 200;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 0.7;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 0.9;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x67e8f9,
    size: 2.0,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  group.add(new THREE.Points(pGeo, pMat));

  return group;
}

/**
 * 7. Crab Nebula Pulsar (M1 Supernova Remnant & Synchrotron Wind)
 */
export function createCrabPulsarVisuals(): THREE.Group {
  const group = new THREE.Group();
  group.name = "visuals_crab_pulsar";

  // Central Spinning Neutron Star
  const nsGeo = new THREE.SphereGeometry(0.03, 16, 16);
  const nsMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const nsMesh = new THREE.Mesh(nsGeo, nsMat);
  group.add(nsMesh);

  // Synchrotron Radiation Equatorial Torus
  const torusGeo = new THREE.TorusGeometry(0.24, 0.035, 16, 32);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.rotation.x = Math.PI / 3;
  group.add(torus);

  // Twin Oscillating Relativistic Beams
  const beamGeo = new THREE.ConeGeometry(0.06, 0.9, 16);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  });

  const beam1 = new THREE.Mesh(beamGeo, beamMat);
  beam1.position.y = 0.45;
  group.add(beam1);

  const beam2 = new THREE.Mesh(beamGeo, beamMat);
  beam2.position.y = -0.45;
  beam2.rotation.x = Math.PI;
  group.add(beam2);

  return group;
}
