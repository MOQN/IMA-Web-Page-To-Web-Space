let sphere;
let texture;

function setupTHREE() {

  // texture = new THREE.TextureLoader().load('assets/cubeGrid.png');
  // texture = new THREE.TextureLoader().load('assets/asteroid.png');
  // texture = new THREE.TextureLoader().load('assets/earth.png');
  texture = new THREE.TextureLoader().load('assets/moon.png');

  sphere = getSphere();
  sphere.scale.set(30.0, 30.0, 30.0);
  scene.add(sphere);

  const light = getLight();
  light.position.set(10, 40, 80);
  scene.add(light);

  gui
    .add(light.position, "x")
    .min(-100)
    .max(100)
    .step(0.5);
  gui
    .add(light.position, "y")
    .min(-100)
    .max(100)
    .step(0.5);
  gui
    .add(light.position, "z")
    .min(-100)
    .max(100)
    .step(0.5);
}

function updateTHREE() {
  //sphere.rotation.x += 0.01;
  //sphere.rotation.z += 0.01;
}

function getLight() {
  const light = new THREE.PointLight(0xffffff, 1, 300);
  return light;
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 360, 360);
  // *** Use MeshStandardMaterial!
  const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: texture,
    displacementMap: texture,
    displacementScale: 0.05
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
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

function cameraUpdate() {
  camera.updateProjectionMatrix();
}


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
  params = {
    value1: 0,
    value2: 0,
    value3: 0
  };

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