const params = { fps: 0, axis: "Y", angle: 0, qx: 0, qy: 0, qz: 0, qw: 1 };

let model, arrow;
const axis = new THREE.Vector3();
function setupThree() {
  model = new Model();
  arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 3, 0xffff00);
  scene.add(model.mesh, arrow);

  setupGUI();

  showInstruction(
    "Pick an axis and slide the angle. That is all you need to build a rotation!",
    "model.mesh.quaternion.setFromAxisAngle(axis, THREE.MathUtils.degToRad(params.angle));"
  );
}
function updateThree() {
  if (params.axis === "X") axis.set(1, 0, 0);
  if (params.axis === "Y") axis.set(0, 1, 0);
  if (params.axis === "Z") axis.set(0, 0, 1);
  if (params.axis === "Diagonal") axis.set(1, 1, 1).normalize();
  arrow.setDirection(axis);
  model.mesh.quaternion.setFromAxisAngle(axis, THREE.MathUtils.degToRad(params.angle));
}
