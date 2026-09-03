console.log("three.js Version: " + THREE.REVISION);

let container, gui;
let scene, camera, renderer;
let controls;

let time, frame = 0;
const fps = { value: 0 };

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
  pane.addBinding(params, 'fps', {
    label: 'FPS',
    readonly: true,
  });
  pane.addBinding(params, 'fps', {
    label: 'FPS Graph',
    readonly: true,
    view: 'graph',
    min: 0,
    max: 120,
  });
  pane.addBlade({ view: 'separator' });

  setupThree(); // *** 
  renderer.setAnimationLoop(animate);
}

function animate() {
  // update the frame count of three.js
  frame++;

  // update the time in milliseconds of three.js
  time = performance.now();

  // calculate the frames per second based on the time
  fps.value = 1000 / (time - (fps.last || time));
  fps.last = time;
  // update the fps value in the params object
  params.fps = fps.value.toFixed(2);

  // update the three.js scene
  updateThree(); // ***

  // update the values in the Tweakpane GUI
  pane.refresh();

  // render the three.js scene
  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});