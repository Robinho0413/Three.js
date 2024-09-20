import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import Bullet from './bullet.js';
import Figure from './figure.js';

gsap.registerPlugin(CustomEase);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Fog
scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

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

// Original code from https://tympanus.net/codrops/2021/10/04/creating-3d-characters-in-three-js/
const random = (min, max, float = false) => {
    const val = Math.random() * (max - min) + min;
    if (float) return val;
    return Math.floor(val)
}

const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
}

const figure = new Figure();
scene.add(figure);


let leftKeyIsDown = false;
let rightKeyIsDown = false;
let upKeyIsDown = false;

let rySpeed = 0;
let walkSpeed = 0.0;

let jumpTimeline = gsap.timeline();
document.addEventListener('keydown', (event) => {
    if ((event.key == ' ') && (jumpTimeline.isActive() == false)) {
        jumpTimeline.to(figure.params, {
            y: 3,
            repeat: 1,
            yoyo: true,
            duration: 0.5,
            ease: CustomEase.create("custom", "M0,0 C0.126,0.382 0.399,0.637 0.557,0.785 0.749,0.966 0.818,1.001 1,1 "),
        });
    }
    if (event.key == 'ArrowUp') {
        upKeyIsDown = true;
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key == 'q') {
        leftKeyIsDown = true;
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key == 'd') {
        rightKeyIsDown = true;
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key == 'z') {
        upKeyIsDown = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key == 'q') {
        leftKeyIsDown = false;
    }
});
document.addEventListener('keyup', (event) => {
    if (event.key == 'd') {
        rightKeyIsDown = false;
    }
});
document.addEventListener('keyup', (event) => {
    if (event.key == 'z') {
        upKeyIsDown = false;
    }
});


//Text facing the camera
let text = null;
const fontLoader = new FontLoader();
const myFont = "fonts/helvetiker_regular.typeface.json";
const textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
function createText(count) {
    scene.remove(text);
    fontLoader.load(myFont, (font) => {
        const textGeometry = new TextGeometry('shots: ' + count, {
            font: font,
            size: 1,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        });
        text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(0, 2, 0);
        scene.add(text);
    })
}
createText(0);

// tir
let bullets = [];
document.addEventListener('keydown', (event) => {
    if (event.key === 'f') {
        createText(bullets.length);
        let bullet = new Bullet(figure.params.x, figure.params.y, figure.params.z, figure.params.ry);
        scene.add(bullet);
        bullets.push(bullet);
    }
});

let clock = new THREE.Clock;

// Main loop
gsap.ticker.add(() => {
    axesHelper.visible = params.showHelpers;
    dlHelper.visible = params.showHelpers;
    camHelper.visible = params.showHelpers;
    gridHelper.visible = params.showHelpers;

    //maj vitesses
    if (leftKeyIsDown)
        rySpeed += 0.003;
    if (rightKeyIsDown)
        rySpeed -= 0.003;
    if (upKeyIsDown)
        walkSpeed += 0.003;

    if (jumpTimeline.isActive()) {

        figure.fadeToAction("Jump", 0.25);
    }

    else if (walkSpeed >= 0.01) {

        figure.fadeToAction("Running", 0.25);
    }


    else if ((!jumpTimeline.isActive()) && (rySpeed < 0.01) && (walkSpeed < 0.01)) {
        figure.fadeToAction("Idle", 0.25);
    }

    //update ratation
    figure.params.ry += rySpeed;
    rySpeed *= 0.95;

    // update marche
    figure.params.x = figure.params.x + walkSpeed * Math.sin(figure.params.ry);
    figure.params.z = figure.params.z + walkSpeed * Math.cos(figure.params.ry);
    walkSpeed *= 0.95;

    let deltaTime = clock.getDelta();

    // maj de balles
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].isAlive()) {
            bullets[i].update();
        }
        else {
            scene.remove(bullets[i]);
            bullets.slice(i, 1);
        }
    }

    // Positionnement
    let localCameraPosition = new THREE.Vector3(0, 5, -25);
    figure.localToWorld(localCameraPosition);
    camera.position.copy(localCameraPosition);

    // quoi regarder
    camera.lookAt(new THREE.Vector3(figure.position.x, 5, figure.position.z))

    // maj des matrices
    camera.updateProjectionMatrix();


    figure.update(deltaTime);
    stats.update();

    // update the position and orientation of the text
    if (text) {
        const localTextPosition = new THREE.Vector3(-2, 5, -20);
        const textPosition = camera.localToWorld(localTextPosition);
        text.lookAt(camera.position);
        text.position.copy(textPosition);
    }

    renderer.render(scene, camera);
});

