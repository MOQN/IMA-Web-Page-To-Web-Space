let database, dbRef;

let pos = { x: 0, y: 0 };

function setup() {
  createCanvas(800, 600);

  setupDB();
  dbRef = getDBReference("realtimeData");
  dbRef.push(pos);
}

function draw() {
  background(0);
  ellipse(pos.x, pos.y, 30, 30);
}

function mouseDragged() {
  let newPos = { x: mouseX, y: mouseY };
  dbRef.update(newPos);
}

function setupDB() {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "---",
    authDomain: "---",
    databaseURL: "---",
    projectId: "---",
    storageBucket: "---",
    messagingSenderId: "---",
    appId: "---",
    measurementId: "---"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
}

function getDBReference(refName) {
  let ref = database.ref(refName);

  // event listeners
  ref.on("child_added", data => {
    console.log("! DB ADDED");
    console.log(data.key);
    console.log(data.val());
  });
  ref.on("child_removed", data => {
    console.log("! DB REMOVED");
    console.log(data.key);
    console.log(data.val());
  });
  ref.on("child_changed", data => {
    console.log("! DB CHANGED");
    console.log(data.key);
    console.log(data.val());

    pos[data.key] = data.val(); // ***
  });
  ref.on("child_moved", data => {
    console.log("! DB MOVED");
    console.log(data.key);
    console.log(data.val());
  });

  return ref;
}

function clearDBReference(refName) {
  let ref = database.ref(refName);

  // clear out the previous data in the key
  ref
    .remove()
    .then(function() {
      console.log("! DB Remove succeeded.");
    })
    .catch(function(error) {
      console.log("! DB Remove failed: " + error.message);
    });
}