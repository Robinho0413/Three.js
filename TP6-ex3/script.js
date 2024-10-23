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
camera.position.set(0, 30, 0);
camera.lookAt(0, 0, 0);

// Tableau des Id des particules disponibles
let availableParticles = [];
// tableau des particules actives
let activeParticles = [];
// Position de l'emetteur
let emitterPos = new THREE.Vector3(0, 0, 0);

const geometry = new THREE.BufferGeometry();
let vertices = [];

const N = 1050;

for (let i = 0; i < N; i++) {
    vertices.push(0, -10000, 0);
    availableParticles.push(i);
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('spark1.png');

let material = new THREE.PointsMaterial({ 
    map: texture, 
    size: 4, 
    transparent: true, 
    opacity: 1.0,
    alphaTest: 0.05,
    sizeAttenuation: true,
    depthWrite: false,
});

scene.add(new THREE.Points(geometry, material));

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
        let deltaTime = clock.getDelta();

        let vertices = geometry.getAttribute('position').array;
        if (availableParticles.length > 10) 
        {
            for (let i = 0; i < 10; i++) {
                let particleId = availableParticles[0];
                let vel = new THREE.Vector3(
                    (Math.random()*4)  - 2 , 
                    (Math.random() * 10) + 10, 
                    (Math.random()*4) - 2 
                );
                let p = new Particle (emitterPos, vel, vertices, particleId);
                activeParticles.push(p);

                availableParticles.splice(0, 1);
            }
        }
        

        for (let i = activeParticles.length - 1; i >= 0; i--) 
        {
            activeParticles[i].update(deltaTime);

            if (activeParticles[i].finished()) 
            {
                availableParticles.push(activeParticles[i].index);
                activeParticles.splice(i, 1);
            }
        }

        geometry.getAttribute('position').needsUpdate = true;

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