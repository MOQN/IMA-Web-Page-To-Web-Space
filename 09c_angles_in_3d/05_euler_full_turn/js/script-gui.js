
let pane;

function setupGUI() {
  pane = new Pane({ title: "Euler 05 · Orientation and turn count" });
  pane.addBinding(params, "angle", { label: "Y (deg)", min: 0, max: 720, step: 1 });
  pane.addBinding(params, "turns", { label: "Turns", readonly: true });
  pane.addButton({ title: "0 degrees" }).on("click", () => { params.angle = 0; });
  pane.addButton({ title: "360 degrees" }).on("click", () => { params.angle = 360; });
  pane.addButton({ title: "720 degrees" }).on("click", () => { params.angle = 720; });
  pane.addButton({ title: "Reset" }).on("click", function () {
    params.angle = 0;
    pane.refresh();
  });
}

function updateGUI() {
  params.turns = Number((params.angle / 360).toFixed(2));
  pane.refresh();
}
