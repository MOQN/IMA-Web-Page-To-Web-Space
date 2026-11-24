let pane;

function setupGUI() {
  pane = new Pane({ title: "Point with a mouse ray" });
  pane.addBinding(params, "fps", { label: "FPS", readonly: true, format: function(value) {
    return value.toFixed(1);
  } });
}

function updateGUI() {
  pane.refresh();
}
