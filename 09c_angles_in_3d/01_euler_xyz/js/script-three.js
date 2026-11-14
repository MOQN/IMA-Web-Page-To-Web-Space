console.log("three.js Version: " + THREE.REVISION);
let scene, camera, renderer, controls;
let timer, time = 0, delta = 0, frame = 0;

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 5, 12);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container-three").appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 2.5));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(3, 6, 5);
  scene.add(light);
  const grid = new THREE.GridHelper(18, 18, 0x555555, 0x353535);
  grid.position.y = -3;
  scene.add(grid);

  timer = new THREE.Timer();
  timer.connect(document);
  timer.reset();

  setupThree(); // ***

  renderer.setAnimationLoop(animate);
}

function animate() {
  frame++;
  timer.update();
  time = timer.getElapsed() * 1000; // milliseconds
  delta = timer.getDelta();
  params.fps = delta > 0 ? 1 / delta : 0;

  updateThree(); // ***

  updateGUI();
  controls.update();
  renderer.render(scene, camera);
}

function showInstruction(text, code = "") {
  const instruction = document.createElement("div");
  instruction.className = "instruction";
  instruction.textContent = text;

  if (code) {
    const snippet = document.createElement("pre");
    snippet.className = "instruction-code";
    snippet.textContent = code;
    instruction.appendChild(snippet);
  }

  document.body.appendChild(instruction);
  return instruction;
}
