const WORLD_HALF_SIZE = 100;
const FLOOR_POSITION = -20;
const COLOR_BG = 0x000000;

let plane;
let light;
let targetBox;

function setupTHREE() {
  // the bottom
  plane = getPlane();
  plane.position.y = FLOOR_POSITION;
  plane.rotation.x = PI / 2;
  scene.add(plane);

  // the targetBox
  targetBox = getBox();
  targetBox.scale.set(3, 3, 3);
  scene.add(targetBox);

  // lights
  const ambiLight = new THREE.AmbientLight(0x333333); // soft white light
  scene.add(ambiLight);

  light = getLight();
  scene.add(light);

  // gui
  let guiLight = gui.addFolder("light")
  guiLight.add(light.position, "x", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  guiLight.add(light.position, "y", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  guiLight.add(light.position, "z", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  guiLight.add(light, "intensity", 0.1, 50).step(0.1);
  guiLight.add(light, "width", 0, 200).step(1);
  guiLight.add(light, "height", 0, 200).step(1);

  params.lookAt = new THREE.Vector3(0, 0, 0);
  guiLight.add(params.lookAt, "x", -WORLD_HALF_SIZE / 2, WORLD_HALF_SIZE / 2).step(0.1);
  guiLight.add(params.lookAt, "y", -WORLD_HALF_SIZE / 2, WORLD_HALF_SIZE / 2).step(0.1);
  guiLight.add(params.lookAt, "z", -WORLD_HALF_SIZE / 2, WORLD_HALF_SIZE / 2).step(0.1);
}

function updateTHREE() {
  // update fog
  scene.fog = new THREE.Fog(COLOR_BG, params.near, params.far);

  // update the light
  // (consider using a callback function rather than the code below.)
  targetBox.position.set(params.lookAt.x, params.lookAt.y, params.lookAt.z);
  light.lookAt(params.lookAt.x, params.lookAt.y, params.lookAt.z);
  light.children[0].scale.x = light.width; // the plane we added.
  light.children[0].scale.y = light.height;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_HALF_SIZE * 2, WORLD_HALF_SIZE * 2, 32);
  const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getLightPlane() {
  const geometry = new THREE.PlaneGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xFF00FF
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getLight() {
  // There is no shadow support.
  // Only MeshStandardMaterial and MeshPhysicalMaterial are supported.
  const w = 10;
  const h = 10;
  const intensity = 10;
  const light = new THREE.RectAreaLight(0xffffff, intensity, w, h);
  light.position.set(10, 10, 0);
  light.lookAt(0, 0, 0);

  let tPlane = getLightPlane();
  light.add(tPlane);

  // You have to include RectAreaLightUniformsLib into your scene and call init().
  //const reclightHelper = new THREE.RectAreaLightHelper(light);
  //light.add(reclightHelper);

  return light;
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