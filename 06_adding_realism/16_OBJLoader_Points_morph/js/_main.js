let params = {
  percent: 0,
};

let bear;
let pointCloud;
let particles = [];

function setupThree() {
  loadOBJ("assets/gummy.obj");

  gui.add(params, "percent", 0, 3).step(0.005);
}

function updateThree() {
  // update the particle first
  let pct = map(sin(frame * 0.01), -1, 1, 0, 1);
  for (let p of particles) {
    p.updateLerp(params.percent);
  }

  // then update the points
  let positionArray = pointCloud.geometry.attributes.position.array;
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let ptIndex = i * 3;
    positionArray[ptIndex + 0] = p.pos.x;
    positionArray[ptIndex + 1] = p.pos.y;
    positionArray[ptIndex + 2] = p.pos.z;
  }
  pointCloud.geometry.attributes.position.needsUpdate = true;
}

function loadOBJ(filepath) {
  // load .obj file
  const loader = new OBJLoader();

  loader.load(
    // resource URL
    filepath,
    // onLoad callback

    // Here the loaded data is assumed to be an object
    function (obj) {
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
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    // onError callback
    function (err) {
      console.error('An error happened');
    }
  );
}

function getPoints(posArray) {
  // let's make a sphere shaped point cloud.
  const originPos = [];
  for (let i = 0; i < posArray.length; i += 3) {
    let vector = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
    vector.normalize();
    vector.mult(300);
    originPos.push(vector.x, vector.y, vector.z); // this will be the starting position
  }

  const vertices = [];
  let scaleAdj = 100.0;
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
  const material = new THREE.PointsMaterial({ color: 0xFFFFFF });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}

class Particle {
  constructor(x1, y1, z1, x2, y2, z2) {
    this.originPos = createVector(x1, y1, z1);
    this.targetPos = createVector(x2, y2, z2);
    this.pos = this.originPos.copy();
  }
  updateLerp(pct) {
    this.pos = p5.Vector.lerp(this.originPos, this.targetPos, pct);
  }
}