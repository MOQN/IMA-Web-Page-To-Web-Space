let params = {
  // (add)
};

let bear;
let pointCloud;

function setupThree() {
  loadOBJ("assets/gummy.obj");
}

function updateThree() {
  if (bear !== undefined) {
    pointCloud.rotation.x += 0.01;
    pointCloud.rotation.z += 0.01;
  }
}

function loadOBJ(filepath) {
  // load .obj file
  const loader = new OBJLoader();

  loader.load(
    // resource URL
    filepath,
    // onLoad callback

    // Here the loaded data is assumed to be an object
    function(obj) {
      // Add the loaded object to the scene
      bear = obj;
      for (let child of bear.children) {
        //child.material = new THREE.MeshBasicMaterial();
        child.material = new THREE.MeshBasicMaterial({
          color: 0x00FF00,
          wireframe: true
        });
      }
      //scene.add(bear);

      console.log(bear.children[0].geometry.attributes.position.array);
      pointCloud = getPoints(bear.children[0].geometry.attributes.position.array);
    },

    // onProgress callback
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    // onError callback
    function(err) {
      console.error('An error happened');
    }
  );
}

function getPoints(posArray) {
  const vertices = [];

  let scaleAdj = 100.0;
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0] * scaleAdj;
    let y = posArray[i + 1] * scaleAdj;
    let z = posArray[i + 2] * scaleAdj;
    vertices.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({ color: 0xFFFFFF });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}