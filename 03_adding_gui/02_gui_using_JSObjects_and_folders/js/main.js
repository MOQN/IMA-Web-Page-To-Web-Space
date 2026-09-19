let params = {
  mode: "Box",
  fps: 0,
  frame: 0,
  time: 0,
};

let cube;

function setupThree() {
  cube = getBox();
  scene.add(cube); // don't forget to add to scene
  cube.position.set(1, 0, 0); //(x, y, z);
  cube.scale.x = 100;
  cube.scale.y = 100;
  cube.scale.z = 100;

  console.log(cube); // look at the properties, especially geometry and material

  // SETUP GUI
  // pane is already declared and constructed in script-three.js.
  pane.addBinding(params, "mode", { readonly: true });
  pane.addBinding(params, "frame", { readonly: true, step: 1 });
  pane.addBinding(params, "time", { readonly: true });

  const folderPos = pane.addFolder({ title: "POSITION", expanded: true });
  folderPos.addBinding(cube.position, "x", { min: -200, max: 200, step: 1 });
  folderPos.addBinding(cube.position, "y", { min: -200, max: 200, step: 1 });
  folderPos.addBinding(cube.position, "z", { min: -200, max: 200, step: 1 });

  const folderRot = pane.addFolder({ title: "ROTATION", expanded: false });
  folderRot.addBinding(cube.rotation, "x", { min: -PI, max: PI, step: 0.01 });
  folderRot.addBinding(cube.rotation, "y", { min: -PI, max: PI, step: 0.01 });
  folderRot.addBinding(cube.rotation, "z", { min: -PI, max: PI, step: 0.01 });

  const folderScl = pane.addFolder({ title: "SCALE", expanded: false });
  folderScl.addBinding(cube.scale, "x", { min: 10, max: 200, step: 0.1 });
  folderScl.addBinding(cube.scale, "y", { min: 10, max: 200, step: 0.1 });
  folderScl.addBinding(cube.scale, "z", { min: 10, max: 200, step: 0.1 });

  const folderMat = pane.addFolder({ title: "MATERIAL", expanded: true });
  folderMat.addBinding(cube.material.color, "r", { min: 0.0, max: 1.0, step: 0.01 });
  folderMat.addBinding(cube.material.color, "g", { min: 0.0, max: 1.0, step: 0.01 });
  folderMat.addBinding(cube.material.color, "b", { min: 0.0, max: 1.0, step: 0.01 });
  folderMat.addBinding(cube.material, "wireframe");
}

function updateThree() {
  params.frame = frame; // take a look at the animate() function in script-three.js.
  params.time = Number(time.toFixed(2));
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}