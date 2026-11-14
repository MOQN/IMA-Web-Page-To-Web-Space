const params = { fps: 0, x: 1, y: 1, z: 1, status: "Ready" };

let model, arrow;
const forward = new THREE.Vector3(0, 0, 1);
const direction = new THREE.Vector3();
function setupThree() {
  model = new Model();
  arrow = new THREE.ArrowHelper(forward, new THREE.Vector3(), 3, 0xffff00);
  scene.add(model.mesh, arrow);

  setupGUI();

  showInstruction(
    "Change the target direction. The arrow turns to point that way!",
    "model.mesh.quaternion.setFromUnitVectors(forward, direction);"
  );
}
function updateThree() {
  direction.set(params.x, params.y, params.z);
  if (direction.lengthSq() < 0.000001) {
    arrow.visible = false;
    params.status = "Zero vector: no direction";
    return;
  }
  params.status = "Ready";
  arrow.visible = true;
  direction.normalize();
  arrow.setDirection(direction);
  model.mesh.quaternion.setFromUnitVectors(forward, direction);
}
