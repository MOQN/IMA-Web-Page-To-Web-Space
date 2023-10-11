let params = {
  // (add)
};

let sphere;
let sprite;
let texture;

function setupThree() {
  texture = new THREE.TextureLoader().load('assets/earth.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;

  sprite = getSprite();
  sprite.scale.set(1100, 1100, 1);

  sphere = getSphere();
  sphere.scale.set(300.0, 300.0, 300.0);
}

function updateThree() {
  //sphere.rotation.x += 0.01;
  //sphere.rotation.z += 0.01;
}

function getSprite() {
  const map = new THREE.TextureLoader().load('assets/sprite.png');
  map.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    color: 0xffffff,
    map: map,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  const sprite = new THREE.Sprite(material);
  scene.add(sprite);
  return sprite;
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    //wireframe: true,
    map: texture,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}
