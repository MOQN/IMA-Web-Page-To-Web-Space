let params = {
  color: "#FFF"
};

let plane;

function setupThree() {
  plane = getPlane();
  scene.add(plane);
  plane.scale.set(500, 500, 1);

  let posArray = plane.geometry.attributes.position.array;
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    posArray[i + 2] = noise(x * 0.01, y * 0.01) * 1000;
  }



  // use count
  /*
  for (let i= 0; i<plane.geometry.attributes.position.count; i++) {
    let x = plane.geometry.attributes.position.getX(i);
    let y = plane.geometry.attributes.position.getY(i);
    let z = plane.geometry.attributes.position.getZ(i);
    plane.geometry.attributes.position.setZ(i, z + Math.random());
  }
    */
}

function updateThree() {
  //
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}