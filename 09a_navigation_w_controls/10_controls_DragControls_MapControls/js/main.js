const params = { fps: 0, viewAngle: 62 };

const boxes = [];
const boxSize = 100;

let controlsMap;
let controlsDrag;

function setupThree() {
  camera.position.set(0, 850, 450);
  camera.lookAt(0, 0, 0);
  const plane = getPlane();
  plane.rotation.x = -PI / 2;
  scene.add(plane);

  addBox(-300, -200);
  addBox(0, 100);
  addBox(300, -100);

  const canvas = renderer.domElement;
  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const floorPoint = new THREE.Vector3();
  const grabOffset = new THREE.Vector3();
  const dragPosition = new THREE.Vector3();
  let hasFloorGrab = false;

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    pointer.y = -(event.clientY - rect.top) / rect.height * 2 + 1;
  }

  function getFloorPoint() {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.ray.intersectPlane(floor, floorPoint);
  }

  // Read the pointer before DragControls dispatches its drag events.
  canvas.addEventListener("pointerdown", updatePointer, true);
  canvas.addEventListener("pointermove", updatePointer, true);

  // Give the boxes first chance to handle the pointer.
  controlsDrag = new DragControls(boxes, camera, canvas);
  controlsDrag.mouseButtons.RIGHT = null;

  controlsMap = new MapControls(camera, canvas);
  controlsMap.enableRotate = false;
  controlsMap.minDistance = 300;
  controlsMap.maxDistance = 1800;
  controlsMap.listenToKeyEvents(window);

  controlsDrag.addEventListener("dragstart", ({ object }) => {
    dragPosition.copy(object.position);
    hasFloorGrab = Boolean(getFloorPoint());
    if (hasFloorGrab) grabOffset.copy(dragPosition).sub(floorPoint);
    object.material.color.set(0xff00ff);
    controlsMap.enabled = false;
  });

  controlsDrag.addEventListener("drag", ({ object }) => {
    if (getFloorPoint()) {
      if (!hasFloorGrab) grabOffset.copy(dragPosition).sub(floorPoint);
      hasFloorGrab = true;
      dragPosition.copy(floorPoint).add(grabOffset);
    }
    object.position.copy(dragPosition);
  });

  controlsDrag.addEventListener("dragend", ({ object }) => {
    object.material.color.set(0x00ff00);
    controlsMap.enabled = true;
  });

  const offset = new THREE.Vector3();
  const view = new THREE.Spherical();

  function updateViewAngle() {
    offset.copy(camera.position).sub(controlsMap.target);
    view.setFromVector3(offset);
    // Keep the camera slightly above the floor at the lowest angle.
    view.phi = THREE.MathUtils.degToRad(90 - Math.max(1, params.viewAngle));
    camera.position.copy(controlsMap.target).add(offset.setFromSpherical(view));
    controlsMap.update();
  }

  pane.addBinding(params, "viewAngle", {
    label: "View Angle (°)", min: 0, max: 90, step: 1,
  }).on("change", updateViewAngle);
  updateViewAngle();
}

function updateThree() {
  //
}

function addBox(x, z) {
  const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const box = new THREE.Mesh(geometry, material);
  box.position.set(x, boxSize / 2, z);
  boxes.push(box);
  scene.add(box);
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(2000, 2000, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0x666666,
    wireframe: true,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geometry, material);
}
