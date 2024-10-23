import * as THREE from 'three';

export default class Particle {

    constructor(_pos, _vel, _geo) {
        const map = new THREE.TextureLoader().load( 'spark1.png' );
        this.material = new THREE.SpriteMaterial( { map: map } );

        this.mesh = new THREE.Sprite(this.material);
        this.mesh.castShadow = true;
        let size = 5;
        this.mesh.scale.set(size, size, size);
        this.mesh.position.set(_pos.x, _pos.y, _pos.z);

        this.velocity = _vel;
        this.position = _vel;
        this.alpha = 255;
    }
  
    finished() {
        return this.alpha < 0;
    }
  
    update(dt) {
        this.mesh.position.add(this.velocity);
        this.alpha -= 1;
        this.material.opacity = this.alpha / 255;
    }

}