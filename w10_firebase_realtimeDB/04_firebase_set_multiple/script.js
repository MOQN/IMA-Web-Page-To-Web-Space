let database, dbRef;
let myDataRef;

let myName = "";
let myData = {};
let entireData = {};

function setup() {
  createCanvas(800, 600);

  myName = prompt("What's your name?").toLowerCase();

  setupDB();
  //clearDBReference("realtimeData" + myName);
  dbRef = getDBReference("realtimeData");
  myDataRef = getUserDBReference("realtimeData/" + myName);

  myData.name = myName;
  myData.x = random(width);
  myData.y = random(height);
  //myDataRef.push(myData);
  dbRef.child(myName).set(myData);
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
  myData.x = mouseX;
  myData.y = mouseY;
  dbRef.child(myName).set(myData);
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

    entireData[data.key] = data.val(); // ***
  });
  ref.on("child_moved", data => {
    console.log("! DB MOVED");
    console.log(data.key);
    console.log(data.val());
  });

  return ref;
}

function getUserDBReference(refName) {
  let ref = database.ref(refName);
  // event listeners
  ref.on("child_added", data => {});
  ref.on("child_removed", data => {});
  ref.on("child_changed", data => {});
  ref.on("child_moved", data => {});

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