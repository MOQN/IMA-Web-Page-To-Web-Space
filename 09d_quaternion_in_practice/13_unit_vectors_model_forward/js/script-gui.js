
let pane;

function setupGUI() {
  pane = new Pane({ title: "Model forward" });
  pane.addBinding(params, "forward", { options: { "Correct: +Y": "+Y", "Wrong: +Z": "+Z" } });
  pane.addBinding(params, "x", { min: -400, max: 400, step: 1, label: "Target X" });
  pane.addBinding(params, "y", { min: -100, max: 350, step: 1, label: "Target Y" });
  pane.addBinding(params, "z", { min: -400, max: 400, step: 1, label: "Target Z" });

  const quaternionFolder = pane.addFolder({ title: "Quaternion" });
  quaternionFolder.addBinding(arrow.quaternion, "x", { label: "qx", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(arrow.quaternion, "y", { label: "qy", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(arrow.quaternion, "z", { label: "qz", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(arrow.quaternion, "w", { label: "qw", readonly: true, format: value => value.toFixed(3) });

}

function updateGUI() {
  pane.refresh();
}
