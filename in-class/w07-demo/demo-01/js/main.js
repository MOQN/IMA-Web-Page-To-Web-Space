let params = {
  // numOfPoints: 0,
  // numOfParticles: 0
};

const WORLD_SIZE = 1000;
const WORLD_HALF_SIZE = 500;

let ball;

function setupThree() {
  // scene.background = new THREE.Color(0x999999)
  ball = getSphere();
  scene.add(ball);
  ball.scale.set(500, 500, 500);

  // add point light
  light = getPointLight("#FFFFFF");
  scene.add(light);
  light.position.set(1000, 0, 0);
}

function updateThree() {
  //
}

function getPointLight(color) {
  const light = new THREE.PointLight(color, 2, 0, 0.1); // ( color , intensity, distance (0=infinite), decay )
  return light;
}
function getSphere() {
  let texture = new THREE.TextureLoader().load('assets/earth.jpg');
  let dTexture = new THREE.TextureLoader().load('assets/earth-displacement.png');

  let geometry = new THREE.SphereGeometry(1, 32, 32);
  let material = new THREE.MeshStandardMaterial({
    color: 0xffffff,

    side: THREE.DoubleSide,
    map: texture,
    displacementMap: dTexture,
    displacementScale: 0.05,
  });
  let sphere = new THREE.Mesh(geometry, material);
  return sphere;
}