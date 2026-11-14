import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getDatabase, onValue, ref, set, update } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js";

let database, dbRef;
let gui;

let params = {};

function setup() {
  createCanvas(800, 600);

  params.x = width / 2;
  params.y = height / 2;
  params.dia = 100;
  params.bgR = 255;
  params.bgG = 255;
  params.bgB = 255;

  gui = new dat.gui.GUI();
  gui.add(params, "x", 0, width).step(1).listen().onChange(updateDB);
  gui.add(params, "y", 0, width).step(1).listen().onChange(updateDB);
  gui.add(params, "dia", 10, 300).step(1).listen().onChange(updateDB);
  gui.add(params, "bgR", 0, 255).step(1).listen().onChange(updateDB);
  gui.add(params, "bgG", 0, 255).step(1).listen().onChange(updateDB);
  gui.add(params, "bgB", 0, 255).step(1).listen().onChange(updateDB);

  setupDB();
  dbRef = ref(database, "classroom/gui");
  onValue(
    dbRef,
    snapshot => {
      const savedParams = snapshot.val();
      if (savedParams) {
        Object.assign(params, savedParams);
      } else {
        set(dbRef, params).catch(error => {
          console.error("Could not save the first shape settings:", error.message);
        });
      }
    },
    error => console.error("Could not read the shape settings:", error.message)
  );
}

function draw() {
  background(params.bgR, params.bgG, params.bgB);
  ellipse(params.x, params.y, params.dia, params.dia);
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

function updateDB() {
  update(dbRef, params).catch(error => {
    console.error("Could not change the shape settings:", error.message);
  });
}