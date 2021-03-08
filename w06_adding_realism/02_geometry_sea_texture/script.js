const WORLD_HALF = 200;
let plane;
let texture;

function setupTHREE() {
  texture = new THREE.TextureLoader().load('assets/sea_dark.jpg');
  texture.offset.set(0, 0);
  texture.repeat.set(2, 2);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
  //texture.mapping = THREE.UVMapping

  plane = getPlane();
  scene.add(plane);
}

function updateTHREE() {

  let posArray = plane.geometry.attributes.position.array;
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    let z = posArray[i + 2];

    let xOffset = (x + frame) * 0.02;
    let yOffset = (y + frame) * 0.02;
    let amp = 6;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 2;

    posArray[i + 2] = noiseValue; // update the z value.
  }
  plane.geometry.attributes.position.needsUpdate = true;
}

function getPlane() {
  let geometry = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, 100, 100);
  let material = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide,
    map: texture
  });
  let mesh = new THREE.Mesh(geometry, material);
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
  params = {
    value1: 0,
    value2: 0,
    value3: 0
  };
  gui.add(params, "value1", -10, 10).step(10);
  gui
    .add(params, "value2")
    .min(-10)
    .max(10)
    .step(10);
  // .listen()
  // .onChange(callback)
  let folder = gui.addFolder("FolderName");
  folder.add(params, "value3", -10, 10).step(1);

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