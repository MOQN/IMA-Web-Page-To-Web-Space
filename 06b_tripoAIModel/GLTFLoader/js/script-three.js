console.log("three.js Version: " + THREE.REVISION);

let container, pane;
let scene, camera, renderer;
let controls;
let previousTime;

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
  });
  pane.addBinding(params, "fps", {
    label: "FPS Graph",
    readonly: true,
    view: "graph",
    min: 0,
    max: 120,
  });
  pane.addBlade({ view: "separator" });


  setupThree(); // load the model

  renderer.setAnimationLoop(animate);
}

function animate() {
  const time = performance.now();
  const deltaTime = previousTime === undefined ? 0 : (time - previousTime) / 1000;
  previousTime = time;
  params.fps = deltaTime > 0 ? (1 / deltaTime).toFixed(2) : "0.00";

  updateThree(deltaTime); // update the model

  pane.refresh();

  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});