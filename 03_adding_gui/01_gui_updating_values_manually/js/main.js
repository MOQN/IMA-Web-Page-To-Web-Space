let params = {
  mode: "Box",
  fps: 0,
  frame: 0,
  time: 0,
  x: 0,
  y: 0,
  z: 0,
  wireframe: false,
  color: "#FFFFFF",
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
  pane.addBinding(params, "x", { min: -200, max: 200, step: 0.1 });
  pane.addBinding(params, "y", { min: -200, max: 200, step: 0.1 });
  pane.addBinding(params, "z", { min: -200, max: 200, step: 0.1 });
  pane.addBinding(params, "wireframe");
  pane.addBinding(params, "color", {
    picker: "inline",
  });

  console.log(cube);
}

function updateThree() {
  params.frame = frame; // take a look at the animate() function in script-three.js.
  params.time = Number(time.toFixed(2));

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  cube.position.set(params.x, params.y, params.z);
  cube.material.wireframe = params.wireframe;
  cube.material.color.set(params.color);

}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}