const params = { fps: 0 };

let box;

function setupThree() {
  createXRScene();

  setupGUI();

  setupWebXR();

  showInstruction("Bring your thumb and index finger together, then spread them. Watch the distance and pinch state above the box.", "const distance = fingertip.position.distanceTo(thumb.position)");
}

function updateThree(xrFrame) {
  if (xrFrame) updateHands(xrFrame);
}

function createXRScene() {
  const grid = new THREE.GridHelper(8, 8);
  scene.add(grid);

  box = getBox();
  box.position.set(0, 1.3, -0.48);
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
