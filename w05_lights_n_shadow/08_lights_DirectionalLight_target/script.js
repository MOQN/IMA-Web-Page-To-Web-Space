const WORLD_HALF_SIZE = 100;
const FLOOR_POSITION = -20;
const COLOR_BG = 0x000000;

let plane;
let cubes = [];
let targetBox;

function setupTHREE() {
  // the bottom
  plane = getPlane();
  plane.position.y = FLOOR_POSITION;
  plane.rotation.x = PI / 2;
  scene.add(plane);

  // cubes
  const distance = 10;
  for (let z = -WORLD_HALF_SIZE; z <= WORLD_HALF_SIZE; z += distance) {
    for (let x = -WORLD_HALF_SIZE; x <= WORLD_HALF_SIZE; x += distance) {
      let tCube = new Cube()
        .setPosition(x, FLOOR_POSITION, z)
        .setScale(5, random(1, 5) ** 2, 5)
        .setTranslation(0, 0.5, 0);
      cubes.push(tCube);
    }
  }

  // let's add a flying box :D
  targetBox = getBox();
  targetBox.material.color.set(0xFF00FF);
  scene.add(targetBox);

  // lights
  const ambiLight = new THREE.AmbientLight(0x333333); // soft white light
  scene.add(ambiLight);

  const directLight = new THREE.DirectionalLight(0xffffff, 0.5); // color, intensity
  scene.add(directLight);

  directLight.castShadow = true;
  directLight.target = targetBox;

  directLight.shadow.mapSize.width = 512; // default
  directLight.shadow.mapSize.height = 512; // default

  // add helper for the light frustum and shadow
  directLight.shadow.camera.near = 0.5;
  directLight.shadow.camera.far = 200;
  const helper = new THREE.CameraHelper(directLight.shadow.camera);
  scene.add(helper);


  // gui
  let guiLight = gui.addFolder("light");
  guiLight.add(directLight, "intensity", 0.1, 1).step(0.05);
  guiLight.add(directLight.position, "x", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  guiLight.add(directLight.position, "y", 0, WORLD_HALF_SIZE).step(0.1);
  guiLight.add(directLight.position, "z", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  guiLight.add(directLight.color, "r", 0.0, 1).step(0.05);
  guiLight.add(directLight.color, "g", 0.0, 1).step(0.05);
  guiLight.add(directLight.color, "b", 0.0, 1).step(0.05);
}

function updateTHREE() {
  // update fog
  scene.fog = new THREE.Fog(COLOR_BG, params.near, params.far);

  // update the objects
  for (let c of cubes) {
    c.move();
    c.rotate();
    c.update();
  }

  // update the target position
  let frequency = frame * 0.01;
  let radialDistance = 20;
  targetBox.position.x = cos(frequency) * radialDistance;
  targetBox.position.z = sin(frequency) * radialDistance;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_HALF_SIZE * 2, WORLD_HALF_SIZE * 2, 32);
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  //mesh.castShadow = true; //default is false
  mesh.receiveShadow = true; //default is false

  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    //color: 0xFFFFFF
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true; //default is false
  mesh.receiveShadow = true; //default is false

  return mesh;
}

class Cube {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.scl = createVector(1, 1, 1);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();
    this.mesh = getBox();
    scene.add(this.mesh);
  }
  setPosition(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  setTranslation(x, y, z) {
    this.mesh.geometry.translate(x, y, z);
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
  setScale(w, h, d) {
    h = (h === undefined) ? w : h;
    d = (d === undefined) ? w : d;
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = createVector(w, h, d);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    return this;
  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  rotate() {
    this.rotVel.add(this.rotAcc);
    this.rot.add(this.rotVel);
    this.rotAcc.mult(0);
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }
  update() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.mesh.scale.set(this.scl.x, this.scl.y, this.scl.z);
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
  // gui
  gui = new dat.gui.GUI();
  params = {
    near: 1,
    far: 300
  };
  let guiFog = gui.addFolder("fog");
  guiFog.add(params, "near", 1, 500).step(1);
  guiFog.add(params, "far", 1, 500).step(1);

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
  renderer.setClearColor(COLOR_BG);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // enable shadow
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  // container
  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  // controls
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

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

  render();
}

function render() {
  renderer.render(scene, camera);
}

// event listeners
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}