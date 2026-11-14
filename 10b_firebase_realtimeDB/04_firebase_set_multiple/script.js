import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getDatabase, onValue, push, ref, set, update } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";

let database, dbRef, myDataRef;

let myName = "";
let myData = {};
let entireData = {};

function setup() {
  createCanvas(800, 600);

  myName = (prompt("Enter your name.") || "").trim();
  if (!myName) {
    return;
  }

  setupDB();
  dbRef = ref(database, "classroom/participants");
  onValue(
    dbRef,
    snapshot => {
      entireData = snapshot.val() || {};
    },
    error => console.error("Could not read the user list:", error.message)
  );

  myData.name = myName;
  myData.x = random(width);
  myData.y = random(height);
  myDataRef = push(dbRef);
  set(myDataRef, myData).catch(error => {
    console.error("Could not save the user:", error.message);
  });
}

function draw() {
  background(0);
  //ellipse(pos.x, pos.y, 30, 30);

  for (const property in entireData) {
    //console.log(`${property}: ${entireData[property]}`);
    let d = entireData[property];
    fill(255);
    text(d.name, d.x, d.y);
  }
}

function mouseDragged() {
  if (!myDataRef) {
    return;
  }

  myData.x = mouseX;
  myData.y = mouseY;
  update(myDataRef, { x: myData.x, y: myData.y }).catch(error => {
    console.error("Could not change the position:", error.message);
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

window.setup = setup;
window.draw = draw;
window.mouseDragged = mouseDragged;