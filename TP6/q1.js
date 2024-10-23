// Daniel Shiffman
// http://codingtra.in

// Simple Particle System
// https://youtu.be/UcdigVaIYAk

const particles = [];

let frame = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  frame++;
  for (let i = 0; i < 5; i++) {
    let p = new Particle();
    particles.push(p);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      // remove this particle
      particles.splice(i, 1);
    }
  }
}

class Particle {

  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    let angleRad = frame / 6.0;
    this.vx = random(0, 10) * cos(angleRad);
    this.vy = random(0, 10) * sin(angleRad);
    this.alpha = 255;
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    let wind = cos(frame * 0.01 + this.alpha / 50) * 4;
    this.x += this.vx + wind;
    this.y += this.vy;
    this.alpha -= 5;
  }

  show() {
    noStroke();
    //stroke(255);
    let l = this.alpha;
    fill(150, this.alpha, l, 15);
    ellipse(this.x, this.y, 16);
  }

}