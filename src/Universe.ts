import * as THREE from 'three/src/Three';

import { CelestialBody, OrbitalElements, AU, AxisAngleQuaternion, AddPlanetParams, addPlanet } from './CelestialBody';
import { Settings } from './SettingsControl';
import { RotationButtons } from './RotationControl';
import { ModulatedIcosahedronGeometry } from './ModulatedIcosahedronGeometry';
import { GraphicsParams } from './GameState';
import { SunVisuals } from './SunVisuals';
import {
    createEarthDayNightMaterial,
    createRealisticMoonMaterial,
    createAlphaCentauriVisuals,
    createTrappist1Visuals,
    createSiriusVisuals,
    createBetelgeuseVisuals,
    createSagittariusAVisuals,
    createPillarsOfCreationVisuals,
    createCrabPulsarVisuals
} from './PlanetaryVisuals';

import moonUrl from './images/moon.png';
import mercuryUrl from './images/mercury.jpg';
import marsUrl from './images/mars.jpg';
import phobosModelUrl from './models/phobos_tf.obj';
import phobosMtlUrl from './models/phobos_tf.mtl';
import phobosColorUrl from './models/phoboscolor.jpg';
import phobosBumpUrl from './models/phobosbump.jpg';
import deimosModelUrl from './models/deimos_tf.obj';
import deimosMtlUrl from './models/deimos_tf.mtl';
import deimosColorUrl from './models/deimoscolor.jpg';
import deimosBumpUrl from './models/deimosbump.jpg';
import venusUrl from './images/venus.jpg';
import jupiterUrl from './images/jupiter.jpg';
import saturnUrl from './images/saturn.jpg';
import saturnRingUrl from './images/saturnringcolor.jpg';
import saturnRingAlphaUrl from './images/saturnringpattern.gif';
import earthUrl from './images/land_ocean_ice_cloud_2048.jpg';
import rocketModelUrl from './rocket.obj';
import rocketMtlUrl from './rocket.mtl';
import perlinUrl from './images/perlin.jpg';

const GMsun = 1.327124400e11 / AU / AU/ AU; // Product of gravitational constant (G) and Sun's mass (Msun)
const rad_per_deg = Math.PI / 180; // Radians per degrees

export const COLOR_PALETTE = [
    '1 1 1',
    '1 0.75 0.75',
    '0.75 1 0.75',
    '0.75 0.75 1',
    '1 1 0.75',
    '0.75 1 1',
    '1 0.75 1',
    '1 0.25 0.25',
    '0.25 1 0.25',
    '1 0.25 1',
    '0.25 1 1',
    '0.25 0.5 1',
    '0.25 1 0.5',
    '1 0.25 0.25',
    '0.5 1 0.25',
    '1 0.25 0.5',
    '0.5 0.25 1',
];

type AddPlanetArgType = (orbitalElements: OrbitalElements,
    params: AddPlanetParams, orbitGeometry: THREE.BufferGeometry) => CelestialBody;


export default class Universe{
    sun: CelestialBody;
    rocket: CelestialBody;
    light: THREE.PointLight;
    orbitGeometry: THREE.BufferGeometry;

    // Dynamic Celestial Phenomena
    sunVisuals: SunVisuals | null = null;
    earthBody: CelestialBody | null = null;
    earthMaterial: THREE.ShaderMaterial | null = null;
    moonBody: CelestialBody | null = null;
    moonMaterial: THREE.ShaderMaterial | null = null;
    earthClouds: THREE.Mesh | null = null;
    blackHoleDisk: THREE.Mesh | null = null;
    cometBody: CelestialBody | null = null;
    cometTail: THREE.Mesh | null = null;
    meteorStreaks: { line: THREE.Line; velocity: THREE.Vector3; life: number; maxLife: number }[] = [];

    // Extrasolar Systems & Deep Space Landmarks
    alphaCentauriGroup: THREE.Group | null = null;
    trappistGroup: THREE.Group | null = null;
    siriusGroup: THREE.Group | null = null;
    betelgeuseGroup: THREE.Group | null = null;
    sgrGroup: THREE.Group | null = null;
    pillarsGroup: THREE.Group | null = null;
    crabPulsarGroup: THREE.Group | null = null;

    constructor(graphicsParams: GraphicsParams, settings: Settings){
        const { scene, viewScale, camera, windowHalfX, windowHalfY } = graphicsParams;
        this.light = new THREE.PointLight( 0xffffff, 1.2, 0, 1e-6 );
        scene.add( this.light );
        scene.add( new THREE.AmbientLight( 0x202020 ) );

        const curve = new THREE.EllipseCurve(0, 0, 1, 1,
            0, Math.PI * 2, false, 90);
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints( curve.getPoints(256) );
        this.orbitGeometry = orbitGeometry;

        const group = new THREE.Object3D();

        const Rsun = 695800.;
        const sunRadiusInAu = viewScale * Rsun / AU;

        const day = 24. * 60. * 60.;
        const hour = 60. * 60.;
        const minute = 60.;

        // Photorealistic Thermonuclear Sun (GLSL Simplex Shader, Volumetric Corona & Erupting Prominences)
        const sunVisuals = new SunVisuals(sunRadiusInAu, viewScale);
        group.add(sunVisuals.group);
        this.sunVisuals = sunVisuals;

        scene.add(group);

        const addPlanetLocal = (orbitalElements: OrbitalElements, params: AddPlanetParams) =>
            addPlanet(orbitalElements, params, graphicsParams, orbitGeometry, settings);

        this.sun = new CelestialBody(null, new THREE.Vector3(), null, "#ffffff", GMsun, "sun");
        this.sun.radius = Rsun;
        this.sun.model = group;

        const mercury = addPlanetLocal({
            semimajor_axis: 0.387098,
            eccentricity: 0.205630,
            inclination: 7.005 * rad_per_deg,
            ascending_node: 48.331 * rad_per_deg,
            argument_of_perihelion: 29.124 * rad_per_deg
        },
        {
            name: "mercury",
            parent: this.sun,
            color: "#3f7f7f",
            texture: mercuryUrl,
            GM: 22032 / AU / AU / AU,
            radius: 2439.7,
            axialTilt: 2.04 * rad_per_deg,
            rotationPeriod: 58.646 * 24. * 60. * 60.,
            sphereOfInfluence: 2e5,
        });

        const venus = addPlanetLocal({
            semimajor_axis: 0.723332,
            eccentricity: 0.00677323,
            inclination: 3.39458 * rad_per_deg,
            ascending_node: 76.678 * rad_per_deg,
            argument_of_perihelion: 55.186 * rad_per_deg
        },
        {
            name: "venus",
            parent: this.sun,
            color: "#7f7f3f",
            texture: venusUrl,
            GM: 324859 / AU / AU / AU,
            radius: 6051.8,
            axialTilt: 	2.64 * rad_per_deg,
            rotationPeriod: -243. * 24. * 60. * 60.,
            sphereOfInfluence: 5e5,
        });

        // Earth is at 1 AU (which is the AU's definition) and orbits around the ecliptic.
        const earth = addPlanetLocal({
            semimajor_axis: 1,
            eccentricity: 0.0167086,
            inclination: 0,
            ascending_node: -11.26064 * rad_per_deg,
            argument_of_perihelion: 114.20783 * rad_per_deg
        },
        {
            name: "earth",
            parent: this.sun,
            color: "#3f7f3f",
            GM: 398600 / AU / AU / AU,
            radius: 6534,
            axialTilt: 23.4392811 * rad_per_deg,
            rotationPeriod: ((23 * 60 + 56) * 60 + 4.10),
            sphereOfInfluence: 5e5
        });

        // 1. Photorealistic Earth with Uniform 100% Illumination & Authentic NASA Blue Marble Map
        const earthRadiusInAu = viewScale * 6534 / AU;
        const earthTex = new THREE.TextureLoader().load(earthUrl);
        earthTex.anisotropy = 16;
        const earthMat = createEarthDayNightMaterial(earthTex);
        const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(earthRadiusInAu, 64, 64), earthMat);
        earthMesh.rotation.x = Math.PI / 2;
        earth.model.add(earthMesh);
        this.earthBody = earth;
        this.earthMaterial = earthMat;

        this.rocket = this.addRocket("rocket",
        {
            semimajor_axis: 10000 / AU,
            eccentricity: 0.,
            inclination: 0,
            ascending_node: 0,
            argument_of_perihelion: 0
        },
        earth,
        graphicsParams,
        settings);

        const moon = addPlanetLocal({
            semimajor_axis: 384399 / AU,
            eccentricity: 0.0167086,
            inclination: 0,
            ascending_node: -11.26064 * rad_per_deg,
            argument_of_perihelion: 114.20783 * rad_per_deg
        },
        {
            name: "moon",
            parent: earth,
            color: "#5f5f5f",
            GM: 4904.8695 / AU / AU / AU,
            radius: 1737.1,
            axialTilt: 	1.5424 * rad_per_deg,
            rotationPeriod: 27.321661 * 24. * 60. * 60.,
            sphereOfInfluence: 1e5,
        });

        // 2. Moon High-Relief Craters with Sharp Atmosphere-less Terminator
        const moonRadiusInAu = viewScale * 1737.1 / AU;
        const moonTex = new THREE.TextureLoader().load(moonUrl);
        const moonMat = createRealisticMoonMaterial(moonTex);
        const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(moonRadiusInAu, 64, 64), moonMat);
        moonMesh.rotation.x = Math.PI / 2;
        moon.model.add(moonMesh);
        this.moonBody = moon;
        this.moonMaterial = moonMat;

        const mars = addPlanetLocal({
            semimajor_axis: 1.523679,
            eccentricity: 0.0935,
            inclination: 1.850 * rad_per_deg,
            ascending_node: 49.562 * rad_per_deg,
            argument_of_perihelion: 286.537 * rad_per_deg
        },
        {
            name: "mars",
            parent: this.sun,
            color: "#7f3f3f",
            texture: marsUrl,
            GM: 42828 / AU / AU / AU,
            radius: 3389.5,
            axialTilt: 	25.19 * rad_per_deg,
            rotationPeriod: 24.6229 * 60. * 60.,
            sphereOfInfluence: 3e5
        });

        const phobos = addPlanetLocal({
            semimajor_axis: 9376 / AU,
            eccentricity: 0.0151,
            inclination: 1.093 * rad_per_deg,
            ascending_node: 48.331 * rad_per_deg,
            argument_of_perihelion: 29.124 * rad_per_deg
        },
        {
            name: "phobos",
            parent: mars,
            color: "#3f7f7f",
            modelName: phobosModelUrl,
            mtlName: phobosMtlUrl,
            texture: phobosColorUrl,
            textureRename: "phoboscolor.jpg",
            bumpMap: phobosBumpUrl,
            bumpMapRename: "phobosbump.jpg",
            modelScale: 1.5,
            GM: 7.113901872e-05 / AU / AU / AU,
            radius: 11.2667,
            axialTilt: 0,
            rotationPeriod: 7 * hour + 39 * minute + 12.,
            sphereOfInfluence: 2e3,
        });

        const deimos = addPlanetLocal({
            semimajor_axis: 23455.5 / AU,
            eccentricity: 0.00033,
            inclination: 0.93 * rad_per_deg,
            ascending_node: 48.331 * rad_per_deg,
            argument_of_perihelion: 29.124 * rad_per_deg
        },
        {
            name: "deimos",
            parent: mars,
            color: "#3f7f7f",
            modelName: deimosModelUrl,
            mtlName: deimosMtlUrl,
            texture: deimosColorUrl,
            textureRename: "deimoscolor.jpg",
            bumpMap: deimosBumpUrl,
            bumpMapRename: "deimosbump.jpg",
            modelScale: 1.5,
            GM: 7.113901872e-05 / AU / AU / AU,
            radius: 11.2667,
            axialTilt: 0,
            rotationPeriod: 1.263 * day,
            sphereOfInfluence: 1e3,
        });

        const jupiter = addPlanetLocal({
            semimajor_axis: 5.204267,
            eccentricity: 0.048775,
            inclination: 1.305 * rad_per_deg,
            ascending_node: 100.492 * rad_per_deg,
            argument_of_perihelion: 275.066 * rad_per_deg
        },
        {
            name: "jupiter",
            parent: this.sun,
            color: "#7f7f3f",
            texture: jupiterUrl,
            GM: 126686534 / AU / AU / AU,
            radius: 69911,
            axialTilt: 3.13 * rad_per_deg,
            rotationPeriod: 9.925 * 60. * 60.,
            sphereOfInfluence: 10e6,
            oblateness: 0.06487,
        });

        const saturn = addPlanetLocal({
            semimajor_axis: 10.1238,
            eccentricity: 0.0565,
            inclination: 2.485 * rad_per_deg,
            ascending_node: 113.665 * rad_per_deg,
            argument_of_perihelion: 339.392 * rad_per_deg
        },
        {
            name: "saturn",
            parent: this.sun,
            color: "#7f7f5f",
            texture: saturnUrl,
            GM: 3.79315347480608e+6 / AU / AU / AU,
            radius: 60268,
            axialTilt: 26.73 * rad_per_deg,
            rotationPeriod: (10. * 60. + 33.) * 60. + 38.,
            sphereOfInfluence: 10e6,
            oblateness: 0.09796,
            ring: {
                innerRadius: 60268 + 6630,
                outerRadius: 60268 + 120700,
                ringTexture: saturnRingUrl,
                ringAlphaTexture: saturnRingAlphaUrl,
            },
        });

        // Use icosahedron instead of sphere to make it look like uniform
        // TODO: use simplex noise to make more smooth asteroid
        const asteroidGeometry = new ModulatedIcosahedronGeometry( 1, 2, (vec) => vec.multiplyScalar(0.3 * (Math.random() - 0.5) + 1) );
        asteroidGeometry.computeVertexNormals();

        // Perlin noise is applied as detail texture.
        // It's asynchrnonous because it's shared by multiple asteroids.
        const asteroidTexture = new THREE.TextureLoader().load(perlinUrl);
        asteroidTexture.wrapS = THREE.RepeatWrapping;
        asteroidTexture.wrapT = THREE.RepeatWrapping;
        asteroidTexture.repeat.set(4, 4);
        const asteroidMaterial = new THREE.MeshLambertMaterial( {
            map: asteroidTexture,
            color: 0xffaf7f, flatShading: false
        } );

        // NASA Mission-Viz (WSMV) - Authentic Potentially Hazardous Asteroids (PHAs)
        // Integrated from https://github.com/nasa/mission-viz with real Keplerian Orbital Elements
        const phaDefinitions = [
            {
                name: "99942 Apophis",
                color: "#ef4444",
                semimajor_axis: 0.9224,
                eccentricity: 0.1912,
                inclination: 3.331 * rad_per_deg,
                ascending_node: 204.446 * rad_per_deg,
                argument_of_perihelion: 126.402 * rad_per_deg,
                radius: 180,
                GM: 1.8e-9 / AU / AU / AU,
                rotationPeriod: 30.56 * hour,
                axialTilt: 165 * rad_per_deg,
            },
            {
                name: "101955 Bennu",
                color: "#f59e0b",
                semimajor_axis: 1.1264,
                eccentricity: 0.2037,
                inclination: 6.035 * rad_per_deg,
                ascending_node: 2.061 * rad_per_deg,
                argument_of_perihelion: 66.223 * rad_per_deg,
                radius: 150,
                GM: 4.9e-9 / AU / AU / AU,
                rotationPeriod: 4.296 * hour,
                axialTilt: 178 * rad_per_deg,
            },
            {
                name: "65803 Didymos",
                color: "#06b6d4",
                semimajor_axis: 1.6446,
                eccentricity: 0.3837,
                inclination: 3.408 * rad_per_deg,
                ascending_node: 73.208 * rad_per_deg,
                argument_of_perihelion: 319.324 * rad_per_deg,
                radius: 220,
                GM: 3.5e-8 / AU / AU / AU,
                rotationPeriod: 2.26 * hour,
                axialTilt: 171 * rad_per_deg,
            },
            {
                name: "1950 DA",
                color: "#dc2626",
                semimajor_axis: 1.6989,
                eccentricity: 0.5073,
                inclination: 12.18 * rad_per_deg,
                ascending_node: 356.76 * rad_per_deg,
                argument_of_perihelion: 224.62 * rad_per_deg,
                radius: 280,
                GM: 1.2e-8 / AU / AU / AU,
                rotationPeriod: 2.12 * hour,
                axialTilt: 168 * rad_per_deg,
            },
            {
                name: "433 Eros",
                color: "#a855f7",
                semimajor_axis: 1.4583,
                eccentricity: 0.2229,
                inclination: 10.828 * rad_per_deg,
                ascending_node: 304.322 * rad_per_deg,
                argument_of_perihelion: 178.817 * rad_per_deg,
                radius: 400,
                GM: 4.46e-4 / AU / AU / AU,
                rotationPeriod: 5.27 * hour,
                axialTilt: 89 * rad_per_deg,
            }
        ];

        for (const pha of phaDefinitions) {
            const body = addPlanetLocal({
                semimajor_axis: pha.semimajor_axis,
                eccentricity: pha.eccentricity,
                inclination: pha.inclination,
                ascending_node: pha.ascending_node,
                argument_of_perihelion: pha.argument_of_perihelion,
            },
            {
                name: pha.name,
                parent: this.sun,
                color: pha.color,
                texture: perlinUrl,
                radius: pha.radius,
                GM: pha.GM,
                axialTilt: pha.axialTilt,
                rotationPeriod: pha.rotationPeriod,
                sphereOfInfluence: pha.radius * 25,
            });

            const shape = new THREE.Mesh( asteroidGeometry, asteroidMaterial );
            const radiusInAu = viewScale * pha.radius / AU;
            shape.scale.set(radiusInAu, radiusInAu * 0.75, radiusInAu * 0.85);
            shape.up.set(0, 0, 1);
            body.model.add( shape );

            if (pha.name === "65803 Didymos") {
                // Dimorphos: Moonlet orbiting Didymos, kinetic impact target of NASA DART
                const dimorphosRadius = 55; // Scaled visual radius for 3D visibility (real: 75.5m)
                const dimorphosSmaKm = 720; // Visual orbital distance ~3.2x Didymos radius (real: 1.189 km)
                const dimorphos = addPlanetLocal({
                    semimajor_axis: dimorphosSmaKm / AU,
                    eccentricity: 0.0,
                    inclination: 0.0,
                    ascending_node: 0.0,
                    argument_of_perihelion: 0.0,
                },
                {
                    name: "Dimorphos",
                    parent: body,
                    color: "#f59e0b",
                    texture: perlinUrl,
                    radius: dimorphosRadius,
                    GM: 1.5e-10 / AU / AU / AU,
                    axialTilt: 0,
                    rotationPeriod: 11.92 * hour,
                    sphereOfInfluence: dimorphosSmaKm * 0.4,
                });
                const dimShape = new THREE.Mesh( asteroidGeometry, asteroidMaterial );
                const dimRadiusInAu = viewScale * dimorphosRadius / AU;
                dimShape.scale.set(dimRadiusInAu, dimRadiusInAu * 0.7, dimRadiusInAu * 0.85);
                dimShape.up.set(0, 0, 1);
                dimorphos.model.add( dimShape );
            }
        }

        // =========================================================================
        // 5. OUTER SOLAR SYSTEM: URANUS & NEPTUNE
        // =========================================================================
        const uranus = addPlanetLocal({
            semimajor_axis: 19.19126,
            eccentricity: 0.04717,
            inclination: 0.773 * rad_per_deg,
            ascending_node: 74.006 * rad_per_deg,
            argument_of_perihelion: 96.999 * rad_per_deg
        },
        {
            name: "uranus",
            parent: this.sun,
            color: "#48cae4",
            texture: saturnUrl,
            GM: 5793939 / AU / AU / AU,
            radius: 25362,
            axialTilt: 97.77 * rad_per_deg,
            rotationPeriod: -17.24 * 60. * 60.,
            sphereOfInfluence: 8e6,
        });

        const neptune = addPlanetLocal({
            semimajor_axis: 30.06896,
            eccentricity: 0.00860,
            inclination: 1.770 * rad_per_deg,
            ascending_node: 131.784 * rad_per_deg,
            argument_of_perihelion: 273.187 * rad_per_deg
        },
        {
            name: "neptune",
            parent: this.sun,
            color: "#0077b6",
            texture: saturnUrl,
            GM: 6835099 / AU / AU / AU,
            radius: 24622,
            axialTilt: 28.32 * rad_per_deg,
            rotationPeriod: 16.11 * 60. * 60.,
            sphereOfInfluence: 8e6,
        });

        // =========================================================================
        // 6. MAIN ASTEROID BELT (Vành đai tiểu hành tinh giữa Sao Hỏa & Sao Mộc)
        // =========================================================================
        const ceres = addPlanetLocal({
            semimajor_axis: 2.767,
            eccentricity: 0.076,
            inclination: 10.59 * rad_per_deg,
            ascending_node: 80.33 * rad_per_deg,
            argument_of_perihelion: 73.59 * rad_per_deg
        },
        {
            name: "Ceres (Asteroid)",
            parent: this.sun,
            color: "#d97706",
            texture: perlinUrl,
            GM: 63.1 / AU / AU / AU,
            radius: 470,
            rotationPeriod: 9.07 * hour,
            sphereOfInfluence: 3e4,
        });

        // Ceres (Dwarf Planet & Largest Asteroid)

        // =========================================================================
        // 7. PERIODIC COMET: 1P/HALLEY (Sao chổi chu kỳ với đuôi bốc hơi)
        // =========================================================================
        const halley = addPlanetLocal({
            semimajor_axis: 17.834,
            eccentricity: 0.967,
            inclination: 162.26 * rad_per_deg,
            ascending_node: 58.42 * rad_per_deg,
            argument_of_perihelion: 111.33 * rad_per_deg
        },
        {
            name: "1P/Halley (Comet)",
            parent: this.sun,
            color: "#38bdf8",
            texture: perlinUrl,
            radius: 120,
            GM: 1.5e-9 / AU / AU / AU,
            rotationPeriod: 52.8 * hour,
            sphereOfInfluence: 5e3,
        });

        // Ion & Dust Tail pointing anti-sunward
        const tailGeom = new THREE.ConeGeometry( 0.05, 0.45, 16, 1, true );
        tailGeom.translate(0, 0.225, 0);
        tailGeom.rotateX(Math.PI / 2);
        const tailMat = new THREE.MeshBasicMaterial({
            color: 0x67e8f9,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        const cometTail = new THREE.Mesh(tailGeom, tailMat);
        halley.model.add(cometTail);
        this.cometTail = cometTail;
        this.cometBody = halley;

        // =========================================================================
        // 8. DEEP SPACE BLACK HOLE: GARGANTUA SINGULARITY (Hố Đen Vũ Trụ)
        // =========================================================================
        const blackHoleGroup = new THREE.Object3D();

        // Event Horizon (Chân trời sự kiện đen tuyệt đối)
        const ehGeom = new THREE.SphereGeometry( 0.04, 32, 32 );
        const ehMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const ehMesh = new THREE.Mesh(ehGeom, ehMat);
        blackHoleGroup.add(ehMesh);

        // Relativistic Accretion Disk (Đĩa bồi tụ plasma xoáy phát sáng)
        const diskGeom = new THREE.RingGeometry( 0.048, 0.22, 64 );
        const diskCanvas = document.createElement('canvas');
        diskCanvas.width = 256;
        diskCanvas.height = 256;
        const dctx = diskCanvas.getContext('2d')!;
        const grad = dctx.createRadialGradient(128, 128, 25, 128, 128, 128);
        grad.addColorStop(0, '#ffffff'); // Inner ISCO white-hot
        grad.addColorStop(0.2, '#ffaa00'); // Blazing yellow-gold
        grad.addColorStop(0.65, '#ff4500'); // Fiery orange-red
        grad.addColorStop(1, 'rgba(180, 0, 0, 0)'); // Outer dark edge
        dctx.fillStyle = grad;
        dctx.fillRect(0, 0, 256, 256);
        const diskTex = new THREE.CanvasTexture(diskCanvas);

        const diskMat = new THREE.MeshBasicMaterial({
            map: diskTex,
            transparent: true,
            opacity: 0.92,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        const accretionDisk = new THREE.Mesh(diskGeom, diskMat);
        accretionDisk.rotation.x = Math.PI / 3;
        blackHoleGroup.add(accretionDisk);
        this.blackHoleDisk = accretionDisk;

        // Relativistic Polar Jets
        const jetGeom = new THREE.CylinderGeometry( 0.004, 0.035, 0.7, 16 );
        const jetMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending
        });
        const jet1 = new THREE.Mesh(jetGeom, jetMat);
        jet1.position.y = 0.35;
        blackHoleGroup.add(jet1);
        const jet2 = new THREE.Mesh(jetGeom, jetMat);
        jet2.position.y = -0.35;
        blackHoleGroup.add(jet2);

        const blackHole = addPlanetLocal({
            semimajor_axis: 42.0,
            eccentricity: 0.12,
            inclination: 25.0 * rad_per_deg,
            ascending_node: 180.0 * rad_per_deg,
            argument_of_perihelion: 45.0 * rad_per_deg
        },
        {
            name: "Gargantua (Black Hole)",
            parent: this.sun,
            color: "#ff5500",
            texture: perlinUrl,
            radius: 80000,
            GM: 1.327e12 / AU / AU / AU,
            rotationPeriod: 0.1 * hour,
            sphereOfInfluence: 1e8,
        });
        blackHole.model.add(blackHoleGroup);

        // =========================================================================
        // 9. EXTRASOLAR STAR SYSTEMS & DEEP SPACE PHENOMENA (4K Chân Thực Vũ Trụ)
        // =========================================================================

        // 9.1 Alpha Centauri Triple Star System & Habitable Proxima b
        const alphaCentauri = addPlanetLocal({
            semimajor_axis: 55.0,
            eccentricity: 0.05,
            inclination: 12.0 * rad_per_deg,
            ascending_node: 30.0 * rad_per_deg,
            argument_of_perihelion: 60.0 * rad_per_deg
        },
        {
            name: "Alpha Centauri (System)",
            parent: this.sun,
            color: "#ffd700",
            radius: 80000,
            GM: 2.5e11 / AU / AU / AU,
            sphereOfInfluence: 1e7
        });
        const acVisuals = createAlphaCentauriVisuals();
        alphaCentauri.model.add(acVisuals);
        this.alphaCentauriGroup = acVisuals;

        // 9.2 TRAPPIST-1 Ultra-cool Red Dwarf & 7 Earth-Sized Exoplanets
        const trappist1 = addPlanetLocal({
            semimajor_axis: 75.0,
            eccentricity: 0.04,
            inclination: -18.0 * rad_per_deg,
            ascending_node: 90.0 * rad_per_deg,
            argument_of_perihelion: 120.0 * rad_per_deg
        },
        {
            name: "TRAPPIST-1 (Exoplanetary System)",
            parent: this.sun,
            color: "#ef4444",
            radius: 65000,
            GM: 1.8e11 / AU / AU / AU,
            sphereOfInfluence: 1e7
        });
        const t1Visuals = createTrappist1Visuals();
        trappist1.model.add(t1Visuals);
        this.trappistGroup = t1Visuals;

        // 9.3 Sirius A & Sirius B (The Pup White Dwarf Binary)
        const sirius = addPlanetLocal({
            semimajor_axis: 95.0,
            eccentricity: 0.08,
            inclination: 28.0 * rad_per_deg,
            ascending_node: 140.0 * rad_per_deg,
            argument_of_perihelion: 200.0 * rad_per_deg
        },
        {
            name: "Sirius A & B (Binary Star)",
            parent: this.sun,
            color: "#38bdf8",
            radius: 95000,
            GM: 3.5e11 / AU / AU / AU,
            sphereOfInfluence: 1e7
        });
        const siriusVisuals = createSiriusVisuals();
        sirius.model.add(siriusVisuals);
        this.siriusGroup = siriusVisuals;

        // 9.4 Betelgeuse (Alpha Orionis Pulsating Red Supergiant)
        const betelgeuse = addPlanetLocal({
            semimajor_axis: 120.0,
            eccentricity: 0.1,
            inclination: 35.0 * rad_per_deg,
            ascending_node: 210.0 * rad_per_deg,
            argument_of_perihelion: 80.0 * rad_per_deg
        },
        {
            name: "Betelgeuse (Red Supergiant)",
            parent: this.sun,
            color: "#dc2626",
            radius: 350000,
            GM: 1.5e12 / AU / AU / AU,
            sphereOfInfluence: 1e8
        });
        const betelgeuseVisuals = createBetelgeuseVisuals();
        betelgeuse.model.add(betelgeuseVisuals);
        this.betelgeuseGroup = betelgeuseVisuals;

        // 9.5 Sagittarius A* Supermassive Black Hole (Milky Way Core)
        const sgrA = addPlanetLocal({
            semimajor_axis: 150.0,
            eccentricity: 0.15,
            inclination: 45.0 * rad_per_deg,
            ascending_node: 270.0 * rad_per_deg,
            argument_of_perihelion: 310.0 * rad_per_deg
        },
        {
            name: "Sagittarius A* (Milky Way Black Hole)",
            parent: this.sun,
            color: "#00f0ff",
            radius: 500000,
            GM: 5.0e13 / AU / AU / AU,
            sphereOfInfluence: 1e9
        });
        const sgrVisuals = createSagittariusAVisuals();
        sgrA.model.add(sgrVisuals);
        this.sgrGroup = sgrVisuals;

        // 9.6 Pillars of Creation (Eagle Nebula - M16 Stellar Nursery)
        const pillars = addPlanetLocal({
            semimajor_axis: 180.0,
            eccentricity: 0.06,
            inclination: -22.0 * rad_per_deg,
            ascending_node: 45.0 * rad_per_deg,
            argument_of_perihelion: 160.0 * rad_per_deg
        },
        {
            name: "Pillars of Creation (M16)",
            parent: this.sun,
            color: "#10b981",
            radius: 400000,
            GM: 1.0e12 / AU / AU / AU,
            sphereOfInfluence: 1e8
        });
        const pillarsVisuals = createPillarsOfCreationVisuals();
        pillars.model.add(pillarsVisuals);
        this.pillarsGroup = pillarsVisuals;

        // 9.7 Crab Nebula Pulsar (M1 Supernova Remnant & Synchrotron Wind)
        const crabPulsar = addPlanetLocal({
            semimajor_axis: 210.0,
            eccentricity: 0.07,
            inclination: 15.0 * rad_per_deg,
            ascending_node: 330.0 * rad_per_deg,
            argument_of_perihelion: 40.0 * rad_per_deg
        },
        {
            name: "Crab Nebula Pulsar (M1)",
            parent: this.sun,
            color: "#38bdf8",
            radius: 200000,
            GM: 1.0e12 / AU / AU / AU,
            sphereOfInfluence: 1e8
        });
        const crabVisuals = createCrabPulsarVisuals();
        crabPulsar.model.add(crabVisuals);
        this.crabPulsarGroup = crabVisuals;

        // =========================================================================
        // 9. METEOR SHOWER STREAKS POOL (Thiên thạch xé toạc bầu trời)
        // =========================================================================
        this.meteorStreaks = [];
        const meteorMat = new THREE.LineBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        for (let i = 0; i < 4; i++) {
            const lineGeom = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0.06, 0.03, 0.015)
            ]);
            const line = new THREE.Line(lineGeom, meteorMat.clone());
            line.visible = false;
            scene.add(line);
            this.meteorStreaks.push({
                line,
                velocity: new THREE.Vector3(),
                life: 0,
                maxLife: 60
            });
        }

    }

    addRocket(name: string, orbitalElements: OrbitalElements, parent: CelestialBody, graphicsParams: GraphicsParams, settings: Settings){
        const rocket = addPlanet(orbitalElements,
        {
            name,
            parent,
            color: "#3f7f7f",
            GM: 100 / AU / AU / AU,
            radius: 0.1,
            controllable: true
        },
        graphicsParams, this.orbitGeometry, settings);
        rocket.quaternion.multiply(AxisAngleQuaternion(1, 0, 0, Math.PI / 2)).multiply(AxisAngleQuaternion(0, 1, 0, Math.PI / 2));

        return rocket;
    }

    update(center_select: boolean, viewScale: number, settings: Settings,
        camera: THREE.Camera, windowHalfX: number, windowHalfY: number,
        updateOrbitalElements: (o: CelestialBody, headingApoapsis: number) => void,
        scene: THREE.Scene, select_obj?: CelestialBody)
    {
        this.sun.update(center_select, viewScale, settings, camera, windowHalfX, windowHalfY,
            updateOrbitalElements,
            scene,
            select_obj);

        // offset sun position
        this.light.position.copy(this.sun.model.position);

        // 1. Photorealistic Sun Shader & Erupting Prominences Update
        if (this.sunVisuals) {
            this.sunVisuals.update(0.016, camera);
        }

        // 2. Real-time Photorealistic Earth & Moon Day/Night Lighting Update
        if (this.earthMaterial && this.earthBody) {
            const sunPos = this.sun.getWorldPosition();
            const earthPos = this.earthBody.getWorldPosition();
            const sunDir = sunPos.clone().sub(earthPos).normalize();
            this.earthMaterial.uniforms.sunDirection.value.copy(sunDir);
            this.earthMaterial.uniforms.cameraWorldPos.value.copy(camera.position);
            this.earthMaterial.uniforms.cloudOffset.value += 0.00008;
        }

        if (this.moonMaterial && this.moonBody) {
            const sunPos = this.sun.getWorldPosition();
            const moonPos = this.moonBody.getWorldPosition();
            const sunDir = sunPos.clone().sub(moonPos).normalize();
            this.moonMaterial.uniforms.sunDirection.value.copy(sunDir);
            this.moonMaterial.uniforms.cameraWorldPos.value.copy(camera.position);
        }

        // 3. Black Hole Accretion Disk Rotation
        if (this.blackHoleDisk) {
            this.blackHoleDisk.rotation.z += 0.035;
        }

        // 4. Extrasolar Systems & Deep Cosmos Dynamic Visuals Update
        if (this.sgrGroup) {
            this.sgrGroup.rotation.y += 0.012;
        }
        if (this.crabPulsarGroup) {
            this.crabPulsarGroup.rotation.y += 0.06;
        }
        if (this.betelgeuseGroup) {
            this.betelgeuseGroup.rotation.y += 0.002;
        }
        if (this.trappistGroup) {
            this.trappistGroup.rotation.y += 0.001;
        }
        if (this.alphaCentauriGroup) {
            this.alphaCentauriGroup.rotation.y += 0.0015;
        }
        if (this.siriusGroup) {
            this.siriusGroup.rotation.y += 0.0025;
        }

        // 4. Comet Tail Orientation (Always pointing directly anti-sunward!)
        if (this.cometTail && this.cometBody) {
            const sunWorld = this.sun.getWorldPosition();
            const cometWorld = this.cometBody.getWorldPosition();
            const antiSunDir = cometWorld.clone().sub(sunWorld).normalize();
            const distToSun = cometWorld.distanceTo(sunWorld);
            const tailScale = Math.max(0.3, Math.min(2.8, 3.8 / (distToSun + 0.5)));
            this.cometTail.scale.set(tailScale, tailScale, tailScale * 1.6);
            this.cometTail.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), antiSunDir);
        }

        // 5. Meteor Streaks Simulation
        this.updateMeteors();
    }

    updateMeteors() {
        for (const m of this.meteorStreaks) {
            if (m.life > 0) {
                m.life--;
                m.line.position.add(m.velocity);
                const mat = m.line.material as THREE.LineBasicMaterial;
                mat.opacity = (m.life / m.maxLife) * 0.9;
                if (m.life <= 0) {
                    m.line.visible = false;
                }
            } else if (Math.random() < 0.015) {
                m.life = Math.floor(Math.random() * 25 + 25);
                m.maxLife = m.life;
                const ang = Math.random() * Math.PI * 2;
                const r = 0.8 + Math.random() * 0.7;
                m.line.position.set(r * Math.cos(ang), r * Math.sin(ang), (Math.random() - 0.5) * 0.2);
                m.velocity.set(
                    (Math.random() - 0.5) * 0.008,
                    (Math.random() - 0.5) * 0.008,
                    (Math.random() - 0.5) * 0.004
                );
                const mat = m.line.material as THREE.LineBasicMaterial;
                mat.opacity = 0.9;
                m.line.visible = true;
            }
        }
    }

    simulateBody(deltaTime: number, div: number, timescale: number, buttons: RotationButtons, select_obj?: CelestialBody){
        this.sun.simulateBody(deltaTime, div, timescale, buttons, select_obj);
    }
}
