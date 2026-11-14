const params = { fps: 0, t: 0, eulerAngle: 170 };

let left, right;
const start = new THREE.Quaternion();
const end = new THREE.Quaternion();
function setupThree() {
  left = new Model(); right = new Model(0xff3300);
  left.mesh.position.x = -2.3; right.mesh.position.x = 2.3;
  scene.add(left.mesh, right.mesh);
  const axis = new THREE.Vector3(0, 1, 0);
  start.setFromAxisAngle(axis, THREE.MathUtils.degToRad(170));
  end.setFromAxisAngle(axis, THREE.MathUtils.degToRad(-170));
}
function updateThree() {
  const angle = THREE.MathUtils.lerp(170, -170, params.t);
  left.mesh.rotation.y = THREE.MathUtils.degToRad(angle);
  right.mesh.quaternion.slerpQuaternions(start, end, params.t);
}
