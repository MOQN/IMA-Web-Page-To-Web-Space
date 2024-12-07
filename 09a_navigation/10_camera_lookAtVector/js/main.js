// About Quaternion
// https://www.youtube.com/watch?v=jTgdKoQv738
// https://www.youtube.com/watch?v=zjMuIxRvygQ
// https://www.youtube.com/watch?v=d4EgbgTm0Bg

let params = {
  color: "#FFF"
};

const WORLD_HALF = 1000;

let plane;
let cube;

function setupThree() {
  // plane
  plane = getPlane();
  scene.add(plane);
  plane.position.y = -WORLD_HALF / 4;
  plane.rotation.x = -PI / 2;


  // boxes
  for (let i = 0; i < 100; i++) {
    let box = getBox();
    scene.add(box);

    box.position.x = random(-WORLD_HALF, WORLD_HALF);
    box.position.y = random(-WORLD_HALF / 2, WORLD_HALF);
    box.position.z = random(-WORLD_HALF, WORLD_HALF);

    box.rotation.x = random(TWO_PI);
    box.rotation.y = random(TWO_PI);
    box.rotation.z = random(TWO_PI);

    const size = random(1, 20);
    box.scale.x = size;
    box.scale.y = size;
    box.scale.z = size;

    box.material.transparent = true;
    box.material.opacity = random(0.4, 0.7);
  }

  // pink cube
  cube = getBox();
  scene.add(cube);
  cube.scale.set(100, 20, 20);
  cube.material.color.r = 1.0;
  cube.material.color.g = 0.0;
  cube.material.color.b = 1.0;

  // gui
  gui.add(camera.position, "z", 10, 500).step(1);
}

function updateThree() {
  camera.position.x = cos(frame * 0.010) * 300;
  camera.position.y = sin(frame * 0.005) * 100;
  camera.lookAt(0, 0, 0);

  let lookAtVector = new THREE.Vector3(0, 0, -1);
  lookAtVector.applyQuaternion(camera.quaternion);
  // or
  //let lookAtVector = new THREE.Vector3(); 
  //camera.getWorldDirection(lookAtVector);
  lookAtVector.multiplyScalar(300.0); // distance from the camera

  let targetPos = new THREE.Vector3().addVectors(camera.position, lookAtVector); // camera position + lookAtVector
  cube.position.copy(targetPos);

  cube.setRotationFromQuaternion(camera.quaternion);
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  //console.log(geometry.attributes.position.array);
  let posArray = geometry.attributes.position.array; // REORGANIZE
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    let z = posArray[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.005;
    let yOffset = (y + WORLD_HALF) * 0.005;
    let amp = 6;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    posArray[i + 2] = noiseValue; // update the z value.
  }

  return mesh;
}