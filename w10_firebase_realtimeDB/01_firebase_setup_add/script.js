let database, dbRef;

function setup() {
  createCanvas(800, 600);
  background(0);

  setupDB();
  clearDBReference("realtimeData");
  dbRef = getDBReference("realtimeData");
}

function draw() {
  //
}

function mousePressed() {
  let data = {
    x: mouseX,
    y: mouseY
  };
  dbRef.push(data);
}

function setupDB() {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyApGy3KwAdxFwjJMNEgtQ481VcAHakxJBs",
    authDomain: "wp2ws-demo.firebaseapp.com",
    databaseURL: "https://wp2ws-demo-default-rtdb.firebaseio.com",
    projectId: "wp2ws-demo",
    storageBucket: "wp2ws-demo.appspot.com",
    messagingSenderId: "477823658599",
    appId: "1:477823658599:web:40703a3fb7803deb51c2c2",
    measurementId: "G-Z1DWENKPGS"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
}

function getDBReference(refName) {
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

  // event listeners
  ref.on("child_added", data => {
    console.log("! DB ADDED");
    console.log(data.key);
    console.log(data.val());

    let value = data.val();
    fill(255);
    rect(value.x, value.y, 10, 10);
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