console.log("three.js Version: " + THREE.REVISION);

let container, pane;
let scene, camera, renderer;
let controls;
let timer, time = 0, delta = 0, frame = 0;

function initThree() {
  scene = new THREE.Scene();

  const fov = 75;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 10000;
  camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  camera.position.z = 1000;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);


  pane = new Pane();
  pane.addBinding(params, "fps", {
    label: "FPS",
    readonly: true,
    format: function (value) {
      return value.toFixed(2);
    },
  });
  pane.addBinding(params, "fps", {
    label: "FPS Graph",
    readonly: true,
    view: "graph",
    min: 0,
    max: 120,
  });
  pane.addBlade({ view: "separator" });

  setupThree(); // ***

  timer = new THREE.Timer();
  timer.connect(document);
  timer.reset();

  renderer.setAnimationLoop(animate);
}

function animate() {
  frame++;
  timer.update();
  time = timer.getElapsed() * 1000; // milliseconds
  delta = timer.getDelta();
  params.fps = delta > 0 ? 1 / delta : 0;

  updateThree(); // ***

  pane.refresh();
  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});