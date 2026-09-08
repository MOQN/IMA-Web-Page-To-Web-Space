const WORLD_SIZE = 2000;
const WORLD_HALF_SIZE = 1000;
const FLOOR_HEIGHT = -150;
const C_GRAVITY = 0.3;

let plane;

let userData = {};

function setupThree() {
  setupSocket();

  // plane
  plane = getPlane();
  scene.add(plane);
  plane.position.y = -WORLD_HALF_SIZE / 4;
  plane.rotation.x = -PI / 2;

  // boxes
  for (let i = 0; i < 100; i++) {
    let box = getBox();
    scene.add(box);

    box.position.x = random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE);
    box.position.y = random(-WORLD_HALF_SIZE / 2, WORLD_HALF_SIZE);
    box.position.z = random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE);

    box.rotation.x = random(TWO_PI);
    box.rotation.y = random(TWO_PI);
    box.rotation.z = random(TWO_PI);

    const size = random(1, 10);
    box.scale.x = size;
    box.scale.y = size;
    box.scale.z = size;

    box.material.transparent = true;
    box.material.opacity = random(0.4, 0.7);
  }
}

function updateThree() {
  for (const clientId in userData) {
    const user = userData[clientId];
    // you can apply some animation here.
  }

  // update the camera position and rotation based on the user's
  const user = userData[socket.id];
  if (!user) return;
  user.update();
  camera.position.copy(user.position);
  camera.quaternion.copy(user.direction);

  // send the user's data to the server
  // this can be optimized to only send the data when the user's data has changed.
  sendUserUpdate();
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_HALF_SIZE * 2, WORLD_HALF_SIZE * 2, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  const position = geometry.attributes.position;
  for (let i = 0; i < position.array.length; i += 3) {
    let x = position.array[i + 0];
    let y = position.array[i + 1];
    let z = position.array[i + 2];

    let xOffset = (x + WORLD_HALF_SIZE) * 0.005;
    let yOffset = (y + WORLD_HALF_SIZE) * 0.005;
    let amp = 6;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    position.array[i + 2] = noiseValue; // update the z value.
  }

  return mesh;
}

function setupSocket() {
  socket = io.connect();

  socket.on("connect", () => {
    // emit a message to the server to notify of new client connection
    socket.emit("new_client");
  });

  socket.on("initialize_user", (clientId) => {
    createUserForClient(clientId);
  });

  socket.on("update_user", (data) => {
    updateUserFromSocket(data);
  });
}

function createUserForClient(clientId) {
  const user = new User(clientId); // create a user object. see public/js/User.js
  userData[clientId] = user; // add the user object to the userData object

  console.log("User added - ID: " + clientId);

  if (clientId === socket.id) {
    user.position.set(
      random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE),
      FLOOR_HEIGHT,
      random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE),
    );
    user.setColor(random(0, 1), random(0, 1), random(0, 1));
  }
}

function updateUserFromSocket(data) {
  const { clientId, position, rotation, scale, color } = data;
  if (userData[clientId]) {
    const user = userData[clientId];
    user.setPosition(position.x, position.y, position.z);
    user.setRotation(rotation.x, rotation.y, rotation.z);
    user.setScale(scale.x, scale.y, scale.z);
    user.setColor(color);
  } else {
    createUserForClient(clientId);
  }
}

// send the user's data to the server
// see the User class in public/js/User.js for the toData() method
function sendUserUpdate() {
  const user = userData[socket.id];
  if (!user) return;

  const data = user.toData();
  socket.emit("update_user", data);
}