let WORLD_SIZE = 1000;
let WORLD_HALF_SIZE = 500;

let userData = {};

function setupThree() {
  setupSocket();
}

function updateThree() {
  for (const clientId in userData) {
    const cube = userData[clientId];
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
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
    // emit a message to the server to notify of new client connection
    socket.emit("new_client");
  });

  socket.on("initialize_cube", (clientId) => {
    createCubeForClient(clientId);
  });

  socket.on("update_cube", (data) => {
    updateCubeFromSocket(data);
  });
}

function createCubeForClient(clientId) {
  const cube = getBox();
  scene.add(cube);
  cube.scale.set(30, 30, 30);

  userData[clientId] = cube;
  console.log("Cube added - ID: " + clientId);

  // add GUI controls only for the local client cube. If it's myself!
  if (clientId === socket.id) {
    cube.position.set(random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE), random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE), random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE));
    cube.scale.set(random(50, 100), random(50, 100), random(50, 100));
    cube.material.color.setRGB(random(0, 1), random(0, 1), random(0, 1));

    const positionFolder = gui.addFolder("Position");
    positionFolder.open();
    positionFolder.add(cube.position, "x").min(-WORLD_HALF_SIZE).max(WORLD_HALF_SIZE).step(0.1).onChange(sendCubeUpdate);
    positionFolder.add(cube.position, "y").min(-WORLD_HALF_SIZE).max(WORLD_HALF_SIZE).step(0.1).onChange(sendCubeUpdate);
    positionFolder.add(cube.position, "z").min(-WORLD_HALF_SIZE).max(WORLD_HALF_SIZE).step(0.1).onChange(sendCubeUpdate);
    const rotationFolder = gui.addFolder("Rotation");
    rotationFolder.open();
    rotationFolder.add(cube.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01).onChange(sendCubeUpdate);
    rotationFolder.add(cube.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01).onChange(sendCubeUpdate);
    rotationFolder.add(cube.rotation, "z").min(-Math.PI).max(Math.PI).step(0.01).onChange(sendCubeUpdate);
    const scaleFolder = gui.addFolder("Scale");
    scaleFolder.open();
    scaleFolder.add(cube.scale, "x").min(1).max(200).step(0.1).onChange(sendCubeUpdate);
    scaleFolder.add(cube.scale, "y").min(1).max(200).step(0.1).onChange(sendCubeUpdate);
    scaleFolder.add(cube.scale, "z").min(1).max(200).step(0.1).onChange(sendCubeUpdate);
  }
}

function updateCubeFromSocket(data) {
  console.log(data);
  const { clientId, position, rotation, scale, color } = data;
  if (userData[clientId]) {
    userData[clientId].position.set(position.x, position.y, position.z);
    userData[clientId].rotation.set(rotation.x, rotation.y, rotation.z);
    userData[clientId].scale.set(scale.x, scale.y, scale.z);
    userData[clientId].material.color.set(color);
  } else {
    createCubeForClient(clientId);
  }
}

function sendCubeUpdate() {
  const mesh = userData[socket.id];
  const data = {
    clientId: socket.id,
    position: {
      x: float(mesh.position.x.toFixed(2)),
      y: float(mesh.position.y.toFixed(2)),
      z: float(mesh.position.z.toFixed(2))
    },
    rotation: {
      x: float(mesh.rotation.x.toFixed(2)),
      y: float(mesh.rotation.y.toFixed(2)),
      z: float(mesh.rotation.z.toFixed(2))
    },
    scale: {
      x: float(mesh.scale.x.toFixed(2)),
      y: float(mesh.scale.y.toFixed(2)),
      z: float(mesh.scale.z.toFixed(2))
    },
    color: mesh.material.color,
  };
  socket.emit("update_cube", data);
}