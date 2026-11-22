let database, dbRef, myDataRef;

let myName = "";
let myData = {};
let entireData = {};

function setup() {
  createCanvas(800, 600);

  const button = createButton("Open Another Window");
  button.mousePressed(function () {
    window.open(window.location.href, "_blank", "noopener");
  });

  myName = (prompt("Enter your name.") || "").trim();
  if (!myName) {
    return;
  }

  setupDB();
  dbRef = FirebaseDatabase.ref(database, "demo/participants");

  FirebaseDatabase.onValue(
    dbRef,
    function (snapshot) {
      entireData = snapshot.val() || {};
    },
    function (error) {
      return console.error("Could not read the user list:", error.message);
    }
  );

  myData.name = myName;
  myData.x = random(width);
  myData.y = random(height);

  myDataRef = FirebaseDatabase.push(dbRef);
  FirebaseDatabase.set(myDataRef, myData).catch(function (error) {
    console.error("Could not save the user:", error.message);
  });
}

function draw() {
  background(220);
  //ellipse(pos.x, pos.y, 30, 30);

  for (const property in entireData) {
    //console.log(`${property}: ${entireData[property]}`);
    let d = entireData[property];
    fill(30);
    text(d.name, d.x, d.y);
  }

  fill(30);
  text("Open this same URL in another window and watch both windows update!", 10, 20);
  text("Press [Backspace] to clear the shared data for this example.", 10, 40);
}

function mouseDragged() {
  if (!myDataRef) {
    return;
  }

  myData.x = mouseX;
  myData.y = mouseY;

  FirebaseDatabase.update(myDataRef, { x: myData.x, y: myData.y }).catch(function (error) {
    console.error("Could not change the position:", error.message);
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
