
let pane;

function setupGUI() {
  pane = new Pane({ title: "Quaternion 02 · Match a direction" });
  pane.addBinding(params, "x", { label: "Target X", min: -1, max: 1, step: 0.1 });
  pane.addBinding(params, "y", { label: "Target Y", min: -1, max: 1, step: 0.1 });
  pane.addBinding(params, "z", { label: "Target Z", min: -1, max: 1, step: 0.1 });
  pane.addBinding(params, "status", { readonly: true });
  pane.addButton({ title: "Reset" }).on("click", function () {
    params.x = 1; params.y = 1; params.z = 1;
    pane.refresh();
  });
}

function updateGUI() {
  
  pane.refresh();
}
