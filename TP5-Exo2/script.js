import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import Spring from './Spring.js';

import Mass from './Mass.js';

gsap.registerPlugin(CustomEase);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Fog
// scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

// Light
let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(50, 100, 10);
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
const camHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(camHelper);

// Plane
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 10, 10),
    new THREE.MeshPhongMaterial({
        color: 0xcbcbcb,
    }));
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
plane.castShadow = false;
scene.add(plane);

// Grid helper
const gridHelper = new THREE.GridHelper(100, 40, 0x000000, 0x000000);
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(10, 10, 20);
scene.add(camera);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);

// Resize 
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});

// Stats
const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);

// GUI
const gui = new GUI();
const params = {
    showHelpers: true
}
gui.add(params, "showHelpers");


const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
    -5, 5, -5,
    5, 5, -5,
    5, 15, -5,
    -5, 15, -5,
    -5, 5, 5,
    5, 5, 5,
    5, 15, 5,
    -5, 15, 5,
]);
const indices = [
    2, 1, 0, 0, 3, 2,
    0, 4, 7, 7, 3, 0,
    0, 1, 5, 5, 4, 0,
    1, 2, 6, 6, 5, 1,
    2, 3, 7, 7, 6, 2,
    4, 5, 6, 6, 7, 4
];
geometry.setIndex(indices);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const material = new THREE.MeshPhongMaterial({ color: 0x156213, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true });

let mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = true;

scene.add(mesh);

let masses = [];
for(let i = 0 ; i < vertices.length ; i += 3)
    masses.push(new Mass(vertices[i], vertices[i+1], vertices[i+2]));

let springs = [];
for(let i = 0 ; i < masses.length ; i++) {
    for (let j = i + 1 ; j < masses.length ; j++) {
        springs.push(new Spring(masses[i], masses[j]));
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        for (let m of masses) {
            let dir = new THREE.Vector3(Math.random() * 10 - 5, 30.0, Math.random() * 10 - 5);
            m.velocity.add(dir);
        }
    }
})

let clock = new THREE.Clock;


// Main loop
gsap.ticker.add(() => {
    axesHelper.visible = params.showHelpers;
    dlHelper.visible = params.showHelpers;
    camHelper.visible = params.showHelpers;
    gridHelper.visible = params.showHelpers;

    let deltaTime = clock.getDelta();

    for (let m of masses)
        m.updatePosition(deltaTime);

    for (let s of springs)
        s.applyConstraint();

    for (let s of springs)
        s.avoidExchange();

    let vertices = geometry.getAttribute('position').array;
    for (let i = 0 ; i < masses.length ; i++) {
        vertices[i * 3] = masses[i].position.x;
        vertices[i * 3 + 1] = masses[i].position.y;
        vertices[i * 3 + 2] = masses[i].position.z;
    }

    geometry.computeVertexNormals();
    geometry.getAttribute("position").needsUpdate = true;

    controls.update();
    stats.update();
    renderer.render(scene, camera);
});


