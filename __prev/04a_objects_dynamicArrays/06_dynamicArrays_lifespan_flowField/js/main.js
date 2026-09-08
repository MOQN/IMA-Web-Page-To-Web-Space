let params = {
  fps: 0,
  noiseFreqPosition: 0.0015,
  noiseFreqTime: 0.001,
  sineFreqPosition: 0.001,
  sineFreqTime: 0.001,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
const GRID_SIZE = 200;

let arrows = [];
let forces = [];
let cubes = [];

function setupThree() {
  setupGUI();

  // create lines in grid
  for (let z = -WORLD_HALF; z <= WORLD_HALF; z += GRID_SIZE) {
    for (let y = -WORLD_HALF; y <= WORLD_HALF; y += GRID_SIZE) {
      for (let x = -WORLD_HALF; x <= WORLD_HALF; x += GRID_SIZE) {
        const arrow = getArrow();
        arrow.position.set(x, y, z);
        arrows.push(arrow);
        scene.add(arrow);
      }
    }
  }

  // generate cubes
  let numOfCubes = 1000;
  for (let i = 0; i < numOfCubes; i++) {
    let tCube = new Cube()
      .setPosition(random(-50, 50), random(-50, 50), random(-50, 50))
      // .setVelocity(random(-5, 5), random(-5, 5), random(-5, 5))
      // .setVelocity(1, 0, 0)
      .setRotationVelocity(random(-0.05, 0.05), random(-0.05, 0.05), random(-0.05, 0.05))
      .setScale(5);
    cubes.push(tCube);
  }
}

function updateThree() {
  // update forces
  let forces = [];

  // Calculate grid dimensions
  const gridWidth = ceil((WORLD_SIZE / GRID_SIZE));  // number of grid points along each axis
  const gridHeight = ceil((WORLD_SIZE / GRID_SIZE));
  const gridDepth = ceil((WORLD_SIZE / GRID_SIZE));

  for (let z = -WORLD_HALF; z <= WORLD_HALF; z += GRID_SIZE) {
    for (let y = -WORLD_HALF; y <= WORLD_HALF; y += GRID_SIZE) {
      for (let x = -WORLD_HALF; x <= WORLD_HALF; x += GRID_SIZE) {
        // Convert world coordinates to grid indices
        let gridX = (x + WORLD_HALF) / GRID_SIZE;
        let gridY = (y + WORLD_HALF) / GRID_SIZE;
        let gridZ = (z + WORLD_HALF) / GRID_SIZE;

        // Calculate 1D index from 3D coordinates
        let index = gridX + gridY * gridWidth + gridZ * gridWidth * gridHeight;

        // get a vector from noise 3d
        let xFreq = x * params.noiseFreqPosition + frame * params.noiseFreqTime;
        let yFreq = y * params.noiseFreqPosition + frame * params.noiseFreqTime;
        let zFreq = z * params.noiseFreqPosition + frame * params.noiseFreqTime;
        let noiseValue = map(noise(xFreq, yFreq, zFreq), 0.0, 1.0, -1.0, 1.0);

        // arbitrary angle calculation
        let force = new THREE.Vector3(
          cos(x * params.sineFreqPosition + frame * params.sineFreqTime),
          sin(y * params.sineFreqPosition + frame * params.sineFreqTime),
          sin(z * params.sineFreqPosition + frame * params.sineFreqTime * 0.7)
        );
        force.normalize(); // direction
        // apply noise to direction
        force.multiplyScalar(noiseValue);
        let magnitude = force.length(); // get magnitude of the vector

        forces[index] = createVector(force.x, force.y, force.z);

        // update arrow
        let arrow = arrows[index];
        arrow.setDirection(force);
        arrow.setLength(magnitude * GRID_SIZE / 2);
        arrow.position.set(x, y, z);
      }
    }
  }

  // update the cubes
  for (let c of cubes) {

    // apply forces based on the grid
    let gridX = floor((c.pos.x + WORLD_HALF) / GRID_SIZE);
    let gridY = floor((c.pos.y + WORLD_HALF) / GRID_SIZE);
    let gridZ = floor((c.pos.z + WORLD_HALF) / GRID_SIZE);
    let index = gridX + gridY * gridWidth + gridZ * gridWidth * gridHeight;

    let force = forces[index].copy();
    force.mult(0.3); // scale the force arbitrary, play with this value to see the effect!
    c.applyForce(force);

    c.move();
    c.vel.limit(5); // limit the velocity; We don't have a steering behavior, so we limit the velocity to prevent it from going too fast. play with this value too!

    c.rotate();
    //c.age();
    c.reappear();
    c.update();
  }

  // if some of them is "done", remove the mesh from the scene, then the Cube object.
  // this time I don't use the flipped for loop. Instead "i--;" is used 
  for (let i = 0; i < cubes.length; i++) {
    let c = cubes[i];
    if (c.isDone) {
      scene.remove(c.mesh);
      cubes.splice(i, 1);
      i--;
    }
  }
}

function getArrow() {
  const dir = new THREE.Vector3(0, 0, -1);
  const origin = new THREE.Vector3(0, 0, 0);
  const length = GRID_SIZE / 2;
  const hexColor = 0x00ff00;

  const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hexColor);
  return arrowHelper;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function setupGUI() {
  pane.addBinding(params, 'noiseFreqPosition', {
    label: 'Noise Freq Position',
    min: 0.0001,
    max: 0.01,
    step: 0.0001,
  });
  pane.addBinding(params, 'noiseFreqTime', {
    label: 'Noise Freq Time',
    min: 0.0001,
    max: 0.01,
    step: 0.0001,
  });
  pane.addBlade({ view: 'separator' });
  pane.addBinding(params, 'sineFreqPosition', {
    label: 'Sine Freq Position',
    min: 0.0001,
    max: 0.01,
    step: 0.0001,
  });
  pane.addBinding(params, 'sineFreqTime', {
    label: 'Sine Freq Time',
    min: 0.0001,
    max: 0.01,
    step: 0.0001,
  });
  pane.addBlade({ view: 'separator' });
}









