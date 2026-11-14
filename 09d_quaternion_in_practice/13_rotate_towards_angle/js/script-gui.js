
let pane;

function setupGUI() {
  pane = new Pane({ title: "rotateTowards" });
  pane.addBinding(params, "angle", { min: -180, max: 180, step: 1, label: "Target (deg)" });
  pane.addBinding(params, "speed", { min: 0, max: 180, step: 1, label: "Speed (deg/s)" });
  pane.addBinding(params, "paused");
  pane.addButton({ title: "Reset rotation" }).on("click", () => { box.quaternion.identity(); });

  const quaternionFolder = pane.addFolder({ title: "Current Quaternion" });
  quaternionFolder.addBinding(box.quaternion, "x", { label: "qx", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(box.quaternion, "y", { label: "qy", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(box.quaternion, "z", { label: "qz", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(box.quaternion, "w", { label: "qw", readonly: true, format: value => value.toFixed(3) });

  const targetQuaternionFolder = pane.addFolder({ title: "Target Quaternion", expanded: false });
  targetQuaternionFolder.addBinding(target, "x", { label: "qx", readonly: true, format: value => value.toFixed(3) });
  targetQuaternionFolder.addBinding(target, "y", { label: "qy", readonly: true, format: value => value.toFixed(3) });
  targetQuaternionFolder.addBinding(target, "z", { label: "qz", readonly: true, format: value => value.toFixed(3) });
  targetQuaternionFolder.addBinding(target, "w", { label: "qw", readonly: true, format: value => value.toFixed(3) });

}

function updateGUI() {
  pane.refresh();
}
