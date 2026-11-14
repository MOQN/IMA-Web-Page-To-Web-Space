import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {
  getDatabase,
  onChildAdded,
  onChildChanged,
  onChildMoved,
  onChildRemoved,
  push,
  ref
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";

let database, dbRef;

function setup() {
  createCanvas(800, 600);
  background(0);

  setupDB();
  dbRef = getDBReference("classroom/drawingPoints");
}

function draw() {
  //
}

function mousePressed() {
  let data = {
    x: mouseX,
    y: mouseY
  };
  push(dbRef, data).catch(error => {
    console.error("Could not save the point:", error.message);
  });
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
    appId: "---",
    measurementId: "---"
  };
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
}

function getDBReference(refName) {
  const reference = ref(database, refName);

  // event listeners
  onChildAdded(reference, data => {
    console.log("! DB ADDED");
    console.log(data.key);
    console.log(data.val());

    let value = data.val();
    fill(255);
    rect(value.x, value.y, 10, 10);
  });
  onChildRemoved(reference, data => {
    console.log("! DB REMOVED");
    console.log(data.key);
    console.log(data.val());
  });
  onChildChanged(reference, data => {
    console.log("! DB CHANGED");
    console.log(data.key);
    console.log(data.val());
  });
  onChildMoved(reference, data => {
    console.log("! DB MOVED");
    console.log(data.key);
    console.log(data.val());
  });

  return reference;
}

window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;