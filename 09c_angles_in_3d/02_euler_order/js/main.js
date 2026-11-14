const params = { fps: 0, x: 45, y: 60, z: 20, order: "ZYX" };

let left, right;
function setupThree() {
  left = new Model();
  right = new Model(0xff3300);
  left.mesh.position.x = -2.3;
  right.mesh.position.x = 2.3;
  scene.add(left.mesh, right.mesh);

  setupGUI();

  showInstruction(
    "Give both objects the same angles, then change the order on the right. See the difference?",
    "left.mesh.rotation.set(x, y, z, \"XYZ\");\nright.mesh.rotation.set(x, y, z, params.order);"
  );
}
function updateThree() {
  const x = THREE.MathUtils.degToRad(params.x);
  const y = THREE.MathUtils.degToRad(params.y);
  const z = THREE.MathUtils.degToRad(params.z);
  left.mesh.rotation.set(x, y, z, "XYZ");
  right.mesh.rotation.set(x, y, z, params.order);
}
