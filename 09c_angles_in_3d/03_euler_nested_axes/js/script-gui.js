
let pane;

function setupGUI() {
  pane = new Pane({ title: "Euler 03 · Axes inside axes" });
  pane.addBinding(params, "x", { label: "X (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "y", { label: "Y (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "z", { label: "Z (deg)", min: -180, max: 180, step: 1 });
  pane.addButton({ title: "Reset" }).on("click", function () {
    params.x = 30; params.y = 25; params.z = 0;
    pane.refresh();
  });
}

function updateGUI() {
  
  pane.refresh();
}
