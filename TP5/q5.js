const deltaT = 0.1;
const gravity = 1;
const damping = 0.99;
const stiffness = 0.99;
const friction = 0.005;
const maxVel = 150;

let masses = [];
let springs = [];
let balls = [];

function createCircle() {
    let radius = 100;
    let segments = 20;
    let centerX = Math.random() * windowWidth;
    let centerY = Math.random() * windowHeight;

    for (let i = 0 ; i < segments ; i++) {
        let angle = i * (2.0 * Math.PI / segments);
        let x = centerX + radius * Math.cos(angle);
        let y = centerY + radius * Math.sin(angle);

        masses.push(new Mass(x, y))
    }

    for (let i = 0; i < segments; i++)
        for (let j = i + 1 ; j < segments ; j++)
            springs.push(new Spring(masses[masses.length - segments + i], masses[masses.length - segments + j]));
}


function setup() {
	createCanvas(windowWidth, windowHeight);

    for (let i = 0 ; i < 20 ; i++) {
        let segments = Math.random() * 10 + 10;
        let radius = Math.random() * 60 + 20;
        balls.push(new Ball(
            Math.random() * windowWidth, Math.random() * windowHeight, segments, radius
        ));

        // createCircle(Math.random() * windowWidth, Math.random() * windowHeight, Math.random() * 50, Math.random() * 10 + 4);
    }
}

function mousePressed () {
    for (let ball of balls) {
        for (let m of ball.masses) {
            let d = m.position.copy();
            d.sub(createVector(mouseX, mouseY));
            d.normalize();
            d.mult(100);
            m.velocity.sub(d);
        }
    }
}


function draw() {
	background("#ADDFFF");

    for (let ball of balls)
        ball.updateMasses();

    for (let ball of balls)
        ball.checkCollisionWithBox(width/2 - 100, height - 200, 200, 200);

    for (let ball of balls)
        ball.checkCollisionWithBalls(balls);

    for (let ball of balls)
        ball.updateSprings();

    for (let ball of balls)
        ball.display();

    // for (let m of masses)
    //     m.updatePosition();

    // for (let m of masses)
    //     m.checkCollisionWithBox(width/2 - 100, height - 200, 200, 200);

    // for (let s of springs)
    //     s.applyConstraint();

    // for (let m of masses)
    //     m.display();

    // for (let s of springs)
    //     s.display();

    fill("black")
    rect(width/2 - 100, height - 200, 200, 200);
}
