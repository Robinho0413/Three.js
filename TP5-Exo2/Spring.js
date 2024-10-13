import * as THREE from 'three';


export default class Spring {
    constructor(_p1, _p2) {
        this.p1 = _p1;
        this.p2 = _p2;
        this.restLength = this.p1.position.distanceTo(this.p2.position);
    }

    applyConstraint() {
        let d = this.p2.position.clone();
        d.sub(this.p1.position);
        d.multiplyScalar((d.length() - this.restLength) / this.restLength);
        d.multiplyScalar(STIFFNESS);

        if (this.p1.fixed) {
            this.p2.velocity.sub(d);
            return;
        }

        if (this.p2.fixed) {
            this.p1.velocity.add(d);
            return;
        }

        d.multiplyScalar(0.5);

        this.p1.velocity.add(d);
        this.p2.velocity.sub(d);
    }

    avoidExchange() {
        let d = this.p2.position.clone();
        d.sub(this.p1.position);
        let nextP1 = this.p1.position.clone();
        nextP1.add(this.p1.velocity);
        let nextP2 = this.p2.position.clone();
        nextP2.add(this.p2.velocity);
        let dNext = nextP2.clone();
        dNext.sub(nextP1);

        if (dNext.dot(d) < 0) {
            this.p1.velocity.multiplyScalar(0.5);
            this.p2.velocity.multiplyScalar(0.5);
        }

    }
}
