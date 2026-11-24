const params = { fps: 0 };

let box;

function setupThree() {
  createXRScene();

  setupGUI();

  setupWebXR();

  showInstruction("Enter AR and look around. Find the small blue box in front of your starting position.", "ARButton.createButton(renderer)");
}

function updateThree() {
  //
}

function createXRScene() {
  box = getBox();
  box.position.set(0, 0, -1.15);
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
