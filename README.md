<div align="center">

# 🚀 NASA WebGL-Orbiter & Deep Space Mission Simulator
### Photorealistic 4K Keplerian Astrodynamics, N-Body Numerical Engine & Aerospace Flight Simulator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![WebGL 2.0 / Three.js](https://img.shields.io/badge/Render%20Engine-Three.js%20r120+-00f0ff.svg?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![NASA WSMV Compatible](https://img.shields.io/badge/Data%20Source-NASA%20JPL%20%26%20WSMV-e11d48.svg?style=for-the-badge&logo=nasa)](https://github.com/nasa/mission-viz)
[![4K Ultra-HD Visuals](https://img.shields.io/badge/Graphics-4K%20UHD%20Photorealistic-10b981.svg?style=for-the-badge)](https://github.com/Logm12/nasa_game_challenge)
[![Physics: RK4 & Kepler](https://img.shields.io/badge/Astrodynamics-RK4%20%2B%20Keplerian-8b5cf6.svg?style=for-the-badge)](https://en.wikipedia.org/wiki/Orbital_mechanics)
[![Netlify Deploy](https://img.shields.io/badge/Deploy-Netlify%20Automated-00c7b7.svg?style=for-the-badge&logo=netlify)](https://www.netlify.com/)

[**Live Interactive Simulation**](https://msakuta.github.io/WebGL-Orbiter/index.html) • [**GitHub Repository**](https://github.com/Logm12/nasa_game_challenge) • [**NASA Mission-Viz**](https://github.com/nasa/mission-viz)

---

</div>

## 🌌 Overview & Mission Scope

**NASA WebGL-Orbiter** is an advanced aerospace flight simulator and astrodynamics laboratory running directly in the browser. Powered by **Three.js** and high-precision **Newtonian N-body gravitational mechanics**, it simulates the Solar System in true physical scale ($1\text{ AU} = 149,597,870.7\text{ km}$), rendering high-resolution **4K planetary bodies**, authentic atmospheric Rayleigh scattering, real-time Keplerian orbital elements, and official **NASA mission trajectories** (Apollo 11, Artemis, DART, OSIRIS-REx, Voyager, New Horizons).

Whether conducting orbital insertion around Jupiter, intercepting hazardous near-Earth asteroids, or executing manual reaction-control docking maneuvers with active **SAS Gyroscopic Autopilot**, WebGL-Orbiter bridges theoretical spaceflight physics with AAA interactive aerospace engineering.

---

## 📑 Table of Contents

1. [Key Features & Capabilities](#-key-features--capabilities)
2. [Astrodynamics & Mathematical Formulations](#-astrodynamics--mathematical-formulations)
   - [2.1 Newtonian Universal Gravitation & N-Body Perturbations](#21-newtonian-universal-gravitation--n-body-perturbations)
   - [2.2 Runge-Kutta 4th Order (RK4) Numerical Integration](#22-runge-kutta-4th-order-rk4-numerical-integration)
   - [2.3 Vis-Viva Equation & Orbital Velocities](#23-vis-viva-equation--orbital-velocities)
   - [2.4 State Vectors to Keplerian Orbital Elements](#24-state-vectors-to-keplerian-orbital-elements)
   - [2.5 Hohmann Transfer & Orbital Insertion](#25-hohmann-transfer--orbital-insertion)
   - [2.6 Gyroscopic Stability Assist (SAS) & Reaction Wheels](#26-gyroscopic-stability-assist-sas--reaction-wheels)
   - [2.7 Spherical Galactic Coordinate Mapping for 4K Deep Space](#27-spherical-galactic-coordinate-mapping-for-4k-deep-space)
3. [NASA Scientific Datasets & Planetary Models](#-nasa-scientific-datasets--planetary-models)
   - [3.1 NASA JPL Horizons Planetary Parameters](#31-nasa-jpl-horizons-planetary-parameters)
   - [3.2 NASA CNEOS Potentially Hazardous Asteroids (PHAs)](#32-nasa-cneos-potentially-hazardous-asteroids-phas)
   - [3.3 Official NASA Mission Profiles](#33-official-nasa-mission-profiles)
4. [Unified Aerospace Flight Deck & Controls](#-unified-aerospace-flight-deck--controls)
5. [Architecture & Project Structure](#-architecture--project-structure)
6. [Building & Running Locally](#-building--running-locally)
7. [License & Acknowledgments](#-license--acknowledgments)

---

## 🌟 Key Features & Capabilities

* **Authentic 4K Photorealistic Celestial Sphere**:
  - Custom $4096 \times 2048$ deep-space background synthesized from the Harvard Spectral Classification catalog ($65,000+$ stars with B-V color temperatures: O/B, A, F, G, K, M).
  - Inclined Milky Way galactic plane with dense Sagittarius core and intricate dark dust absorption rifts (Great Rift, Coalsack).
  - Deep-sky astronomical landmarks: Andromeda Galaxy (M31), Large and Small Magellanic Clouds (LMC/SMC), and stellar nurseries.
* **Unified Aerospace Flight Deck**:
  - Interactive plasma thrust slider with instant $100\%$ `[Z]`, $50\%$, and `CUT [X]` engine presets.
  - High-visibility 3D Navball with live orbital velocity telemetry ($\text{m/s}$ or $\text{km/s}$).
  - 6-DOF RCS tactile attitude controls (`Pitch`, `Yaw`, `Roll`) synchronized with physical keyboard inputs (`W/A/S/D/Q/E`).
  - Comprehensive **SAS Autopilot**: `STAB LOCK` (gyro active damping), `PROGRADE` ($V^+$ boost), `RETROGRADE` ($V^-$ brake), and `MANUAL`.
* **NASA Mission Designer & Custom Fleet Hangar**:
  - Official NASA exploration fleet: Space Shuttle Discovery (OV-103), Apollo 11 Lunar Module (Eagle), Voyager 1, Constellation-X, and Ares I.
  - Custom sci-fi flagships: Quinjet Mk-VII Stealth Interceptor, The Milano, The Benatar, Sanctuary Flagship, Hyperion Dreadnought, and Ghostwing.
  - Tailored national livery decals, NASA meatball/worm insignias, and modular tech payloads.
* **Instant Warp Orbital Insertion (`🚀 ESTABLISH ORBIT HERE`)**:
  - Instantly teleports spacecraft into a stable, circular Keplerian orbit around any target celestial body ($v = \sqrt{GM/r}$).
* **Full Ecliptic Cosmic Orrery Dock**:
  - Clean top-dock navigation bar featuring Solar System planets, moons, hazardous asteroids, extrasolar stars (Alpha Centauri, TRAPPIST-1, Sirius, Betelgeuse), and deep cosmos singularities (Gargantua, Sagittarius A*, Crab Pulsar).

---

## 📐 Astrodynamics & Mathematical Formulations

WebGL-Orbiter implements rigorous Newtonian physics, classical Keplerian mechanics, and orbital perturbation equations:

```
                      Z (Zenith / Normal)
                      ^
                      |     . - ~ ~ - .      Orbit Trajectory
                      |   /             \
                      |  /       r       \
                      | /                 \
                      |/                   \
                      O---------------------> Y (Velocity / Prograde)
                     / \                   /
                    /   \                 /
                   /     \               /
                  v        . - ~ ~ - .
                 X (Radial / Outward)
```

### 2.1 Newtonian Universal Gravitation & N-Body Perturbations
The acceleration $\mathbf{a}_i$ acting on an astronomical body or spacecraft $i$ with mass $m_i$ exerted by all other gravitating bodies $j$ is governed by Newton's law of universal gravitation:

$$\mathbf{a}_i = \frac{d^2\mathbf{r}_i}{dt^2} = \sum_{j \neq i} G M_j \frac{\mathbf{r}_j - \mathbf{r}_i}{\|\mathbf{r}_j - \mathbf{r}_i\|^3} + \mathbf{a}_{\text{thrust}}$$

Using the standard gravitational parameter $\mu_j = G M_j$:

$$\mathbf{a}_i = \sum_{j \neq i} \mu_j \frac{\mathbf{r}_j - \mathbf{r}_i}{\|\mathbf{r}_j - \mathbf{r}_i\|^3} + \frac{\mathbf{F}_{\text{engine}}}{m_i(t)}$$

For spacecraft propulsion, instantaneous thrust is computed via the Tsiolkovsky rocket equation:

$$\Delta v = v_e \ln \left( \frac{m_0}{m_f} \right) = I_{\text{sp}} g_0 \ln \left( \frac{m_0}{m_f} \right)$$

---

### 2.2 Runge-Kutta 4th Order (RK4) Numerical Integration
To preserve high numerical stability across variable timewarp scales ($1\times$ to $1,000,000\times$), positions and velocities are integrated using the 4th-order Runge-Kutta method:

Given the state vector $\mathbf{y} = [\mathbf{r}, \mathbf{v}]^T$ and $\frac{d\mathbf{y}}{dt} = f(t, \mathbf{y}) = [\mathbf{v}, \mathbf{a}(t, \mathbf{r})]^T$:

$$\mathbf{y}_{n+1} = \mathbf{y}_n + \frac{\Delta t}{6} \left( \mathbf{k}_1 + 2\mathbf{k}_2 + 2\mathbf{k}_3 + \mathbf{k}_4 \right)$$

where:
$$\begin{aligned}
\mathbf{k}_1 &= f(t_n, \mathbf{y}_n) \\
\mathbf{k}_2 &= f\left(t_n + \frac{\Delta t}{2}, \mathbf{y}_n + \frac{\Delta t}{2} \mathbf{k}_1\right) \\
\mathbf{k}_3 &= f\left(t_n + \frac{\Delta t}{2}, \mathbf{y}_n + \frac{\Delta t}{2} \mathbf{k}_2\right) \\
\mathbf{k}_4 &= f\left(t_n + \Delta t, \mathbf{y}_n + \Delta t \mathbf{k}_3\right)
\end{aligned}$$

---

### 2.3 Vis-Viva Equation & Orbital Velocities
For any two-body Keplerian system with mass $M \gg m$, the instantaneous orbital speed $v$ at distance $r$ is:

$$v^2 = \mu \left( \frac{2}{r} - \frac{1}{a} \right)$$

Special cases utilized in simulation:
* **Circular Orbital Velocity** ($r = a$, eccentricity $e = 0$):
  $$v_{\text{circ}} = \sqrt{\frac{\mu}{r}} = \sqrt{\frac{G M}{r}}$$
* **Escape Velocity (Vận tốc vũ trụ cấp 2)** ($a \to \infty$, parabolic trajectory):
  $$v_{\text{esc}} = \sqrt{\frac{2\mu}{r}} = \sqrt{2} \cdot v_{\text{circ}}$$
* **Apoapsis ($r_a$) and Periapsis ($r_p$) Speeds**:
  $$v_p = \sqrt{\frac{\mu}{a} \frac{1 + e}{1 - e}}, \qquad v_a = \sqrt{\frac{\mu}{a} \frac{1 - e}{1 + e}}$$

---

### 2.4 State Vectors to Keplerian Orbital Elements
The live telemetry HUD transforms position $\mathbf{r} = (x, y, z)$ and velocity $\mathbf{v} = (v_x, v_y, v_z)$ into the six classical orbital elements:

1. **Specific Angular Momentum**:
   $$\mathbf{h} = \mathbf{r} \times \mathbf{v}, \qquad h = \|\mathbf{h}\|$$
2. **Node Vector**:
   $$\mathbf{n} = \hat{\mathbf{k}} \times \mathbf{h} = (-h_y, h_x, 0)$$
3. **Eccentricity Vector & Magnitude**:
   $$\mathbf{e} = \frac{1}{\mu} \left[ \left( v^2 - \frac{\mu}{r} \right) \mathbf{r} - (\mathbf{r} \cdot \mathbf{v}) \mathbf{v} \right], \qquad e = \|\mathbf{e}\|$$
4. **Specific Orbital Energy & Semi-Major Axis ($a$)**:
   $$\varepsilon = \frac{v^2}{2} - \frac{\mu}{r}, \qquad a = -\frac{\mu}{2\varepsilon}$$
5. **Inclination ($i$)**:
   $$i = \arccos \left( \frac{h_z}{h} \right)$$
6. **Longitude of the Ascending Node ($\Omega$)**:
   $$\Omega = \begin{cases} \arccos\left(\frac{n_x}{\|\mathbf{n}\|}\right) & n_y \ge 0 \\ 2\pi - \arccos\left(\frac{n_x}{\|\mathbf{n}\|}\right) & n_y < 0 \end{cases}$$
7. **Argument of Periapsis ($\omega$)**:
   $$\omega = \begin{cases} \arccos\left(\frac{\mathbf{n} \cdot \mathbf{e}}{\|\mathbf{n}\| e}\right) & e_z \ge 0 \\ 2\pi - \arccos\left(\frac{\mathbf{n} \cdot \mathbf{e}}{\|\mathbf{n}\| e}\right) & e_z < 0 \end{cases}$$
8. **True Anomaly ($\nu$)**:
   $$\nu = \begin{cases} \arccos\left(\frac{\mathbf{e} \cdot \mathbf{r}}{e r}\right) & \mathbf{r} \cdot \mathbf{v} \ge 0 \\ 2\pi - \arccos\left(\frac{\mathbf{e} \cdot \mathbf{r}}{e r}\right) & \mathbf{r} \cdot \mathbf{v} < 0 \end{cases}$$

---

### 2.5 Hohmann Transfer & Orbital Insertion
Interplanetary travel calculations rely on coplanar Hohmann transfer trajectories:

$$\Delta v_1 = \sqrt{\frac{\mu}{r_1}} \left( \sqrt{\frac{2 r_2}{r_1 + r_2}} - 1 \right)$$
$$\Delta v_2 = \sqrt{\frac{\mu}{r_2}} \left( 1 - \sqrt{\frac{2 r_1}{r_1 + r_2}} \right)$$
$$\Delta v_{\text{total}} = \Delta v_1 + \Delta v_2$$

The one-way transfer duration (half an orbital period of the transfer ellipse):

$$t_{\text{transfer}} = \pi \sqrt{\frac{a_{\text{transfer}}^3}{\mu}} = \pi \sqrt{\frac{(r_1 + r_2)^3}{8\mu}}$$

---

### 2.6 Gyroscopic Stability Assist (SAS) & Reaction Wheels
In microgravity, zero-damping rotation causes persistent tumbling. The SAS autopilot active dampening algorithm models internal reaction wheel torque:

$$\mathbf{\omega}(t + \Delta t) = \mathbf{\omega}(t) \cdot \max\left(0, 1.0 - k_{\text{damp}} \frac{\Delta t}{\text{substeps}}\right)$$

where $k_{\text{damp}} = 16.0\text{ s}^{-1}$.

When `PROGRADE` ($V^+$) or `RETROGRADE` ($V^-$) mode is engaged, the ship dynamically aligns its forward axis $\hat{\mathbf{u}}_{\text{fwd}} = (1, 0, 0)$ with target velocity unit vector $\hat{\mathbf{v}} = \pm \frac{\mathbf{v}}{\|\mathbf{v}\|}$:

$$\mathbf{q}_{\text{align}} = \text{Quaternion.fromUnitVectors}(\hat{\mathbf{u}}_{\text{fwd}}, \hat{\mathbf{v}})$$
$$\mathbf{q}_{\text{ship}}(t + \Delta t) = \text{Slerp}\left(\mathbf{q}_{\text{ship}}(t), \mathbf{q}_{\text{align}}, \alpha \cdot \Delta t\right)$$

---

### 2.7 Spherical Galactic Coordinate Mapping for 4K Deep Space
To render an astronomically correct celestial sphere without polar pinching or seam distortion, coordinates are mapped from Equatorial coordinates $(\alpha, \delta)$ to Galactic coordinates $(l, b)$ using spherical trigonometry:

$$\sin(b) = \sin(\delta) \sin(\delta_G) + \cos(\delta) \cos(\delta_G) \cos(\alpha - \alpha_G)$$
$$\cos(b) \sin(l_0 - l) = \cos(\delta) \sin(\alpha - \alpha_G)$$
$$\cos(b) \cos(l_0 - l) = \sin(\delta) \cos(\delta_G) - \cos(\delta) \sin(\delta_G) \cos(\alpha - \alpha_G)$$

* **Galactic North Pole (J2000)**: $\alpha_G = 192.85948^\circ$, $\delta_G = 27.12825^\circ$.
* **Galactic Zero-Longitude Node**: $l_0 = 32.93192^\circ$.

---

## 🛰️ NASA Scientific Datasets & Planetary Models

### 3.1 NASA JPL Horizons Planetary Parameters
All planetary ephemerides, radii, and gravitational constants are calibrated against official NASA Jet Propulsion Laboratory (JPL) astrodynamic tables:

| Celestial Body | Radius ($R$, km) | Standard Gravitational Parameter ($\mu = GM, \text{km}^3/\text{s}^2$) | Semi-Major Axis ($a$, AU) | Eccentricity ($e$) | Inclination ($i$, deg) | Rotation Period |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **The Sun (Sol)** | $695,800.0$ | $1.32712440018 \times 10^{11}$ | — | — | — | $25.38\text{ days}$ |
| **Mercury** | $2,439.7$ | $2.2032 \times 10^4$ | $0.387098$ | $0.205630$ | $7.005^\circ$ | $58.646\text{ days}$ |
| **Venus** | $6,051.8$ | $3.24859 \times 10^5$ | $0.723332$ | $0.006773$ | $3.394^\circ$ | $-243.025\text{ days}$ |
| **Earth** | $6,371.0$ | $3.986004418 \times 10^5$ | $1.000000$ | $0.016708$ | $0.000^\circ$ | $23\text{h } 56\text{m } 04\text{s}$ |
| **The Moon** | $1,737.4$ | $4.9048695 \times 10^3$ | $0.002570$ | $0.054900$ | $5.145^\circ$ | $27.321\text{ days}$ |
| **Mars** | $3,389.5$ | $4.282837 \times 10^4$ | $1.523679$ | $0.093400$ | $1.850^\circ$ | $24\text{h } 37\text{m } 22\text{s}$ |
| **Jupiter** | $69,911.0$ | $1.26686534 \times 10^8$ | $5.204267$ | $0.048498$ | $1.303^\circ$ | $9\text{h } 55\text{m } 30\text{s}$ |
| **Saturn** | $58,232.0$ | $3.7931187 \times 10^7$ | $9.582600$ | $0.055550$ | $2.485^\circ$ | $10\text{h } 33\text{m } 38\text{s}$ |
| **Uranus** | $25,362.0$ | $5.793939 \times 10^6$ | $19.229411$ | $0.047318$ | $0.772^\circ$ | $-17\text{h } 14\text{m } 24\text{s}$ |
| **Neptune** | $24,622.0$ | $6.836529 \times 10^6$ | $30.068963$ | $0.008606$ | $1.769^\circ$ | $16\text{h } 06\text{m } 36\text{s}$ |

---

### 3.2 NASA CNEOS Potentially Hazardous Asteroids (PHAs)
Integrated with real-time radar proximity telemetry and authentic Keplerian orbital elements:

* **99942 Apophis**: Atokous asteroid with dramatic 2029 Earth close approach ($a = 0.922\text{ AU}, e = 0.191$).
* **101955 Bennu**: Carbonaceous near-Earth asteroid sampled by NASA OSIRIS-REx ($a = 1.126\text{ AU}, e = 0.203$).
* **65803 Didymos & Dimorphos**: Binary system targeted by the NASA DART kinetic deflection test ($a = 1.644\text{ AU}, e = 0.384$).
* **(29075) 1950 DA**: Kilometer-class near-Earth object under optical planetary defense surveillance ($a = 1.699\text{ AU}, e = 0.507$).
* **433 Eros**: S-type Amor asteroid surveyed by NASA NEAR Shoemaker ($a = 1.458\text{ AU}, e = 0.223$).
* **1P/Halley**: Periodic retrograde comet ($a = 17.834\text{ AU}, e = 0.967, i = 162.3^\circ$).

---

### 3.3 Official NASA Mission Profiles
The simulation includes verified flight scenarios accessible via the Scenario Selector and Dossier modals:
* **NASA Artemis I/II**: Earth-Moon Trans-Lunar Injection (TLI) and Free-Return Trajectory.
* **NASA DART Mission**: Kinetic Impactor Intercept Course toward 65803 Didymos.
* **NASA OSIRIS-REx**: Proximity Operations & Sample Retrieval at Asteroid 101955 Bennu.
* **NASA Apollo 11**: Lunar Orbit Insertion (LOI) & Descent Trajectory.
* **NASA Voyager 1**: Solar System Interstellar Escape Hyperbolic Trajectory.
* **NASA New Horizons**: Kuiper Belt Pluto & Arrokoth Flyby.

---

### 3.4 NASA Space Apps Challenge — Space Mission Design Architecture & Trade-Offs

The project strictly complies with the **NASA Space Apps Challenge** mission design rubric, implementing real-time aerospace engineering trade-offs:

#### A. Inverse-Square Solar Energy Falloff ($1/r^2$ Solar Law)
Solar array electrical output decreases quadratically with heliocentric distance $r$ (in AU):

$$P_{\text{solar}}(r) = P_0 \left( \frac{r_0}{r} \right)^2 = \frac{1400\text{ W}}{r^2}$$

* **Earth ($1.0\text{ AU}$)**: $P = 1400\text{ W}$ (UltraFlex arrays operate at peak capacity).
* **Mars ($1.52\text{ AU}$)**: $P \approx 605\text{ W}$ (Moderate degradation, requiring power prioritization).
* **Europa / Jupiter ($5.20\text{ AU}$)**: $P \approx 51.8\text{ W}$ (Critical power starvation; engineering constraint mandates Next-Gen RTG Plutonium-238 nuclear power delivering $800\text{ W}$ continuously).

#### B. Mass vs. Launch Vehicle Lift Capacity Constraints
Spacecraft wet mass $m_{\text{wet}} = m_{\text{dry}} + m_{\text{propellant}} + m_{\text{payload}}$ is rigorously bounded by real launch vehicle payload capacities:

| Launch Vehicle | Max Payload to LEO ($m_{\text{max}}$) | Mission Class Suitability |
| :--- | :---: | :--- |
| **Rocket Lab Electron** | $300\text{ kg}$ | CubeSat / SmallSat (6U/12U) Scout Missions |
| **SpaceX Falcon 9** | $15,000\text{ kg}$ | Discovery Medium Bus Lunar & Planetary Probes |
| **SpaceX Falcon Heavy** | $63,800\text{ kg}$ | Heavy Deep Space Flagship & Mars Sample Return |
| **NASA SLS Block 1/1B** | $95,000\text{ kg}$ | Artemis Lunar Surface & Outer Solar System Flagships |

If $m_{\text{wet}} > m_{\text{max}}$, the launch interlock triggers an over-mass lockout requiring structural or propellant redesign.

#### C. Tsiolkovsky $\Delta v$ Budget Verification
The spacecraft propulsion subsystem calculates available mission $\Delta v$ against destination requirements:

$$\Delta v_{\text{avail}} = I_{\text{sp}} \cdot g_0 \cdot \ln \left( \frac{m_{\text{dry}} + m_{\text{prop}}}{m_{\text{dry}}} \right) \ge \Delta v_{\text{mission}}$$

* **Hydrazine Monopropellant**: $I_{\text{sp}} = 220\text{ s}, m_{\text{prop}} = 350\text{ kg}$.
* **Hypergolic Bipropellant (MMH/NTO)**: $I_{\text{sp}} = 325\text{ s}, m_{\text{prop}} = 1400\text{ kg}$.
* **NEXT-C Gridded Xenon Ion Thruster**: $I_{\text{sp}} = 4150\text{ s}, m_{\text{prop}} = 300\text{ kg}$ (requires electric power $P \ge 700\text{ W}$).

#### D. Scientific Payload & Mission Debrief Scoring
Telemetry sensors generate cumulative science yield:
$$\text{Score}_{\text{science}} = \sum_{k} \text{SciencePoints}_k \cdot \eta_{\text{telemetry}}$$
subject to operational budget reserves:
$$\text{Budget}_{\text{reserve}} = \text{Budget}_{\text{cap}} - \text{Cost}_{\text{bus}} - \text{Cost}_{\text{prop}} - \text{Cost}_{\text{power}} - \sum \text{Cost}_{\text{payload}} \ge \$0\text{M}$$

---

## 🕹️ Unified Aerospace Flight Deck & Controls

```
+---------------------------------------------------------------------------------------+
|                                    FLIGHT DECK CONSOLE                                |
|  [MAIN THRUST]                   [3D NAVBALL & HEADING]                [AUTOPILOT / SAS]  |
|  +--+  100% [Z]                     ORBIT SPEED                         [ STAB LOCK ] |
|  |  |  50%                         10.5742 km/s                        [ PROGRADE  ] |
|  |##|  CUT  [X]                 (▲ W)  (↺ Q)  (↻ E)                     [RETROGRADE ] |
|  |##|                          (◀ A)  [NAV]  (▶ D)                     [  MANUAL   ] |
|  +--+  [+10%] [-10%]                   (▼ S)                                          |
+---------------------------------------------------------------------------------------+
```

### Hotkey Mappings

| Control / Input | Primary Key | Description |
| :--- | :---: | :--- |
| **Throttle Maximum** | `Z` | Sets main engine thrust immediately to $100\%$ |
| **Throttle Cutoff** | `X` | Halts engine instantly ($0\%$ thrust) to conserve propellant |
| **Throttle Up (Fine)** | `Shift` / `+10%` | Increments engine throttle by $+10\%$ |
| **Throttle Down (Fine)** | `Ctrl` / `-10%` | Decrements engine throttle by $-10\%$ |
| **Pitch Down** | `W` | Noses spacecraft downwards |
| **Pitch Up** | `S` | Noses spacecraft upwards |
| **Yaw Left** | `A` | Turns spacecraft nose left |
| **Yaw Right** | `D` | Turns spacecraft nose right |
| **Roll Counter-Clockwise** | `Q` | Rolls craft counter-clockwise |
| **Roll Clockwise** | `E` | Rolls craft clockwise |
| **Timewarp Acceleration** | `+` / `=` | Speeds up physics simulation ($1\times \to 1,000,000\times$) |
| **Timewarp Deceleration** | `-` | Slows down physics simulation to real-time |
| **Toggle Ecliptic Grids** | `G` | Toggles astronomical coordinate reference planes |
| **Toggle Chase Camera** | `H` | Locks camera view along velocity vector |
| **Instant Orbital Insertion** | *UI Button* | `🚀 ESTABLISH ORBIT HERE` inserts craft into stable Keplerian orbit |

---

## 🏗️ Architecture & Project Structure

```
WebGL-Orbiter/
├── .github/
│   └── workflows/
│       └── netlify-deploy.yml    # Automated CI/CD deployment pipeline
├── dist/                          # Production Webpack distribution bundle
├── src/
│   ├── models/spacecraft/         # Official NASA 3D GLTF/GLB models
│   ├── images/
│   │   ├── deep_space_4k.jpg      # High-fidelity 4K deep-space celestial vault
│   │   ├── land_ocean_ice_cloud*  # NASA Blue Marble 4K planetary surfaces
│   │   └── navball.png            # Aerospace attitude director indicator texture
│   ├── CelestialBody.ts           # N-body physics, orbital elements, SAS active damping
│   ├── FlightDeckControl.ts       # Unified aerospace console, throttle, and directional pad
│   ├── NasaMissionDesigner.ts     # NASA hangar, modular craft builder, and badge liveries
│   ├── PlanetaryVisuals.ts        # Earth day/night 4K Rayleigh shader & lunar normal mapping
│   ├── SolarSystemExplorer.ts     # Top Cosmic Orrery dock, NASA dossiers & warp insertion
│   ├── SunVisuals.ts              # Thermonuclear photosphere shader & prominence loops
│   ├── ScenarioSelectorControl.ts # NASA mission flight trajectory presets
│   ├── TimeScaleControl.ts        # Timewarp clock controller
│   ├── Overlay.ts                 # 3D Navball Three.js sphere projection
│   ├── orbiter.ts                 # Main entrypoint, scene graph, and animation render loop
│   └── nasa_mission.css           # Modern aerospace glassmorphism UI styles
├── generate_4k_deep_space.py      # Astronomical 4K celestial sphere generator script
├── netlify.toml                   # Netlify web server configuration
├── package.json                   # Dependencies, scripts, and build tasks
├── webpack.common.js              # Common Webpack bundler config
└── webpack.prod.js                # Optimized production build configuration
```

---

## 🛠️ Building & Running Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* `npm` package manager
* [Python 3](https://www.python.org/) with `Pillow` and `numpy` (optional, for regenerating 4K starfield maps)

### Installation & Execution

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Logm12/nasa_game_challenge.git
   cd nasa_game_challenge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   node serve.js
   ```
   Open your browser at `http://localhost:8000`.

4. **Build production bundle**:
   ```bash
   npm run build
   ```
   Generates optimized `bundle.js` and assets inside the `dist/` directory.

---

## 📜 License & Acknowledgments

* **Codebase License**: Released under the [MIT License](LICENSE).
* **NASA Data & Models**: Public domain, courtesy of the [National Aeronautics and Space Administration (NASA)](https://www.nasa.gov/), [NASA Scientific Visualization Studio](https://svs.gsfc.nasa.gov/), and [NASA JPL](https://www.jpl.nasa.gov/).
* **Original Simulation Core**: Inspired by Masahiro Sakuta's orbital mechanics experiments and the legendary [Kerbal Space Program](https://www.kerbalspaceprogram.com/).
* **Graphics Framework**: Powered by [Three.js](https://threejs.org/).
