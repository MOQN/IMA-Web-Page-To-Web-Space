let params = {
  // (add)
};

const WORLD_SIZE = 1000;
const MAX_PARTICLE_NUMBER = 5000;

let pointCloud;
let particles = [];

function setupThree() {
  // particles
  for (let i = 0; i < MAX_PARTICLE_NUMBER; i++) {
    let tParticle = new Particle()
      .setPosition(random(-200, 200), 0, 0)
      .setVelocity(random(-0.2, 0.2), random(-0.2, 0.2), random(-0.2, 0.2))
    particles.push(tParticle);
  }
  params.drawCount = particles.length;

  // Points
  pointCloud = getPoints(particles);
  scene.add(pointCloud);
}

function updateThree() {
  // generate more particles
  while (particles.length < MAX_PARTICLE_NUMBER) {
    let tParticle = new Particle()
      .setPosition(random(-200, 200), 0, 0)
      .setVelocity(random(-0.2, 0.2), random(-0.2, 0.2), random(-0.2, 0.2))
    particles.push(tParticle);
  }

  // update the particles first
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    //p.attractedTo(0, 0, 0);
    p.flow();
    p.move();
    p.adjustVelocity(-0.005);
    p.rotate();

    p.age();
    if (p.isDone) {
      particles.splice(i, 1);
      i--;
    }
  }

  // then update the points
  let positionArray = pointCloud.geometry.attributes.position.array;
  let colorArray = pointCloud.geometry.attributes.color.array;
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let ptIndex = i * 3;
    // position
    positionArray[ptIndex + 0] = p.pos.x;
    positionArray[ptIndex + 1] = p.pos.y;
    positionArray[ptIndex + 2] = p.pos.z;
    //color
    colorArray[ptIndex + 0] = 1.0 * p.lifespan;
    colorArray[ptIndex + 1] = 0.5 * p.lifespan;
    colorArray[ptIndex + 2] = 0.1 * p.lifespan;
  }
  pointCloud.geometry.setDrawRange(0, particles.length); // ***
  pointCloud.geometry.attributes.position.needsUpdate = true;
  pointCloud.geometry.attributes.color.needsUpdate = true;

  // update GUI
  params.drawCount = particles.length;
}

function getPoints(objects) {
  //const vertices = new Float32Array(objects.length * 3);
  //const colors = new Float32Array(objects.length * 3);
  const vertices = [];
  const colors = [];

  for (let obj of objects) {
    vertices.push(obj.pos.x, obj.pos.y, obj.pos.z);
    colors.push(1.0, 1.0, 1.0);
  }
  // geometry
  const geometry = new THREE.BufferGeometry();
  // attributes
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  // draw range
  const drawCount = objects.length; // draw the whole objects
  geometry.setDrawRange(0, drawCount);
  // geometry
  const texture = new THREE.TextureLoader().load('assets/particle_texture.jpg');
  const material = new THREE.PointsMaterial({
    //color: 0xFF9911,
    vertexColors: true,
    size: 3,
    sizeAttenuation: true, // default
    opacity: 0.9,
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    map: texture
  });
  // Points
  const points = new THREE.Points(geometry, material);
  return points;
}

class Particle {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();

    this.scl = createVector(1, 1, 1);
    this.mass = 1;
    //this.setMass(); // feel free to use this method; it arbitrarily defines the mass based on the scale.

    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();

    this.lifespan = 1.0;
    this.lifeReduction = random(0.001, 0.005);
    this.isDone = false;
  }
  setPosition(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = createVector(x, y, z);
    return this;
  }
  setRotationAngle(x, y, z) {
    this.rot = createVector(x, y, z);
    return this;
  }
  setRotationVelocity(x, y, z) {
    this.rotVel = createVector(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = createVector(w, h, d);
    return this;
  }
  setMass(mass) {
    if (mass) {
      this.mass = mass;
    } else {
      this.mass = 1 + (this.scl.x * this.scl.y * this.scl.z) * 0.000001; // arbitrary
    }
    return this;
  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  adjustVelocity(amount) {
    this.vel.mult(1 + amount);
  }
  rotate() {
    this.rotVel.add(this.rotAcc);
    this.rot.add(this.rotVel);
    this.rotAcc.mult(0);
  }
  applyForce(f) {
    let force = f.copy();
    if (this.mass > 0) {
      force.div(this.mass);
    }
    this.acc.add(force);
  }
  reappear() {
    if (this.pos.z > WORLD_SIZE / 2) {
      this.pos.z = -WORLD_SIZE / 2;
    }
  }
  disappear() {
    if (this.pos.z > WORLD_SIZE / 2) {
      this.isDone = true;
    }
  }
  age() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  attractedTo(x, y, z) {
    let target = new p5.Vector(x, y, z);
    let force = p5.Vector.sub(target, this.pos);
    if (force.mag() < 100) {
      force.mult(-0.005);
    } else {
      force.mult(0.0001);
    }
    this.applyForce(force);
  }
  flow() {
    let xFreq = this.pos.x * 0.05 + frame * 0.005;
    let yFreq = this.pos.y * 0.05 + frame * 0.005;
    let zFreq = this.pos.z * 0.05 + frame * 0.005;
    let noiseValue = map(noise(xFreq, yFreq, zFreq), 0.0, 1.0, -1.0, 1.0);
    let force = new p5.Vector(cos(frame * 0.005), sin(frame * 0.005), sin(frame * 0.002));
    force.normalize();
    force.mult(noiseValue * 0.01);
    this.applyForce(force);
  }
}