let pane;

function setupGUI() {
  pane = new Pane({ title: "Add a Rotation" });
  pane.addBinding(params, "step", { label: "Step (deg)", min: 5, max: 90, step: 5 });
  pane.addButton({ title: "Add X Rotation" }).on("click", function () {
    addRotation(new THREE.Vector3(1, 0, 0));
  });
  pane.addButton({ title: "Add Y Rotation" }).on("click", function () {
    addRotation(new THREE.Vector3(0, 1, 0));
  });
  pane.addButton({ title: "Reset" }).on("click", function () {
    box.quaternion.identity();
  });
  const quaternionFolder1 = pane.addFolder({ title: "Quaternion", expanded: false });
  quaternionFolder1.addBinding(box.quaternion, "x", { label: "qx", readonly: true });
  quaternionFolder1.addBinding(box.quaternion, "y", { label: "qy", readonly: true });
  quaternionFolder1.addBinding(box.quaternion, "z", { label: "qz", readonly: true });
  quaternionFolder1.addBinding(box.quaternion, "w", { label: "qw", readonly: true });

}

function updateGUI() {
  pane.refresh();
}
