const params = { fps: 0 };
let box;

function setupThree() {
  createScene();
  setupGUI();
  showInstruction("Aim at the box and press then release the main trigger to change its color.", "controller.addEventListener('select', onSelect)");
  setupWebXR();
}

function updateThree(xrFrame) {
  if (xrFrame) updateControllers();
}

function createScene() {
  scene.add(new THREE.GridHelper(8, 8));
  const geometry = new THREE.BoxGeometry(0.24, 0.24, 0.24);
  const material = new THREE.MeshStandardMaterial({ color: 0x55aaff });
  box = new THREE.Mesh(geometry, material);
  box.position.set(0, 1.3, -1.15);
  scene.add(box);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7788aa, 2));
}
