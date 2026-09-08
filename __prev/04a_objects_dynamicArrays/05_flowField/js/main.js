let params = {
  fps: 0,
  noiseFreqPosition: 0.01,
  noiseFreqTime: 0.001,
  sineFreqPosition: 0.001,
  sineFreqTime: 0.001,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
const GRID_SIZE = 200;

let arrows = [];
let forces = [];

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
}

function updateThree() {
  // update forces
  let forces = [];
  
  // Calculate grid dimensions
  const gridWidth = (WORLD_SIZE / GRID_SIZE) + 1;  // number of grid points along each axis
  const gridHeight = (WORLD_SIZE / GRID_SIZE) + 1;
  const gridDepth = (WORLD_SIZE / GRID_SIZE) + 1;
  
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

        forces[index] = force;

        // update arrow
        let arrow = arrows[index];
        arrow.setDirection(force);
        arrow.setLength(magnitude * GRID_SIZE / 2);
        arrow.position.set(x, y, z);
      }
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
    wireframe: true,
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