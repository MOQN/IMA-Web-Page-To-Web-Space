function setupWebXR() {
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local");

  document.body.append(ARButton.createButton(renderer));
}
