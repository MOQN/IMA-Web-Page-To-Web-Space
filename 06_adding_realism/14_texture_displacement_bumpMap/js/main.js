let params = {
  fps: 0,
  showTexture: false,
  displacementScale: 0.05,
};

let sphere, bumpSphere;
let texture;

function setupThree() {
  // texture = new THREE.TextureLoader().load('assets/cubeGrid.png');
  // texture = new THREE.TextureLoader().load('assets/asteroid.png');
  // texture = new THREE.TextureLoader().load('assets/earth.png');
  texture = new THREE.TextureLoader().load('assets/moon.png');
  texture.colorSpace = THREE.SRGBColorSpace;

  sphere = getSphere();
  bumpSphere = getSphere(true);
  scene.add(sphere, bumpSphere);
  sphere.position.x = -350;
  bumpSphere.position.x = 350;
  sphere.scale.setScalar(250);
  bumpSphere.scale.setScalar(250);

  const light = getLight();
  scene.add(light);
  light.position.set(0, 400, 800);

  pane.addBinding(params, "showTexture", {
    label: "Texture",
  }).on("change", function () {
    for (const mesh of [sphere, bumpSphere]) {
      mesh.material.map = params.showTexture ? texture : null;
      mesh.material.needsUpdate = true;
    }
  });

  pane.addBinding(params, "displacementScale", {
    label: "Displacement Scale",
    min: 0,
    max: 0.3,
    step: 0.005,
  }).on("change", function () {
    sphere.material.displacementScale = params.displacementScale;
    bumpSphere.material.displacementScale = params.displacementScale;
  });

  pane.addBinding(bumpSphere.material, "bumpScale", {
    label: "Bump Scale",
    min: 0,
    max: 5,
    step: 0.01,
  });

  pane.addBinding(light.position, "x", {
    min: -2000,
    max: 2000,
    step: 1,
  });
  pane.addBinding(light.position, "y", {
    min: -2000,
    max: 2000,
    step: 1,
  });
  pane.addBinding(light.position, "z", {
    min: -2000,
    max: 2000,
    step: 1,
  });
}

function updateThree() {
  //
}

function getLight() {
  const light = new THREE.PointLight(0xffffff, 1, 2000, 0.01);
  return light;
}

function getSphere(useBumpMap = false) {
  const geometry = new THREE.SphereGeometry(1, 360, 360);
  // *** Use MeshStandardMaterial!
  const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: params.showTexture ? texture : null,
    // while displacement moves vertices;
    displacementMap: texture,
    displacementScale: params.displacementScale,
    // bump mapping adds surface detail to the lighting!
    bumpMap: useBumpMap ? texture : null,
    bumpScale: 1,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}