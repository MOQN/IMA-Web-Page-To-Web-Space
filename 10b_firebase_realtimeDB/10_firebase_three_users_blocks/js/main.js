const params = { fps: 0, color: "#ffffff" };

const users = new Map();
const blocks = new Map();

const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

let plane;

let startX, startY;

function setupThree() {
  camera.position.set(500, 600, 900);
  const controls = new OrbitControls(camera, renderer.domElement);

  plane = getPlane();
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
  scene.add(new THREE.AmbientLight(0xffffff, 1));

  renderer.domElement.addEventListener("pointerdown", function (event) {
    startX = event.clientX;
    startY = event.clientY;
  });
  renderer.domElement.addEventListener("pointerup", editBlocks);

  setupDB();
  controls.addEventListener("change", shareUser);
  pane.addBinding(params, "color", { label: "My Color" }).on("change", shareUser);

  pane.addButton({ title: "Reset Data" }).on("click", resetData);

  pane.addButton({ title: "Open Another Window" }).on("click", function () {
    window.open(window.location.href, "_blank", "noopener");
  });

  showInstruction("Move around and see yourself in another window. Click the floor to add a block. Shift-click a block to remove it.");
}

function updateThree() {
  //
}

function editBlocks(event) {
  if (event.button !== 0 || dist(startX, startY, event.clientX, event.clientY) > 4) return;

  const bounds = renderer.domElement.getBoundingClientRect();
  pointer.x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
  pointer.y = 1 - (event.clientY - bounds.top) / bounds.height * 2;
  raycaster.setFromCamera(pointer, camera);

  const targets = [plane];
  blocks.forEach(function (block) {
    targets.push(block);
  });
  const intersections = raycaster.intersectObjects(targets);
  const hit = intersections[0];
  if (!hit) return;

  if (hit.object === plane && !event.shiftKey) {
    addBlock(hit.point.x, hit.point.z);
  } else if (hit.object !== plane && event.shiftKey) {
    removeBlock(hit.object.userData.key);
  }
}

function showUser(key, data) {
  let user = users.get(key);
  if (!user) {
    const sphere = getSphere();
    scene.add(sphere);
    users.set(key, sphere);
    user = sphere;
  }

  user.position.set(data.x, data.y, data.z);
  user.material.color.set(data.color);
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(2000, 2000, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0x555555,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getBlock(key, data) {
  const geometry = new THREE.BoxGeometry(80, 80, 80);
  let color = data.color;
  if (color === null || color === undefined) {
    color = floor(random(0x1000000));
  }
  const material = new THREE.MeshLambertMaterial({ color: color });
  const block = new THREE.Mesh(geometry, material);
  block.position.set(data.x, 40, data.z);
  block.userData.key = key;
  return block;
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(20, 16, 12);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
