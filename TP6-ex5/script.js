
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Particle from './Particle.js';



// Create the scene
const scene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// Light
let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(0, 10, 0);
light.target.position.set(0, 0, 0);
scene.add(light);
const dlHelper = new THREE.DirectionalLightHelper(light);
scene.add(dlHelper);
light.castShadow = true;
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 50;
light.shadow.camera.far = 150;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 30);

let particles = [];


function spawnRandomParticle(pos) {
    let speedFactor = 0.1;
    let vel = new THREE.Vector3((Math.random() * 20) - 10, (Math.random() * 100) + 50, (Math.random() * 20) - 10);
    vel.normalize();
    vel.multiplyScalar(speedFactor);
    let p = new Particle(pos, vel);
    scene.add(p.mesh);
    return p;
}

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add a grid helper
const gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);
let clock = new THREE.Clock();

// Animation loop
gsap.ticker.add(() => {
    gridHelper.visible = params.showHelpers;
    let deltaTime = clock.getDelta();

    for (let i = 0; i < 5; i++) {
        let p = spawnRandomParticle((new THREE.Vector3(0, 0, 0)));
        particles.push(p);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();

        if (particles[i].finished()) {
            scene.remove(particles[i].mesh)
            particles.splice(i, 1);
        }
    }

    controls.update();
    renderer.render(scene, camera);
}
);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});