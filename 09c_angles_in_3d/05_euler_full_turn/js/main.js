const params = { fps: 0, angle: 0, turns: 0 };

let model, reference;
function setupThree() {
  model = new Model();
  reference = new Model(0xffffff);
  model.mesh.position.x = -2.3;
  reference.mesh.position.x = 2.3;
  scene.add(model.mesh, reference.mesh);

  setupGUI();
}
function updateThree() {
  model.mesh.rotation.y = THREE.MathUtils.degToRad(params.angle);
}
