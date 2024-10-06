let params = {
  mode: "Box",
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
  // gui is aready declared and constructed in script-three.js.
  gui.add(params, "mode").listen();
  gui.add(params, "frame").listen();
  gui.add(params, "time").listen();

  let folderPos = gui.addFolder("POSITION");
  folderPos.open();
  folderPos.add(cube.position, "x").min(-200).max(200).step(1);
  folderPos.add(cube.position, "y").min(-200).max(200).step(1);
  folderPos.add(cube.position, "z").min(-200).max(200).step(1);

  let folderRot = gui.addFolder("ROTATION");
  // folderRot.close(); // by default
  folderRot.add(cube.rotation, "x").min(-PI).max(PI).step(0.01);
  folderRot.add(cube.rotation, "y").min(-PI).max(PI).step(0.01);
  folderRot.add(cube.rotation, "z").min(-PI).max(PI).step(0.01);

  let folderScl = gui.addFolder("SCALE");
  // folderScl.close(); // by default
  folderScl.add(cube.scale, "x").min(10).max(200).step(0.1);
  folderScl.add(cube.scale, "y").min(10).max(200).step(0.1);
  folderScl.add(cube.scale, "z").min(10).max(200).step(0.1);

  let folderMat = gui.addFolder("MATERIAL");
  folderMat.open();
  folderMat.add(cube.material.color, "r").min(0.0).max(1.0).step(0.01);;
  folderMat.add(cube.material.color, "g").min(0.0).max(1.0).step(0.01);;
  folderMat.add(cube.material.color, "b").min(0.0).max(1.0).step(0.01);;
  folderMat.add(cube.material, "wireframe");
}

function updateThree() {
  params.frame = frame; // take a look at the animate() function in script-three.js.
  params.time = time;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  mesh = new THREE.Mesh(geometry, material);
  return mesh;
}