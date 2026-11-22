let pane;

function setupGUI() {
  pane = new Pane({ title: "Hover with a controller" });
  pane.addBinding(params, "fps", { label: "FPS", readonly: true, format: function(value) {
    return value.toFixed(1);
  } });
}

function updateGUI() {
  pane.refresh();
}
