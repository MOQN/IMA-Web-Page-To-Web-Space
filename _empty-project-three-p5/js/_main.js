let cube;

function setupThree() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;
}

function updateThree() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}