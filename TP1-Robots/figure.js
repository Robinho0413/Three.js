import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class Figure extends THREE.Group {
    constructor(params) {
        super();
        this.params = {
            x: 0,
            y: 0,
            z: 0,
            ry: 0,
        };

        // Position according to params
        this.position.x = this.params.x;
        this.position.y = this.params.y;
        this.position.z = this.params.z;

        var self = this;
        const loader = new GLTFLoader();
        loader.load('RobotExpressive.glb', function (gltf) {
            self.add(gltf.scene);
            self.loadAnimations(gltf.scene, gltf.animations);
        }, undefined, function (e) {
            console.error(e);
        })
    }

    loadAnimations(model, animations) {
        this.mixer = new THREE.AnimationMixer(model);
        this.states = ["Idle", "Running", "Jump", "ThumbsUp"];

        this.actions = {};
        

        for (let i = 0; i < animations.length; i++) {
            const clip = animations[i];
            if (this.states.includes(clip.name)) {
                const action = this.mixer.clipAction(clip);
                this.actions[clip.name] = action;

                if(clip.name === "Jump" || clip.name == "ThumbsUp") {
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopOnce;
                }
            }
        }

        this.state = "Idle"
        this.actions[this.state].play();
    }

    update(dt) {
        this.rotation.y = this.params.ry;
        this.position.y = this.params.y;
        this.position.x = this.params.x;
        this.position.z = this.params.z;

        if (this.mixer) {
            this.mixer.update(dt);
        }
    }

    fadeToAction(animationName, fadeDuration){
        if (!this.actions) return;
        if (animationName === this.state) return;
        this.actions[this.state].fadeOut(fadeDuration);
        this.actions[animationName].reset().fadeIn(fadeDuration).play();

        this.state = animationName;
    }
}