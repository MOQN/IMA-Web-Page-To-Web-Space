function setupWebXR() {
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local-floor");

  renderer.xr.addEventListener("sessionstart", function () {
    console.log("VR session started.");
  });
  renderer.xr.addEventListener("sessionend", function () {
    console.log("VR session ended.");
  });

  document.body.append(VRButton.createButton(renderer));
}
