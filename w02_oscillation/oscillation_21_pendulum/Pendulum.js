"use strict";

class Pendulum {
  constructor(x, y, len) {
    this.origin = createVector(x, y);
    this.armLength = len;

    this.ball = createVector();
    this.ballMass = 50;

    this.angle = PI / 4;
    this.aVel = 0.0;
    this.aAcc = 0.0;

    this.damping = 0.98;
  }
  update() {
    let gravity = 0.5;
    let force = (-1 * gravity / this.ballMass) * sin(this.angle);

    this.aAcc += force;
    this.aVel += this.aAcc;
    this.angle += this.aVel;

    this.aAcc *= 0;
    this.aVel *= this.damping;
  }
  display() {
    let x = cos(this.angle + PI / 2) * this.armLength;
    let y = sin(this.angle + PI / 2) * this.armLength;
    this.ball = createVector(x, y);

    translate(this.origin.x, this.origin.y);
    // arm
    stroke(255);
    strokeWeight(2);
    line(0, 0, this.ball.x, this.ball.y);
    // anchor (origin)
    rectMode(CENTER);
    noStroke();
    fill(255);
    rect(0, 0, 10, 10);
    // ball
    fill(255);
    ellipse(this.ball.x, this.ball.y, this.ballMass, this.ballMass);
  }

}