let params = {
  // (add)
};

let groundMirror, verticalMirror;
let cube;

function setupThree() {
  renderer.setClearColor("#222222");

  cube = getBox();
  cube.position.set(0, 300, 0); //(x, y, z);
  cube.scale.x = 150;
  cube.scale.y = 150;
  cube.scale.z = 150;
  scene.add(cube);

  groundMirror = getCircleMirror();
  groundMirror.position.y = -100;
  groundMirror.rotateX(-Math.PI / 2);
  scene.add(groundMirror);

  verticalMirror = getPlaneMirror();
  verticalMirror.position.y = 500;
  verticalMirror.position.z = -500;
  scene.add(verticalMirror);
}

function updateThree() {
  //cube.material.color.set(params.color);
  // cube
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.01;

  // reflector
  let posArray = verticalMirror.geometry.attributes.position.array;
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    posArray[i + 2] = sin((x + y) * 0.05 + frame * 0.05) * 10;
  }
  verticalMirror.geometry.attributes.position.needsUpdate = true;
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
  let reflector = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777
  });

  return reflector;
}

function getPlaneMirror() {
  let geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
  let reflector = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x889999
  });
  return reflector;
}