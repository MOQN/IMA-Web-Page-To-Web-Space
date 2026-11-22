
let pane;

function setupGUI() {
  pane = new Pane({ title: "slerp" });
  pane.addBinding(params, "duration", { min: 0.3, max: 4, step: 0.1, label: "Duration (sec)" });
  pane.addButton({ title: "Front" }).on("click", function() { turnTo(0, 0); });
  pane.addButton({ title: "Left" }).on("click", function() { turnTo(0, 90); });
  pane.addButton({ title: "Right" }).on("click", function() { turnTo(0, -90); });
  pane.addButton({ title: "Up" }).on("click", function() { turnTo(-60, 0); });

  const quaternionFolder = pane.addFolder({ title: "Quaternion" });
  quaternionFolder.addBinding(arrow.quaternion, "x", { label: "qx", readonly: true, format: function(value) {
    return value.toFixed(3);
  } });
  quaternionFolder.addBinding(arrow.quaternion, "y", { label: "qy", readonly: true, format: function(value) {
    return value.toFixed(3);
  } });
  quaternionFolder.addBinding(arrow.quaternion, "z", { label: "qz", readonly: true, format: function(value) {
    return value.toFixed(3);
  } });
  quaternionFolder.addBinding(arrow.quaternion, "w", { label: "qw", readonly: true, format: function(value) {
    return value.toFixed(3);
  } });

}

function updateGUI() {
  pane.refresh();
}
