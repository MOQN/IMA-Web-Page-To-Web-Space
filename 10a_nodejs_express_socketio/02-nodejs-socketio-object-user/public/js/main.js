const WORLD_SIZE = 1000;
const WORLD_HALF_SIZE = 500;

let userData = {};

function setupThree() {
  setupSocket();
}

function updateThree() {
  for (const clientId in userData) {

    const user = userData[clientId];
    user.move();
    user.rotate();
  }
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
    // If this is the current client, randomize the properties and set up the controls.
    user.setPosition(
      random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE),
      random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE),
      random(-WORLD_HALF_SIZE, WORLD_HALF_SIZE)
    );
    user.setScale(random(50, 100), random(50, 100), random(50, 100));
    user.setColor(random(0, 1), random(0, 1), random(0, 1));

    setupUserPane(user);
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
// this function is called whenever the user's position, rotation, or scale is changed
// also, see the User class in public/js/User.js for the toData() method
function sendUserUpdate() {
  const user = userData[socket.id];
  const data = user.toData();
  socket.emit("update_user", data);
}

function setupUserPane(user) {
  const positionFolder = pane.addFolder({ title: "Position", expanded: true });
  positionFolder.addBinding(user.mesh.position, "x", { min: -WORLD_HALF_SIZE, max: WORLD_HALF_SIZE, step: 0.1 }).on("change", sendUserUpdate);
  positionFolder.addBinding(user.mesh.position, "y", { min: -WORLD_HALF_SIZE, max: WORLD_HALF_SIZE, step: 0.1 }).on("change", sendUserUpdate);
  positionFolder.addBinding(user.mesh.position, "z", { min: -WORLD_HALF_SIZE, max: WORLD_HALF_SIZE, step: 0.1 }).on("change", sendUserUpdate);

  const rotationFolder = pane.addFolder({ title: "Rotation", expanded: true });
  rotationFolder.addBinding(user.mesh.rotation, "x", { min: -Math.PI, max: Math.PI, step: 0.01 }).on("change", sendUserUpdate);
  rotationFolder.addBinding(user.mesh.rotation, "y", { min: -Math.PI, max: Math.PI, step: 0.01 }).on("change", sendUserUpdate);
  rotationFolder.addBinding(user.mesh.rotation, "z", { min: -Math.PI, max: Math.PI, step: 0.01 }).on("change", sendUserUpdate);

  const scaleFolder = pane.addFolder({ title: "Scale", expanded: true });
  scaleFolder.addBinding(user.mesh.scale, "x", { min: 1, max: 200, step: 0.1 }).on("change", sendUserUpdate);
  scaleFolder.addBinding(user.mesh.scale, "y", { min: 1, max: 200, step: 0.1 }).on("change", sendUserUpdate);
  scaleFolder.addBinding(user.mesh.scale, "z", { min: 1, max: 200, step: 0.1 }).on("change", sendUserUpdate);
}