const params = { fps: 0 };

let box;

function setupThree() {
  createXRScene();

  setupGUI();

  setupWebXR();

  showInstruction(
    "1. On your computer, open <strong>chrome://inspect/#devices</strong> in Chrome.\n" +
    "2. Find this Quest Browser tab and choose <strong>Inspect → Console</strong>.\n" +
    "3. In Quest, choose <strong>Enter VR</strong> and watch for the session log.",
    'console.log("VR session started.");'
  );
}

function updateThree() {
  //
}

function createXRScene() {
  const grid = new THREE.GridHelper(8, 8);
  scene.add(grid);

  box = getBox();
  box.position.set(0, 1.3, -1.15);
  scene.add(box);

  const light = new THREE.HemisphereLight(0xffffff, 0x7788aa, 2);
  scene.add(light);
}

function getBox() {
  const geometry = new THREE.BoxGeometry(0.24, 0.24, 0.24);
  const material = new THREE.MeshStandardMaterial({ color: 0x55aaff });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
