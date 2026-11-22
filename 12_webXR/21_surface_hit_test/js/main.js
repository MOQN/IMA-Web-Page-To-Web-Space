const params = { fps: 0 };
let box;

function setupThree() {
  createScene();
  setupGUI();
  showInstruction("Move your aim across the floor or a table. Look for the green ring where the surface is detected.", "const hits = frame.getHitTestResults(hitSource)");
  setupWebXR();
}

function updateThree(xrFrame) {
  if (xrFrame) updatePlacement(xrFrame);
}

function createScene() {
  const geometry = new THREE.BoxGeometry(0.24, 0.24, 0.24);
  const material = new THREE.MeshStandardMaterial({ color: 0x55aaff });
  box = new THREE.Mesh(geometry, material);
  box.visible = false;
  scene.add(box);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7788aa, 2));
}
