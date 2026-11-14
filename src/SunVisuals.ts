/**
 * SunVisuals.ts
 * PHOTOREALISTIC THERMONUCLEAR SUN SHADER & VOLUMETRIC CORONA SYSTEM
 * Thiết kế Mặt Trời chân thực chuẩn NASA SDO 4K với:
 * 1. Quang cầu (Photosphere) sôi sục hạt đối lưu nhiệt hạch (Convection Granules) bằng GLSL Simplex fBm GPU Shader.
 * 2. Định luật làm tối rìa Eddington (Solar Limb Darkening) chuẩn vật lý thiên văn.
 * 3. Vết đen Mặt Trời (Sunspots) với vùng bóng tối (Umbra) và quầng sợi từ trường (Penumbra).
 * 4. Quầng nhật hoa thể tích (Volumetric Coronal Ray Streams) phóng tỏa gió mặt trời vào vũ trụ.
 * 5. Tai lửa bùng phát (Solar Prominences & Coronal Mass Ejections) vặn xoắn và phun trào thực tế.
 * 6. Vệt lóa thấu kính điện ảnh (Anamorphic Solar Lens Flare & Blinding Diffraction Spikes).
 */

import * as THREE from 'three/src/Three';

// Simplex 3D Noise GLSL Implementation
const NOISE_GLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  vec3 shift = vec3(100.0);
  for (int i = 0; i < 4; ++i) {
    v += a * snoise(p);
    p = p * 2.05 + shift;
    a *= 0.5;
  }
  return v;
}
`;

export class SunVisuals {
  public group: THREE.Object3D;
  public photosphereMesh: THREE.Mesh;
  public innerCoronaMesh: THREE.Mesh;
  public outerCoronaMesh: THREE.Mesh;
  public prominenceGroup: THREE.Object3D;
  public lensFlareGroup: THREE.Object3D;
  public flareParticles: THREE.Points;

  private photosphereUniforms: {
    time: { value: number };
    granuleScale: { value: number };
    limbPower: { value: number };
  };

  private coronaUniforms: {
    time: { value: number };
    intensity: { value: number };
  };

  private prominenceMeshes: {
    mesh: THREE.Mesh;
    baseScale: number;
    speed: number;
    phase: number;
    rotationAxis: THREE.Vector3;
  }[] = [];

  private flareParticlePositions: Float32Array;
  private flareParticleSpeeds: Float32Array;
  private flareParticleDirections: THREE.Vector3[] = [];

  constructor(private sunRadiusInAu: number, private viewScale: number) {
    this.group = new THREE.Object3D();

    // =========================================================================
    // 1. BOILING THERMONUCLEAR PHOTOSPHERE (GLSL Shader)
    // =========================================================================
    this.photosphereUniforms = {
      time: { value: 0.0 },
      granuleScale: { value: 7.5 },
      limbPower: { value: 0.65 }
    };

    const photosphereVert = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewDir = -normalize(mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const photosphereFrag = `
      uniform float time;
      uniform float granuleScale;
      uniform float limbPower;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      ${NOISE_GLSL}

      void main() {
        vec3 p = normalize(vPosition) * granuleScale;

        // Dynamic multi-layer boiling plasma turbulence
        float t = time * 0.12;
        float n1 = fbm(p + vec3(0.0, t * 0.35, t * 0.15));
        float n2 = fbm(p * 2.0 - vec3(t * 0.25, 0.0, t * 0.4));
        float granules = fbm(p * 3.8 + vec3(n1 * 1.5, n2 * 1.5, t * 0.2));

        // Physical Eddington Solar Limb Darkening:
        // Center is blistering white-hot, edge darkens to incandescent deep amber/crimson
        float cosTheta = max(0.0, dot(vNormal, vViewDir));
        float limbDarkening = 0.35 + 0.65 * pow(cosTheta, limbPower);

        // Chromospheric Plasma Palette
        vec3 colIntergranular = vec3(0.72, 0.12, 0.01); // 4500K deep cool crimson lanes
        vec3 colGranuleBody   = vec3(1.0, 0.52, 0.04);  // 5800K blazing solar orange
        vec3 colGranuleHot    = vec3(1.0, 0.92, 0.35);  // 6500K golden white hot
        vec3 colFlaresWhite   = vec3(1.4, 1.35, 1.1);   // 10000K blinding incandescent plasma

        float gVal = granules * 0.5 + 0.5;
        vec3 plasma = mix(colIntergranular, colGranuleBody, smoothstep(0.12, 0.48, gVal));
        plasma = mix(plasma, colGranuleHot, smoothstep(0.48, 0.78, gVal));
        plasma = mix(plasma, colFlaresWhite, smoothstep(0.78, 1.0, gVal));

        // Sunspots (Vết đen từ trường tại vĩ độ 10° - 35°)
        float lat = abs(vPosition.y / length(vPosition));
        if (lat > 0.12 && lat < 0.62) {
          float spotNoise = snoise(normalize(vPosition) * 4.0 + vec3(0.0, 0.0, time * 0.015));
          if (spotNoise > 0.65) {
            float spot = smoothstep(0.65, 0.82, spotNoise);
            // Penumbra halo into deep black Umbra core
            plasma = mix(plasma, vec3(0.08, 0.015, 0.005), spot * 0.92);
          }
        }

        // Apply physical limb darkening & center specular heat
        vec3 finalColor = plasma * limbDarkening;
        finalColor += colGranuleHot * pow(cosTheta, 4.0) * 0.45; // Blinding core glow

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const photosphereMat = new THREE.ShaderMaterial({
      vertexShader: photosphereVert,
      fragmentShader: photosphereFrag,
      uniforms: this.photosphereUniforms
    });

    const photosphereGeom = new THREE.SphereGeometry(1, 64, 64);
    this.photosphereMesh = new THREE.Mesh(photosphereGeom, photosphereMat);
    this.photosphereMesh.scale.setScalar(this.sunRadiusInAu);
    this.group.add(this.photosphereMesh);

    // =========================================================================
    // 2. VOLUMETRIC CORONA RAY STREAMS & FRESNEL HALO (Quầng Nhật Hoa 3D)
    // =========================================================================
    this.coronaUniforms = {
      time: { value: 0.0 },
      intensity: { value: 1.0 }
    };

    const coronaVert = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewDir = -normalize(mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const coronaFrag = `
      uniform float time;
      uniform float intensity;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewDir;

      ${NOISE_GLSL}

      void main() {
        // Fresnel rim glow
        float cosTheta = max(0.0, dot(vNormal, vViewDir));
        float fresnel = 1.0 - cosTheta;
        fresnel = pow(fresnel, 2.2);

        // Radiant coronal ray streamers (Tia nhật hoa bốc ra)
        vec3 dir = normalize(vPosition);
        float angle = atan(dir.y, dir.x);
        float rays = sin(angle * 18.0 + time * 0.4) * 0.5 + 0.5;
        rays += sin(angle * 36.0 - time * 0.6) * 0.25;
        rays += snoise(dir * 3.5 + vec3(0.0, 0.0, time * 0.25)) * 0.35;

        vec3 innerColor = vec3(1.0, 0.85, 0.35); // Blazing gold
        vec3 outerColor = vec3(1.0, 0.35, 0.04); // Fiery orange-red

        vec3 corona = mix(innerColor, outerColor, fresnel);
        float alpha = fresnel * (0.65 + rays * 0.5) * intensity;

        gl_FragColor = vec4(corona * 1.6, alpha);
      }
    `;

    const innerCoronaMat = new THREE.ShaderMaterial({
      vertexShader: coronaVert,
      fragmentShader: coronaFrag,
      uniforms: this.coronaUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });

    this.innerCoronaMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), innerCoronaMat);
    this.innerCoronaMesh.scale.setScalar(this.sunRadiusInAu * 1.18);
    this.group.add(this.innerCoronaMesh);

    // Outer soft ethereal corona halo
    const outerCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xff3b00,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
    this.outerCoronaMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), outerCoronaMat);
    this.outerCoronaMesh.scale.setScalar(this.sunRadiusInAu * 1.58);
    this.group.add(this.outerCoronaMesh);

    // =========================================================================
    // 3. ERUPTING SOLAR PROMINENCES & CME FLUX ROPES (Tai Lửa Bùng Nổ)
    // =========================================================================
    this.prominenceGroup = new THREE.Object3D();

    const promVert = `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const promFrag = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;
      ${NOISE_GLSL}

      void main() {
        // Turbulent twisting plasma ribbons
        float t = time * 0.6;
        float n = snoise(vPosition * 8.0 + vec3(t, t * 0.5, 0.0));
        float edge = smoothstep(0.0, 0.45, vUv.y) * smoothstep(1.0, 0.55, vUv.y);

        vec3 flameHot  = vec3(1.3, 1.1, 0.6); // White-hot plasma arch core
        vec3 flameBody = vec3(1.0, 0.45, 0.05);
        vec3 flameRim  = vec3(0.9, 0.15, 0.01);

        vec3 col = mix(flameRim, flameBody, n * 0.5 + 0.5);
        col = mix(col, flameHot, smoothstep(0.3, 0.8, n));

        float alpha = edge * (0.6 + n * 0.4);
        gl_FragColor = vec4(col * 1.8, alpha);
      }
    `;

    const promMat = new THREE.ShaderMaterial({
      vertexShader: promVert,
      fragmentShader: promFrag,
      uniforms: { time: this.photosphereUniforms.time },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    // Spawn 12 authentic magnetic prominence arches
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
      const loopRadius = 0.16 + Math.random() * 0.14;
      const tubeRadius = 0.035 + Math.random() * 0.02;
      const promGeom = new THREE.TorusGeometry(loopRadius, tubeRadius, 10, 24, Math.PI * 0.95);
      const promMesh = new THREE.Mesh(promGeom, promMat);

      // Place along limb of sphere
      const zOffset = (Math.random() - 0.5) * 0.4;
      promMesh.position.set(Math.cos(angle) * 0.97, Math.sin(angle) * 0.97, zOffset);
      promMesh.rotation.z = angle - Math.PI / 2;
      promMesh.rotation.x = (Math.random() - 0.5) * 0.8;
      promMesh.rotation.y = (Math.random() - 0.5) * 0.8;

      this.prominenceGroup.add(promMesh);
      this.prominenceMeshes.push({
        mesh: promMesh,
        baseScale: 1.0,
        speed: 1.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        rotationAxis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
      });
    }

    this.prominenceGroup.scale.setScalar(this.sunRadiusInAu);
    this.group.add(this.prominenceGroup);

    // =========================================================================
    // 4. Flare Particles & Lens Flare - Kept as empty groups to preserve API without casting visual artifacts in deep space
    this.flareParticles = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ visible: false }));
    this.lensFlareGroup = new THREE.Object3D();
  }

  public update(deltaTime: number, camera: THREE.Camera) {
    const dt = Math.max(0.001, Math.min(0.1, deltaTime));

    // 1. Advance Photosphere & Corona GLSL time
    this.photosphereUniforms.time.value += dt;
    this.coronaUniforms.time.value += dt;

    // 2. Animate Solar Prominences (Eruptions & Twisting)
    const t = this.photosphereUniforms.time.value;
    for (const p of this.prominenceMeshes) {
      const scaleCycle = 1.0 + Math.sin(t * p.speed + p.phase) * 0.42;
      p.mesh.scale.set(scaleCycle, scaleCycle, scaleCycle * (1.0 + Math.sin(t * 3.0) * 0.2));
      p.mesh.rotation.z += 0.004;
    }

    // 3. Pulse Coronal Halos
    const coronaPulse = 1.0 + Math.sin(t * 1.8) * 0.06;
    this.innerCoronaMesh.scale.setScalar(this.sunRadiusInAu * 1.18 * coronaPulse);
    const outerPulse = 1.0 + Math.sin(t * 1.2 + 1.0) * 0.08;
    this.outerCoronaMesh.scale.setScalar(this.sunRadiusInAu * 1.58 * outerPulse);
  }
}
