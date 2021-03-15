let sphere;
let texture;

function setupTHREE() {
  texture = new THREE.CanvasTexture(img.canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;

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
    displacementScale: 0.3
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

///// p5.js /////
let canvas;
let img;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  //canvas.hide();

  img = createImage(300, 300);
  background(100);

  initTHREE();
}

function draw() {
  img.loadPixels();
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let xOff = x * 0.015 + frameCount * 0.010;
      let yOff = y * 0.015 + frameCount * 0.010;
      let brightness = noise(xOff, yOff) * 255;
      img.pixels[index + 0] = brightness; // red
      img.pixels[index + 1] = brightness; // green
      img.pixels[index + 2] = brightness; // blue
      img.pixels[index + 3] = 255; // alpha
    }
  }
  img.updatePixels();
  //image(img, 0, 0); // uncomment this line and see the img in the canvas

  texture.needsUpdate = true; // ***
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