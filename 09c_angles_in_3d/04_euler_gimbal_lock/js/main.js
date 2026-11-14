const params = { fps: 0, x: 0, y: 90, z: 0 };

let gimbal;
function setupThree() {
  gimbal = new Gimbal();
  scene.add(gimbal.mesh);
}
function updateThree() {
  gimbal.setAngles(params.x, params.y, params.z);
}
