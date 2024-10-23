import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';



export default class Particle {
    constructor(_pos, _velocity, _geom) {
        this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.material.transparent = true;

        this.mesh = new THREE.Mesh(_geom, this.material);
        let size = 0.3;
        this.mesh.scale.set(size, size, size);
        this.mesh.position.set(_pos.x, _pos.y, _pos.z);

        this.velocity = _velocity.clone();
        this.alphas = 55;


    }

    update(dt) {
        this.mesh.position.add(this.velocity)
        this.alphas -= 1;
        this.material.opacity = this.alphas / 255;
    }

    alive() {
        return this.alphas > 0;
    }
}
const sphereGeometry = new THREE.SphereGeometry();


function spawnRandomParticle(pos){

    let speedFactor = 0.1;
    let vel = new THREE.Vector3(
        Math.random() * speedFactor - speedFactor / 2,
        Math.random() * speedFactor + speedFactor / 2,
        Math.random() * speedFactor - speedFactor / 2
    );
    let p = new Particle(pos, vel, sphereGeometry);

    particles.push(p);
    scene.add(p.mesh);

}


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

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


// Resize 
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});


// // Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;


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

let clock = new THREE.Clock();


let particles = [];

let emitterPos = new THREE.Vector3(0, 0, 0);


// Update the gsap ticker to include collision checks
gsap.ticker.add(() => {
    axesHelper.visible = params.showHelpers;
    dlHelper.visible = params.showHelpers;
    camHelper.visible = params.showHelpers;
    gridHelper.visible = params.showHelpers;

    let deltaTime = clock.getDelta();

    for(let i = 0; i < 15; i++){
    
        spawnRandomParticle(emitterPos);
    
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(deltaTime);
        if (!particles[i].alive()) {
            scene.remove(particles[i].mesh);
            particles.splice(i, 1);
        }
    }



    controls.update();

    // Render the scene
    renderer.render(scene, camera);

    // Update stats
    stats.update();
});