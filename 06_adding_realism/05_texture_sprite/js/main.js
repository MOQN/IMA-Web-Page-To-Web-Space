let params = {
  fps: 0,
};

let sphere;
let sprite;
let texture;

function setupThree() {
  texture = new THREE.TextureLoader().load('assets/earth.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;

  sprite = getSprite();
  scene.add(sprite);
  sprite.scale.set(1100, 1100, 1);

  sphere = getSphere();
  scene.add(sphere);
  sphere.scale.set(300.0, 300.0, 300.0);

  pane.addBinding(sprite, "visible", { label: "Sprite" });
  pane.addBinding(sphere, "visible", { label: "Sphere" });
}

function updateThree() {
  sphere.rotation.y += 0.002;
  sphere.rotation.z += 0.001;
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
  return mesh;
}
