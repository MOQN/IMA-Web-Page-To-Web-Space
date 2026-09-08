// https://threejs.org/docs/?q=sphere#api/en/geometries/SphereGeometry

let ball;

function setupThree() {
  ball = getSphere();
  scene.add(ball);
  ball.scale.x = 100;
  ball.scale.y = 100;
  ball.scale.z = 100;
}

function updateThree() {
  //
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 16); //(radius, widthSegments, heightSegments)
  const material = new THREE.MeshNormalMaterial({
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}