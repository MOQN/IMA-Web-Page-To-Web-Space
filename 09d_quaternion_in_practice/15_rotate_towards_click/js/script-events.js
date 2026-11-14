window.addEventListener("resize", function () {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const pointerDown = new THREE.Vector2();
let clickPointerId = null;
let dragged = false;

// Only events that start on the 3D canvas can choose a target.
const canvasContainer = document.getElementById("container-three");
canvasContainer.addEventListener("pointerdown", function (event) {
  if (event.button !== 0) return;
  pointerDown.set(event.clientX, event.clientY);
  clickPointerId = event.pointerId;
  dragged = false;
});

window.addEventListener("pointermove", function (event) {
  if (event.pointerId !== clickPointerId) return;
  pointer.set(event.clientX, event.clientY);
  if (pointer.distanceTo(pointerDown) > 5) dragged = true;
});

window.addEventListener("pointerup", function (event) {
  if (event.pointerId !== clickPointerId) return;
  clickPointerId = null;
  if (dragged || !renderer || !plane) return;
  pointer.set(event.clientX, event.clientY);
  if (pointer.distanceTo(pointerDown) > 5) return; // OrbitControls drag
  if (event.target !== renderer.domElement) return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set(
    (event.clientX - rect.left) / rect.width * 2 - 1,
    -(event.clientY - rect.top) / rect.height * 2 + 1
  );
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(plane)[0];
  if (hit) {
    target.position.copy(hit.point);
    target.position.y += 20; // sphere center above the floor
  }
});
window.addEventListener("pointercancel", function () { clickPointerId = null; });
