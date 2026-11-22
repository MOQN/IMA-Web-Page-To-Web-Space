let boxesRef;

let draggedBox;

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
  const database = FirebaseDatabase.getDatabase(app);
  boxesRef = FirebaseDatabase.ref(database, "demo/cubePositions");

  FirebaseDatabase.onValue(boxesRef, function (snapshot) {
    objects.forEach(function (box, index) {
      if (box === draggedBox) return;
      const position = snapshot.child(String(index)).val() || {};
      box.position.copy(box.userData.originalPosition);
      if (![position.x, position.y, position.z].every(Number.isFinite)) return;
      box.position.set(position.x, position.y, position.z);
    });
  });
}

function saveBoxPosition(box) {
  if (!boxesRef) return;
  const boxRef = FirebaseDatabase.child(boxesRef, String(objects.indexOf(box)));
  const position = {
    x: box.position.x,
    y: box.position.y,
    z: box.position.z
  };
  FirebaseDatabase.set(boxRef, position).catch(console.error);
}

function resetData() {
  FirebaseDatabase.remove(boxesRef).catch(console.error);
}
