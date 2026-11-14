const params = { fps: 0 };

let controls;

function setupThree() {
  // controls
  controls = new TrackballControls(camera, renderer.domElement);

  scene.add(getSphere());
}

function updateThree() {
  controls.update();
}

window.addEventListener("resize", () => controls?.handleResize());

function getSphere() {
  const radius = 300;
  const geometry = new THREE.SphereGeometry(radius, 48, 32);
  const positionAttribute = geometry.attributes.position;
  const direction = new THREE.Vector3();

  for (let i = 0; i < positionAttribute.count; i++) {
    direction.fromBufferAttribute(positionAttribute, i).normalize();
    const bump = noise(
      (direction.x + 1) * 2,
      (direction.y + 1) * 2,
      (direction.z + 1) * 2
    );
    const distance = radius + (bump - 0.5) * 200;
    positionAttribute.setXYZ(i, direction.x * distance, direction.y * distance, direction.z * distance);
  }

  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  return new THREE.Mesh(geometry, material);
}
