// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Sep 21 2017


"use strict";

let c;

function setup() {
  createCanvas(500, 600);
  c = new Circle(width / 2, height / 2);
}

function draw() {
  background(0);

  let angle = c.vel.heading(); // check this out!

  // steering?
  if (keyIsPressed) {
    let force = createVector();
    if (keyCode == LEFT_ARROW) {
      force = p5.Vector.fromAngle(radians(-90) + angle);
    } else if (keyCode == RIGHT_ARROW) {
      force = p5.Vector.fromAngle(radians(90) + angle);
    }
    force.mult(0.1);
    c.applyForce(force);
  }

  c.update();
  c.checkEdges();
  c.display();
}


class Circle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(-1, 0);
    this.acc = createVector();
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  applyForce(force) {
    this.acc.add(force); // force accumulation!
  }
  checkEdges() {
    if (this.pos.x < 0) {
      this.pos.x = width;
    } else if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    } else if (this.pos.y > height) {
      this.pos.y = 0;
    }
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);

    // draw the circle
    fill(255);
    ellipse(0, 0, 30, 30);

    // draw the velocity vector
    stroke(255, 0, 0);
    line(0, 0, this.vel.x * 10, this.vel.y * 10);

    pop();
  }
}