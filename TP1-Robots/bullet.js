import * as THREE from 'three';

export default class Bullet extends THREE.Group {
    constructor(x, y, z, orientation) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
        this.orientation = orientation;
        this.life = 200;

        //create a bullet
        this.bullet = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 32),
            new THREE.MeshLambertMaterial({ color : 0xff0000})
        );
        this.bullet.castShadow = true;
        this.add(this.bullet);

        this.position.set(x, y, z);
    }

    isAlive() {
        return this.life > 0;
    }

    update() {
        this.life--;
        const speed = 1.1;
        this.position.x += speed * Math.sin(this.orientation);
        this.position.z += speed * Math.cos(this.orientation);
    }
}