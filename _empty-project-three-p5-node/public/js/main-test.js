let params = {
  color: "#FFF",
};
let cubes = {}; // Stores cubes for each client
let guiControllers = {};

function setupThree() {
  setupSocket();
}

function updateThree() {
  for (const clientId in cubes) {
    const cube = cubes[clientId];
    cube.material.color.set(params.color);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  return new THREE.Mesh(geometry, material);
}

function setupSocket() {
  socket = io.connect();
  socket.on("connect", () => {
    // Emit a message to the server to notify of new client connection
    socket.emit("new_client");
  });

  socket.on("initialize_cube", (clientId) => {
    createCubeForClient(clientId);
  });

  socket.on("update_cube", (data) => {
    updateCubeFromSocket(data);
  });

  socket.on("client_disconnected", (clientId) => {
    removeCubeForClient(clientId);
  });
}

function createCubeForClient(clientId) {
  const cube = getBox();
  cube.position.set(Math.random() * 5, Math.random() * 5, 0);
  cube.scale.set(100, 100, 100);
  cubes[clientId] = cube;
  scene.add(cube);

  // Add GUI controls only for the local client cube
  if (clientId === socket.id) {
    guiControllers[clientId] = setupGuiForCube(cube);
  }
}

function updateCubeFromSocket(data) {
  const { clientId, position, scale, color } = data;
  if (cubes[clientId]) {
    cubes[clientId].position.set(position.x, position.y, position.z);
    cubes[clientId].scale.set(scale.x, scale.y, scale.z);
    cubes[clientId].material.color.set(color);
  }
}

function sendCubeUpdate() {
  const cube = cubes[socket.id];
  const data = {
    clientId: socket.id,
    position: cube.position,
    scale: cube.scale,
    color: params.color,
  };
  socket.emit("update_cube", data);
}

function removeCubeForClient(clientId) {
  if (cubes[clientId]) {
    scene.remove(cubes[clientId]);
    delete cubes[clientId];

    // Remove GUI controls for disconnected clients
    if (guiControllers[clientId]) {
      Object.values(guiControllers[clientId]).forEach((controller) => gui.remove(controller));
      delete guiControllers[clientId];
    }
  }
}