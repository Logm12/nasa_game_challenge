import * as THREE from 'three/src/Three';

import { MenuControl } from './MenuControl';
import { AU, AxisAngleQuaternion, CelestialBody } from './CelestialBody';

import menuIconUrl from './images/menuIcon.png';


export class ScenarioSelectorControl extends MenuControl{

    protected getSelectObj: () => CelestialBody;
    protected showEvent: () => void;
    public scenarioMap: Map<string, () => void>;

    constructor(
        getRocket: () => CelestialBody,
        setSelectObj: (obj: CelestialBody) => void,
        setThrottle: (throttle: number) => void,
        resetTime: () => void,
        sendMessage: (msg: string) => void,
        showEvent: () => void)
    {
        const config = {
            buttonTop: 0,
            buttonHeight: 32,
            buttonWidth: 32,
            innerTitle: "Scenario Selector",
        };
        super('Scenarios', menuIconUrl, config);
        this.scenarioMap = new Map();

        this.getSelectObj = getRocket;
        this.showEvent = showEvent;

        this.valueElement.style.border = "5px ridge #ffff7f";
        const scenarios: {
            title: string,
            parent: string,
            semimajor_axis: number,
            ascending_node?: number,
            eccentricity?: number,
            rotation?: THREE.Quaternion,
            inclination?: number,
        }[] = [
            {title: "Earth orbit", parent: "earth", semimajor_axis: 10000 / AU},
            {title: "Moon orbit", parent: "moon", semimajor_axis: 3000 / AU},
            {title: "Mars orbit", parent: "mars", semimajor_axis: 5000 / AU},
            {title: "Venus orbit", parent: "venus", semimajor_axis: 10000 / AU, ascending_node: Math.PI},
            {title: "Jupiter orbit", parent: "jupiter", semimajor_axis: 100000 / AU},
            {title: "Saturn orbit", parent: "saturn", semimajor_axis: 65000 / AU, inclination: 12 * Math.PI / 180},
            // NASA Mission-Viz (WSMV) Orbital Flight Scenarios
            {
                title: "NASA Artemis: Earth-Moon TLI",
                parent: "earth",
                semimajor_axis: 200000 / AU,
                eccentricity: 0.965,
                inclination: 28.5 * Math.PI / 180
            },
            {
                title: "NASA DART: Dimorphos Kinetic Impact",
                parent: "Dimorphos",
                semimajor_axis: 180 / AU,
                eccentricity: 0.15
            },
            {
                title: "NASA DART: Dimorphos Kinetic Impact",
                parent: "65803 Didymos",
                semimajor_axis: 200 / AU,
                eccentricity: 0.02
            },
            {
                title: "NASA OSIRIS-REx: 101955 Bennu Rendezvous",
                parent: "101955 Bennu",
                semimajor_axis: 350 / AU,
                eccentricity: 0.02
            },
            {
                title: "NASA Planetary Defense: 99942 Apophis",
                parent: "99942 Apophis",
                semimajor_axis: 400 / AU,
                eccentricity: 0.04
            },
            {
                title: "NASA Voyager 1: Interstellar Boundary",
                parent: "sun",
                semimajor_axis: 158.0,
                eccentricity: 0.02,
                inclination: 35.5 * Math.PI / 180
            },
            {
                title: "NASA New Horizons: Kuiper Belt Survey",
                parent: "sun",
                semimajor_axis: 39.5,
                eccentricity: 0.24,
                inclination: 17.1 * Math.PI / 180
            },
            {
                title: "NASA Juno: Jupiter Polar Magnetosphere",
                parent: "jupiter",
                semimajor_axis: 180000 / AU,
                eccentricity: 0.94,
                inclination: 90 * Math.PI / 180
            },
            {
                title: "NASA JWST: Sun-Earth L2 Halo Orbit",
                parent: "earth",
                semimajor_axis: 1500000 / AU,
                eccentricity: 0.02,
                inclination: 5.1 * Math.PI / 180
            },
            {
                title: "NASA 1950 DA: Deep Space Intercept",
                parent: "1950 DA",
                semimajor_axis: 600 / AU,
                eccentricity: 0.08
            },
            {
                title: "Uranus orbit",
                parent: "uranus",
                semimajor_axis: 50000 / AU,
                inclination: 97.77 * Math.PI / 180
            },
            {
                title: "Neptune orbit",
                parent: "neptune",
                semimajor_axis: 50000 / AU,
                inclination: 28.32 * Math.PI / 180
            },
            {
                title: "Ceres & Main Asteroid Belt",
                parent: "Ceres (Asteroid)",
                semimajor_axis: 1500 / AU,
                eccentricity: 0.02
            },
            {
                title: "1P/Halley Comet Intercept",
                parent: "1P/Halley (Comet)",
                semimajor_axis: 800 / AU,
                eccentricity: 0.05
            },
            {
                title: "Gargantua Black Hole Singularity",
                parent: "Gargantua (Black Hole)",
                semimajor_axis: 250000 / AU,
                eccentricity: 0.08,
                inclination: 25 * Math.PI / 180
            },
        ];
        for(let i = 0; i < scenarios.length; i++){
            const scenario = scenarios[i];
            const elem = document.createElement('div');
            elem.style.margin = "15px";
            elem.style.padding = "15px";
            elem.style.border = "1px solid #ffff00";
            elem.innerHTML = scenario.title;
            const clickHandler = (() => {
                const ascending_node = scenario.ascending_node || 0.;
                var eccentricity = scenario.eccentricity || 0.;
                var rotation = scenario.rotation ?? (() => {
                    var rotation = AxisAngleQuaternion(0, 0, 1, ascending_node - Math.PI / 2);
                    rotation.multiply(AxisAngleQuaternion(0, 1, 0, Math.PI - (scenario.inclination ?? 0)));
                    return rotation;
                })();
                const select_obj = getRocket();
                const parent = CelestialBody.findBody(scenario.parent);
                if(!parent)
                    return;
                select_obj.setParent(parent);
                select_obj.position = new THREE.Vector3(0, 1 - eccentricity, 0)
                    .multiplyScalar(scenario.semimajor_axis).applyQuaternion(rotation);
                select_obj.quaternion = rotation.clone();
                select_obj.quaternion.multiply(AxisAngleQuaternion(1, 0, 0, -Math.PI / 2));
                select_obj.angularVelocity = new THREE.Vector3();
                setThrottle(0);
                select_obj.setOrbitingVelocity(scenario.semimajor_axis, rotation);
                select_obj.totalDeltaV = 0.;
                select_obj.ignitionCount = 0;
                setSelectObj(select_obj);
                resetTime();
                sendMessage('Scenario ' + scenario.title + ' Loaded!');
                this.title.style.display = 'none';
                this.visible = false;
                this.valueElement.style.display = 'none';
            });
            elem.onclick = clickHandler;
            this.scenarioMap.set(scenario.title.toLowerCase(), clickHandler);
            if (scenario.title.includes("Dimorphos Kinetic Impact")) {
                this.scenarioMap.set("nasa dart: 65803 didymos intercept", clickHandler);
            }
            this.valueElement.appendChild(elem);
        }
    }

    loadScenarioByName(name: string) {
        let handler = this.scenarioMap.get(name.toLowerCase());
        if (!handler && name.toLowerCase().includes('dart')) {
            this.scenarioMap.forEach((val, key) => {
                if (!handler && key.includes('dart')) {
                    handler = val;
                }
            });
        }
        if (handler) {
            handler();
        }
    }

    setVisible(v: boolean){
        super.setVisible.call(this, v);
        if(this.visible){
            this.showEvent();
        }
    }
}