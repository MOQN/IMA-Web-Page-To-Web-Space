"use strict";

class Planet {
  constructor(x, y, radius) {
    this.pos = createVector(x, y);
    this.rad = radius;
    this.cGravity = radius*0.0005;
    this.cWaterResistance = 0.05;
  }
  update() {
    //this.pos.x = cos(frameCount*0.01) * 50;
    //this.pos.y = sin(frameCount*0.01) * 50;
  }
  display() {
    push();
    
    // Water
    fill(0, 0, 255, 120);
    stroke(0, 0, 255);
    ellipse(this.pos.x, this.pos.y, this.rad * 2, this.rad * 2);
    
    pop();
  }
}