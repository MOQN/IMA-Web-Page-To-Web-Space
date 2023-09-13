console.log("three.js Version: " + THREE.REVISION);

let scene, camera, renderer;
let time, frame = 0;

function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  let container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  setupThree(); // *** 

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  time = performance.now();
  frame++;

  updateThree(); // ***

  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});