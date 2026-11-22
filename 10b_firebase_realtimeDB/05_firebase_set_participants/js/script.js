let database, dbRef, myDataRef, pane;

let myData = { name: "Name", color: "#ffffff", size: 24, x: 0, y: 0 };
let entireData = {};

function setup() {
  createCanvas(800, 600);

  setupDB();
  dbRef = FirebaseDatabase.ref(database, "demo/participants-styles");

  FirebaseDatabase.onValue(
    dbRef,
    function (snapshot) {
      entireData = snapshot.val() || {};
    },
    function (error) {
      return console.error("Could not read the user list:", error.message);
    }
  );

  myData.color = color(random(256), random(256), random(256)).toString("#rrggbb");
  myData.x = random(width);
  myData.y = random(height);

  myDataRef = FirebaseDatabase.push(dbRef);
  FirebaseDatabase.set(myDataRef, myData).catch(function (error) {
    console.error("Could not save the user:", error.message);
  });

  pane = new Pane();

  pane.addBinding(myData, "name", { label: "Name" }).on("change", updateParticipant);
  pane.addBinding(myData, "x", { min: 0, max: width, step: 1 }).on("change", updateParticipant);
  pane.addBinding(myData, "y", { min: 0, max: height, step: 1 }).on("change", updateParticipant);
  pane.addBinding(myData, "color", { label: "Color" }).on("change", updateParticipant);
  pane.addBinding(myData, "size", { label: "Size", min: 10, max: 100, step: 1 }).on("change", updateParticipant);

  pane.addButton({ title: "Clear Shared Data" }).on("click", function () {
    if (confirm("Clear the shared data for this example in every window?")) {
      FirebaseDatabase.remove(dbRef).catch(console.error);
    }
  });

  pane.addButton({ title: "Open Another Window" }).on("click", function () {
    window.open(window.location.href, "_blank", "noopener");
  });
}

function draw() {
  background(220);
  //ellipse(pos.x, pos.y, 30, 30);

  for (const property in entireData) {
    //console.log(`${property}: ${entireData[property]}`);
    let d = entireData[property];
    noStroke();
    fill(d.color);
    let size = d.size;
    if (size === null || size === undefined) {
      size = 24;
    }
    circle(d.x, d.y, size);
    fill(30);
    text(d.name, d.x + size / 2 + 4, d.y + 4);
  }

  fill(30);
  text("Open this same URL in another window and watch both windows update!", 10, 20);
}

function updateParticipant() {
  FirebaseDatabase.update(myDataRef, myData).catch(console.error);
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
