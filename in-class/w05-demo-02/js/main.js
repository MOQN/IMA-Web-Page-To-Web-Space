const WORLD_SIZE = 2000;
const WORLD_HALF_SIZE = 1000;
const FLOOR_POSITION = -200;

let params = {
  color: "#FFF"
};

let cubes = [];
let pointLight;
let spotLight, spotLightHelper;
let directLight, directLightHelper;
let lightTarget;

function setupThree() {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  // 1. fog
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.Fog(0x000000, 1, 3000);

  // 2a. ambient light
  let ambiLight = new THREE.AmbientLight("#333");
  scene.add(ambiLight);

  // 2b. hemisphere light
  let hemiLight = new THREE.HemisphereLight(0xFF0000, 0x0000FF, 0.05);
  //scene.add(hemiLight);

  // 3. point light
  // set the decay value to 0.01 (very low) to make the light reach far away
  //pointLight = new THREE.PointLight(0xFFFFFF, 10, 1000, 0.01);
  //pointLight.position.set(0, 300, 0);
  //pointLight.castShadow = true; // default false
  //scene.add(pointLight);







  // 4. spot light
  //SpotLight( color, intensity, distance, angle, penumbra, decay )
  //spotLight = new THREE.SpotLight(0xFFFFFF, 10, 1000, PI / 6, 1.0, 0.01);
  //spotLight.position.set(0, 300, 0);
  //spotLight.castShadow = true;
  //scene.add(spotLight);

  // add a mesh for the light source
  //let sphere = getSphere();
  //spotLight.add(sphere); /// add the sphere to the light!!
  //sphere.scale.set(20, 20, 20);

  // add the helper!
  //spotLightHelper = new THREE.SpotLightHelper(spotLight);
  //scene.add(spotLightHelper);






  // 5. directional light
  directLight = new THREE.DirectionalLight(0xFFCCCC, 10);
  directLight.position.set(0, 600, 0);
  directLight.castShadow = true;
  scene.add(directLight);

  directLightHelper = new THREE.DirectionalLightHelper(directLight, 300);
  scene.add(directLightHelper);

  // add a target for the light
  lightTarget = getBox();
  scene.add(lightTarget);
  lightTarget.position.set(0, 50, 0);
  lightTarget.scale.set(30, 30, 30);
  lightTarget.material = new THREE.MeshBasicMaterial({
    color: 0xFF00FF
  });
  // let's make it invisible
  // lightTarget.visible = false;

  directLight.target = lightTarget;







  // structure
  let plane = getPlane();
  scene.add(plane);
  plane.scale.set(WORLD_SIZE, WORLD_SIZE, 1);
  plane.rotation.x = - PI / 2;
  plane.position.y = FLOOR_POSITION;

  let distance = 100;
  for (let z = -WORLD_HALF_SIZE; z <= WORLD_HALF_SIZE; z += distance) {
    for (let x = -WORLD_HALF_SIZE; x <= WORLD_HALF_SIZE; x += distance) {
      let tCube = new Cube()
        .setPosition(x, FLOOR_POSITION, z)
        .setTranslation(0, 0.5, 0)
        .setScale(50, random(3, 18) ** 2, 50);
      cubes.push(tCube);
    }
  }
}

function updateThree() {
  // rotate the point light
  let angle = frame * 0.01;
  let radDist = 500;
  lightTarget.position.x = sin(angle) * radDist;
  lightTarget.position.z = cos(angle) * radDist;

  directLightHelper.update();



  //spotLightHelper.update();

  // draw boxes!
  for (let cube of cubes) {
    cube.update();
  }
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true; //default is false
  mesh.receiveShadow = true;
  return mesh;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

class Cube {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.scl = createVector(1, 1, 1);
    this.mass = 1;
    //this.setMass(); // feel free to use this method; it arbitrarily defines the mass based on the scale.
    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();
    this.mesh = getBox();
    scene.add(this.mesh); // don't forget to add to scene
  }
  setPosition(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  setTranslation(x, y, z) {
    this.mesh.geometry.translate(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = createVector(x, y, z);
    return this;
  }
  setRotationAngle(x, y, z) {
    this.rot = createVector(x, y, z);
    return this;
  }
  setRotationVelocity(x, y, z) {
    this.rotVel = createVector(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    // or
    //h = (h === undefined) ? w : h;
    //d = (d === undefined) ? w : d;
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = createVector(w, h, d);
    return this;
  }
  setMass(mass) {
    if (mass) {
      this.mass = mass;
    } else {
      this.mass = 1 + (this.scl.x * this.scl.y * this.scl.z) * 0.000001; // arbitrary
    }
    return this;
  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  rotate() {
    this.rotVel.add(this.rotAcc);
    this.rot.add(this.rotVel);
    this.rotAcc.mult(0);
  }
  applyForce(f) {
    let force = f.copy();
    if (this.mass > 0) {
      force.div(this.mass);
    }
    this.acc.add(force);
  }
  update() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.mesh.scale.set(this.scl.x, this.scl.y, this.scl.z);
  }
}