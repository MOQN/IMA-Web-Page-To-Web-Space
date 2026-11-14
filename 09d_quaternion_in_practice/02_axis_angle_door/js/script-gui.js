
let pane;

function setupGUI() {
  pane = new Pane({ title: "setFromAxisAngle" });
  pane.addBinding(params, "angle", { min: 0, max: 120, step: 1, label: "Open (deg)" });

  const quaternionFolder = pane.addFolder({ title: "Quaternion" });
  quaternionFolder.addBinding(hinge.quaternion, "x", { label: "qx", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(hinge.quaternion, "y", { label: "qy", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(hinge.quaternion, "z", { label: "qz", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(hinge.quaternion, "w", { label: "qw", readonly: true, format: value => value.toFixed(3) });

}

function updateGUI() {
  pane.refresh();
}
