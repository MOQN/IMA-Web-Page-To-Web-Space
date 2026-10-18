let params = {
  fps: 0,
};

let model;
let pointCloud;

function setupThree() {
  camera.position.set(0, 400, 1000);
  controls.target.set(0, 400, 0);
  controls.update();

  loadGLTF("assets/test-model.glb");
}

function updateThree() {
  if (pointCloud !== undefined) {
    pointCloud.rotation.y += 0.01;
  }
}

function loadGLTF(filepath) {
  // Import GLTFLoader from the Three.js addons before using it.
  // See index.html for the import setup!
  const loader = new GLTFLoader();

  loader.load(
    // resource URL
    filepath,
    // onLoad callback

    // Here the loaded data is assumed to be an object
    function (gltfData) {
      model = gltfData.scene;
      const vertices = getModelVertices(model);
      if (vertices.length === 0) {
        console.error("No mesh vertices found in GLTF:", filepath);
        return;
      }
      pointCloud = getPoints(vertices);
      pane.addBinding(pointCloud.material, "size", { min: 1, max: 5, step: 0.1 });
      scene.add(pointCloud);
    },

    // onProgress callback
    function (xhr) {
      if (xhr.total > 0) {
        console.log(`${(xhr.loaded / xhr.total * 100).toFixed(0)}% loaded`);
      } else {
        console.log(`${(xhr.loaded / 1024).toFixed(0)} KB downloaded (total unknown)`);
      }
    },

    // onError callback
    function (err) {
      console.error("Failed to load GLTF:", filepath, err);
    }
  );
}

function getModelVertices(object) {
  const vertices = [];
  const vertex = new THREE.Vector3();
  // the first child might be a group, not a mesh. let's visit every level.
  // update the matrices first so each mesh's position, rotation and scale are ready.
  object.updateMatrixWorld(true);
  object.traverse(function (child) {
    if (!child.isMesh) return;
    const positionAttributes = child.geometry.attributes.position;
    // these coordinates belong to this mesh, not to the whole model.
    // matrixworld includes the parent groups too, so the parts stay lined up
    // when we collect them into one point cloud with no parent transforms.
    for (let i = 0; i < positionAttributes.count; i++) {
      vertex.fromBufferAttribute(positionAttributes, i);
      vertex.applyMatrix4(child.matrixWorld);
      vertices.push(vertex.x, vertex.y, vertex.z);
    }
  });
  return vertices;
}

function getPoints(posArray) {
  const vertices = [];

  let scaleAdj = 1000.0;
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
  return points;
}