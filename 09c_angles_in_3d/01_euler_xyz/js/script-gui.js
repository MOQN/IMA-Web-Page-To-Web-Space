
let pane;

function setupGUI() {
  pane = new Pane({ title: "Euler 01 · Rotation on each axis" });
  pane.addBinding(params, "x", { label: "X (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "y", { label: "Y (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "z", { label: "Z (deg)", min: -180, max: 180, step: 1 });
  pane.addButton({ title: "Reset" }).on("click", function () {
    params.x = 0; params.y = 0; params.z = 0;
    pane.refresh();
  });
}

function updateGUI() {
  
  pane.refresh();
}
