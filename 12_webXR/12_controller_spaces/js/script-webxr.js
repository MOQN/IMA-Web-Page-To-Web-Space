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

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(), new THREE.Vector3(0, 0, -3),
      ]),
      new THREE.LineBasicMaterial({ color }),
    );
    controller.add(line);
    const marker = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.035, 0.08),
      new THREE.MeshBasicMaterial({ color }),
    );
    grip.add(marker);
    scene.add(controller, grip);
  }
}

