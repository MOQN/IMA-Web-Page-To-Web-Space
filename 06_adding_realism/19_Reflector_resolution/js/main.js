let params = {
  fps: 0,
  resolutionScale: 0.5,
  reflectionSize: "",
};

let groundMirror, verticalMirror;
let cube;

function setupThree() {
  renderer.setClearColor("#222222");

  cube = getBox();
  scene.add(cube);
  cube.position.set(0, 300, 0); //(x, y, z);
  cube.scale.x = 150;
  cube.scale.y = 150;
  cube.scale.z = 150;

  groundMirror = getCircleMirror();
  scene.add(groundMirror);
  groundMirror.position.y = -100;
  groundMirror.rotateX(-Math.PI / 2);

  verticalMirror = getPlaneMirror();
  scene.add(verticalMirror);
  verticalMirror.position.y = 500;
  verticalMirror.position.z = -500;

  updateReflectionSize();
  pane.addBinding(params, "resolutionScale", { min: 0.25, max: 1, step: 0.25 })
    .on("change", updateReflectionSize);
  pane.addBinding(params, "reflectionSize", { readonly: true });
  window.addEventListener("resize", updateReflectionSize);
}

function updateReflectionSize() {
  // we use ceil() here to ensure the render target size is an integer and greater than zero!
  const width = ceil(window.innerWidth * params.resolutionScale);
  const height = ceil(window.innerHeight * params.resolutionScale);
  groundMirror.getRenderTarget().setSize(width, height);
  verticalMirror.getRenderTarget().setSize(width, height);
  params.reflectionSize = `${width} x ${height}`;
}

function updateThree() {
  //cube.material.color.set(params.color);
  // cube
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.01;

  // reflector
  let positionAttributes = verticalMirror.geometry.attributes.position;
  for (let i = 0; i < positionAttributes.array.length; i += 3) {
    let x = positionAttributes.array[i + 0];
    let y = positionAttributes.array[i + 1];
    positionAttributes.array[i + 2] = sin((x + y) * 0.05 + frame * 0.05) * 10;
  }
  positionAttributes.needsUpdate = true;
}

function getBox() {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshNormalMaterial({
    // (add)
  });
  let mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getPlane() {
  let geometry = new THREE.PlaneGeometry(1, 1, 1);
  let material = new THREE.MeshNormalMaterial({
    // (add)
  });
  let mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getCircleMirror() {
  let geometry = new THREE.CircleGeometry(400, 640);

  // Import Reflector from the Three.js addons before using it.
  // See index.html for the import setup!
  let reflector = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: 1,
    textureHeight: 1,
    color: 0x777777
  });

  return reflector;
}

function getPlaneMirror() {
  let geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
  geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);

  // Import Reflector from the Three.js addons before using it.
  // See index.html for the import setup!
  let reflector = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: 1,
    textureHeight: 1,
    color: 0x889999
  });
  return reflector;
}