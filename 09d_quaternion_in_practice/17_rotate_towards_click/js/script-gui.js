
let pane;

function setupGUI() {
  pane = new Pane({ title: "Click to aim" });
  pane.addBinding(params, "speed", { min: 0, max: 180, step: 1, label: "Speed (deg/s)" });
  pane.addBinding(params, "targetX", { readonly: true });
  pane.addBinding(params, "targetZ", { readonly: true });
  pane.addBinding(params, "status", { readonly: true });

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
  params.targetX = Math.round(target.position.x);
  params.targetZ = Math.round(target.position.z);
  pane.refresh();
}
