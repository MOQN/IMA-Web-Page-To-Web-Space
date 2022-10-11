///////////////////////////////////////////////////////

let pointLight;
let cubes = [];

function setupTHREE() {
  pointLight = new Light();

  for (let i = 0; i < 10; i++) {
    cubes.push(new Cube());
  }

  gui.add(pointLight.pos, "x", -10, 10).step(0.05);
  gui.add(pointLight.pos, "y", -10, 10).step(0.05);
  gui.add(pointLight.pos, "z", -10, 10).step(0.05);
}

function updateTHREE() {
  // light
  pointLight.update();

  // cubes
  for (let c of cubes) {
    c.move();
    c.rotate();
    c.update();
  }
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0x000000
  });
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

function getLight() {
  let light = new THREE.PointLight(0xffffff, 10, 0); //( color, intensity, range(0 = infinite) )
  scene.add(light);
  return light;
}

class Cube {
  constructor() {
    this.pos = createVector(0, 0, 0);
    this.vel = createVector(
      random(-0.03, 0.03),
      random(-0.03, 0.03),
      random(-0.03, 0.03)
    );
    this.acc = createVector();
    //
    this.rot = createVector();
    this.rotVel = createVector(
      random(-0.01, 0.01),
      random(-0.01, 0.01),
      random(-0.01, 0.01)
    );
    this.rotAcc = createVector();
    //
    this.mesh = getBox();
  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    //
    this.vel.mult(0.99);
  }
  rotate() {
    this.rotVel.add(this.rotAcc);
    this.rot.add(this.rotVel);
    this.rotAcc.mult(0);
  }
  update() {
    this.mesh.position.x = this.pos.x;
    this.mesh.position.y = this.pos.y;
    this.mesh.position.z = this.pos.z;

    this.mesh.rotation.x = this.rot.x;
    this.mesh.rotation.y = this.rotVel.y;
    this.mesh.rotation.z = this.rotAcc.z;
  }
}

class Light {
  constructor(x, y, z) {
    this.pos = new p5.Vector(x, y, z);
    //this.vel = new p5.Vector();
    //this.acc = new p5.Vector();
    this.size = 1.0;

    this.mesh = getSphere();
    this.light = getLight();

    this.update();
  }
  update() {
    this.size = map(sin(frame * 0.02), -1, 1, 0.1, 3);

    //mesh
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.scale.set(this.size, this.size, this.size);

    // light
    this.light.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
    this.light.intensity = this.size * 5;
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

let container, stats, gui;
let scene, camera, renderer;
let time = 0;
let frame = 0;

function initTHREE() {
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
  renderer.setClearColor("#333333");
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

  // let's draw!
  setupTHREE();
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