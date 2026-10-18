const params = {
  fps: 0,
  recomputeNormals: true,
  wireframe: false,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
let plane, updatedPlane;

function setupThree() {
  // original plane!
  plane = getPlane();

  // updatedPlane
  updatedPlane = plane.clone();
  updatedPlane.geometry = plane.geometry.clone();
  updatedPlane.geometry.computeVertexNormals();

  plane.position.x = -650;
  updatedPlane.position.x = 650;

  plane.scale.setScalar(0.6);
  updatedPlane.scale.setScalar(0.6);

  scene.add(plane, updatedPlane);

  // lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-1000, 1000, 1000);
  scene.add(light);

  const comparisonFolder = pane.addFolder({ title: "Comparison" });
  comparisonFolder.addBinding(params, "recomputeNormals").on("change", function () {
    if (params.recomputeNormals) {
      updatedPlane.geometry.computeVertexNormals();
    } else {
      updatedPlane.geometry.setAttribute(
        "normal", plane.geometry.attributes.normal.clone()
      );
    }
  });
  comparisonFolder.addBinding(params, "wireframe").on("change", function () {
    plane.material.wireframe = params.wireframe;
  });
}

function updateThree() {
  //
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 100, 100);
  const positionAttributes = geometry.attributes.position;
  for (let i = 0; i < positionAttributes.array.length; i += 3) {
    const x = positionAttributes.array[i + 0];
    const y = positionAttributes.array[i + 1];
    const xOffset = (x + WORLD_HALF) * 0.005;
    const yOffset = (y + WORLD_HALF) * 0.005;
    positionAttributes.array[i + 2] = (noise(xOffset, yOffset) * 9) ** 3; // z
  }
  positionAttributes.needsUpdate = true;

  const material = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geometry, material);
}
