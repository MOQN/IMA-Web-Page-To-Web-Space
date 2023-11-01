const ui = {
  drawCount: 0,
}

const WORLD_SIZE = 500;
const WORLD_HALF = WORLD_SIZE / 2;
const MAX_PARTICLE_NUMBER = 5000;

let pointCloud;
let particles = [];

function setupThree() {
  // gui
  gui.add(ui, "drawCount").min(0).max(MAX_PARTICLE_NUMBER).step(1).listen();

  // floor
  const floor = getPlane();
  floor.position.y = -WORLD_HALF / 2;
  floor.rotation.x = -PI / 2;

  // create Points
  pointCloud = getPoints(MAX_PARTICLE_NUMBER);
}

function updateThree() {
  // update the particles first
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    //p.flow();
    //p.adjustVelocity(-0.005);
    //p.move();
    p.age();
    if (p.isDone) {
      particles.splice(i, 1);
      i--;
    }
  }
  while (particles.length > MAX_PARTICLE_NUMBER) {
    particles.splice(0, 1);
  }

  // then update the points
  const position = pointCloud.geometry.attributes.position;
  const color = pointCloud.geometry.attributes.color;
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let ptIndex = i * 3;
    // position
    position.array[ptIndex + 0] = p.pos.x;
    position.array[ptIndex + 1] = p.pos.y;
    position.array[ptIndex + 2] = p.pos.z;
    //color
    color.array[ptIndex + 0] = p.color.r * p.lifespan;
    color.array[ptIndex + 1] = p.color.g * p.lifespan;
    color.array[ptIndex + 2] = p.color.b * p.lifespan;
  }
  position.needsUpdate = true;
  color.needsUpdate = true;
  pointCloud.geometry.setDrawRange(0, particles.length); // ***

  // update GUI
  ui.drawCount = particles.length;
}

function getPoints(number) {
  const vertices = new Float32Array(number * 3);
  const colors = new Float32Array(number * 3);

  // geometry
  const geometry = new THREE.BufferGeometry();
  // attributes
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  // draw range
  const drawCount = number; // draw the whole objects
  geometry.setDrawRange(0, drawCount);
  // geometry
  const material = new THREE.PointsMaterial({
    //color: 0xFFFFFF,
    vertexColors: true,
    size: 10,
    sizeAttenuation: true,
    // opacity: 0.9,
    // transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  // Points
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0x999999,
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  let pos = geometry.attributes.position;
  for (let i = 0; i < pos.array.length; i += 3) {
    let x = pos.array[i + 0];
    let y = pos.array[i + 1];
    let z = pos.array[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.02;
    let yOffset = (y + WORLD_HALF) * 0.02;
    let amp = 30;
    let noiseValue = noise(xOffset, yOffset) * amp;

    pos.array[i + 2] = noiseValue; // update the z value.
  }

  scene.add(mesh);
  return mesh;
}

// event listeners
window.addEventListener("resize", onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}