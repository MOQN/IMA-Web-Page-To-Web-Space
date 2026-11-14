const params = { fps: 0, x: 0, y: 0, z: 0 };

let model;
function setupThree() {
  model = new Model();
  scene.add(model.mesh);

  setupGUI();

  showInstruction(
    "Try the X, Y and Z sliders one at a time. Then mix them!",
    "model.mesh.rotation.set(x, y, z, \"XYZ\");"
  );
}
function updateThree() {
  const x = THREE.MathUtils.degToRad(params.x);
  const y = THREE.MathUtils.degToRad(params.y);
  const z = THREE.MathUtils.degToRad(params.z);
  model.mesh.rotation.set(x, y, z, "XYZ");
}
