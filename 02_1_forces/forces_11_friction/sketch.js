let GRAVITY_MAGNITUDE = 1;
let FRICTION_MAGNITUDE = 2;
let particles = [];


function setup() {
  createCanvas(500, 600);
  background(0);

  particles.push(new Particle(100, height / 2));
  particles.push(new Particle(250, height / 2));
  particles.push(new Particle(400, height / 2));

}


function draw() {
  background(0);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    //let wind = createVector(random(0.1,1), 0);
    //p.applyForce(wind);
    
    let gravity = createVector(0, GRAVITY_MAGNITUDE * p.mass);
    p.applyForce(gravity);
    
    let friction = p5.Vector.mult(p.vel, -1);
    friction.normalize();
    friction.mult(FRICTION_MAGNITUDE);
    friction.limit(p.vel.mag()); // ***
    p.applyForce(friction); // air friction? Incorrect! Let's talk about that later :D

    p.checkBoundaries();
    p.update();
    p.display();
  }
}