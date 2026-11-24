const params = { fps: 0 };

let box;

function setupThree() {
  createXRScene();

  setupGUI();

  setupWebXR();

  showInstruction("Aim until you see the green ring and use the primary select action. Aim elsewhere and select again.", "reticle.matrix.decompose(box.position, box.quaternion, scale)");
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
