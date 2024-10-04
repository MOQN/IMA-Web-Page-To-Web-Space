// https://threejs.org/docs/#api/en/geometries/PlaneGeometry

let torus;

function setupThree() {
  torus = getTorus();
  scene.add(torus);
  torus.scale.x = 100;
  torus.scale.y = 100;
  torus.scale.z = 30;
}

function updateThree() {
  torus.rotation.x += -0.01;
  torus.rotation.y += -0.02;
}

function getTorus() {
  const geometry = new THREE.TorusGeometry(1, 0.25, 16, 5); //(radius, tube, radialSegments, tubularSegments, arc)
  const material = new THREE.MeshNormalMaterial({
    //
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}