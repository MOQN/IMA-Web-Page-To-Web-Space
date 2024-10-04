// https://threejs.org/docs/#api/en/geometries/PlaneGeometry

let plane;

function setupThree() {
  plane = getPlane();
  scene.add(plane);
  plane.scale.x = 500;
  plane.scale.y = 500;
}

function updateThree() {
  plane.rotation.x += -0.01;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}