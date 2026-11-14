let pane;

function setupGUI() {
  pane = new Pane({ title: "Local and World Axes" });
  pane.addBinding(params, "step", { label: "Step (deg)", min: 5, max: 90, step: 5 });
  pane.addButton({ title: "Rotate Both" }).on("click", function () {
    const angle = THREE.MathUtils.degToRad(params.step);
    left.rotateOnAxis(axis, angle);
    right.rotateOnWorldAxis(axis, angle);
  });
  pane.addButton({ title: "Reset" }).on("click", resetRotation);
  const quaternionFolder1 = pane.addFolder({ title: "Local Axis", expanded: false });
  quaternionFolder1.addBinding(left.quaternion, "x", { label: "qx", readonly: true });
  quaternionFolder1.addBinding(left.quaternion, "y", { label: "qy", readonly: true });
  quaternionFolder1.addBinding(left.quaternion, "z", { label: "qz", readonly: true });
  quaternionFolder1.addBinding(left.quaternion, "w", { label: "qw", readonly: true });

  const quaternionFolder2 = pane.addFolder({ title: "World Axis", expanded: false });
  quaternionFolder2.addBinding(right.quaternion, "x", { label: "qx", readonly: true });
  quaternionFolder2.addBinding(right.quaternion, "y", { label: "qy", readonly: true });
  quaternionFolder2.addBinding(right.quaternion, "z", { label: "qz", readonly: true });
  quaternionFolder2.addBinding(right.quaternion, "w", { label: "qw", readonly: true });

}

function updateGUI() {
  pane.refresh();
}
