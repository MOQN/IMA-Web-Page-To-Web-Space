const WORLD_HALF = 200;
let plane;

function setupTHREE() {
  // plane
  plane = getPlane();
  plane.position.y = -WORLD_HALF / 2;
  plane.rotation.x = -PI / 2;

  // boxes
  for (let i = 0; i < 100; i++) {
    let box = getBox();

    box.position.x = random(-WORLD_HALF, WORLD_HALF);
    box.position.y = random(-WORLD_HALF / 2, WORLD_HALF);
    box.position.z = random(-WORLD_HALF, WORLD_HALF);

    box.rotation.x = random(TWO_PI);
    box.rotation.y = random(TWO_PI);
    box.rotation.z = random(TWO_PI);

    const size = random(1, 20);
    box.scale.x = size;
    box.scale.y = size;
    box.scale.z = size;

    box.material.transparent = true;
    box.material.opacity = random(0.4, 0.7);
  }
}

function updateTHREE() {
  //
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_HALF * 10, WORLD_HALF * 10, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  //console.log(geometry.attributes.position.array);
  let posArray = geometry.attributes.position.array;
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    let z = posArray[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.02;
    let yOffset = (y + WORLD_HALF) * 0.02;
    let amp = 6;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    posArray[i + 2] = noiseValue; // update the z value.
  }
  
  scene.add(mesh);
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
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

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