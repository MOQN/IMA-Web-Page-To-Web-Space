console.log("three.js Version: " + THREE.REVISION);

let container;
let scene, camera, renderer;
let controls;
let timer, time = 0, delta = 0, frame = 0;

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.set(500, 350, 800);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

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
