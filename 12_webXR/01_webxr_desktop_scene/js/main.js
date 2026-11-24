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

  showInstruction(
    "Each grid square is 1 scene unit wide. In VR, that is 1 meter, and the box is 24 cm wide.",
    "const geometry = new THREE.BoxGeometry(0.24, 0.24, 0.24);"
  );
}

function updateThree() {
  //
}

///// UTILS /////

function getBox() {
  const geometry = new THREE.BoxGeometry(0.24, 0.24, 0.24);
  const material = new THREE.MeshStandardMaterial({ color: 0x55aaff });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
