// Move the mouse to look around.
// Press the left mouse button to move forward.
// Press the right mouse button to move backward.
// Press the arrow keys to look around.
// Press W, A, S, D to move.
// Press Q, E to rotate on the Z axis.

let params = {
  color: "#FFF"
};

const WORLD_HALF = 1000;
let plane;

function setupThree() {
  // controls
  clock = new THREE.Clock(); // check the updateThree() function
  controls = new FlyControls(camera, renderer.domElement);
  controls.movementSpeed = 100; // default: 1
  controls.rollSpeed = 0.25; // default: 0.005
  controls.autoForward = false;
  controls.dragToLook = false;

  // plane
  plane = getPlane();
  plane.position.y = -WORLD_HALF / 4;
  plane.rotation.x = -PI / 2;

  // boxes
  for (let i = 0; i < 100; i++) {
    let box = getBox();

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
}

function updateThree() {
  const delta = clock.getDelta();
  controls.update(delta);
  camera.position.y = 0;
  //console.log(delta);
  //console.log(camera.position);
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
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
  let posArray = geometry.attributes.position.array;
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

  scene.add(mesh);
  return mesh;
}