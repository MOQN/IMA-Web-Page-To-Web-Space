let params = {
  fps: 0,
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const dragPosition = new THREE.Vector3();
const dragOffset = new THREE.Vector3();

let cubes = [];
let selected = null;
let pointerId = null;

function setupThree() {
  camera.position.set(700, 700, 1000);
  controls.target.set(0, 0, 0);
  controls.update();

  const plane = getPlane();
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  for (let i = 0; i < 20; i++) {
    const c = new Cube()
      .setPosition(random(-400, 400), 0, random(-400, 400))
      .setScale(random(40, 80));
    c.update();
    cubes.push(c);
  }
}

function updateThree() {
  for (let c of cubes) {
    c.update();
  }
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(2000, 2000, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0x555555,
    wireframe: true,
    side: THREE.DoubleSide
  });
  return new THREE.Mesh(geometry, material);
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  geometry.translate(0, 0.5, 0);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  return new THREE.Mesh(geometry, material);
}

class Cube {
  constructor() {
    this.pos = new THREE.Vector3();
    this.scl = new THREE.Vector3(1, 1, 1);
    this.mesh = getBox();
    scene.add(this.mesh);
  }
  setPosition(x, y, z) {
    this.pos.set(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    this.scl.set(w, h, d);
    return this;
  }
  update() {
    this.mesh.position.copy(this.pos);
    this.mesh.scale.copy(this.scl);
  }
}

function updateRay(event) {
  const canvasBounds = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
  mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;
  scene.updateMatrixWorld(true);
  camera.updateWorldMatrix(true, false);
  raycaster.setFromCamera(mouse, camera);
}

// Capture pointerdown before OrbitControls receives it.
window.addEventListener("pointerdown", onPointerDown, true);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("pointerup", onPointerUp);
window.addEventListener("pointercancel", onPointerUp);
window.addEventListener("lostpointercapture", onPointerUp);
window.addEventListener("blur", onPointerUp);

function onPointerDown(event) {
  if (event.target !== renderer.domElement || event.button !== 0 || !event.isPrimary || selected) return;
  updateRay(event);
  const intersections = raycaster.intersectObjects(cubes.map(c => c.mesh), false);
  if (intersections.length === 0) return;
  if (!raycaster.ray.intersectPlane(dragPlane, dragPosition)) return;

  selected = cubes.find(c => c.mesh === intersections[0].object);
  dragOffset.subVectors(selected.pos, dragPosition); // keep the grabbed point under the pointer
  selected.mesh.material.color.set(0x00ff00);
  controls.enabled = false;
  pointerId = event.pointerId;
  renderer.domElement.setPointerCapture(pointerId);
}

function onPointerMove(event) {
  if (!selected || event.pointerId !== pointerId) return;
  updateRay(event);
  if (raycaster.ray.intersectPlane(dragPlane, dragPosition)) {
    selected.pos.copy(dragPosition).add(dragOffset);
  }
}

function onPointerUp(event) {
  if (!selected || (event.type !== "blur" && event.pointerId !== pointerId)) return;
  selected.mesh.material.color.set(0xffffff);
  selected = null;
  controls.enabled = true;
  const releasedPointer = pointerId;
  pointerId = null;
  if (renderer.domElement.hasPointerCapture(releasedPointer)) {
    renderer.domElement.releasePointerCapture(releasedPointer);
  }
}
