
let pane;

function setupGUI() {
  pane = new Pane({ title: "setFromAxisAngle" });
  pane.addBinding(params, "speed", { min: -360, max: 360, step: 1, label: "Speed (deg/s)" });
  pane.addBinding(params, "paused");

  const quaternionFolder = pane.addFolder({ title: "Quaternion" });
  quaternionFolder.addBinding(fan.quaternion, "x", { label: "qx", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(fan.quaternion, "y", { label: "qy", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(fan.quaternion, "z", { label: "qz", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(fan.quaternion, "w", { label: "qw", readonly: true, format: value => value.toFixed(3) });

}

function updateGUI() {
  pane.refresh();
}
