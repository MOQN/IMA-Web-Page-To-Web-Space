let pane;

function setupGUI() {
  pane = new Pane({ title: "See the controller ray and grip" });
  pane.addBinding(params, "fps", { label: "FPS", readonly: true, format: function(value) {
    return value.toFixed(1);
  } });
}

function updateGUI() {
  pane.refresh();
}
