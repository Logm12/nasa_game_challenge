/**
 * SolarSystemExplorer.ts
 * Interactive Solar System Orrery & Astronomical Planet Inspector
 * Features 3D cinematic framing, orbital navigation, and comprehensive NASA scientific dossiers.
 * Fully localized in 100% American English (USA).
 */

import * as THREE from 'three/src/Three';
import { onLangChange, formatTpl } from './i18n';
import { getOrreryTexts } from './i18n-catalog';
import { CelestialBody, AU, AxisAngleQuaternion } from './CelestialBody';
import { Settings } from './SettingsControl';
import { CELESTIAL_QUIZ_DATA, getTravelCost, LANDABLE_BODIES_M2 } from './nasa_mission_quiz_data';

export interface PlanetDossier {
  id: string;
  name: string;
  subtitle: string;
  type: 'star' | 'planet' | 'moon' | 'asteroid' | 'comet' | 'blackhole' | 'nebula' | 'pulsar';
  icon: string;
  color: string;
  diameterKm: string;
  massKg: string;
  surfaceTemp: string;
  orbitPeriod: string;
  rotationPeriod: string;
  gravity: string;
  atmosphere: string;
  description: string;
  highlights: string[];
}

export const SOLAR_DOSSIERS: Record<string, PlanetDossier> = {
  sun: {
    id: 'sun',
    name: 'The Sun (Sol)',
    subtitle: 'G-Type Main-Sequence Star (Yellow Dwarf) • System Core',
    type: 'star',
    icon: '☀️',
    color: '#ffaa00',
    diameterKm: '1,392,700 km (109× Earth)',
    massKg: '1.989 × 10³⁰ kg (99.86% of Solar System)',
    surfaceTemp: '5,500°C (Photosphere) / 15,000,000°C (Core)',
    orbitPeriod: '230 Million Years (Galactic Center Orbit)',
    rotationPeriod: '25 – 35 Days (Differential Rotation)',
    gravity: '274 m/s² (28.0g)',
    atmosphere: 'Hydrogen (73.46%), Helium (24.85%), Oxygen, Carbon',
    description: 'G-type main-sequence star at the center of the Solar System. Powered by thermonuclear fusion converting 600 million tons of hydrogen into helium every second. Emits dynamic Coronal Mass Ejections (CMEs), high-energy solar prominences, and relativistic solar wind into interplanetary space.',
    highlights: [
      'Superheated boiling photosphere with convection granules and magnetic sunspots',
      'Giant magnetic prominence plasma loops erupting thousands of kilometers into space',
      'Primary thermonuclear engine driving planetary orbits and heliospheric protection'
    ]
  },
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    subtitle: 'Terrestrial Planet • Extreme Solar Proximity',
    type: 'planet',
    icon: '☿',
    color: '#a0a0a0',
    diameterKm: '4,879 km (0.38× Earth)',
    massKg: '3.30 × 10²³ kg (0.055× Earth)',
    surfaceTemp: '-180°C (Night) to 430°C (Day)',
    orbitPeriod: '87.97 Earth Days',
    rotationPeriod: '58.65 Earth Days (3:2 Spin-Orbit Resonance)',
    gravity: '3.70 m/s² (0.38g)',
    atmosphere: 'Ultra-thin Exosphere (Oxygen, Sodium, Hydrogen, Helium)',
    description: 'The smallest planet in the Solar System and closest to the Sun. Heavily cratered surface resembling the Moon with record temperature swings exceeding 600°C between solar noon and midnight.',
    highlights: [
      'Massive metallic iron core occupying 75% of planetary radius',
      'Anomalous perihelion precession verified Einstein\'s General Relativity'
    ]
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    subtitle: 'Terrestrial Planet • Runaway Supercritical Greenhouse',
    type: 'planet',
    icon: '♀',
    color: '#e6c280',
    diameterKm: '12,104 km (0.95× Earth)',
    massKg: '4.87 × 10²⁴ kg (0.815× Earth)',
    surfaceTemp: '465°C (Hottest Planet in Solar System)',
    orbitPeriod: '224.7 Earth Days',
    rotationPeriod: '243 Earth Days (Retrograde Spin)',
    gravity: '8.87 m/s² (0.90g)',
    atmosphere: 'Carbon Dioxide (96.5%), Nitrogen (3.5%), Sulfuric Acid H₂SO₄ Clouds',
    description: 'Earth\'s sister planet shrouded in opaque, reflective sulfuric acid clouds. Endures catastrophic runaway greenhouse effect with crushing surface pressure equal to 900 meters deep in Earth\'s ocean.',
    highlights: [
      'One Venusian day is longer than a Venusian year',
      'Retrograde rotation spins clockwise opposite to nearly all other planets'
    ]
  },
  earth: {
    id: 'earth',
    name: 'Earth (Terra)',
    subtitle: 'Terrestrial Planet • Planetary Cradle of Life',
    type: 'planet',
    icon: '🌍',
    color: '#00b4d8',
    diameterKm: '12,742 km',
    massKg: '5.972 × 10²⁴ kg',
    surfaceTemp: '-89°C to 58°C (Mean: 15°C)',
    orbitPeriod: '365.25 Days (1.000 AU = 149.6 Million km)',
    rotationPeriod: '23 Hours 56 Minutes 4 Seconds',
    gravity: '9.807 m/s² (1.00g)',
    atmosphere: 'Nitrogen (78%), Oxygen (21%), Argon (0.9%), CO₂ (0.04%)',
    description: 'The only known haven of organic life in the universe. Features 71% liquid water oceans, a dynamic magnetosphere deflecting solar radiation, and NASA Blue Marble continental topology.',
    highlights: [
      'NASA Blue Marble 4K global topological landmass and oceanic bathymetry',
      'Cyan Rayleigh atmospheric scattering with dynamic circulating cloud deck',
      'Artemis spaceflight launch baseline for Moon and Mars exploration'
    ]
  },
  moon: {
    id: 'moon',
    name: 'The Moon (Luna)',
    subtitle: 'Natural Satellite • Tidally Locked Companion',
    type: 'moon',
    icon: '🌙',
    color: '#d1d5db',
    diameterKm: '3,474 km (0.27× Earth)',
    massKg: '7.34 × 10²² kg (0.012× Earth)',
    surfaceTemp: '-130°C (Night) to 120°C (Day)',
    orbitPeriod: '27.3 Earth Days',
    rotationPeriod: '27.3 Earth Days (Synchronous Tidal Lock)',
    gravity: '1.62 m/s² (0.166g — 1/6th Earth Gravity)',
    atmosphere: 'Hard Vacuum (< 10⁻¹⁰ Pa)',
    description: 'Earth\'s sole natural satellite. Sculpted by billions of years of impacts creating stark cratered highlands (Copernicus, Tycho), dark basaltic volcanic maria (Sea of Tranquillity), and rugged regolith.',
    highlights: [
      'High-relief crater rims, central peaks, and basaltic impact basins',
      'Synchronous tidal locking keeping its near-side permanently facing Earth',
      'Historic landing site of Apollo 11 and target of NASA Artemis lunar base'
    ]
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    subtitle: 'The Red Planet • Desert Frontier',
    type: 'planet',
    icon: '♂',
    color: '#e76f51',
    diameterKm: '6,779 km (0.53× Earth)',
    massKg: '6.42 × 10²³ kg (0.107× Earth)',
    surfaceTemp: '-140°C to 20°C (Mean: -63°C)',
    orbitPeriod: '687 Earth Days (1.88 Earth Years)',
    rotationPeriod: '24 Hours 37 Minutes (1 Sol)',
    gravity: '3.72 m/s² (0.38g)',
    atmosphere: 'Carbon Dioxide (95.3%), Nitrogen (2.6%), Argon (1.9%)',
    description: 'The iconic Red Planet tinted by pervasive iron oxide dust. Boasts the Solar System\'s tallest shield volcano (Olympus Mons, 22 km high) and the gargantuan canyon system Valles Marineris (4,000 km long).',
    highlights: [
      'Host to irregular captured asteroidal moons Phobos and Deimos',
      'Ancient river deltas, dry lake beds, and perennial water-ice polar caps'
    ]
  },
  asteroid_belt: {
    id: 'asteroid_belt',
    name: 'Main Asteroid Belt',
    subtitle: 'Circumstellar Torus • Protoplanetary Debris Field',
    type: 'asteroid',
    icon: '☄️',
    color: '#f59e0b',
    diameterKm: 'Annular Belt 2.2 AU to 3.2 AU (150 Million km width)',
    massKg: 'Approx. 2.4 × 10²¹ kg (4% of Earth\'s Moon)',
    surfaceTemp: '-73°C to -108°C',
    orbitPeriod: '3 to 6 Earth Years',
    rotationPeriod: 'Varies from hours to days',
    gravity: 'Microgravity (< 0.05 m/s²)',
    atmosphere: 'None',
    description: 'Vast toroidal ring between Mars and Jupiter populated by millions of primordial rocky and metallic remnants from the solar nebula 4.6 billion years ago, prevented from accreting into a planet by Jupiter\'s gravity.',
    highlights: [
      'Over 1,200 simulated asteroids and dwarf planet Ceres orbiting Sol',
      'Primary source of near-Earth meteorites and primitive carbonaceous chondrites',
      'Rich in volatile water ice, nickel-iron, and platinum-group minerals'
    ]
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    subtitle: 'Gas Giant • King of the Solar System',
    type: 'planet',
    icon: '♃',
    color: '#d4a373',
    diameterKm: '139,820 km (11× Earth)',
    massKg: '1.898 × 10²⁷ kg (318× Earth, 2.5× all other planets combined)',
    surfaceTemp: '-110°C (Cloud Tops) / 24,000°C (Core)',
    orbitPeriod: '11.86 Earth Years',
    rotationPeriod: '9 Hours 55 Minutes (Fastest rotation in Solar System)',
    gravity: '24.79 m/s² (2.53g)',
    atmosphere: 'Hydrogen (90%), Helium (10%), Methane, Ammonia',
    description: 'The largest planet in the Solar System. Governed by chaotic atmospheric zonal bands, the centuries-old Great Red Spot anticyclonic storm, and a colossal magnetosphere shielding the inner system.',
    highlights: [
      '95 confirmed moons including Galilean worlds Io, Europa, Ganymede, and Callisto',
      'Gravitational shield deflecting comets and deep space debris away from Earth'
    ]
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    subtitle: 'Gas Giant • The Jewel of the System',
    type: 'planet',
    icon: '♄',
    color: '#e9d8a6',
    diameterKm: '116,460 km (9.1× Earth)',
    massKg: '5.68 × 10²⁶ kg (95× Earth)',
    surfaceTemp: '-140°C',
    orbitPeriod: '29.45 Earth Years',
    rotationPeriod: '10 Hours 33 Minutes',
    gravity: '10.44 m/s² (1.06g)',
    atmosphere: 'Hydrogen (96%), Helium (3%), Methane',
    description: 'Renowned for its breathtaking system of planetary rings composed of billions of 99% pure water-ice particles spanning 280,000 km while averaging merely 10 meters in thickness. Less dense than liquid water.',
    highlights: [
      'Spectacular reflective icy ring system with Cassini Division gap',
      'Ocean moon Enceladus erupting cryovolcanic plumes and smog-rich moon Titan'
    ]
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    subtitle: 'Ice Giant • Tilted World',
    type: 'planet',
    icon: '⛢',
    color: '#48cae4',
    diameterKm: '50,724 km (4.0× Earth)',
    massKg: '8.68 × 10²⁵ kg (14.5× Earth)',
    surfaceTemp: '-224°C (Coldest Planetary Atmosphere)',
    orbitPeriod: '84.0 Earth Years',
    rotationPeriod: '17 Hours 14 Minutes (Retrograde & Tilted 97.77°)',
    gravity: '8.69 m/s² (0.89g)',
    atmosphere: 'Hydrogen (83%), Helium (15%), Methane (2.3% blue absorption)',
    description: 'An ice giant rolling sideways on its orbital plane with an extreme axial tilt of 97.8°, likely caused by an ancient protoplanetary collision. Features the coldest atmospheric temperatures in the Solar System.',
    highlights: [
      'Unique sideways rotation axis producing 42-year long seasonal extremes',
      'Faint dark ring system and 27 named moons orbiting equatorial plane'
    ]
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    subtitle: 'Ice Giant • The Windswept Abyss',
    type: 'planet',
    icon: '♆',
    color: '#0077b6',
    diameterKm: '49,244 km (3.86× Earth)',
    massKg: '1.02 × 10²⁶ kg (17.1× Earth)',
    surfaceTemp: '-214°C',
    orbitPeriod: '164.8 Earth Years',
    rotationPeriod: '16 Hours 6 Minutes',
    gravity: '11.15 m/s² (1.14g)',
    atmosphere: 'Hydrogen (80%), Helium (19%), Methane (1.5%)',
    description: 'The outermost major planet in the Solar System. Characterized by deep azure coloration, transient Earth-sized dark storms, and the most ferocious supersonic winds recorded in the planetary system exceeding 2,100 km/h.',
    highlights: [
      'Supersonic retrograde jet streams and Great Dark Spot storms',
      'Massive retrograde moon Triton featuring active nitrogen geysers'
    ]
  },
  halley: {
    id: 'halley',
    name: 'Periodic Comet 1P/Halley',
    subtitle: 'Primitive Icy Body • Highly Eccentric Wanderer',
    type: 'comet',
    icon: '☄️',
    color: '#90e0ef',
    diameterKm: '11 km × 8 km Nucleus',
    massKg: '2.2 × 10¹⁴ kg',
    surfaceTemp: '-200°C (Aphelion) to 80°C (Perihelion)',
    orbitPeriod: '75.3 Years (Eccentricity e = 0.967)',
    rotationPeriod: '52.8 Hours',
    gravity: 'Microgravity (~ 0.001 m/s²)',
    atmosphere: 'Sublimating Water, Carbon Monoxide, Dust Coma',
    description: 'Pristine primordial iceberg traveling from beyond Neptune to inside Venus\'s orbit. As it nears Sol, solar radiation sublimates volatile ice into a glowing coma and dual million-kilometer ion and dust tails pointing anti-sunward.',
    highlights: [
      'Dynamic anti-sunward sublimating ion/dust tail driven by solar photon pressure',
      'Source of the Orionid and Eta Aquariid annual meteor showers on Earth'
    ]
  },
  blackhole: {
    id: 'blackhole',
    name: 'Gargantua Singularity',
    subtitle: 'Supermassive Black Hole • Extreme General Relativity',
    type: 'blackhole',
    icon: '🕳️',
    color: '#ff4d00',
    diameterKm: 'Schwarzschild Radius: 150,000 km (Event Horizon)',
    massKg: '100 Million Solar Masses (Supermassive)',
    surfaceTemp: 'Absolute 0K at Horizon / Millions of Kelvin in Accretion Disk',
    orbitPeriod: 'Deep Space Singularity',
    rotationPeriod: 'Near-Extremal Kerr Rotation (a* = 0.998)',
    gravity: 'Infinite at Singularity (Infinite Spacetime Curvature)',
    atmosphere: 'Relativistic Plasma Accretion Disk & Dual Polar Jets',
    description: 'A supermassive rotating Kerr black hole with spacetime curvature so extreme that not even light can escape the event horizon. Surrounded by a blinding relativistic plasma accretion disk exhibiting Doppler boosting and dual collimated magnetic polar jets.',
    highlights: [
      'Pitch black event horizon surrounded by gravitational lensing photon sphere',
      'Relativistic swirling accretion disk with Doppler blue/redshift asymmetry',
      'Dual collimated synchrotron polar jets projecting light-years into the cosmos'
    ]
  },
  phas: {
    id: 'phas',
    name: 'NASA Potentially Hazardous Asteroids (PHAs)',
    subtitle: 'Planetary Defense Priority • Earth-Crosser Fleet',
    type: 'asteroid',
    icon: '⚠️',
    color: '#ef4444',
    diameterKm: '370 m (Apophis) to 16.8 km (Eros)',
    massKg: '10¹⁰ kg to 10¹⁵ kg',
    surfaceTemp: '-70°C to 25°C',
    orbitPeriod: '0.88 to 2.10 Years',
    rotationPeriod: '2.1 to 30.5 Hours',
    gravity: '< 0.01 m/s²',
    atmosphere: 'None',
    description: 'Asteroids with orbits bringing them within 0.05 AU (7.5 million km) of Earth. Monitored continuously by NASA Planetary Defense Coordination Office and simulated using mission-viz WSMV orbital mechanics.',
    highlights: [
      '99942 Apophis scheduled for ultra-close Earth flyby in 2029',
      '101955 Bennu successfully sampled by NASA OSIRIS-REx spacecraft',
      '65803 Didymos kinetic impactor target of NASA DART mission'
    ]
  },
  rocket: {
    id: 'rocket',
    name: 'Orbital Spacecraft / Quinjet Mk-VII',
    subtitle: 'Interplanetary Exploration Ship • NASA & Artemis Equipped',
    type: 'star',
    icon: '🚀',
    color: '#00f0ff',
    diameterKm: 'Length: 24 m / Wingspan: 18 m',
    massKg: '1,620 kg (Dry) + 2,400 kg (Quantum Fuel)',
    surfaceTemp: 'Vibranium Heat Shielding & Thermal Barrier',
    orbitPeriod: 'Determined by Active Keplerian Trajectory',
    rotationPeriod: 'Full 3-Axis RCS Inertial Attitude Control',
    gravity: 'Internal Higgs-Field Inertial Dampening',
    atmosphere: 'Pressurized 1.0 atm (Life Support Active)',
    description: 'Next-generation interplanetary exploration spacecraft equipped with official 4K NASA insignia, selectable national livery, Arc Reactor core, high-efficiency warp propulsion, and NASA WSMV Keplerian HUD.',
    highlights: [
      'Customizable 4K National Flag and NASA mission insignias on hull and wings',
      'Real-time Keplerian avionics telemetry, PHA proximity radar, and 3-axis flight control'
    ]
  },
  alpha_centauri: {
    id: 'alpha_centauri',
    name: 'Alpha Centauri System & Proxima b',
    subtitle: 'Nearest Star System • 4.37 Light-Years from Earth',
    type: 'star',
    icon: '🌟',
    color: '#ffd700',
    diameterKm: 'Rigil Kentaurus (1.7M km) + Toliman (1.2M km) + Proxima (200k km)',
    massKg: 'Combined Mass ~2.18 Solar Masses (4.34 × 10³⁰ kg)',
    surfaceTemp: 'Rigil: 5,790 K (G2V) • Toliman: 5,260 K (K1V) • Proxima: 3,042 K',
    orbitPeriod: 'Binary Orbit 79.91 Earth Years',
    rotationPeriod: 'A: 22 Days • B: 41 Days • Proxima: 82.6 Days',
    gravity: 'Proxima b Surface Gravity: 10.7 m/s² (1.09g)',
    atmosphere: 'Proxima b: Nitrogen, Water Vapor, CO₂ (Candidate Biosphere)',
    description: 'Triple star system containing Rigil Kentaurus (G2V), Toliman (K1V), and the red dwarf flare star Proxima Centauri. Proxima Centauri hosts Proxima b, an Earth-mass terrestrial exoplanet orbiting within the circumstellar habitable zone at 0.0485 AU.',
    highlights: [
      'Target of the Breakthrough Starshot interstellar relativistic laser-sail fleet',
      'Proxima b receives liquid water stellar irradiance comparable to Earth',
      'Closest extrasolar star system to humankind in the Milky Way galaxy'
    ]
  },
  trappist1: {
    id: 'trappist1',
    name: 'TRAPPIST-1 Exoplanetary System',
    subtitle: 'Ultra-Cool Red Dwarf with 7 Earth-Sized Worlds • 39.5 Light-Years',
    type: 'star',
    icon: '🔴',
    color: '#ef4444',
    diameterKm: '167,000 km (0.12× Solar Diameter, slightly larger than Jupiter)',
    massKg: '1.79 × 10²⁹ kg (0.0898 Solar Masses)',
    surfaceTemp: '2,566 K (Ultra-cool M8V dwarf star)',
    orbitPeriod: 'Exoplanets orbit between 1.51 to 18.76 Earth Days',
    rotationPeriod: '3.3 Earth Days (Active Red Dwarf Flare Dynamo)',
    gravity: 'TRAPPIST-1e Surface Gravity: 9.12 m/s² (0.93g)',
    atmosphere: 'TRAPPIST-1e: Water Ocean World Atmosphere, High Atmospheric Retention',
    description: 'Remarkable M-dwarf star system hosting seven terrestrial Earth-sized rocky exoplanets in resonant orbital chains. Three planets (1e, 1f, 1g) reside inside the circumstellar habitable zone, with TRAPPIST-1e confirmed as a prime candidate for extraterrestrial liquid water oceans.',
    highlights: [
      'Highest density of Earth-sized habitable-zone planets ever detected',
      'Planets in harmonic orbital resonance forming an intricate orbital clockwork',
      'TRAPPIST-1 will burn stable hydrogen for over 12 trillion years'
    ]
  },
  sirius: {
    id: 'sirius',
    name: 'Sirius A & Sirius B (The Pup)',
    subtitle: 'Binary Star • Brightest Star in Earth\'s Night Sky • 8.6 Light-Years',
    type: 'star',
    icon: '✨',
    color: '#38bdf8',
    diameterKm: 'Sirius A: 2.38M km (1.71× Sol) • Sirius B: 11,600 km (Earth Size)',
    massKg: 'Sirius A: 2.06 Solar Masses • Sirius B: 1.02 Solar Masses',
    surfaceTemp: 'Sirius A: 9,940 K (A1V) • Sirius B: 25,200 K (Hot White Dwarf)',
    orbitPeriod: 'Binary Period 50.1 Earth Years',
    rotationPeriod: 'Sirius A: 5.5 Days',
    gravity: 'Sirius B Surface Gravity: 3.5 × 10⁶ m/s² (350,000g)',
    atmosphere: 'Sirius B: Pure Hydrogen Atmosphere under Relativistic Gravity',
    description: 'Luminous A-type main sequence star Sirius A paired with Sirius B ("The Pup"), the first discovered white dwarf star in astronomical history. Sirius B packs the entire mass of our Sun into an ultra-dense degenerate electron core smaller than the Earth.',
    highlights: [
      'Sirius A shines with 25.4× the visual luminosity of our Sun',
      'Sirius B gravity causes measurable gravitational redshift predicted by Einstein',
      'Ultra-dense degenerate electron gas in Sirius B core reaches 2.4 tons per cubic cm'
    ]
  },
  betelgeuse: {
    id: 'betelgeuse',
    name: 'Betelgeuse (Alpha Orionis)',
    subtitle: 'Pulsating Red Supergiant • Supernova Precursor • 548 Light-Years',
    type: 'star',
    icon: '💥',
    color: '#dc2626',
    diameterKm: '1.06 Billion km (764× Sol, would engulf Jupiter\'s orbit)',
    massKg: '3.3 × 10³¹ kg (16.5 Solar Masses)',
    surfaceTemp: '3,500 K (Pulsating Convective Photosphere)',
    orbitPeriod: 'Circumstellar Dust Envelopes expanding at 17 km/s',
    rotationPeriod: '~36 Earth Years (Slow Equatorial Rotation)',
    gravity: '0.005 m/s² (Extremely Low Gravitational Surface Binding)',
    atmosphere: 'Vast Circumstellar Gas Shells, Titanium Oxide, Carbon, Silicate Dust',
    description: 'Gigantic pulsating red supergiant star in the constellation of Orion. Nearing the end of its stellar nuclear lifespan and scheduled to detonate as a blinding Type II Core-Collapse Supernova that will shine brighter than the full Moon in Earth\'s sky.',
    highlights: [
      'Great Dimming event in 2019-2020 caused by colossal convective surface dust ejection',
      'Enormous boiling convective cells thousands of times larger than our Sun',
      'Core currently fusing heavier elements toward eventual iron core collapse'
    ]
  },
  sagittarius_a: {
    id: 'sagittarius_a',
    name: 'Sagittarius A* (Sgr A*)',
    subtitle: 'Milky Way Supermassive Galactic Core Singularity • 26,673 Light-Years',
    type: 'blackhole',
    icon: '🕳️',
    color: '#00f0ff',
    diameterKm: 'Schwarzschild Diameter: 51.8 Million km (0.35 AU)',
    massKg: '8.26 × 10³⁶ kg (4.15 Million Solar Masses)',
    surfaceTemp: 'Inner Accretion Disk: 10,000,000 K (X-Ray Blazing Plasma)',
    orbitPeriod: 'Inner Stable Circular Orbit (ISCO): ~30 Minutes',
    rotationPeriod: 'Kerr Black Hole Spin Parameter a* ≈ 0.9 (Near Maximum Spin)',
    gravity: 'Infinite Curvature Singularity (Spacetime Geodesic Disruption)',
    atmosphere: 'Relativistic Magnetized Plasma Accretion Flow & Relativistic Jets',
    description: 'The central gravitational anchor of the Milky Way galaxy. Imaged directly by the Event Horizon Telescope (EHT), Sagittarius A* features a spinning Kerr event horizon, blinding relativistic Doppler-boosted accretion disk, and collimated synchrotron plasma jets.',
    highlights: [
      'Directly imaged by the international Event Horizon Telescope collaboration',
      'Relativistic frame-dragging pulls space itself into rotation around the horizon',
      'Stars in the central S-cluster (like S2) orbit at velocities exceeding 7,000 km/s'
    ]
  },
  pillars_of_creation: {
    id: 'pillars_of_creation',
    name: 'Pillars of Creation (M16 Eagle Nebula)',
    subtitle: 'Interstellar Stellar Nursery • 6,500 Light-Years in Serpens',
    type: 'nebula',
    icon: '🌌',
    color: '#10b981',
    diameterKm: 'Columns span 4 to 5 Light-Years (37.8 Trillion km)',
    massKg: '~200 Solar Masses of Molecular Gas & Dust',
    surfaceTemp: '-260°C (Cold Molecular Hydrogen Interior)',
    orbitPeriod: 'Galactic Orbit in Scutum-Centaurus Spiral Arm',
    rotationPeriod: 'Internal Turbulent Shear & Photoevaporation Winds',
    gravity: 'Self-Gravitating Protostellar Cores (EGGs)',
    atmosphere: 'Molecular Hydrogen (H₂), Ionized Oxygen (O-III), Sulfur (S-II)',
    description: 'Iconic towering columns of cold interstellar hydrogen gas and dust sculpted by the intense ultraviolet radiation and stellar winds of young, massive O and B type stars in the Eagle Nebula. Inside the finger-like projections, new stars and planetary systems are actively condensing.',
    highlights: [
      'Famous multi-wavelength observations by Hubble and James Webb Space Telescope',
      'Evaporating Gaseous Globules (EGGs) emerging from the eroded dust pillars',
      'Continuous battle between gravitational collapse forming stars and photoevaporation'
    ]
  },
  crab_pulsar: {
    id: 'crab_pulsar',
    name: 'Crab Nebula Pulsar (PSR B0531+21)',
    subtitle: 'Magnetized Relativistic Neutron Star • 6,500 Light-Years',
    type: 'pulsar',
    icon: '⚡',
    color: '#38bdf8',
    diameterKm: '20 km (Manhattan Island Size)',
    massKg: '2.8 × 10³⁰ kg (1.4 Solar Masses compressed into 20 km)',
    surfaceTemp: '1,600,000 K (Young Hot Neutron Star Surface)',
    orbitPeriod: 'Supernova Remnant expanding at 1,500 km/s',
    rotationPeriod: '33.5 Milliseconds (Rotates 30.2 times every second!)',
    gravity: '1.0 × 10¹² m/s² (100 Billion times Earth gravity)',
    atmosphere: 'Magnetosphere Magnetic Field: 3.8 × 10⁸ Tesla (3.8 Trillion Gauss)',
    description: 'Ultra-dense spinning neutron star left behind by the historic Supernova 1054 recorded by Chinese and Arab astronomers in 1054 AD. Spins 30 times a second, powering the glowing synchrotron Crab Nebula with an enormous relativistic particle wind.',
    highlights: [
      'Emits pulsed electromagnetic radiation from radio, optical, X-ray, to gamma rays',
      'Magnetic field generates electric fields strong enough to rip particles from the surface',
      'Rotational energy loss rate of 4.5 × 10³¹ Watts powers the entire Crab Nebula'
    ]
  }
};

export class SolarSystemExplorer {
  private dockElement: HTMLElement | null = null;
  private modalElement: HTMLElement | null = null;
  private isDockCollapsed = false;
  private currentTargetBody: CelestialBody | null = null;
  private currentDossier: PlanetDossier | null = null;
  private missionDesigner: any = null;

  public setMissionDesigner(designer: any) {
    this.missionDesigner = designer;
  }

  constructor(
    private getSelectObj: () => CelestialBody | null,
    private setSelectObj: (body: CelestialBody) => void,
    private getCamera: () => THREE.PerspectiveCamera,
    private getCameraControls: () => any,
    private getViewScale: () => number,
    private getSettings: () => Settings,
    private sendMessage: (msg: string) => void
  ) {
    this.createDOMElements();
  }

  private createDOMElements() {
    // 1. Floating Top Celestial Explorer Dock
    const dock = document.createElement('div');
    dock.id = 'solar-system-dock';
    dock.className = 'solar-dock';
    dock.innerHTML = `
      <div class="solar-dock-inner">
        <div class="solar-dock-brand" id="solar-dock-toggle" title="Toggle Cosmic Orrery Dock">
          <span class="dock-pulse"></span>
          <span class="dock-icon">🪐</span>
          <span class="dock-title">COSMIC ORRERY</span>
          <span class="dock-chevron" id="dock-chevron-arrow">▾</span>
        </div>

        <div class="solar-dock-category-tabs" id="solar-dock-category-tabs">
          <button class="dock-cat-btn active" data-cat="solar">☀️ SOLAR SYSTEM</button>
          <button class="dock-cat-btn" data-cat="extrasolar">🌌 EXTRASOLAR STARS</button>
          <button class="dock-cat-btn" data-cat="deep_cosmos">🌀 DEEP COSMOS</button>
        </div>

        <button class="track-scroll-arrow left" id="track-scroll-left" title="Scroll Left">‹</button>
        <div class="solar-planets-track" id="solar-planets-track">
          <!-- Solar System Targets -->
          <div class="planet-cat-group active" data-cat-group="solar">
            <button class="planet-btn" data-target="sun" title="The Sun (Sol Core Star)">
              <span class="p-icon">☀️</span><span class="p-name">The Sun</span>
            </button>
            <button class="planet-btn" data-target="mercury" title="Mercury">
              <span class="p-icon">☿</span><span class="p-name">Mercury</span>
            </button>
            <button class="planet-btn" data-target="venus" title="Venus">
              <span class="p-icon">♀</span><span class="p-name">Venus</span>
            </button>
            <button class="planet-btn active" data-target="earth" title="Earth (Terra)">
              <span class="p-icon">🌍</span><span class="p-name">Earth</span>
            </button>
            <button class="planet-btn" data-target="moon" title="The Moon (Luna)">
              <span class="p-icon">🌙</span><span class="p-name">Moon</span>
            </button>
            <button class="planet-btn" data-target="mars" title="Mars (The Red Planet)">
              <span class="p-icon">♂</span><span class="p-name">Mars</span>
            </button>
            <button class="planet-btn" data-target="asteroid_belt" title="Main Asteroid Belt">
              <span class="p-icon">☄️</span><span class="p-name">Asteroids</span>
            </button>
            <button class="planet-btn" data-target="jupiter" title="Jupiter">
              <span class="p-icon">♃</span><span class="p-name">Jupiter</span>
            </button>
            <button class="planet-btn" data-target="saturn" title="Saturn & Rings">
              <span class="p-icon">♄</span><span class="p-name">Saturn</span>
            </button>
            <button class="planet-btn" data-target="uranus" title="Uranus">
              <span class="p-icon">⛢</span><span class="p-name">Uranus</span>
            </button>
            <button class="planet-btn" data-target="neptune" title="Neptune">
              <span class="p-icon">♆</span><span class="p-name">Neptune</span>
            </button>
            <button class="planet-btn" data-target="halley" title="Periodic Comet 1P/Halley">
              <span class="p-icon">☄️</span><span class="p-name">Halley</span>
            </button>
            <button class="planet-btn" data-target="phas" title="NASA Potentially Hazardous Asteroids">
              <span class="p-icon">⚠️</span><span class="p-name" style="color: #ef4444;">NASA PHAs</span>
            </button>
            <button class="planet-btn ship-btn" data-target="rocket" title="Active Spacecraft">
              <span class="p-icon">🚀</span><span class="p-name">Spacecraft</span>
            </button>
          </div>

          <!-- Extrasolar Star Systems Targets -->
          <div class="planet-cat-group" data-cat-group="extrasolar" style="display: none;">
            <button class="planet-btn" data-target="alpha_centauri" title="Alpha Centauri System & Habitable Proxima b">
              <span class="p-icon">🌟</span><span class="p-name" style="color: #ffd700;">Alpha Centauri</span>
            </button>
            <button class="planet-btn" data-target="trappist1" title="TRAPPIST-1 Red Dwarf & 7 Earth-Sized Exoplanets">
              <span class="p-icon">🔴</span><span class="p-name" style="color: #ef4444;">TRAPPIST-1</span>
            </button>
            <button class="planet-btn" data-target="sirius" title="Sirius A & White Dwarf Sirius B (The Pup)">
              <span class="p-icon">✨</span><span class="p-name" style="color: #38bdf8;">Sirius A & B</span>
            </button>
            <button class="planet-btn" data-target="betelgeuse" title="Betelgeuse (Alpha Orionis Pulsating Red Supergiant)">
              <span class="p-icon">💥</span><span class="p-name" style="color: #dc2626;">Betelgeuse</span>
            </button>
          </div>

          <!-- Deep Cosmos Phenomena Targets -->
          <div class="planet-cat-group" data-cat-group="deep_cosmos" style="display: none;">
            <button class="planet-btn" data-target="sagittarius_a" title="Sagittarius A* Milky Way Supermassive Black Hole">
              <span class="p-icon">🕳️</span><span class="p-name" style="color: #00f0ff;">Sagittarius A*</span>
            </button>
            <button class="planet-btn" data-target="pillars_of_creation" title="Pillars of Creation (M16 Eagle Nebula)">
              <span class="p-icon">🌌</span><span class="p-name" style="color: #10b981;">Pillars (M16)</span>
            </button>
            <button class="planet-btn" data-target="crab_pulsar" title="Crab Nebula Pulsar (M1 Relativistic Neutron Star)">
              <span class="p-icon">⚡</span><span class="p-name" style="color: #38bdf8;">Crab Pulsar</span>
            </button>
            <button class="planet-btn" data-target="blackhole" title="Gargantua Singularity">
              <span class="p-icon">🕳️</span><span class="p-name" style="color: #ff5500;">Gargantua</span>
            </button>
          </div>
        </div>
        <button class="track-scroll-arrow right" id="track-scroll-right" title="Scroll Right">›</button>
      </div>
    `;
    document.body.appendChild(dock);
    this.dockElement = dock;

    // 2. Cosmic Observation Dossier Modal
    const modal = document.createElement('div');
    modal.id = 'cosmic-dossier-modal';
    modal.className = 'cosmic-dossier-modal';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="dossier-card">
        <div class="dossier-header">
          <div class="dossier-title-wrap">
            <span class="dossier-avatar" id="dossier-icon">🌍</span>
            <div>
              <div class="dossier-name-vi" id="dossier-name" style="font-family: var(--font-tech); font-size: 1.45rem; color: #fff; font-weight: 700; letter-spacing: 1px;">Earth (Terra)</div>
              <div class="dossier-name-en" id="dossier-subtitle" style="font-size: 0.85rem; color: var(--stark-cyan); margin-top: 2px;">Terrestrial Planet • Planetary Cradle of Life</div>
            </div>
          </div>
          <button class="dossier-close-btn" id="dossier-btn-close">✕</button>
        </div>

        <p class="dossier-desc" id="dossier-description"></p>

        <div class="dossier-grid" id="dossier-specs-grid">
          <!-- Populated dynamically -->
        </div>

        <div class="dossier-highlights">
          <div class="dossier-section-title">✨ ASTRONOMICAL HIGHLIGHTS & OBSERVATIONS:</div>
          <ul id="dossier-highlights-list" class="dossier-ul"></ul>
        </div>

        <div class="dossier-actions">
          <button class="dossier-act-btn primary" id="dossier-btn-focus">
            🔭 CLOSE-UP 3D OBSERVATION
          </button>
          <button class="dossier-act-btn secondary" id="dossier-btn-teleport">
            🚀 ESTABLISH ORBIT HERE
          </button>
          <button class="dossier-act-btn secondary" id="dossier-btn-recon" style="display: none; background: linear-gradient(135deg, rgba(14, 165, 233, 0.4), rgba(6, 182, 212, 0.3)); border-color: #00f0ff; color: #fff;">
            📸 2D RECON & QUIZ
          </button>
          <button class="dossier-act-btn secondary" id="dossier-btn-land" style="display: none; background: linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(234, 88, 12, 0.3)); border-color: #f59e0b; color: #fff;">
            🛬 LAND & SAMPLE
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    this.modalElement = modal;

    this.bindEvents();
    this.applyLanguage();
    onLangChange(() => this.applyLanguage());
  }

  private bindEvents() {
    // Dock collapse / expand
    const btnToggle = document.getElementById('solar-dock-toggle');
    const track = document.getElementById('solar-planets-track');
    const tabs = document.getElementById('solar-dock-category-tabs');
    const btnLeft = document.getElementById('track-scroll-left');
    const btnRight = document.getElementById('track-scroll-right');
    const arrow = document.getElementById('dock-chevron-arrow');

    btnToggle?.addEventListener('click', () => {
      this.isDockCollapsed = !this.isDockCollapsed;
      const displayVal = this.isDockCollapsed ? 'none' : 'flex';
      if (track) track.style.display = displayVal;
      if (tabs) tabs.style.display = displayVal;
      if (btnLeft) btnLeft.style.display = displayVal;
      if (btnRight) btnRight.style.display = displayVal;
      if (arrow) arrow.textContent = this.isDockCollapsed ? '▴' : '▾';
    });

    // Smooth horizontal scrolling via buttons & mouse wheel
    btnLeft?.addEventListener('click', () => {
      if (track) track.scrollBy({ left: -220, behavior: 'smooth' });
    });
    btnRight?.addEventListener('click', () => {
      if (track) track.scrollBy({ left: 220, behavior: 'smooth' });
    });
    track?.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        track.scrollLeft += e.deltaY * 0.9;
        e.preventDefault();
      }
    }, { passive: false });

    // Cosmic Orrery Category Switcher Tabs
    const catBtns = document.querySelectorAll('.dock-cat-btn');
    const catGroups = document.querySelectorAll('.planet-cat-group');
    catBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = (btn as HTMLElement).getAttribute('data-cat');
        catBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        catGroups.forEach((g) => {
          if ((g as HTMLElement).getAttribute('data-cat-group') === cat) {
            (g as HTMLElement).style.display = 'flex';
          } else {
            (g as HTMLElement).style.display = 'none';
          }
        });
      });
    });

    // Planet / Celestial Target Buttons
    const buttons = document.querySelectorAll('.planet-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = (btn as HTMLElement).getAttribute('data-target');
        if (!targetId) return;

        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        this.focusOnCelestialObject(targetId);
      });
    });

    // Close Dossier Modal
    document.getElementById('dossier-btn-close')?.addEventListener('click', () => {
      if (this.modalElement) this.modalElement.style.display = 'none';
    });

    // Focus 3D button inside Dossier
    document.getElementById('dossier-btn-focus')?.addEventListener('click', () => {
      if (this.modalElement) this.modalElement.style.display = 'none';
    });

    // Teleport / Establish Orbit button inside Dossier
    document.getElementById('dossier-btn-teleport')?.addEventListener('click', () => {
      this.establishOrbitAtCurrentTarget();
    });

    // 2D Recon & Quiz button inside Dossier
    document.getElementById('dossier-btn-recon')?.addEventListener('click', () => {
      if (this.modalElement) this.modalElement.style.display = 'none';
      if (this.missionDesigner && this.currentDossier) {
        this.missionDesigner.openReconPhotoModal(this.currentDossier.id);
      }
    });

    // Surface Landing & Sampling button inside Dossier
    document.getElementById('dossier-btn-land')?.addEventListener('click', () => {
      if (this.modalElement) this.modalElement.style.display = 'none';
      if (this.missionDesigner && this.currentDossier) {
        this.missionDesigner.openSurfaceLandingModal(this.currentDossier.id);
      }
    });

    // Close on background click
    this.modalElement?.addEventListener('click', (e) => {
      if (e.target === this.modalElement) {
        this.modalElement.style.display = 'none';
      }
    });
  }

  public focusOnCelestialObject(targetId: string) {
    const dossier = SOLAR_DOSSIERS[targetId];
    if (dossier) {
      this.showDossier(dossier);
    }

    // Resolve celestial body in universe
    let targetBodyName = targetId;
    if (targetId === 'earth') targetBodyName = 'earth';
    else if (targetId === 'sun') targetBodyName = 'sun';
    else if (targetId === 'moon') targetBodyName = 'moon';
    else if (targetId === 'mercury') targetBodyName = 'mercury';
    else if (targetId === 'venus') targetBodyName = 'venus';
    else if (targetId === 'mars') targetBodyName = 'mars';
    else if (targetId === 'jupiter') targetBodyName = 'jupiter';
    else if (targetId === 'saturn') targetBodyName = 'saturn';
    else if (targetId === 'uranus') targetBodyName = 'uranus';
    else if (targetId === 'neptune') targetBodyName = 'neptune';
    else if (targetId === 'blackhole') targetBodyName = 'Gargantua (Black Hole)';
    else if (targetId === 'halley') targetBodyName = '1P/Halley (Comet)';
    else if (targetId === 'phas') targetBodyName = '99942 Apophis';
    else if (targetId === 'asteroid_belt') targetBodyName = 'Ceres (Asteroid)';
    else if (targetId === 'rocket') targetBodyName = 'rocket';
    else if (targetId === 'alpha_centauri') targetBodyName = 'Alpha Centauri (System)';
    else if (targetId === 'trappist1') targetBodyName = 'TRAPPIST-1 (Exoplanetary System)';
    else if (targetId === 'sirius') targetBodyName = 'Sirius A & B (Binary Star)';
    else if (targetId === 'betelgeuse') targetBodyName = 'Betelgeuse (Red Supergiant)';
    else if (targetId === 'sagittarius_a') targetBodyName = 'Sagittarius A* (Milky Way Black Hole)';
    else if (targetId === 'pillars_of_creation') targetBodyName = 'Pillars of Creation (M16)';
    else if (targetId === 'crab_pulsar') targetBodyName = 'Crab Nebula Pulsar (M1)';

    let body = CelestialBody.findBody(targetBodyName);
    if (!body && targetId === 'blackhole') {
      body = CelestialBody.findBody('Gargantua') || CelestialBody.findBody('blackhole');
    }
    if (!body && targetId === 'halley') {
      body = CelestialBody.findBody('halley') || CelestialBody.findBody('Comet Halley');
    }
    if (!body && targetId === 'phas') {
      body = CelestialBody.findBody('99942 Apophis') || CelestialBody.findBody('101955 Bennu');
    }
    if (!body && targetId === 'asteroid_belt') {
      body = CelestialBody.findBody('Ceres') || CelestialBody.findBody('433 Eros');
    }

    if (body) {
      this.currentTargetBody = body;
      this.setSelectObj(body);
      const settings = this.getSettings();
      settings.center_select = true;

      // Smoothly zoom camera to optimal close-up observation distance
      const camera = this.getCamera();
      const cameraControls = this.getCameraControls();
      const viewScale = this.getViewScale();

      const radius = body.radius || 6000;
      let targetDist = Math.max(0.0001, (viewScale * radius) / AU * 3.8);
      if (body.name === 'sun') targetDist = Math.max(0.05, (viewScale * radius) / AU * 2.8);
      if (targetId === 'blackhole' || targetId === 'sagittarius_a') targetDist = 0.08;
      if (targetId === 'alpha_centauri' || targetId === 'trappist1' || targetId === 'sirius') targetDist = 0.06;
      if (targetId === 'betelgeuse') targetDist = 0.12;
      if (targetId === 'pillars_of_creation') targetDist = 0.09;
      if (targetId === 'crab_pulsar') targetDist = 0.05;

      camera.position.set(0, targetDist * 0.35, targetDist);
      if (cameraControls && cameraControls.target) {
        cameraControls.target.set(0, 0, 0);
        cameraControls.update();
      }

      this.sendMessage(formatTpl(getOrreryTexts().focusMessage, { name: dossier ? dossier.name : body.name }));
    }
  }

  private applyLanguage() {
    const ot = getOrreryTexts();
    const brand = document.getElementById('solar-dock-toggle');
    if (brand) brand.title = ot.toggleTitle;
    const dockTitle = document.querySelector('#solar-system-dock .dock-title');
    if (dockTitle) dockTitle.textContent = ot.title;
    const tabSolar = document.querySelector('.dock-cat-btn[data-cat="solar"]');
    if (tabSolar) tabSolar.textContent = ot.tabSolar;
    const tabExtra = document.querySelector('.dock-cat-btn[data-cat="extrasolar"]');
    if (tabExtra) tabExtra.textContent = ot.tabExtrasolar;
    const tabDeep = document.querySelector('.dock-cat-btn[data-cat="deep_cosmos"]');
    if (tabDeep) tabDeep.textContent = ot.tabDeepCosmos;

    document.querySelectorAll('#solar-system-dock .planet-btn').forEach((btn) => {
      const target = btn.getAttribute('data-target');
      if (!target || !ot.targets[target]) return;
      const info = ot.targets[target];
      (btn as HTMLElement).title = info.title;
      const nameEl = btn.querySelector('.p-name');
      if (nameEl) nameEl.textContent = info.label;
    });

    const hlTitle = document.querySelector('#cosmic-dossier-modal .dossier-section-title');
    if (hlTitle) hlTitle.textContent = ot.highlightsTitle;
    const btnFocus = document.getElementById('dossier-btn-focus');
    if (btnFocus) btnFocus.textContent = ot.btnFocus;
    const btnTeleport = document.getElementById('dossier-btn-teleport');
    if (btnTeleport) btnTeleport.textContent = ot.btnTeleport;
    const btnClose = document.getElementById('dossier-btn-close');
    if (btnClose) btnClose.setAttribute('aria-label', ot.closeAria);

    if (this.currentDossier && this.modalElement && this.modalElement.style.display !== 'none') {
      this.showDossier(this.currentDossier);
    }
  }

  private showDossier(dossier: PlanetDossier) {
    if (!this.modalElement) return;
    this.currentDossier = dossier;
    const ot = getOrreryTexts();

    const iconEl = document.getElementById('dossier-icon');
    const nameEl = document.getElementById('dossier-name');
    const subEl = document.getElementById('dossier-subtitle');
    const descEl = document.getElementById('dossier-description');

    if (iconEl) iconEl.textContent = dossier.icon;
    if (nameEl) nameEl.textContent = dossier.name;
    if (subEl) subEl.textContent = dossier.subtitle;
    if (descEl) descEl.textContent = dossier.description;

    const specsGrid = document.getElementById('dossier-specs-grid');
    if (specsGrid) {
      specsGrid.innerHTML = `
        <div class="dossier-metric">
          <span class="m-label">${ot.metricDiameter}</span>
          <strong class="m-val">${dossier.diameterKm}</strong>
        </div>
        <div class="dossier-metric">
          <span class="m-label">${ot.metricMass}</span>
          <strong class="m-val">${dossier.massKg}</strong>
        </div>
        <div class="dossier-metric">
          <span class="m-label">${ot.metricTemp}</span>
          <strong class="m-val" style="color: ${dossier.color};">${dossier.surfaceTemp}</strong>
        </div>
        <div class="dossier-metric">
          <span class="m-label">${ot.metricGravity}</span>
          <strong class="m-val">${dossier.gravity}</strong>
        </div>
        <div class="dossier-metric">
          <span class="m-label">${ot.metricRotation}</span>
          <strong class="m-val">${dossier.rotationPeriod}</strong>
        </div>
        <div class="dossier-metric">
          <span class="m-label">${ot.metricOrbit}</span>
          <strong class="m-val">${dossier.orbitPeriod}</strong>
        </div>
        <div class="dossier-metric full-col">
          <span class="m-label">${ot.metricAtmosphere}</span>
          <strong class="m-val" style="font-size: 0.8rem; font-weight: normal; color: #cbd5e1;">${dossier.atmosphere}</strong>
        </div>
      `;
    }

    const hlList = document.getElementById('dossier-highlights-list');
    if (hlList) {
      hlList.innerHTML = dossier.highlights.map((h) => `<li>${h}</li>`).join('');
    }

    // Dynamic Mission Actions & Travel Costs
    const btnRecon = document.getElementById('dossier-btn-recon');
    const btnLand = document.getElementById('dossier-btn-land');
    const btnTeleport = document.getElementById('dossier-btn-teleport');

    if (this.missionDesigner && this.missionDesigner.isMissionActive) {
      const missionId = this.missionDesigner.selectedMission?.id;
      const travelCost = getTravelCost(missionId, dossier.id);
      
      if (missionId === 'mission_1_survey') {
        const quizData = CELESTIAL_QUIZ_DATA[dossier.id];
        if (quizData && descEl) {
          const isVi = this.missionDesigner.getCurrentLanguage() === 'vi';
          descEl.textContent = isVi ? quizData.descVi : quizData.descEn;
        }
        if (btnTeleport) {
          btnTeleport.textContent = `🚀 ESTABLISH ORBIT ($${travelCost}M)`;
        }
        if (btnRecon) {
          btnRecon.style.display = 'inline-block';
        }
        if (btnLand) {
          btnLand.style.display = 'none';
        }
      } else if (missionId === 'mission_2_samples') {
        const isLandable = LANDABLE_BODIES_M2.includes(dossier.id);
        if (btnTeleport) {
          btnTeleport.textContent = isLandable ? `🚀 ESTABLISH ORBIT ($${travelCost}M)` : `🚀 ORBIT ONLY ($${travelCost}M)`;
        }
        if (btnRecon) {
          btnRecon.style.display = 'none';
        }
        if (btnLand) {
          btnLand.style.display = isLandable ? 'inline-block' : 'none';
        }
      } else {
        if (btnTeleport) btnTeleport.textContent = ot.btnTeleport;
        if (btnRecon) btnRecon.style.display = 'none';
        if (btnLand) btnLand.style.display = 'none';
      }
    } else {
      if (btnTeleport) btnTeleport.textContent = ot.btnTeleport;
      if (btnRecon) btnRecon.style.display = 'none';
      if (btnLand) btnLand.style.display = 'none';
    }

    this.modalElement.style.display = 'flex';
  }

  /**
   * Thiết lập Quỹ đạo Dịch chuyển Tức thời (Warp / Instant Orbital Insertion)
   * Đưa tàu vũ trụ của người chơi vào quỹ đạo tròn Keplerian ổn định quanh thiên thể đang chọn
   */
  private establishOrbitAtCurrentTarget() {
    if (!this.currentTargetBody) return;
    const target = this.currentTargetBody;

    if (this.missionDesigner && this.missionDesigner.isMissionActive) {
      const allowed = this.missionDesigner.handlePlanetaryTravel(target.name);
      if (!allowed) {
        return;
      }
    }

    // Tìm phi thuyền điều khiển được của người chơi
    let rocket = CelestialBody.findBody('rocket');
    if (!rocket) {
      const cur = this.getSelectObj();
      if (cur && cur.controllable) {
        rocket = cur;
      }
    }

    if (!rocket) {
      this.sendMessage('⚠️ Không tìm thấy phi thuyền đang hoạt động trong mô phỏng!');
      return;
    }

    // Đóng modal hồ sơ thiên văn
    if (this.modalElement) this.modalElement.style.display = 'none';

    // Tính toán bán kính quỹ đạo an toàn dựa theo kích thước thiên thể
    const targetRadiusKm = target.radius || 6000;
    let altitudeKm = targetRadiusKm * 0.5;
    if (target.name === 'sun') altitudeKm = 40000000; // 0.27 AU vành an toàn
    else if (targetRadiusKm < 50) altitudeKm = 80; // Tiểu hành tinh nhỏ
    else if (targetRadiusKm > 50000) altitudeKm = 35000; // Các hành tinh khí khổng lồ

    const semimajor_axis = (targetRadiusKm + altitudeKm) / AU;
    const rotation = new THREE.Quaternion(); // Quỹ đạo xích đạo

    rocket.setParent(target);
    rocket.position = new THREE.Vector3(0, semimajor_axis, 0);
    rocket.quaternion = rotation.clone();
    rocket.quaternion.multiply(AxisAngleQuaternion(1, 0, 0, -Math.PI / 2));
    rocket.angularVelocity = new THREE.Vector3(0, 0, 0);
    rocket.throttle = 0;
    if (rocket.blastModel) rocket.blastModel.visible = false;
    rocket.setOrbitingVelocity(semimajor_axis, rotation);
    rocket.totalDeltaV = 0;
    rocket.ignitionCount = 0;

    // Chọn phi thuyền làm đối tượng điều khiển chính
    this.setSelectObj(rocket);

    // Canh chỉnh camera lại gần phi thuyền ở quỹ đạo mới
    const camera = this.getCamera();
    const cameraControls = this.getCameraControls();
    const viewScale = this.getViewScale();
    const shipViewDist = Math.max(0.00005, (viewScale * 25) / AU * 5.0);
    camera.position.set(0, shipViewDist * 0.4, shipViewDist);
    if (cameraControls && cameraControls.target) {
      cameraControls.target.set(0, 0, 0);
      cameraControls.update();
    }

    this.sendMessage(`🚀 Đã thiết lập quỹ đạo thành công! Tàu vũ trụ đang quay quanh ${target.name} (Độ cao: ${Math.round(altitudeKm).toLocaleString()} km, Vận tốc quỹ đạo tròn ổn định).`);
  }
}
