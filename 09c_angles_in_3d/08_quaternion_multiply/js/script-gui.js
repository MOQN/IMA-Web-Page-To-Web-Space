
let pane;

function setupGUI() {
  pane = new Pane({ title: "Quaternion 03 · Multiplication order" });
  pane.addBinding(params, "x", { label: "X (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "y", { label: "Y (deg)", min: -180, max: 180, step: 1 });
  pane.addButton({ title: "Reset" }).on("click", function () {
    params.x = 60; params.y = 45;
    pane.refresh();
  });
}

function updateGUI() {
  
  pane.refresh();
}
