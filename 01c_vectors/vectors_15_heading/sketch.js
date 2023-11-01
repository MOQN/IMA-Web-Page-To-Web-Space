// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Sep 21 2017


"use strict";

let c;

function setup() {
  createCanvas(500,600);
  c = new Circle(width/2, height/2);
}

function draw() {
  background(0);
  
  let angle = c.vel.heading(); // Check this vector function!
  console.log(angle);

  c.update();
  c.display();
}


class Circle {
  constructor(x,y) {
    this.pos = createVector(x,y);
    this.vel = createVector(-1,0);
    this.acc = createVector();
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    
    fill(255);
    ellipse(0,0,30,30);
    
    pop();
  }
}