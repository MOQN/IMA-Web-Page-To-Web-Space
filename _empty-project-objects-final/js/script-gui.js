

let pane;

function setupGUI() {
  pane = new Pane();
  pane.addBinding(params, "fps", { label: "FPS", readonly: true });
  pane.addBinding(params, "fps", {
    label: "FPS Graph",
    readonly: true,
    view: "graph",
    min: 0,
    max: 120,
  });
  pane.addBlade({ view: "separator" });
  pane.addBinding(params, "numOfParticles", { step: 1, readonly: true });
}

function updateGUI() {
  params.numOfParticles = cubes.length;
  pane.refresh();
}
