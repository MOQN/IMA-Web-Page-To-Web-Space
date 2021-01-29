"use strict";

class Planet {
  constructor(x, y, radius) {
    this.pos = createVector(x, y);
    this.rad = radius;
    this.waterRad = this.rad * 0.5;
    this.coreRad = this.rad * 0.2;
    this.cGravity = radius*0.0005;
    this.cWindMagnitude = 2;
    this.cAirResistance = 0.05;
    this.cWaterResistance = 0.9;
    this.cCoreRestitution = 1.25;
  }
  update() {
    //this.pos.x = cos(frameCount*0.01) * 50;
    //this.pos.y = sin(frameCount*0.01) * 50;
  }
  display() {
    push();
    
    // Air
    fill(255, 50);
    stroke(255,100);
    ellipse(this.pos.x, this.pos.y, this.rad * 2, this.rad * 2);
    // Water
    fill(0, 0, 255, 120);
    stroke(0, 0, 255);
    ellipse(this.pos.x, this.pos.y, this.waterRad * 2, this.waterRad * 2);
    // core
    fill(255, 0, 0, 80);
    stroke(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, this.coreRad * 2, this.coreRad * 2);
    
    pop();
  }
}