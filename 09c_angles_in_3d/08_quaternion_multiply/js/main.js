const params = { fps: 0, x: 60, y: 45 };

let left, right;
const qX = new THREE.Quaternion();
const qY = new THREE.Quaternion();
const axisX = new THREE.Vector3(1, 0, 0);
const axisY = new THREE.Vector3(0, 1, 0);
function setupThree() {
  left = new Model(); right = new Model(0xff3300);
  left.mesh.position.x = -2.3; right.mesh.position.x = 2.3;
  scene.add(left.mesh, right.mesh);

  setupGUI();

  showInstruction(
    "Try X then Y, and Y then X. Combining rotations in a different order changes the pose!",
    "left.mesh.quaternion.copy(qX).multiply(qY);\nright.mesh.quaternion.copy(qY).multiply(qX);"
  );
}
function updateThree() {
  qX.setFromAxisAngle(axisX, THREE.MathUtils.degToRad(params.x));
  qY.setFromAxisAngle(axisY, THREE.MathUtils.degToRad(params.y));
  // For fixed/world axes, the right-hand rotation is applied first.
  left.mesh.quaternion.copy(qX).multiply(qY);
  right.mesh.quaternion.copy(qY).multiply(qX);
}
