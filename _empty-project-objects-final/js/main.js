const params = {
  fps: 0,
  numOfParticles: 0,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let cubes = [];

function setupThree() {
  // add your code here
}

function updateThree() {
  // generate
  let cube = new Cube();
  scene.add(cube.mesh);
  // random position
  // cube.pos.x = random(-WORLD_HALF, WORLD_HALF);
  // cube.pos.y = random(-WORLD_HALF, WORLD_HALF);
  // cube.pos.z = random(-WORLD_HALF, WORLD_HALF);
  cubes.push(cube);

  // update
  for (let cube of cubes) {
    cube.updatePosition();
    cube.updateRotation();
    cube.updateLifespan();
    cube.updateScale();
    cube.updateColor();
    cube.reappear(WORLD_HALF);
    // or, cube.update(); // if you want to update all properties
  }

  // remove cubes that are done
  for (let i = cubes.length - 1; i >= 0; i--) {
    let cube = cubes[i];
    if (cube.isDone) {
      cube.dispose();
      cubes.splice(i, 1);
    }
  }
}

