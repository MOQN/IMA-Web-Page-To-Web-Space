let WATER_SURFACE = 400;
let GRAVITY_MAGNITUDE = 1;

let AIR_RESISTANCE_COEFFICIENT = 0.02;
let WATER_RESISTANCE_COEFFICIENT = 0.7;


let particles = [];


function setup() {
  createCanvas(500, 600);
  background(0);

  particles.push(new Particle(100, 0));
  particles.push(new Particle(250, 0));
  particles.push(new Particle(400, 0));
}


function draw() {
  background(0);

  // water
  fill(0, 0, 70);
  rect(0, WATER_SURFACE, width, height - WATER_SURFACE);


  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    p.checkBoundaries();

    let gravity = createVector(0, GRAVITY_MAGNITUDE * p.mass);
    p.applyForce(gravity);

    // resistance
    let resistance = p5.Vector.mult(p.vel, -1);
    resistance.normalize();
    let speed = p.vel.mag();
    if (p.pos.y < WATER_SURFACE) {
      // air resistance
      let magnitude = speed * speed * AIR_RESISTANCE_COEFFICIENT;
      resistance.mult(magnitude);
    } else {
      // liquid resistance
      let magnitude = speed * speed * WATER_RESISTANCE_COEFFICIENT;
      resistance.mult(magnitude);
    }
    p.applyForce(resistance);

    // update
    p.update();

    // display
    p.display();
  }
}