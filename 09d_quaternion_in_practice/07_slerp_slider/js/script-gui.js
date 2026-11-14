
let pane;

function setupGUI() {
  pane = new Pane({ title: "slerp" });
  pane.addBinding(params, "t", { min: 0, max: 1, step: 0.01 });

  const quaternionFolder = pane.addFolder({ title: "Quaternion" });
  quaternionFolder.addBinding(box.quaternion, "x", { label: "qx", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(box.quaternion, "y", { label: "qy", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(box.quaternion, "z", { label: "qz", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(box.quaternion, "w", { label: "qw", readonly: true, format: value => value.toFixed(3) });

}

function updateGUI() {
  pane.refresh();
}
