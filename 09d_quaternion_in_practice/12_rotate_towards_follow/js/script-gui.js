
let pane;

function setupGUI() {
  pane = new Pane({ title: "rotateTowards" });
  pane.addBinding(params, "targetSpeed", { min: -120, max: 120, step: 1, label: "Target (deg/s)" });
  pane.addBinding(params, "speed", { min: 0, max: 180, step: 1, label: "Aim (deg/s)" });
  pane.addBinding(params, "paused", { label: "Pause target" });

  const quaternionFolder = pane.addFolder({ title: "Current Quaternion" });
  quaternionFolder.addBinding(arrow.quaternion, "x", { label: "qx", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(arrow.quaternion, "y", { label: "qy", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(arrow.quaternion, "z", { label: "qz", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(arrow.quaternion, "w", { label: "qw", readonly: true, format: value => value.toFixed(3) });

  const targetQuaternionFolder = pane.addFolder({ title: "Target Quaternion", expanded: false });
  targetQuaternionFolder.addBinding(targetRotation, "x", { label: "qx", readonly: true, format: value => value.toFixed(3) });
  targetQuaternionFolder.addBinding(targetRotation, "y", { label: "qy", readonly: true, format: value => value.toFixed(3) });
  targetQuaternionFolder.addBinding(targetRotation, "z", { label: "qz", readonly: true, format: value => value.toFixed(3) });
  targetQuaternionFolder.addBinding(targetRotation, "w", { label: "qw", readonly: true, format: value => value.toFixed(3) });

}

function updateGUI() {
  pane.refresh();
}
