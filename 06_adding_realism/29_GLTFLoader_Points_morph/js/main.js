let params = {
  fps: 0,
  percent: 0,
};

let model;
let pointCloud;
let particles = [];

function setupThree() {
  camera.position.set(0, 400, 1000);
  controls.target.set(0, 400, 0);
  controls.update();

  loadGLTF("assets/test-model.glb");

  pane.addBinding(params, "percent", { min: 0, max: 3, step: 0.005 });
}

function updateThree() {
  // update the particle first
  for (let p of particles) {
    p.updateLerp(params.percent);
  }

  // then update the points
  if (pointCloud) {
    pointCloud.rotation.y += 0.01;
    let positionAttributes = pointCloud.geometry.attributes.position;
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      let ptIndex = i * 3;
      positionAttributes.array[ptIndex + 0] = p.pos.x;
      positionAttributes.array[ptIndex + 1] = p.pos.y;
      positionAttributes.array[ptIndex + 2] = p.pos.z;
    }
    positionAttributes.needsUpdate = true;
    pointCloud.geometry.computeBoundingSphere();
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
  // a model can have groups inside groups, with several meshes at the bottom.
  // traverse visits them all; children[0] would only give us the first branch.
  object.updateMatrixWorld(true);
  object.traverse(function (child) {
    if (!child.isMesh) return;
    const positionAttributes = child.geometry.attributes.position;
    // bake the mesh and parent transforms into each target position.
    // otherwise the morph would pull separate parts back to their local origins.
    // we're reading the source here, not changing its geometry.
    for (let i = 0; i < positionAttributes.count; i++) {
      vertex.fromBufferAttribute(positionAttributes, i);
      vertex.applyMatrix4(child.matrixWorld);
      vertices.push(vertex.x, vertex.y, vertex.z);
    }
  });
  return vertices;
}

function getPoints(posArray) {
  // let's make a sphere shaped point cloud.
  const originPos = [];
  for (let i = 0; i < posArray.length; i += 3) {
    let vector = new THREE.Vector3(random(-1, 1), random(-1, 1), random(-1, 1));
    vector.normalize();
    vector.multiplyScalar(300);
    vector.y += 400;
    originPos.push(vector.x, vector.y, vector.z); // this will be the starting position
  }

  const vertices = [];
  let scaleAdj = 1000.0;
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0] * scaleAdj;
    let y = posArray[i + 1] * scaleAdj;
    let z = posArray[i + 2] * scaleAdj;
    vertices.push(x, y, z); // this will be the target position
  }

  // let's construct the Particle objects
  for (let i = 0; i < vertices.length; i += 3) {
    let x1 = originPos[i + 0];
    let y1 = originPos[i + 1];
    let z1 = originPos[i + 2];

    let x2 = vertices[i + 0];
    let y2 = vertices[i + 1];
    let z2 = vertices[i + 2];

    particles.push(new Particle(x1, y1, z1, x2, y2, z2));
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
  const material = new THREE.PointsMaterial({ color: 0xFFFFFF });
  const points = new THREE.Points(geometry, material);
  return points;
}

class Particle {
  constructor(x1, y1, z1, x2, y2, z2) {
    this.originPos = new THREE.Vector3(x1, y1, z1);
    this.targetPos = new THREE.Vector3(x2, y2, z2);
    this.pos = this.originPos.clone();
  }
  updateLerp(pct) {
    this.pos.lerpVectors(this.originPos, this.targetPos, pct);
  }
}