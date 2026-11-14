
let pane;

function setupGUI() {
  pane = new Pane({ title: "Quaternion 04 · Take the short path" });
  pane.addBinding(params, "t", { min: 0, max: 1, step: 0.005 });
  pane.addBinding(params, "eulerAngle", { label: "Left Y (deg)", readonly: true });
  pane.addButton({ title: "Reset" }).on("click", function () {
    params.t = 0;
    pane.refresh();
  });
}

function updateGUI() {
  params.eulerAngle = Number(THREE.MathUtils.lerp(170, -170, params.t).toFixed(1));
  pane.refresh();
}
