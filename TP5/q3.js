const deltaT = 0.1;
const gravity = 1;
const damping = 0.99;
const stiffness = 0.99;
const friction = 0.005;
const maxVel = 150;

let masses = [];
let springs = [];

function setup() {
	createCanvas(windowWidth, windowHeight);

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
            springs.push(new Spring(masses[i], masses[j]));



}


function draw() {
	background(255);

    for (let m of masses)
        m.updatePosition();

    for (let s of springs)
        s.applyConstraint();

    for (let m of masses)
        m.display();

    for (let s of springs)
        s.display();
}
