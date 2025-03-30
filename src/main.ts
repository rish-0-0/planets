import * as THREE from 'three';
import './style.css';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {CelestialBody} from "./components/CelestialBody.ts";
import {updateBodyPosition} from "./utils/gravity.ts";

const scene = new THREE.Scene();

const gridSize: number = 10;
const gridDivisions: number = 20;

const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
scene.add(gridHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add Light
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);



// Add a planet
const sun = new CelestialBody(1e7, 1.0, 0xffff00, new THREE.Vector3(0.0, 0.0, 0));
sun.addToScene(scene);
sun.velocity.set(0.0,0,0);

const mercury = new CelestialBody(1e1, 0.2, 0x00ffff, new THREE.Vector3(4.0, 0.0, 0));
mercury.addToScene(scene);
mercury.velocity.set(0, 0, 0.725);

const venus = new CelestialBody(1e2, 0.3, 0xff0000, new THREE.Vector3(0.0, 6.0, 0));
venus.addToScene(scene);
venus.velocity.set(0, 0, -0.425);

const allObjects: CelestialBody[] = [];
allObjects.push(sun);
allObjects.push(mercury);
allObjects.push(venus);



















// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Animation Loop with Fixed Timestep
let previousTime = performance.now();
const FRAMES_PER_SECOND = 60;
const REFRESH_RATE = 1 / FRAMES_PER_SECOND;
let accumulatedTime = 0;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    // Logic
    const currentTime = performance.now();
    const frameTime = (currentTime - previousTime) / 1000; // Convert ms to seconds
    previousTime = currentTime;
    accumulatedTime += frameTime;

    // Only update when enough time has accumulated
    while (accumulatedTime >= REFRESH_RATE) {
        for (let i = 0; i < allObjects.length; i++) {
            for (let j = 0; j < allObjects.length; j++) {
                if (i == j) {
                    continue;
                }
                const body1 = allObjects[i];
                const body2 = allObjects[j];

                updateBodyPosition(body1, body2, REFRESH_RATE);
                updateBodyPosition(body2, body1, REFRESH_RATE);
            }
        }
        accumulatedTime -= REFRESH_RATE;
    }

    // End Logic
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});