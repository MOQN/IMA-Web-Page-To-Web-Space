const params = { fps: 0, x: 30, y: 25, z: 0 };

let gimbal;
function setupThree() {
  gimbal = new Gimbal();
  scene.add(gimbal.mesh);

  setupGUI();

  showInstruction(
    "Turn the outer ring first, then the inner ones. Each axis moves with its parent!",
    "gimbal.setAngles(params.x, params.y, params.z);"
  );
}
function updateThree() {
  gimbal.setAngles(params.x, params.y, params.z);
}
