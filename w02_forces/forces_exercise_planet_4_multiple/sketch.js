let planets = [];
let particles = [];


function setup() {
  createCanvas(1200, 800);

  planets.push(new Planet(-300, random(-200, 200), random(80, 120))); // x,y,radius
  planets.push(new Planet(300, random(-200, 200), random(150, 200))); // x,y,radius

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
  for (let j = 0; j < planets.length; j++) {

    let tPlanet = planets[j];

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];

      // how to create a gravity
      let gravity = p5.Vector.sub(tPlanet.pos, p.pos);
      gravity.normalize();
      gravity.mult(tPlanet.cGravity * p.mass);
      p.applyForce(gravity);

      let distance = p.pos.dist(tPlanet.pos);

      // core area
      if (distance < tPlanet.coreRad) {
        p.vel.mult(tPlanet.cCoreRestitution);
      }
      // water area
      else if (distance < tPlanet.waterRad) {
        // water resistance
        let resistance = p5.Vector.mult(p.vel, -1);
        resistance.normalize();
        let speed = p.vel.mag();
        resistance.mult(speed * speed * tPlanet.cWaterResistance);
        resistance.limit(speed); // ***
        p.applyForce(resistance);
      }
      // air area
      else if (distance < tPlanet.rad) {
        // air resistance
        let resistance = p5.Vector.mult(p.vel, -1);
        resistance.normalize();
        let speed = p.vel.mag();
        resistance.mult(speed * speed * tPlanet.cAirResistance);
        resistance.limit(speed); // ***
        p.applyForce(resistance);
        // wind
        let wind = p.vel.copy();
        wind.normalize();
        wind.rotate(radians(60)); // ***
        wind.mult(tPlanet.cWindMagnitude);
        p.applyForce(wind);
      }

      p.update();
      p.display();
    }
    tPlanet.update();
    tPlanet.display();
  }

  pop();
}