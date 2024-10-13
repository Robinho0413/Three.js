import * as THREE from 'three';


export default class Mass {
    constructor(_x, _y, _z) {
        this.position = new THREE.Vector3(_x, _y, _z);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.fixed = false;
    }

    updatePosition(dt) {
        this.velocity.y += GRAVITY;
        this.velocity.multiplyScalar(DAMPING)
        let v = this.velocity.clone();
        v.multiplyScalar(dt);

        this.position.add(v);

        this.fixed = false;

        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y *= -1;
            this.velocity.multiplyScalar(FRICTION);
            this.fixed = true;
        }
    }
}
