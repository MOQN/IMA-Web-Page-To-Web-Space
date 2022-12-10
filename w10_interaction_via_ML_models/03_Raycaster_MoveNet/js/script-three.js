///// three.js /////

let container, stats, gui;
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
  renderer.setClearColor("#333333");
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // container
  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  // controls
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  // gui
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