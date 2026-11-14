const params = { fps: 0 };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let socket;
let userData = {};

function setupThree() {
  setupSocket();
}

function updateThree() {
  for (const clientId in userData) {
    const cube = userData[clientId];

    // try to add some animation here!
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
    // Clear old objects before the server sends the current users.
    for (const clientId of Object.keys(userData)) removeClient(clientId);
    for (const child of [...pane.children].slice(3)) child.dispose();
  });

  socket.on("remove_cube", removeClient);

  socket.on("initialize_cube", (clientId) => {
    createCubeForClient(clientId);
  });

  socket.on("update_cube", (data) => {
    updateCubeFromSocket(data);
  });
}

function createCubeForClient(clientId) {
  if (userData[clientId]) return;
  const cube = getBox();
  scene.add(cube);
  cube.scale.set(30, 30, 30);

  userData[clientId] = cube;
  console.log("Cube added - ID: " + clientId);

  // Add controls only for the local client cube.
  if (clientId === socket.id) {
    cube.position.set(random(-WORLD_HALF, WORLD_HALF), random(-WORLD_HALF, WORLD_HALF), random(-WORLD_HALF, WORLD_HALF));
    cube.scale.set(random(50, 100), random(50, 100), random(50, 100));
    cube.material.color.setRGB(random(0, 1), random(0, 1), random(0, 1));

    const positionFolder = pane.addFolder({ title: "Position", expanded: true });
    positionFolder.addBinding(cube.position, "x", { min: -WORLD_HALF, max: WORLD_HALF, step: 0.1 }).on("change", sendCubeUpdate);
    positionFolder.addBinding(cube.position, "y", { min: -WORLD_HALF, max: WORLD_HALF, step: 0.1 }).on("change", sendCubeUpdate);
    positionFolder.addBinding(cube.position, "z", { min: -WORLD_HALF, max: WORLD_HALF, step: 0.1 }).on("change", sendCubeUpdate);
    const rotationFolder = pane.addFolder({ title: "Rotation", expanded: true });
    rotationFolder.addBinding(cube.rotation, "x", { min: -Math.PI, max: Math.PI, step: 0.01 }).on("change", sendCubeUpdate);
    rotationFolder.addBinding(cube.rotation, "y", { min: -Math.PI, max: Math.PI, step: 0.01 }).on("change", sendCubeUpdate);
    rotationFolder.addBinding(cube.rotation, "z", { min: -Math.PI, max: Math.PI, step: 0.01 }).on("change", sendCubeUpdate);
    const scaleFolder = pane.addFolder({ title: "Scale", expanded: true });
    scaleFolder.addBinding(cube.scale, "x", { min: 1, max: 200, step: 0.1 }).on("change", sendCubeUpdate);
    scaleFolder.addBinding(cube.scale, "y", { min: 1, max: 200, step: 0.1 }).on("change", sendCubeUpdate);
    scaleFolder.addBinding(cube.scale, "z", { min: 1, max: 200, step: 0.1 }).on("change", sendCubeUpdate);
    sendCubeUpdate();
  }
}

function updateCubeFromSocket(data) {
  console.log(data);
  const { clientId, position, rotation, scale, color } = data;
  if (!userData[clientId]) createCubeForClient(clientId);
  if (userData[clientId]) {
    userData[clientId].position.set(position.x, position.y, position.z);
    userData[clientId].rotation.set(rotation.x, rotation.y, rotation.z);
    userData[clientId].scale.set(scale.x, scale.y, scale.z);
    if (color && typeof color === "object") {
      userData[clientId].material.color.setRGB(color.r, color.g, color.b);
    } else {
      userData[clientId].material.color.set(color);
    }
  } else {
    createCubeForClient(clientId);
  }
}

function sendCubeUpdate() {
  if (!socket.connected || !userData[socket.id]) return;
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
    color: mesh.material.color.getHex(),
  };
  socket.emit("update_cube", data);
}

function removeClient(clientId) {
  const item = userData[clientId];
  if (!item) return;
  const mesh = item.mesh || item;
  if (item.dispose) item.dispose();
  scene.remove(mesh);
  mesh.geometry.dispose();
  mesh.material.dispose();
  delete userData[clientId];
}
