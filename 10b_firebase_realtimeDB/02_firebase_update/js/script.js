let database, dbRef;

let pos = { x: 0, y: 0 };

function setup() {
  createCanvas(800, 600);

  const button = createButton("Open Another Window");
  button.mousePressed(function () {
    window.open(window.location.href, "_blank", "noopener");
  });

  setupDB();
  dbRef = FirebaseDatabase.ref(database, "demo/mousePosition");

  FirebaseDatabase.onValue(
    dbRef,
    function (snapshot) {
      const savedPosition = snapshot.val();
      if (savedPosition) {
        pos = savedPosition;
      } else {
        FirebaseDatabase.set(dbRef, pos).catch(function (error) {
          console.error("Could not save the first position:", error.message);
        });
      }
    },
    function (error) {
      console.error("Could not read the position:", error.message);
    }
  );
}

function draw() {
  background(220);
  ellipse(pos.x, pos.y, 30, 30);
  fill(30);
  text("Open this same URL in another window and watch both windows update!", 10, 20);
}

function mouseDragged() {
  let newPos = { x: mouseX, y: mouseY };

  FirebaseDatabase.update(dbRef, newPos).catch(function (error) {
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
    appId: "---"
  };

  const app = FirebaseApp.initializeApp(firebaseConfig);
  database = FirebaseDatabase.getDatabase(app);
}
