let params = { fps: 0 };

let controls;

// Move the mouse to look around.
// Press the left mouse button to move forward.
// Press the right mouse button to move backward.
// Press the arrow keys to look around.
// Press W, A, S, D to move.
// Press Q, E to rotate on the Z axis.

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
let plane;

function setupThree() {
  // controls
  controls = new FlyControls(camera, renderer.domElement);
  controls.movementSpeed = 100; // default: 1
  controls.rollSpeed = 0.25; // default: 0.005
  controls.autoForward = false;
  controls.dragToLook = false;

  pane.addBinding(controls, "movementSpeed", { label: "Move Speed", min: 25, max: 500 });
  pane.addBinding(controls, "rollSpeed", { label: "Turn Speed", min: 0.05, max: 1 });
  pane.addBinding(controls, "autoForward", { label: "Auto Forward" });
  pane.addBinding(controls, "dragToLook", { label: "Drag to Look" });

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
}

function updateThree() {
  controls.update(delta);
  camera.position.y = 0;
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
  let positionAttribute = geometry.attributes.position;
  for (let i = 0; i < positionAttribute.array.length; i += 3) {
    let x = positionAttribute.array[i + 0];
    let y = positionAttribute.array[i + 1];
    let z = positionAttribute.array[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.005;
    let yOffset = (y + WORLD_HALF) * 0.005;
    let amp = 6;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    positionAttribute.array[i + 2] = noiseValue; // update the z value.
  }

  return mesh;
}