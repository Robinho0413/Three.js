import * as THREE from 'three';

export default class Particle {

    constructor(_pos, _vel, _vertices, _particleId) {
        this.index = _particleId;
        this.vertices = _vertices;
        this.vertices[this.index * 3] = _pos.x;
        this.vertices[this.index * 3 + 1] = _pos.y;
        this.vertices[this.index * 3 + 2] = _pos.z;

        this.velocity = _vel;
        this.alpha = 1.0;
    }
  
    finished() {
        return this.alpha < 0;
    }
  
    update(dt) {
        this.vertices[this.index * 3] += this.velocity.x * dt;
        this.vertices[this.index * 3 + 1] += this.velocity.y * dt;
        this.vertices[this.index * 3 + 2] += this.velocity.z * dt;

        this.alpha -= 0.01;
    }

}