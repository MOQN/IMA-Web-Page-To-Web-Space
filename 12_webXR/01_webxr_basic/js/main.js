let params = {
  // (add)
};

let room;
let cube;

function setupThree() {
  // WebXR
  setupWebXR();

  // controls
  // controls = new OrbitControls(camera, renderer.domElement);  // ensure you comment this out when using WebXR.

  // room
  room = getRoom();
  scene.add(room);

  // lights
  const hemiLight = new THREE.HemisphereLight(0xa5a5a5, 0x898989, 3);
  scene.add(hemiLight);

  const direcLight = new THREE.DirectionalLight(0xffffff, 3);
  direcLight.position.set(1, 1, 1).normalize();
  scene.add(direcLight);

  // cube
  cube = getBox();
  cube.position.set(0, 4, 0);
  cube.scale.x = 1.5;
  cube.scale.y = 1.5;
  cube.scale.z = 1.5;
  scene.add(cube);
}

function updateThree() {
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.005;
}


///// UTILS /////

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({
    color: Math.random() * 0xffffff
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}


///// WebXR /////

function getRoom() {
  const geometry = new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0);
  const materials = new THREE.LineBasicMaterial({ color: 0xbcbcbc });
  const mesh = new THREE.LineSegments(geometry, materials);
  return mesh;
}

let controller, controllerGrip;
function setupWebXR() {
  renderer.xr.enabled = true;

  // controller 
  function onSelectStart() {
    this.userData.isSelecting = true;
  }
  function onSelectEnd() {
    this.userData.isSelecting = false;
  }
  controller = renderer.xr.getController(0);
  controller.addEventListener("selectstart", onSelectStart);
  controller.addEventListener("selectend", onSelectEnd);
  controller.addEventListener("connected", function (event) {
    this.add(buildController(event.data));
  });
  controller.addEventListener("disconnected", function () {
    this.remove(this.children[0]);
  });
  scene.add(controller);

  // controller grip
  const controllerModelFactory = new XRControllerModelFactory();
  controllerGrip = renderer.xr.getControllerGrip(0);
  controllerGrip.add(
    controllerModelFactory.createControllerModel(controllerGrip)
  );
  scene.add(controllerGrip);

  // display the XR Button
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
      return new THREE.Mesh(geometry, material);
  }
}

