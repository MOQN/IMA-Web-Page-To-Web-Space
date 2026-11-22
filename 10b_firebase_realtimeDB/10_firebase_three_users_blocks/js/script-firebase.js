let database;
let blocksRef;
let userRef;

let shareTimer;
let userConnected = false;

function setupDB() {
  const firebaseConfig = {
    apiKey: "---",
    authDomain: "---",
    databaseURL: "---",
    projectId: "---",
    storageBucket: "---",
    messagingSenderId: "---",
    appId: "---"
  };

  const app = FirebaseApp.initializeApp(firebaseConfig);
  database = FirebaseDatabase.getDatabase(app);
  blocksRef = FirebaseDatabase.ref(database, "demo/orbitBlocks");
  setupUsers();

  FirebaseDatabase.onChildAdded(blocksRef, function (snapshot) {
    const block = getBlock(snapshot.key, snapshot.val());
    blocks.set(snapshot.key, block);
    scene.add(block);
  });

  FirebaseDatabase.onChildRemoved(blocksRef, function (snapshot) {
    const block = blocks.get(snapshot.key);
    if (!block) return;
    scene.remove(block);
    block.geometry.dispose();
    block.material.dispose();
    blocks.delete(snapshot.key);
  });
}

function addBlock(x, z) {
  const color = floor(random(0x1000000));
  FirebaseDatabase.push(blocksRef, { x: x, z: z, color: color }).catch(console.error);
}

function removeBlock(key) {
  FirebaseDatabase.remove(FirebaseDatabase.child(blocksRef, key)).catch(console.error);
}

function setupUsers() {
  const usersRef = FirebaseDatabase.ref(database, "demo/orbitUsers");
  userRef = FirebaseDatabase.push(usersRef);

  FirebaseDatabase.onValue(FirebaseDatabase.ref(database, ".info/connected"), async function (snapshot) {
    userConnected = false;
    if (!snapshot.val()) return;
    await FirebaseDatabase.onDisconnect(userRef).remove();
    userConnected = true;
    shareUser();
  });

  FirebaseDatabase.onChildAdded(usersRef, readUser);
  FirebaseDatabase.onChildChanged(usersRef, readUser);
  FirebaseDatabase.onChildRemoved(usersRef, function (snapshot) {
    const user = users.get(snapshot.key);
    if (!user) return;
    scene.remove(user);
    user.geometry.dispose();
    user.material.dispose();
    users.delete(snapshot.key);
  });
}

function readUser(snapshot) {
  if (snapshot.key !== userRef.key) showUser(snapshot.key, snapshot.val());
}

function shareUser() {
  if (!userConnected || shareTimer) return;
  shareTimer = setTimeout(saveUser, 50);
}

function saveUser() {
  shareTimer = null;
  if (!userConnected) return;
  const userData = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
    color: params.color
  };
  FirebaseDatabase.set(userRef, userData).catch(console.error);
}

function resetData() {
  FirebaseDatabase.remove(blocksRef).catch(console.error);
}
