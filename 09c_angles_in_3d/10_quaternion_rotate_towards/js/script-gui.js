
let pane;

function setupGUI() {
  pane = new Pane({ title: "Quaternion 05 · Follow a target orientation" });
  pane.addBinding(params, "x", { label: "Target X (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "y", { label: "Target Y (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "speed", { label: "Speed (deg/s)", min: 0, max: 180, step: 1 });
  pane.addBinding(params, "paused", { label: "Pause" });
  pane.addBinding(params, "remaining", { label: "Remaining (deg)", readonly: true });
  pane.addButton({ title: "Reset" }).on("click", function () {
    params.x = 45; params.y = 120; params.speed = 60; params.paused = false; current.mesh.quaternion.identity();
    pane.refresh();
  });
}

function updateGUI() {
  params.remaining = Number(THREE.MathUtils.radToDeg(current.mesh.quaternion.angleTo(target.mesh.quaternion)).toFixed(1));
  pane.refresh();
}
