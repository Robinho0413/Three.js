class Mass {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.previousPosition = this.position;
        this.velocity = createVector(0, random(20));
    }
    updatePosition() {
        this.velocity.y += gravity;
        this.velocity.mult(damping);
        this.velocity.limit(maxVel);
        this.previousPosition = this.position.copy();
        this.position.x += this.velocity.x * deltaT;
        this.position.y += this.velocity.y * deltaT;
        if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.x = 0;
            this.velocity.y *= friction;
        }
        if (this.position.x > width) {
            this.position.x = width;
            this.velocity.x = 0;
            this.velocity.y *= friction;
        }
        if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y = 0;
            this.velocity.x *= friction;
        }
        if (this.position.y > height) {
            this.position.y = height;
            this.velocity.y = 0;
            this.velocity.x *= friction;
        }
    }

    checkCollisionWithBox(x, y, width, height) {
        let left = x;
        let top = y;
        let right = left + width;
        let bottom = top + height;

        if (this.position.x < left || this.position.x > right || this.position.y < top || this.position.y > bottom)
            return;

        if (this.position.y > top && this.previousPosition.y <= top) {
            this.position.y = top;
            this.velocity.y = 0;
            this.velocity.x *= friction;
        }

        if (this.position.y < bottom && this.previousPosition.y >= bottom) {
            this.position.y = bottom;
            this.velocity.y = 0;
            this.velocity.x *= friction;
        }

        if (this.position.x > left && this.previousPosition.x <= left) {
            this.position.x = left;
            this.velocity.x = 0;
            this.velocity.y *= friction;
        }

        if (this.position.x < right && this.previousPosition.x >= right) {
            this.position.x = right;
            this.velocity.x = 0;
            this.velocity.y *= friction;
        }

    }

    display() {
        fill("red");
        stroke("orange");
        circle(this.position.x, this.position.y, 10);
    }
}
