const params = { fps: 0 };

let controls;


function setupThree() {
  // controls
  controls = new ArcballControls(camera, renderer.domElement, scene);
  pane.addBinding(controls, "enableAnimations", { label: "Animations" });
  pane.addBinding(controls, "enableFocus", { label: "Double-Click Focus" });
  pane.addBinding(controls, "cursorZoom", { label: "Zoom to Cursor" });

  scene.add(getSphere());
}

function updateThree() {
  // ArcballControls handles its own updates.
}

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
