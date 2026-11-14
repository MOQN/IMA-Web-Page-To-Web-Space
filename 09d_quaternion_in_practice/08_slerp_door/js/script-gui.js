
let pane;

function setupGUI() {
  pane = new Pane({ title: "slerp" });
  pane.addBinding(params, "duration", { min: 0.5, max: 5, step: 0.1, label: "Duration (sec)" });
  pane.addBinding(params, "paused");
  pane.addBinding(params, "progress", { readonly: true });
  pane.addButton({ title: "Open / Replay" }).on("click", () => { progress = 0; playing = true; });

  const quaternionFolder = pane.addFolder({ title: "Quaternion" });
  quaternionFolder.addBinding(hinge.quaternion, "x", { label: "qx", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(hinge.quaternion, "y", { label: "qy", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(hinge.quaternion, "z", { label: "qz", readonly: true, format: value => value.toFixed(3) });
  quaternionFolder.addBinding(hinge.quaternion, "w", { label: "qw", readonly: true, format: value => value.toFixed(3) });

}

function updateGUI() {
  params.progress = Number(progress.toFixed(2));
  pane.refresh();
}
