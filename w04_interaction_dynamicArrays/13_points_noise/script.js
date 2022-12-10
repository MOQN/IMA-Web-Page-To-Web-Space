const WORLD_SIZE = 1000;

let pointCloud;
let particles = [];

function setupTHREE() {
  // particles
  for (let z = -WORLD_SIZE / 2; z < WORLD_SIZE / 2; z += 5) {
    for (let x = -WORLD_SIZE / 2; x < WORLD_SIZE / 2; x += 5) {
      let tParticle = new Particle()
        .setPosition(x, -200, z)
      particles.push(tParticle);
    }
  }
  // Points
  pointCloud = getPoints(particles);
  scene.add(pointCloud);
}

function updateTHREE() {
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



///// p5.js /////

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  canvas.hide();
  background(50);

  initTHREE();
}

function draw() {
  noLoop();
}

///// three.js /////

let container, stats, gui, params;
let scene, camera, renderer;
let time = 0;
let frame = 0;

function initTHREE() {
  console.log(THREE.REVISION);
  // scene
  scene = new THREE.Scene();

  // camera (fov, ratio, near, far)
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.5,
    5000
  );
  camera.position.z = 100;

  // renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor("#111111");
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // container
  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  // controls
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  // gui
  // https://davidwalsh.name/dat-gui
  gui = new dat.gui.GUI();

  // stats
  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  container.appendChild(stats.dom);

  setupTHREE();

  // let's draw!
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  stats.update();
  time = performance.now();
  frame++;

  updateTHREE();

  renderer.render(scene, camera);
}

// event listeners
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}