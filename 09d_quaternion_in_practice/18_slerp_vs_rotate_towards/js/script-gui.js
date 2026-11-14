
let pane;

function setupGUI() {
  pane = new Pane({ title: "Left: slerp / Right: rotateTowards" });
  pane.addBinding(params, "angle", { min: -180, max: 180, step: 1, label: "Target (deg)" });
  pane.addBinding(params, "follow", { min: 0, max: 1, step: 0.01, label: "Slerp fraction / frame" });
  pane.addBinding(params, "speed", { min: 0, max: 180, step: 1, label: "Speed (deg/s)" });
  pane.addBinding(params, "smoothLeft", { readonly: true, label: "Slerp remaining" });
  pane.addBinding(params, "steadyLeft", { readonly: true, label: "Steady remaining" });
  pane.addButton({ title: "Reset / Replay" }).on("click", resetRotation);

  const leftQuaternionFolder = pane.addFolder({ title: "Left Quaternion · slerp" });
  leftQuaternionFolder.addBinding(smoothArrow.quaternion, "x", { label: "qx", readonly: true, format: value => value.toFixed(3) });
  leftQuaternionFolder.addBinding(smoothArrow.quaternion, "y", { label: "qy", readonly: true, format: value => value.toFixed(3) });
  leftQuaternionFolder.addBinding(smoothArrow.quaternion, "z", { label: "qz", readonly: true, format: value => value.toFixed(3) });
  leftQuaternionFolder.addBinding(smoothArrow.quaternion, "w", { label: "qw", readonly: true, format: value => value.toFixed(3) });

  const rightQuaternionFolder = pane.addFolder({ title: "Right Quaternion · rotateTowards" });
  rightQuaternionFolder.addBinding(steadyArrow.quaternion, "x", { label: "qx", readonly: true, format: value => value.toFixed(3) });
  rightQuaternionFolder.addBinding(steadyArrow.quaternion, "y", { label: "qy", readonly: true, format: value => value.toFixed(3) });
  rightQuaternionFolder.addBinding(steadyArrow.quaternion, "z", { label: "qz", readonly: true, format: value => value.toFixed(3) });
  rightQuaternionFolder.addBinding(steadyArrow.quaternion, "w", { label: "qw", readonly: true, format: value => value.toFixed(3) });

}

function updateGUI() {
  params.smoothLeft = Number(THREE.MathUtils.radToDeg(smoothArrow.quaternion.angleTo(goal)).toFixed(1));
  params.steadyLeft = Number(THREE.MathUtils.radToDeg(steadyArrow.quaternion.angleTo(goal)).toFixed(1));
  pane.refresh();
}
