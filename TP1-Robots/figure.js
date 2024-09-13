import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Figure extends THREE.Group {
    constructor(params) {
        super();
        this.params = {
            x: 0,
            y: 1.4,
            z: 0,
            ry: 0,
        };

        // Position according to params
        this.group.position.x = this.params.x;
        this.group.position.y = this.params.y;
        this.group.position.z = this.params.z;

        var self = this;
        const loader = new GTLFLoader();
        loader.load('RobotExpressive.glb', function (gltf) {
            self.add(gltf.scene);
            loadAnimations(gltf.animatons);
        }, undefined, function (e) {
            console.error(e);
        })
    }

    loadAnimations(animations) {
        this.mixer = new THREE.AnimationMixer(model);
        this.states = ["Idle", "Running", "Jump", "ThumbsUp"];

        this.actions = {};

        for (let i = 0; i < animations.length)
    }

    update() {
        this.group.rotation.y = this.params.ry;
        this.group.position.y = this.params.y;
        this.group.position.x = this.params.x;
        this.group.position.z = this.params.z;
        this.arms.forEach((arm, index) => {
            const m = index % 2 === 0 ? 1 : -1;
            arm.rotation.z = this.params.armRotation * m;
        });
        this.head.rotation.z = this.params.headRotation;
        this.leftEye.scale.y = this.leftEye.scale.z = this.leftEye.scale.x = this.params.leftEyeScale;

        //arms animation
        this.arms.forEach((arm, index) => {
            const m = index % 2 === 0 ? 1 : -1;
            // jump
            arm.rotation.z = this.params.armRotation * m;
            // walk
            arm.rotation.x = this.params.walkRotation * -m;
        })

        //legs animation
        this.legs.forEach((leg, index) => {
            const m = index % 2 === 0 ? 1 : -1;
            leg.rotation.x = this.params.walkRotation * m;
        })
    }

    init() {
    }
}