let cube;
let texture;

function setupTHREE() {
  texture = new THREE.CanvasTexture(img.canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;

  cube = getBox();
}

function updateTHREE() {
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.01;

  cube.scale.x = 10.0;
  cube.scale.y = 10.0;
  cube.scale.z = 10.0;
}

function getBox() {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshBasicMaterial({
    //wireframe: true
    map: texture
  });
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
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
      img.pixels[index + 0] = random(255); // red
      img.pixels[index + 1] = random(255); // green
      img.pixels[index + 2] = random(255); // blue
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

  renderer.render(scene, camera);
}

// event listeners
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}