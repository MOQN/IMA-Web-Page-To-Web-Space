let params = {
  // (add)
};

const WORLD_SIZE = 1000;

let pointCloud;
let particles = [];

function setupThree() {
  // particles
  for (let z = -WORLD_SIZE / 2; z < WORLD_SIZE / 2; z += 7) {
    for (let x = -WORLD_SIZE / 2; x < WORLD_SIZE / 2; x += 7) {
      let tParticle = new Particle()
        .setPosition(x, -200, z)
      particles.push(tParticle);
    }
  }
  // Points
  pointCloud = getPoints(particles);
  scene.add(pointCloud);
}

function updateThree() {
  // update the particles first
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.fluctuate();
  }

  // then update the points
  let positionArray = pointCloud.geometry.attributes.position.array;
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let ptIndex = i * 3;
    positionArray[ptIndex + 0] = p.pos.x;
    positionArray[ptIndex + 1] = p.pos.y;
    positionArray[ptIndex + 2] = p.pos.z;
  }
  pointCloud.geometry.setDrawRange(0, particles.length); // ***
  pointCloud.geometry.attributes.position.needsUpdate = true;
}

function getPoints(objects) {
  const vertices = [];
  for (let obj of objects) {
    vertices.push(obj.pos.x, obj.pos.y, obj.pos.z);
  }
  // geometry
  const geometry = new THREE.BufferGeometry();
  // attributes
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  // draw range
  const drawCount = objects.length; // draw the whole objects
  geometry.setDrawRange(0, drawCount);
  // material
  const texture = new THREE.TextureLoader().load('assets/particle_texture.jpg');
  const material = new THREE.PointsMaterial({
    color: 0xFF9911,
    size: 3,
    sizeAttenuation: true,
    //opacity: 0.50,
    //transparent: true,
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
    this.originPos = createVector();
    this.pos = createVector();
  }
  setPosition(x, y, z) {
    this.originPos = createVector(x, y, z);
    this.pos = createVector(x, y, z);
    return this;
  }
  fluctuate() {
    let xFreq = this.pos.x * 0.01 + frame * 0.005;
    let zFreq = this.pos.z * 0.01 + frame * 0.005;
    let yOffset = noise(xFreq, zFreq) * 200;
    this.pos.y = this.originPos.y + yOffset;
  }
}