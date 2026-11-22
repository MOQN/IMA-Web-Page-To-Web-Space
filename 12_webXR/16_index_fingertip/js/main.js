const params = { fps: 0 };
let box;

function setupThree() {
  createScene();
  setupGUI();
  showInstruction("Set the controllers down and hold up a hand. The blue sphere follows the index fingertip.", "frame.getJointPose(hand.get('index-finger-tip'), referenceSpace)");
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
