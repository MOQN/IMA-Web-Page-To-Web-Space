const params = { fps: 0 };
let box;

function setupThree() {
  createScene();
  setupGUI();
  showInstruction("Click the box twice. Move the pointer away after each click to see the new color.", "raycaster.intersectObject(box)");
  camera.updateWorldMatrix(true, false);
  setupPointer();
}

function updateThree() {
  updatePointer();
}

function createScene() {
  scene.add(new THREE.GridHelper(8, 8));
  const geometry = new THREE.BoxGeometry(0.24, 0.24, 0.24);
  const material = new THREE.MeshStandardMaterial({ color: 0x55aaff });
  box = new THREE.Mesh(geometry, material);
  box.position.set(0, 1.3, -1.15);
  scene.add(box);
  box.updateWorldMatrix(true, false);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7788aa, 2));
}

let boxColor = 0x55aaff;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerActive = false;

function readPointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    1 - ((event.clientY - rect.top) / rect.height) * 2,
  );
  pointerActive = true;
}

function setupPointer() {
  renderer.domElement.addEventListener("pointermove", readPointer);
  renderer.domElement.addEventListener("pointerleave", function() { pointerActive = false; });
  renderer.domElement.addEventListener("click", function(event) {
    readPointer(event);
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.intersectObject(box).length) {
      if (boxColor === 0x55aaff) {
        boxColor = 0xc084fc;
      } else {
        boxColor = 0x55aaff;
      }
    }
  });
}

function updatePointer() {
  raycaster.setFromCamera(pointer, camera);
  const hover = pointerActive && raycaster.intersectObject(box).length > 0;

  if (hover) {
    box.material.color.set(0xffdc67);
  } else {
    box.material.color.set(boxColor);
  }
}
