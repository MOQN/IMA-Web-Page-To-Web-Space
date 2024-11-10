let params = {
  numOfPoints: 0,
  numOfParticles: 0
};

const NUM_OF_POINTS = 10000;
const WORLD_SIZE = 1000;
const WORLD_HALF_SIZE = 500;

let pointCloud;
let particles = [];

function setupThree() {
  // scene.background = new THREE.Color(0x999999);
  pointCloud = getPoints();
  scene.add(pointCloud);

  // gui
  gui.add(params, 'numOfPoints').listen();
  gui.add(params, 'numOfParticles').listen();
}

function updateThree() {
  // create a new particle
  for (let i = 0; i < 5; i++) {
    let x = cos(frame * 0.01) * WORLD_HALF_SIZE;
    let y = sin(frame * 0.01) * WORLD_HALF_SIZE;

    let tParticle = new Particle()
      .setPosition(x, y, 0)
      .setVelocity(random(-0.1, 0.1), random(-0.1, 0.1), random(-0.1, 0.1));
    particles.push(tParticle);
  }

  // update the particles
  // update the point cloud by hard-copying the particle positions
  let posArray = pointCloud.geometry.attributes.position.array;
  let colorArray = pointCloud.geometry.attributes.color.array

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.move();
    p.age();

    let ptIndex = i * 3;
    posArray[ptIndex + 0] = p.pos.x;
    posArray[ptIndex + 1] = p.pos.y;
    posArray[ptIndex + 2] = p.pos.z;

    colorArray[ptIndex + 0] = p.r * p.lifespan;
    colorArray[ptIndex + 1] = p.g * p.lifespan;
    colorArray[ptIndex + 2] = p.b * p.lifespan;

    if (p.isDone) {
      particles.splice(i, 1);
      i--;
    }
  }

  // limit the number of particles
  while (particles.length > NUM_OF_POINTS) {
    //particles.shift();
    particles.splice(0, 1); // remove the first (oldest) element
  }

  pointCloud.geometry.attributes.position.needsUpdate = true; // ***
  pointCloud.geometry.attributes.color.needsUpdate = true; // ***
  pointCloud.geometry.setDrawRange(0, particles.length);

  params.numOfPoints = pointCloud.geometry.attributes.position.count;
  params.numOfParticles = particles.length;
}




function getPoints() {
  const texture = new THREE.TextureLoader().load('assets/particle_texture.jpg');

  const vertices = new Float32Array(NUM_OF_POINTS * 3);
  // position
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  // color
  const colors = new Float32Array(NUM_OF_POINTS * 3);
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    //color: 0xFFFFFF,
    vertexColors: true,
    // sizeAttenuation: false,
    size: 10,
    map: texture,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.Points(geometry, material);
  return mesh;
}



// CLASS

class Particle {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();

    this.scl = createVector(1, 1, 1);
    this.mass = 1;
    //this.setMass(); // feel free to use this method; it arbitrarily defines the mass based on the scale.

    this.lifespan = 1.0;
    this.lifeReduction = random(0.001, 0.005);
    this.isDone = false;

    this.r = 0.7;
    this.g = 0.5;
    this.b = 0;
  }
  setPosition(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = createVector(x, y, z);
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