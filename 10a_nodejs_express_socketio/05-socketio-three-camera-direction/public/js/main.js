const params = {
  fps: 0,
  color: "#ffffff"
};

const instructionText = "The white tip shows where each user is looking.";

let controls;
let connectionStatus;

let socket;
let users = {};

function setupThree() {
  const color = new THREE.Color(Math.floor(Math.random() * 0x1000000));
  params.color = "#" + color.getHexString();

  // Give each viewer a different start so their cones do not cover each other.
  const startPosition = new THREE.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1);
  startPosition.setLength(1000);
  startPosition.y = 600;
  camera.position.copy(startPosition);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  const plane = getPlane();
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  controls.addEventListener("change", sendViaSocket);

  setupSocket();

  pane.addBinding(params, "color", { label: "My Color" }).on("change", sendViaSocket);

  pane.addButton({ title: "Open Another Window" }).on("click", function () {
    window.open(window.location.href, "_blank", "noopener");
  });

  const instruction = showInstruction(instructionText, "Connecting…");
  connectionStatus = instruction.querySelector(".instruction-code");
}

function updateThree() {
  // Received positions are applied right away in this step.
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
}

function sendViaSocket() {
  if (!socket || !socket.connected) return;

  const data = {
    x: Number(camera.position.x.toFixed(2)),
    y: Number(camera.position.y.toFixed(2)),
    z: Number(camera.position.z.toFixed(2)),
    color: params.color
  };
  data.quaternion = {
    x: camera.quaternion.x,
    y: camera.quaternion.y,
    z: camera.quaternion.z,
    w: camera.quaternion.w
  };
  socket.emit("message_name", data);
}

function receiveViaSocket(data) {
  console.log("Received message_name:", data);
  if (data.id === socket.id) return;

  let user = users[data.id];
  if (!user) {
    user = getCone();
    scene.add(user);
    users[data.id] = user;
  }

  user.material.color.set(data.color);
  user.position.set(data.x, data.y, data.z);
  user.quaternion.set(
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

function getCone() {
  const geometry = new THREE.ConeGeometry(40, 120, 16);
  // Point the cone along the camera's local forward direction (-Z).
  geometry.rotateX(-Math.PI / 2);
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
