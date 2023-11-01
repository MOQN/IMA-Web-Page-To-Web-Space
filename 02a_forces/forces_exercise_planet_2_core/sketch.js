let planet;
let particles = [];


function setup() {
  createCanvas(1200, 800);

  planet = new Planet(0, 0, 200); // x,y,radius

  for (let i = 0; i < 30; i++) {
    particles.push(new Particle(-width / 2, -height / 2));
  }
}


function draw() {
  background(0);

  push();
  translate(width / 2, height / 2);
  // create zoom-in & out
  let s = map(mouseY, 0, height, 0.5, 1.5);
  scale(s);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // how to create a gravity
    let gravity = p5.Vector.sub(planet.pos, p.pos);
    gravity.normalize();
    gravity.mult(planet.cGravity * p.mass);
    p.applyForce(gravity);

    let distance = p.pos.dist(planet.pos);

    // core area
    if (distance < planet.coreRad) {
      p.vel.mult(planet.cCoreRestitution);
    }
    // water area
    else if (distance < planet.rad) {
      // water resistance
      let resistance = p5.Vector.mult(p.vel, -1);
      resistance.normalize();
      let speed = p.vel.mag();
      resistance.mult(speed * speed * planet.cWaterResistance);
      resistance.limit(speed); // ***
      p.applyForce(resistance);
    }
    
    p.update();
    p.display();
  }
  planet.update();
  planet.display();

  pop();
}