let params = {
  fps: 0,
  color: "#0F0",
  wireframe: true,
};

let cube;

function setupThree() {
  cube = getBox();
  scene.add(cube);

  cube.scale.x = 100;
  cube.scale.y = 100;
  cube.scale.z = 100;

  // GUI with Tweakpane
  // https://tweakpane.github.io/docs/getting-started/

  // see script-three.js for fps-rated GUI

  pane.addBinding(params, 'wireframe');
  pane.addBinding(params, 'color', {
    picker: 'inline',
    // expanded: true,
  });
  pane.addBlade({ view: 'separator' });

  const folderPosition = pane.addFolder({ expanded: true, title: 'Position', });
  folderPosition.addBinding(cube.position, "x", { label: "PosX", min: -500, max: 500 });
  folderPosition.addBinding(cube.position, "y", { label: "PosY", min: -500, max: 500 });
  folderPosition.addBinding(cube.position, "z", { label: "PosZ", min: -500, max: 500 });

  const folderRotation = pane.addFolder({ expanded: true, title: 'Rotation', });
  folderRotation.addBinding(cube.rotation, "x", { label: "RotX" });
  folderRotation.addBinding(cube.rotation, "y", { label: "RotY" });
  folderRotation.addBinding(cube.rotation, "z", { label: "RotZ" });

  const folerScale = pane.addFolder({ expanded: true, title: 'Scale', });
  folerScale.addBinding(cube.scale, "x", { label: "ScaleX", min: 50, max: 300 });
  folerScale.addBinding(cube.scale, "y", { label: "ScaleY", min: 50, max: 300 });
  folerScale.addBinding(cube.scale, "z", { label: "ScaleZ", min: 50, max: 300 });
}

function updateThree() {
  cube.material.color.set(params.color);
  cube.material.wireframe = params.wireframe;

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.009;
  cube.rotation.z += 0.008;
  // these rotation values are updated by pane.refresh(); See script-three.js.
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}