let database;
let blocksRef;

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
  blocksRef = FirebaseDatabase.ref(database, "demo/sharedBlocks");

  FirebaseDatabase.onChildAdded(blocksRef, function (snapshot) {
    const block = getBlock(snapshot.key, snapshot.val());
    blocks.set(snapshot.key, block);
    draggableBlocks.push(block);
    scene.add(block);
  });

  FirebaseDatabase.onChildChanged(blocksRef, function (snapshot) {
    const block = blocks.get(snapshot.key);
    const data = snapshot.val();
    if (!block || block === draggedBlock || !data || ![data.x, data.z].every(Number.isFinite)) return;
    let y = 40;
    if (Number.isFinite(data.y)) {
      y = data.y;
    }
    block.position.set(data.x, y, data.z);
  });

  FirebaseDatabase.onChildRemoved(blocksRef, function (snapshot) {
    const block = blocks.get(snapshot.key);
    if (!block) return;
    scene.remove(block);
    block.geometry.dispose();
    block.material.dispose();
    const index = draggableBlocks.indexOf(block);
    if (index !== -1) draggableBlocks.splice(index, 1);
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

function updateBlockPosition(block) {
  const blockRef = FirebaseDatabase.child(blocksRef, block.userData.key);
  const position = {
    x: block.position.x,
    y: block.position.y,
    z: block.position.z
  };
  FirebaseDatabase.update(blockRef, position).catch(console.error);
}

function resetData() {
  FirebaseDatabase.remove(blocksRef).catch(console.error);
}
