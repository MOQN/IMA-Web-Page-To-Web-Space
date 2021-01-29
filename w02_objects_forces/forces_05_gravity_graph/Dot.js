"use strict";


class Dot {
  constructor(x,y) {
    this.pos = createVector(x,y);
  }
  
  update() {
    this.pos.x--;
  }
  
  display() {
    push();
    stroke(0,255,255);
    strokeWeight(3);
    point(this.pos.x, this.pos.y);
    pop();
  }
}