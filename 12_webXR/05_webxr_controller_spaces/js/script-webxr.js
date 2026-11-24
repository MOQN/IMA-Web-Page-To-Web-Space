function setupWebXR() {
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local-floor");

  document.body.append(VRButton.createButton(renderer));
  setupControllers();
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

    controller.addEventListener("connected", function (event) {
      console.log("Controller connected:", event.data.handedness);
    });

    scene.add(controller, grip);
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
