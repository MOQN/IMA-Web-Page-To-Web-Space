
let pane;

function setupGUI() {
  pane = new Pane({ title: "Euler 04 · Gimbal lock" });
  pane.addBinding(params, "x", { label: "X (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "y", { label: "Y (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "z", { label: "Z (deg)", min: -180, max: 180, step: 1 });
  pane.addButton({ title: "Y = 90 (lock)" }).on("click", () => { params.y = 90; });
  pane.addButton({ title: "Y = 0 (free)" }).on("click", () => { params.y = 0; });
  pane.addButton({ title: "X = 30, Z = 0" }).on("click", () => { params.x = 30; params.z = 0; });
  pane.addButton({ title: "X = 0, Z = 30" }).on("click", () => { params.x = 0; params.z = 30; });
  pane.addButton({ title: "Reset" }).on("click", function () {
    params.x = 0; params.y = 90; params.z = 0;
    pane.refresh();
  });
}

function updateGUI() {
  
  pane.refresh();
}
