function setupWebXR() {
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local-floor");
  document.body.append(VRButton.createButton(renderer));
}
