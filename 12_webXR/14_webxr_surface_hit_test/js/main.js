const params = { fps: 0 };

let box;

function setupThree() {
  createXRScene();

  setupGUI();

  setupWebXR();

  showInstruction("Move your aim across the floor or a table. Look for the green ring where the surface is detected.", "const hits = frame.getHitTestResults(hitSource)");
}

function updateThree(xrFrame) {
  if (xrFrame) updatePlacement(xrFrame);
}

function createXRScene() {
  box = getBox();
  box.visible = false;
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
