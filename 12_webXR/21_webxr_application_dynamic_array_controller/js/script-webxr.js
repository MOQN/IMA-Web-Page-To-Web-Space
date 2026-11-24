const controllers = [];

function setupWebXR() {
  renderer.xr.enabled = true;

  const controllerModelFactory = new XRControllerModelFactory();

  for (let i = 0; i < 2; i++) {
    const controller = renderer.xr.getController(i);
    controller.addEventListener("selectstart", function () {
      controller.userData.isSelecting = true;
    });
    controller.addEventListener("selectend", function () {
      controller.userData.isSelecting = false;
    });
    controller.addEventListener("connected", function (event) {
      const ray = buildController(event.data);
      if (ray) controller.add(ray);
    });
    controller.addEventListener("disconnected", function () {
      controller.userData.isSelecting = false;
      const ray = controller.children[0];
      if (ray) controller.remove(ray);
    });
    scene.add(controller);
    controllers.push(controller);

    const grip = renderer.xr.getControllerGrip(i);
    grip.add(controllerModelFactory.createControllerModel(grip));
    scene.add(grip);
  }

  renderer.xr.addEventListener("sessionend", function () {
    for (const controller of controllers) {
      controller.userData.isSelecting = false;
    }
  });

  document.body.appendChild(XRButton.createButton(renderer));
}

function buildController(data) {
  let geometry, material;

  switch (data.targetRayMode) {
    case "tracked-pointer":
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3)
      );
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3)
      );

      material = new THREE.LineBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      });

      return new THREE.Line(geometry, material);

    case "gaze":
      geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, -1);
      material = new THREE.MeshBasicMaterial({
        opacity: 0.5,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      return mesh;
  }
}