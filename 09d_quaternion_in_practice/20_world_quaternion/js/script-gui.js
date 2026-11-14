let pane;

function setupGUI() {
  pane = new Pane({ title: "Copy a World Rotation" });
  pane.addBinding(params, "parentAngle", { label: "Parent Y (deg)", min: -180, max: 180, step: 1 });
  pane.addBinding(params, "childAngle", { label: "Child X (deg)", min: -180, max: 180, step: 1 });
  const quaternionFolder1 = pane.addFolder({ title: "Child Local Rotation", expanded: false });
  quaternionFolder1.addBinding(child.quaternion, "x", { label: "qx", readonly: true });
  quaternionFolder1.addBinding(child.quaternion, "y", { label: "qy", readonly: true });
  quaternionFolder1.addBinding(child.quaternion, "z", { label: "qz", readonly: true });
  quaternionFolder1.addBinding(child.quaternion, "w", { label: "qw", readonly: true });

  const quaternionFolder2 = pane.addFolder({ title: "Child World Rotation", expanded: false });
  quaternionFolder2.addBinding(worldRotation, "x", { label: "qx", readonly: true });
  quaternionFolder2.addBinding(worldRotation, "y", { label: "qy", readonly: true });
  quaternionFolder2.addBinding(worldRotation, "z", { label: "qz", readonly: true });
  quaternionFolder2.addBinding(worldRotation, "w", { label: "qw", readonly: true });

}

function updateGUI() {
  pane.refresh();
}
