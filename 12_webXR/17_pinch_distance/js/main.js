const params = { fps: 0 };
let box;

function setupThree() {
  createScene();
  setupGUI();
  showInstruction("Bring your thumb and index finger together, then spread them. Watch the distance and pinch state above the box.", "const distance = fingertip.position.distanceTo(thumb.position)");
  setupWebXR();
}

function updateThree(xrFrame) {
  if (xrFrame) updateHands(xrFrame);
}

function createScene() {
  scene.add(new THREE.GridHelper(8, 8));
  const geometry = new THREE.BoxGeometry(0.24, 0.24, 0.24);
  const material = new THREE.MeshStandardMaterial({ color: 0x55aaff });
  box = new THREE.Mesh(geometry, material);
  box.position.set(0, 1.3, -0.48);
  scene.add(box);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7788aa, 2));
}
