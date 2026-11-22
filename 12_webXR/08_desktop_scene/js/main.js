const params = { fps: 0 };

function setupThree() {
  const grid = new THREE.GridHelper(8, 8);
  scene.add(grid);

  const light = new THREE.HemisphereLight(0xffffff, 0x7788aa, 2);
  scene.add(light);

  const box = getBox();
  box.position.set(0, 1.3, -1.15);
  scene.add(box);

  setupGUI();
  showInstruction("Look for the box and the grid. Each grid square is one meter wide.");
}

function updateThree() {}

///// UTILS /////

function getBox() {
  const geometry = new THREE.BoxGeometry(0.24, 0.24, 0.24);
  const material = new THREE.MeshStandardMaterial({ color: 0x55aaff });
  return new THREE.Mesh(geometry, material);
}
