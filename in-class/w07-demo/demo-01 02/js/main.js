let params = {
  // (add)
};

const WORLD_SIZE = 1000;
const WORLD_HALF_SIZE = 500;
let pointCloud;

function setupThree() {
  pointCloud = getPoints();
  scene.add(pointCloud);
}

function updateThree() {
  // pointCloud.rotation.x += 0.01;
  // pointCloud.rotation.y += 0.01;

  let posArray = pointCloud.geometry.attributes.position.array;

  for (let i = 0; i < posArray.length; i += 3) {
    // posArray[i + 0] = random(-50, 50); // x
    // posArray[i + 1] = random(-50, 50); // y
    // posArray[i + 2] = random(-50, 50); // z
    posArray[i + 0] += random(-5, 5); // x
    posArray[i + 1] += random(-5, 5); // y
    posArray[i + 2] += random(-5, 5); // z
  }
  pointCloud.geometry.attributes.position.needsUpdate = true; // ***
}














function getPoints() {
  const vertices = [];

  for (let i = 0; i < 50000 * 3; i += 3) {
    // sphere-like
    let vector = new p5.Vector.random3D();
    //vector.mult(random(500));
    vector.setMag(500);
    vertices[i + 0] = vector.x;
    vertices[i + 1] = vector.y;
    vertices[i + 2] = vector.z;

    // ring-like
    //vertices[i + 0] = cos(i * 0.01) * 500; //x
    //vertices[i + 1] = sin(i * 0.01) * 500; //y
    //vertices[i + 2] = random(-100, 100); //z

    // box-like
    //vertices[i + 0] = random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE);
    //vertices[i + 1] = random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE);
    //vertices[i + 2] = random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE);
  }
  // for (let i = 0; i < 50000; i++) {
  //   const x = THREE.MathUtils.randFloatSpread(2000);
  //   const y = THREE.MathUtils.randFloatSpread(2000);
  //   const z = THREE.MathUtils.randFloatSpread(2000);

  //   vertices.push(x, y, z);
  // }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    // sizeAttenuation: false,
    // size: 10
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