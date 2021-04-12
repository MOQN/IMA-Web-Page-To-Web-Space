let database, dbRef;

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
  dbRef = getDBReference("realtimeData");
  dbRef.push(params);
}

function draw() {
  background(params.bgR, params.bgG, params.bgB);
  ellipse(params.x, params.y, params.dia, params.dia);
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

function updateDB() {
  dbRef.update(params);
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

    params[data.key] = data.val(); // ***
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