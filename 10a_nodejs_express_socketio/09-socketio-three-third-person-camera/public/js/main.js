const params = {
  fps: 0,
  color: "#ffffff",
  blockColor: "#ffcc66"
};

const instructionText = "WASD to move, Q/E to turn, Shift to run. Watch the camera follow your cone. Drag the shared block.";

let character;
let keys = {};

let connectionStatus;

let socket;
let users = {};

let pendingUpdate = false;
let lastSendTime = 0;

let sharedBlock;

let dragPointer = null;
let hasBlock = false;

let grabNumber = 0;
let grabPending = false;
let lastPointer = null;

let pointer, raycaster, dragPlane, dragPoint, dragOffset;

function setupThree() {
  const color = new THREE.Color(Math.floor(Math.random() * 0x1000000));
  params.color = "#" + color.getHexString();

  character = getCone();
  character.material.color.set(params.color);
  const startPosition = new THREE.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1);
  startPosition.setLength(300);
  startPosition.y = 40;
  character.position.copy(startPosition);
  scene.add(character);

  updateCamera(1);

  const plane = getPlane();
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  sharedBlock = getBox();
  sharedBlock.scale.set(80, 80, 80);
  sharedBlock.position.set(0, 40, 0);
  sharedBlock.material.color.set(params.blockColor);
  scene.add(sharedBlock);

  pointer = new THREE.Vector2();
  raycaster = new THREE.Raycaster();
  dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -40);
  dragPoint = new THREE.Vector3();
  dragOffset = new THREE.Vector3();

  window.addEventListener("keydown", function (event) {
    keys[event.code] = true;
  });
  window.addEventListener("keyup", function (event) {
    keys[event.code] = false;
  });

  renderer.domElement.addEventListener("pointerdown", startBlockDrag, { capture: true });
  renderer.domElement.addEventListener("pointermove", moveBlockDrag);
  renderer.domElement.addEventListener("pointerup", endBlockDrag);
  renderer.domElement.addEventListener("pointercancel", endBlockDrag);
  renderer.domElement.addEventListener("lostpointercapture", endBlockDrag);
  window.addEventListener("blur", function () {
    keys = {};
    endBlockDrag();
  });

  pane.addBinding(params, "color", { label: "My Color" }).on("change", function () {
    character.material.color.set(params.color);
    pendingUpdate = true;
  });
  pane
    .addBinding(params, "blockColor", { label: "Block Color" })
    .on("change", function () {
      if (socket.connected) socket.emit("block_color", params.blockColor);
    });

  pane.addButton({ title: "Open Another Window" }).on("click", function () {
    window.open(window.location.href, "_blank", "noopener");
  });

  const instruction = showInstruction(instructionText, "Connecting…");
  connectionStatus = instruction.querySelector(".instruction-code");
  setupSocket();
}

function updateThree() {
  if (dragPointer === null) {
    moveCharacter();
    updateCamera();
  }

  if (pendingUpdate && socket.connected && time - lastSendTime >= 50) {
    sendViaSocket();
  }

  const amount = 0.1;
  for (const id in users) {
    const user = users[id];
    user.position.lerp(user.userData.targetPosition, amount);
    user.quaternion.slerp(user.userData.targetQuaternion, amount);
  }
}

function moveCharacter() {
  let speed = 4;
  if (keys.ShiftLeft || keys.ShiftRight) speed = 8;

  if (keys.KeyQ) character.rotateY(0.025);
  if (keys.KeyE) character.rotateY(-0.025);

  if (keys.KeyW) character.translateZ(-speed);
  if (keys.KeyS) character.translateZ(speed);
  if (keys.KeyA) character.translateX(-speed);
  if (keys.KeyD) character.translateX(speed);

  character.position.x = THREE.MathUtils.clamp(character.position.x, -960, 960);
  character.position.z = THREE.MathUtils.clamp(character.position.z, -960, 960);

  if (keys.KeyW || keys.KeyA || keys.KeyS || keys.KeyD || keys.KeyQ || keys.KeyE) {
    pendingUpdate = true;
  }
}

function updateCamera(amount = 0.1) {
  const offset = new THREE.Vector3(100, 150, 350);
  offset.applyQuaternion(character.quaternion);
  offset.add(character.position);

  camera.position.lerp(offset, amount);
  camera.lookAt(character.position);
}

function setupSocket() {
  socket = io();

  socket.on("connect", function () {
    for (const id in users) removeUser(id);
    connectionStatus.textContent = "Connected.";
    sendViaSocket();
  });

  socket.on("disconnect", function () {
    connectionStatus.textContent = "Connecting…";
    endBlockDrag();
  });

  socket.on("message_name", receiveViaSocket);

  socket.on("users_state", function (data) {
    console.log("Received users_state:", data);
    for (const id in users) removeUser(id);
    for (const id in data) receiveViaSocket(data[id]);
  });

  socket.on("user_left", function (id) {
    console.log("Received user_left:", id);
    removeUser(id);
  });

  socket.on("block_state", receiveBlock);
}

function sendViaSocket() {
  if (!socket || !socket.connected) return;

  const data = {
    x: Number(character.position.x.toFixed(2)),
    y: Number(character.position.y.toFixed(2)),
    z: Number(character.position.z.toFixed(2)),
    color: params.color
  };
  data.quaternion = {
    x: character.quaternion.x,
    y: character.quaternion.y,
    z: character.quaternion.z,
    w: character.quaternion.w
  };
  socket.emit("message_name", data);
  lastSendTime = time;
  pendingUpdate = false;
}

function receiveViaSocket(data) {
  console.log("Received message_name:", data);
  if (data.id === socket.id) return;

  let user = users[data.id];
  if (!user) {
    user = getCone();
    user.userData.targetPosition = new THREE.Vector3();
    user.userData.targetQuaternion = new THREE.Quaternion();
    user.position.set(data.x, data.y, data.z);
    user.quaternion.set(
      data.quaternion.x,
      data.quaternion.y,
      data.quaternion.z,
      data.quaternion.w
    ).normalize();
    scene.add(user);
    users[data.id] = user;
  }

  user.material.color.set(data.color);
  user.userData.targetPosition.set(data.x, data.y, data.z);
  user.userData.targetQuaternion.set(
    data.quaternion.x,
    data.quaternion.y,
    data.quaternion.z,
    data.quaternion.w
  ).normalize();
}

function removeUser(id) {
  const user = users[id];
  if (!user) return;

  scene.remove(user);
  user.traverse(function (mesh) {
    mesh.geometry.dispose();
    mesh.material.dispose();
  });
  delete users[id];
}

function receiveBlock(data) {
  console.log("Received block_state:", data);
  sharedBlock.position.set(data.x, data.y, data.z);
  sharedBlock.material.color.set(data.color);
  params.blockColor = data.color;
  pane.refresh();
}

function setPointer(event) {
  const bounds = renderer.domElement.getBoundingClientRect();
  pointer.set(
    ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
    1 - ((event.clientY - bounds.top) / bounds.height) * 2
  );
  raycaster.setFromCamera(pointer, camera);
}

function startBlockDrag(event) {
  if (event.button !== 0 || !socket.connected || dragPointer !== null || grabPending)
    return;

  setPointer(event);
  if (raycaster.intersectObject(sharedBlock).length === 0) return;
  if (!raycaster.ray.intersectPlane(dragPlane, dragPoint)) return;

  dragOffset.copy(sharedBlock.position).sub(dragPoint);
  dragPointer = event.pointerId;
  lastPointer = event;
  renderer.domElement.setPointerCapture(event.pointerId);
  grabPending = true;

  const request = ++grabNumber;
  socket.timeout(3000).emit("block_grab", function (error, allowed) {
    grabPending = false;
    if (error || !allowed || dragPointer === null || request !== grabNumber) {
      if (!error && allowed) socket.emit("block_release");
      if (request === grabNumber) endBlockDrag();

      return;
    }

    hasBlock = true;
    moveBlockDrag(lastPointer);
  });
}

function moveBlockDrag(event) {
  if (event.pointerId !== dragPointer) return;

  lastPointer = event;
  if (!hasBlock || !socket.connected) return;

  setPointer(event);
  if (!raycaster.ray.intersectPlane(dragPlane, dragPoint)) return;

  dragPoint.add(dragOffset);
  socket.emit("block_update", {
    x: dragPoint.x,
    z: dragPoint.z
  });
}

function endBlockDrag(event) {
  if (dragPointer === null || (event && event.pointerId !== dragPointer)) return;

  const pointerId = dragPointer;
  dragPointer = null;
  grabNumber++;
  hasBlock = false;
  if (socket.connected) socket.emit("block_release");
  if (renderer.domElement.hasPointerCapture(pointerId)) {
    renderer.domElement.releasePointerCapture(pointerId);
  }
}

function getCone() {
  const geometry = new THREE.ConeGeometry(40, 120, 16);
  // Point the cone along the camera's local forward direction (-Z).
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
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
