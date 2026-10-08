let params = {
  fps: 0,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
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
    p.updatePosition();
    p.adjustVelocity(-0.005);
    p.updateRotation();

    p.updateLifespan();
    p.updateScale();
    if (p.isDone) {
      particles.splice(i, 1);
      i--;
    }
  }

  // then update the points
  const positionAttribute = pointCloud.geometry.getAttribute("position");
  const colorAttribute = pointCloud.geometry.getAttribute("color");
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let ptIndex = i * 3;
    // position
    positionAttribute.array[ptIndex + 0] = p.pos.x;
    positionAttribute.array[ptIndex + 1] = p.pos.y;
    positionAttribute.array[ptIndex + 2] = p.pos.z;
    //color
    colorAttribute.array[ptIndex + 0] = 1.0 * p.lifespan;
    colorAttribute.array[ptIndex + 1] = 0.5 * p.lifespan;
    colorAttribute.array[ptIndex + 2] = 0.1 * p.lifespan;
  }
  pointCloud.geometry.setDrawRange(0, particles.length); // ***
  positionAttribute.needsUpdate = true;
  colorAttribute.needsUpdate = true;

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
  const positionAttribute = geometry.getAttribute("position");
  const colorAttribute = geometry.getAttribute("color");
  positionAttribute.setUsage(THREE.DynamicDrawUsage);
  colorAttribute.setUsage(THREE.DynamicDrawUsage);
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
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.acc = new THREE.Vector3();

    this.baseScl = new THREE.Vector3(1, 1, 1);
    this.scl = this.baseScl.clone();
    this.mass = 1;
    //this.setMass(); // feel free to use this method; it arbitrarily defines the mass based on the scale.

    this.rot = new THREE.Vector3();
    this.rotVel = new THREE.Vector3();
    this.rotAcc = new THREE.Vector3();

    this.lifespan = 1.0;
    this.lifeReduction = random(0.001, 0.005);
    this.isDone = false;
  }
  setPosition(x, y, z) {
    this.pos = new THREE.Vector3(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = new THREE.Vector3(x, y, z);
    return this;
  }
  setRotationAngle(x, y, z) {
    this.rot = new THREE.Vector3(x, y, z);
    return this;
  }
  setRotationVelocity(x, y, z) {
    this.rotVel = new THREE.Vector3(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.baseScl.set(w, h, d);
    this.scl.copy(this.baseScl);
    return this;
  }
  setMass(mass) {
    if (mass) {
      this.mass = mass;
    } else {
      this.mass = 1 + (this.baseScl.x * this.baseScl.y * this.baseScl.z) * 0.000001; // arbitrary
    }
    return this;
  }
  updatePosition() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0, 0);
  }
  adjustVelocity(amount) {
    this.vel.multiplyScalar(1 + amount);
  }
  updateRotation() {
    this.rotVel.add(this.rotAcc);
    this.rot.add(this.rotVel);
    this.rotAcc.set(0, 0, 0);
  }
  applyForce(f) {
    let force = f.clone();
    if (this.mass > 0) {
      force.divideScalar(this.mass);
    }
    this.acc.add(force);
  }
  reappear() {
    if (this.pos.z > WORLD_HALF) {
      this.pos.z = -WORLD_HALF;
    }
  }
  disappear() {
    if (this.pos.z > WORLD_HALF) {
      this.isDone = true;
    }
  }
  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  updateScale() {
    this.scl.set(
      this.baseScl.x * this.lifespan,
      this.baseScl.y * this.lifespan,
      this.baseScl.z * this.lifespan
    );
  }
  attractedTo(x, y, z) {
    let target = new THREE.Vector3(x, y, z);
    let force = target.clone().sub(this.pos);
    if (force.length() < 100) {
      force.multiplyScalar(-0.005);
    } else {
      force.multiplyScalar(0.0001);
    }
    this.applyForce(force);
  }
  flow() {
    let xFreq = this.pos.x * 0.05 + frame * 0.005;
    let yFreq = this.pos.y * 0.05 + frame * 0.005;
    let zFreq = this.pos.z * 0.05 + frame * 0.005;
    let noiseValue = map(noise(xFreq, yFreq, zFreq), 0.0, 1.0, -1.0, 1.0);
    let force = new THREE.Vector3(cos(frame * 0.005), sin(frame * 0.005), sin(frame * 0.002));
    force.normalize();
    force.multiplyScalar(noiseValue * 0.01);
    this.applyForce(force);
  }
}