let params = {};

let database, dbRef;
let pane;

function setup() {
  createCanvas(800, 600);

  params.x = width / 2;
  params.y = height / 2;
  params.dia = 100;
  params.color = "#ffffff";

  pane = new Pane();

  setupDB();
  dbRef = FirebaseDatabase.ref(database, "demo/gui");

  FirebaseDatabase.onValue(
    dbRef,
    function (snapshot) {
      const savedParams = snapshot.val();
      if (savedParams) {
        if (savedParams.x !== null && savedParams.x !== undefined) {
          params.x = savedParams.x;
        }
        if (savedParams.y !== null && savedParams.y !== undefined) {
          params.y = savedParams.y;
        }
        if (savedParams.dia !== null && savedParams.dia !== undefined) {
          params.dia = savedParams.dia;
        }
        if (savedParams.color !== null && savedParams.color !== undefined) {
          params.color = savedParams.color;
        }
        pane.refresh();
      } else {
        params.x = width / 2;
        params.y = height / 2;
        params.dia = 100;
        params.color = "#ffffff";
        pane.refresh();
      }
    },
    function (error) {
      return console.error("Could not read the shape settings:", error.message);
    }
  );

  pane.addBinding(params, "x", { min: 0, max: width, step: 1 }).on("change", updateDB);
  pane.addBinding(params, "y", { min: 0, max: height, step: 1 }).on("change", updateDB);
  pane.addBinding(params, "dia", { label: "Diameter", min: 10, max: 300, step: 1 }).on("change", updateDB);
  pane.addBinding(params, "color", { label: "Circle Color" }).on("change", updateDB);

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
  noStroke();
  fill(params.color);
  ellipse(params.x, params.y, params.dia, params.dia);
  fill(30);
  text("Open this same URL in another window and watch both windows update!", 10, 20);
}

function updateDB() {
  FirebaseDatabase.update(dbRef, params).catch(function (error) {
    console.error("Could not change the shape settings:", error.message);
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
