"use strict";

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.dia = 30;
  }
  applyForce(force) {
    this.acc.add(force);
  }
  update() {
    this.vel.add(this.acc); //vel = vel + acc;
    this.pos.add(this.vel); //pos = pos + vel;
    this.acc.mult(0);

  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);

    stroke(255);
    fill(255,80);
    ellipse(0, 0, this.dia, this.dia);
    fill(255, 0, 0);

    noStroke();
    // show the value of vel.y
    let value = round(this.vel.y * 10) / 10;
    text(value, 5, -20);
    print(round(this.vel.y * 10) / 10);

    pop();
  }
  displayDebugMode() {
    push();

    translate(this.pos.x, this.pos.y);
    // draw vel.y
    stroke(255, 0, 0);
    line(0, 0, 0, p.vel.y);
    stroke(0, 255, 0);
    // draw gravity
    translate(-2, p.vel.y);
    line(0, 0, 0, GRAVITY_MAG);
    ellipse(0, GRAVITY_MAG, 2, 2);

    pop();
  }
  checkBoundaries() {
    if (this.pos.y > GROUND) {
      this.pos.y = GROUND;
      this.vel.y = -this.vel.y;
    }
  }
}
