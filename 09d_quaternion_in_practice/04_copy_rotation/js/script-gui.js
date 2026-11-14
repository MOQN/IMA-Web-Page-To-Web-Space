let pane;

function setupGUI() {
  pane = new Pane({ title: "Copy a Rotation" });
  pane.addBinding(params, "angle", { label: "Y (deg)", min: -180, max: 180, step: 1 });
  const quaternionFolder1 = pane.addFolder({ title: "Quaternion", expanded: false });
  quaternionFolder1.addBinding(q, "x", { label: "qx", readonly: true });
  quaternionFolder1.addBinding(q, "y", { label: "qy", readonly: true });
  quaternionFolder1.addBinding(q, "z", { label: "qz", readonly: true });
  quaternionFolder1.addBinding(q, "w", { label: "qw", readonly: true });

}

function updateGUI() {
  pane.refresh();
}
