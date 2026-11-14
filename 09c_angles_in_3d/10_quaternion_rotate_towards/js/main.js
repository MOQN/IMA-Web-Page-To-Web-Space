const params = { fps: 0, x: 45, y: 120, speed: 60, paused: false, remaining: 0 };

let current, target;
const targetAngles = new THREE.Euler();
function setupThree() {
  current = new Model(); target = new Model(0xff3300);
  current.mesh.position.x = -2.3; target.mesh.position.x = 2.3;
  scene.add(current.mesh, target.mesh);

  setupGUI();
}
function updateThree() {
  targetAngles.set(THREE.MathUtils.degToRad(params.x), THREE.MathUtils.degToRad(params.y), 0, "XYZ");
  target.mesh.quaternion.setFromEuler(targetAngles);
  if (!params.paused) {
    const step = THREE.MathUtils.degToRad(params.speed) * delta;
    current.mesh.quaternion.rotateTowards(target.mesh.quaternion, step);
  }
}
