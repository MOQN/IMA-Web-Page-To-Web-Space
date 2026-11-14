
let pane;

function setupGUI() {
  pane = new Pane({ title: "Euler 02 · Same angles, different order" });
  pane.addBinding(params, "x", { label: "X (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "y", { label: "Y (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "z", { label: "Z (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "order", { label: "Right order", options: { XYZ: "XYZ", XZY: "XZY", YXZ: "YXZ", YZX: "YZX", ZXY: "ZXY", ZYX: "ZYX" } });
  pane.addButton({ title: "Reset" }).on("click", function () {
    params.x = 45; params.y = 60; params.z = 20; params.order = "ZYX";
    pane.refresh();
  });
}

function updateGUI() {
  
  pane.refresh();
}
