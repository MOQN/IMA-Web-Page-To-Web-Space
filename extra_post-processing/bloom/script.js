// http://jsfiddle.net/prisoner849/mjfckw02/
// https://threejs.org/examples/?q=bloom#webgl_postprocessing_unreal_bloom
// https://threejs.org/examples/?q=bloom#webgl_postprocessing_unreal_bloom_selective

function setupThree() {
  let light = new THREE.DirectionalLight(0xffffff, 0.75);
  light.position.setScalar(100);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));

  let boxDark = getDarkBox();
  boxDark.position.z = 0.25;

  let boxGlow = getGlowBox();
  boxGlow.position.z = -2.25;
}

function updateThree() {
  renderer.autoClear = false;
  renderer.clear();

  camera.layers.set(1);
  composer.render();

  renderer.clearDepth();
  camera.layers.set(0);
}

function getDarkBox() {
  let geometry = new THREE.BoxGeometry(5, 5, 4);
  let material = new THREE.MeshLambertMaterial({
    color: 0x150505,
    wireframe: false
  });
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh); // *** reorganize ***
  return mesh;
}

function getGlowBox() {
  let geometry = new THREE.BoxGeometry(5, 5, 1);
  let material = new THREE.MeshBasicMaterial({
    color: "red",
    wireframe: false
  });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.layers.enable(1); // ***
  scene.add(mesh); // *** reorganize ***
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
  console.log(THREE.REVISION);

  // scene
  scene = new THREE.Scene();

  // camera (fov, ratio, near, far)
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.5,
    10000
  );
  camera.position.set(-5, 5, 5);
  camera.layers.enable(1);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor("#333333");
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // container
  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  // controls
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  // COMPOSER
  renderScene = new THREE.RenderPass(scene, camera)

  effectFXAA = new THREE.ShaderPass(THREE.FXAAShader)
  effectFXAA.uniforms.resolution.value.set(1 / window.innerWidth, 1 / window.innerHeight)

  bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
  bloomPass.threshold = 0.21
  bloomPass.strength = 1.2
  bloomPass.radius = 0.55
  bloomPass.renderToScreen = true

  composer = new THREE.EffectComposer(renderer)
  composer.setSize(window.innerWidth, window.innerHeight)

  composer.addPass(renderScene)
  composer.addPass(effectFXAA)
  composer.addPass(bloomPass)

  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.toneMappingExposure = Math.pow(0.9, 4.0)

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

  setupThree();

  // let's draw!
  renderer.setAnimationLoop(animate);
}

function animate() {
  stats.update();
  time = performance.now();
  frame++;

  updateThree();

  renderer.render(scene, camera);
}

// event listeners
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}