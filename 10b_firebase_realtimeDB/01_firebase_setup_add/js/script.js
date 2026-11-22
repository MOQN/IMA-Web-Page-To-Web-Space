let database, dbRef;
const points = new Map();

function setup() {
  createCanvas(800, 600);

  const button = createButton("Open Another Window");
  button.mousePressed(function () {
    window.open(window.location.href, "_blank", "noopener");
  });

  setupDB();
  dbRef = getDBReference("demo/drawingPoints");
}

function draw() {
  background(220);

  fill(30);
  for (const point of points.values()) {
    rect(point.x, point.y, 10, 10);
  }

  text("Open this same URL in another window and watch both windows update!", 10, 20);
  text("Click to save a point. Refresh to see your saved points again.", 10, 40);
  text("Press [Backspace] to clear the shared data for this example.", 10, 70);
}

function mousePressed() {
  let data = {
    x: mouseX,
    y: mouseY
  };
  FirebaseDatabase.push(dbRef, data).catch(function (error) {
    console.error("Could not save the point:", error.message);
  });
}

function keyPressed() {
  if (key == "Backspace") {
    let answer = confirm("Clear the shared data for this example in every window?")
    if (answer) {
      FirebaseDatabase.remove(dbRef).catch(console.error);
    }
  }
}

function setupDB() {
  // Your web app's Firebase configuration
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
}

function getDBReference(refName) {
  const reference = FirebaseDatabase.ref(database, refName);

  // event listeners
  FirebaseDatabase.onChildAdded(reference, function (data) {
    console.log("! DB ADDED");
    console.log(data.key);
    console.log(data.val());

    let value = data.val();
    points.set(data.key, value);
  });

  FirebaseDatabase.onChildRemoved(reference, function (data) {
    points.delete(data.key);
    console.log("! DB REMOVED");
    console.log(data.key);
    console.log(data.val());
  });

  FirebaseDatabase.onChildChanged(reference, function (data) {
    console.log("! DB CHANGED");
    console.log(data.key);
    console.log(data.val());
  });

  FirebaseDatabase.onChildMoved(reference, function (data) {
    console.log("! DB MOVED");
    console.log(data.key);
    console.log(data.val());
  });

  return reference;
}
