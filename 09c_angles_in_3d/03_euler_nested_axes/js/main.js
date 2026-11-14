const params = { fps: 0, x: 30, y: 25, z: 0 };

let gimbal;
function setupThree() {
  gimbal = new Gimbal();
  scene.add(gimbal.mesh);

  setupGUI();
}
function updateThree() {
  gimbal.setAngles(params.x, params.y, params.z);
}
