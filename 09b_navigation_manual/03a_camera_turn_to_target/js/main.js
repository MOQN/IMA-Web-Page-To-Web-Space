const params = {
  fps: 0,
  target: "left",
  mode: "instant",
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

const targets = {};
let goalCamera;

function setupThree() {
  camera.position.set(0, 100, 750);
  goalCamera = camera.clone();

  // plane
  const plane = getPlane();
  scene.add(plane);
  plane.position.y = -WORLD_HALF / 4;
  plane.rotation.x = -PI / 2;

  // Background boxes
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

  targets.left = addBox(-180, 0x44aaff);
  targets.right = addBox(180, 0xff8833);
  camera.lookAt(targets.left.position);

  pane.addBinding(params, "target", {
    label: "Target",
    options: { "Left (Blue)": "left", "Right (Orange)": "right" },
  });
  pane.addBinding(params, "mode", {
    label: "Turn",
    options: { Instant: "instant", Smooth: "smooth" },
  });
}

function updateThree() {
  const target = targets[params.target].position;

  if (params.mode === "instant") {
    camera.lookAt(target);
  } else {
    // Find the target orientation without turning the visible camera yet.
    goalCamera.lookAt(target);
    const turnStep = Math.PI / 180; // one degree per frame
    camera.quaternion.rotateTowards(goalCamera.quaternion, turnStep);
  }
}

function addBox(x, color) {
  const geometry = new THREE.BoxGeometry(100, 100, 100);
  const material = new THREE.MeshBasicMaterial({ color });
  const box = new THREE.Mesh(geometry, material);
  box.position.set(x, 50, 0);
  scene.add(box);
  return box;
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
