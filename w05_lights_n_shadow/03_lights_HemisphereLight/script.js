const WORLD_HALF_SIZE = 100;
const FLOOR_POSITION = -20;
const COLOR_BG = 0x000000;

let plane;
let cubes = [];

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

  // lights
  const ambiLight = new THREE.AmbientLight(0x333333); // soft light
  scene.add(ambiLight);

  const hemiLight = new THREE.HemisphereLight(0x000099, 0x330000, 1); //skyColor, groundColor, intensity
  scene.add(hemiLight);
  console.log(hemiLight);


  let guiAmbiLight = gui.addFolder("AmbiLight");
  guiAmbiLight.add(ambiLight.color, "r", 0.0, 1.0);
  guiAmbiLight.add(ambiLight.color, "g", 0.0, 1.0);
  guiAmbiLight.add(ambiLight.color, "b", 0.0, 1.0);

  let guihemiLightSky = gui.addFolder("HemiLight-Sky");
  guihemiLightSky.add(hemiLight.color, "r", 0.0, 1.0);
  guihemiLightSky.add(hemiLight.color, "g", 0.0, 1.0);
  guihemiLightSky.add(hemiLight.color, "b", 0.0, 1.0);

  let guihemiLightGround = gui.addFolder("HemiLight-Ground");
  guihemiLightGround.add(hemiLight.groundColor, "r", 0.0, 1.0);
  guihemiLightGround.add(hemiLight.groundColor, "g", 0.0, 1.0);
  guihemiLightGround.add(hemiLight.groundColor, "b", 0.0, 1.0);
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
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_HALF_SIZE * 2, WORLD_HALF_SIZE * 2, 32);
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    //color: 0xFFFFFF,
    //wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  
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
   setScale(w, h = w, d = w) {
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

  renderer.render(scene, camera);
}

// event listeners
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}