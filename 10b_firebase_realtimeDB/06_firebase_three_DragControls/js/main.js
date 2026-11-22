let params = { fps: 0 };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let plane;
let objects = [];

function setupThree() {
  // controls
  const controlsOrbit = new OrbitControls(camera, renderer.domElement);
  const controlsDrag = new DragControls(objects, camera, renderer.domElement);

  // add event listener to show dragged objects as wireframes
  controlsDrag.addEventListener('dragstart', function (event) {
    event.object.material.wireframe = true;
    controlsOrbit.enabled = false; // ***
    draggedBox = event.object;
  });

  controlsDrag.addEventListener('dragend', function (event) {
    event.object.material.wireframe = false;
    controlsOrbit.enabled = true; // ***
    saveBoxPosition(event.object);
    draggedBox = null;
  });

  // plane
  plane = getPlane();
  plane.position.y = -WORLD_HALF / 4;
  plane.rotation.x = -PI / 2;
  scene.add(plane);

  // 27 cubes in the center.
  for (let y = 0; y < 3; y++) {
    for (let z = -1; z <= 1; z++) {
      for (let x = -1; x <= 1; x++) {
        const box = getBox();
        box.scale.setScalar(90);
        box.position.set(x * 92, plane.position.y + 45 + y * 92, z * 92);
        box.userData.originalPosition = box.position.clone();
        scene.add(box);
        objects.push(box);
      }
    }
  }

  setupDB();

  pane.addButton({ title: "Reset Data" }).on("click", resetData);

  pane.addButton({ title: "Open Another Window" }).on("click", function () {
    window.open(window.location.href, "_blank", "noopener");
  });

  showInstruction("Drag a cube!");
}

function updateThree() {
  //
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: floor(random(0x1000000)) });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0x555555,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}