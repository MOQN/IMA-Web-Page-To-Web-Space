
let pane;

function setupGUI() {
  pane = new Pane({ title: "Quaternion 01 · One axis and one angle" });
  pane.addBinding(params, "axis", { options: { X: "X", Y: "Y", Z: "Z", Diagonal: "Diagonal" } });
  pane.addBinding(params, "angle", { label: "Angle (deg)", min: -180, max: 180, step: 1 });
  for (const key of ["qx", "qy", "qz", "qw"]) pane.addBinding(params, key, { readonly: true });
  pane.addButton({ title: "Reset" }).on("click", function () {
    params.axis = "Y"; params.angle = 0;
    pane.refresh();
  });
}

function updateGUI() {
  const q = model.mesh.quaternion;
  params.qx = Number(q.x.toFixed(3)); params.qy = Number(q.y.toFixed(3));
  params.qz = Number(q.z.toFixed(3)); params.qw = Number(q.w.toFixed(3));
  pane.refresh();
}
