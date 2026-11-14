import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getDatabase, onValue, ref, set, update } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";

let database, dbRef;

let pos = { x: 0, y: 0 };

function setup() {
  createCanvas(800, 600);

  setupDB();
  dbRef = ref(database, "classroom/mousePosition");
  onValue(
    dbRef,
    snapshot => {
      const savedPosition = snapshot.val();
      if (savedPosition) {
        pos = savedPosition;
      } else {
        set(dbRef, pos).catch(error => {
          console.error("Could not save the first position:", error.message);
        });
      }
    },
    error => console.error("Could not read the position:", error.message)
  );
}

function draw() {
  background(0);
  ellipse(pos.x, pos.y, 30, 30);
}

function mouseDragged() {
  let newPos = { x: mouseX, y: mouseY };
  update(dbRef, newPos).catch(error => {
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