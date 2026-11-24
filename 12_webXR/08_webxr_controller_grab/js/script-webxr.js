let grabbedBy = null;

const controllers = [];
const raycaster = new THREE.Raycaster();

function setupWebXR() {
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local-floor");

  document.body.append(VRButton.createButton(renderer));
  setupControllers();

  renderer.xr.addEventListener("sessionend", function() {
    return releaseBox(grabbedBy);
  });
}

function setupControllers() {
  for (let i = 0; i < 2; i++) {
    const controller = renderer.xr.getController(i);
    const grip = renderer.xr.getControllerGrip(i);

    let color;
    if (i === 0) {
      color = 0x5fcfff;
    } else {
      color = 0xff9d55;
    }

    const line = getControllerRay(color);
    controller.add(line);

    const marker = getGripMarker(color);
    grip.add(marker);

    controller.addEventListener("selectstart", function() {
      if (grabbedBy || !hitsBox(controller)) return;
      controller.attach(box);
      grabbedBy = controller;
      console.log("Box grabbed.");
    });
    controller.addEventListener("selectend", function() {
      return releaseBox(controller);
    });
    controller.addEventListener("disconnected", function() {
      return releaseBox(controller);
    });

    scene.add(controller, grip);
    controllers.push(controller);
  }
}

function hitsBox(controller) {
  if (!controller.visible) return false;
  raycaster.setFromXRController(controller);
  box.updateWorldMatrix(true, false);
  return raycaster.intersectObject(box).length > 0;
}

function releaseBox(controller) {
  if (!controller || grabbedBy !== controller) return;
  scene.attach(box);
  grabbedBy = null;
  console.log("Box released.");
}

function updateControllers() {
  let hover = false;
  for (let i = 0; i < controllers.length; i++) {
    if (hitsBox(controllers[i])) {
      hover = true;
      break;
    }
  }

  if (grabbedBy) {
    box.material.color.set(0x62efb0);
  } else if (hover) {
    box.material.color.set(0xffdc67);
  } else {
    box.material.color.set(0x55aaff);
  }
}

function getControllerRay(color) {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(), new THREE.Vector3(0, 0, -3),
  ]);
  const material = new THREE.LineBasicMaterial({ color });
  const line = new THREE.Line(geometry, material);
  return line;
}

function getGripMarker(color) {
  const geometry = new THREE.BoxGeometry(0.035, 0.035, 0.08);
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
