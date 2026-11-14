
let pane;

function setupGUI() {
  pane = new Pane({ title: "setFromUnitVectors" });
  pane.addBinding(params, "x", { min: -1, max: 1, step: 0.1, label: "Direction X" });
  pane.addBinding(params, "y", { min: -0.2, max: 1, step: 0.1, label: "Direction Y" });
  pane.addBinding(params, "z", { min: -1, max: 1, step: 0.1, label: "Direction Z" });
  pane.addBinding(params, "speed", { min: 0, max: 300, step: 1 });
  pane.addBinding(params, "paused", { label: "Pause movement" });
  pane.addButton({ title: "Reset position" }).on("click", () => { arrow.position.set(0, 0, 0); });
  pane.addBinding(params, "status", { readonly: true });

  const quaternionFolder = pane.addFolder({ title: "Quaternion" });
  quaternionFolder.addBinding(arrow.quaternion, "x", { label: "qx", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(arrow.quaternion, "y", { label: "qy", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(arrow.quaternion, "z", { label: "qz", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(arrow.quaternion, "w", { label: "qw", readonly: true, format: value => value.toFixed(3) });

}

function updateGUI() {
  pane.refresh();
}
