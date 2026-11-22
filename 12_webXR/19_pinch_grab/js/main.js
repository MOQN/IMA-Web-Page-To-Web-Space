const params = { fps: 0 };
let box;

function setupThree() {
  createScene();
  setupGUI();
  showInstruction("Start a pinch at the box. Move your hand and open your fingers to release.", "midpoint.copy(fingertip.position).lerp(thumb.position, 0.5)");
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
