import * as THREE from 'three';
import './style.css';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {CelestialBody} from "./components/CelestialBody.ts";
import {updateBodyPosition} from "./utils/gravity.ts";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  window.innerWidth / window.innerHeight,
  0.1
);

camera.position.z = 30;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add Light
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);


const COMMON_MASS = 1.35e5;
// Add a planet
const planet1 = new CelestialBody(COMMON_MASS, 0.5, 0xffff00, new THREE.Vector3(4.0, 0.0, 0));
planet1.addToScene(scene);
planet1.velocity.set(0.0, 1.0, 0.0);

const planet2 = new CelestialBody(COMMON_MASS, 0.5, 0x00ffff, new THREE.Vector3(-2.0, 3.564, 0));
planet2.addToScene(scene);
planet2.velocity.set(-0.866, -0.5, 0.0);

const planet3 = new CelestialBody(COMMON_MASS, 0.5, 0xff0000, new THREE.Vector3(-2.0, -3.564, 0));
planet3.addToScene(scene);
planet3.velocity.set(0.866, -0.5, 0.0);

const allObjects: CelestialBody[] = [];
allObjects.push(planet1);
allObjects.push(planet2);
allObjects.push(planet3);



















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
                    // same body...
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