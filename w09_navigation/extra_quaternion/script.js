// about Quaternions
// https://www.youtube.com/watch?v=zjMuIxRvygQ
// https://www.youtube.com/watch?v=jTgdKoQv738

const WORLD_HALF = 200;

let box;
let line;
let quaternion;

function setupTHREE() {
  box = getBox();
  box.scale.x = 20;
  box.scale.y = 10;
  box.scale.z = 2;
  scene.add(box);

  const vector = new THREE.Vector3();
  line = getLine();
  scene.add(line);

  let folder;
  // for vector3
  params.x = 0;
  params.y = 1;
  params.z = 0;
  params.angle = PI;
  folder = gui.addFolder("Vector 3");
  folder.add(params, "x", -1, 1).step(0.1);
  folder.add(params, "y", -1, 1).step(0.1);
  folder.add(params, "z", -1, 1).step(0.1);
  folder.add(params, "angle", 0, TWO_PI).step(0.001);

  // quaternion
  quaternion = new THREE.Quaternion();
  folder = gui.addFolder("Quaternion");
  folder.add(quaternion, "_x", -1, 1).step(0.001).listen();
  folder.add(quaternion, "_y", -1, 1).step(0.001).listen();
  folder.add(quaternion, "_z", -1, 1).step(0.001).listen();
  folder.add(quaternion, "_w", -1, 1).step(0.001).listen();
}

function updateTHREE() {
  // update the quaternion by the GUI
  quaternion.setFromAxisAngle(new THREE.Vector3(params.x, params.y, params.z), params.angle);
  box.setRotationFromQuaternion(quaternion);

  // get a vector from the quaternion
  const vector = new THREE.Vector3(0, 0, -1);
  vector.applyQuaternion(quaternion);
  vector.multiplyScalar(30);

  // update the line mesh
  line.geometry.attributes.position.array[0] = vector.x;
  line.geometry.attributes.position.array[1] = vector.y;
  line.geometry.attributes.position.array[2] = vector.z;
  line.geometry.attributes.position.needsUpdate = true;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial({
    //wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getLine() {
  const points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  points.push(new THREE.Vector3(0, 0, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x00FF00 });
  const mesh = new THREE.Line(geometry, material);
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
  //let controls = new THREE.OrbitControls(camera, renderer.domElement);

  // gui
  // https://davidwalsh.name/dat-gui
  gui = new dat.gui.GUI();
  params = {};

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