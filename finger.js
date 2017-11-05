function finger(tip, dip, mcp, pip, carp) {
  this.myPoints = [tip, dip, mcp, pip, carp];
  this.firstDraw = true;
  this.line;
  this.vectorFromJson = function vectorFromJson(a) {
    var Vector = new BABYLON.Vector3(a[0], a[1], a[2]);
    return Vector;
  }
  this.updateFinger = function updateFinger(tip, dip, mcp, pip, carp) {
    this.myPoints = [tip, dip, mcp, pip, carp];
  }
  this.toVectors = function toVectors() {
    for (var i = 0; i < this.myPoints.length; i++) {
      this.myPoints[i] = this.vectorFromJson(this.myPoints[i]);

    }
  }
  this.drawLine = function drawLine(scene) {
    this.toVectors();
    /*
    tip = tip.subtract(carp);
    dip = dip.subtract(carp);
    mcp = mcp.subtract(carp);
    pip = pip.subtract(carp);
    carp = carp.subtract(carp);
    */
    //Array of points to construct lines
    //Create lines with updatable parameter set to true for later changes
    if (this.firstDraw) {
      var line = BABYLON.MeshBuilder.CreateLines("lines", {
        points: this.myPoints,
        updatable: true
      }, scene);
      this.line = line;
      this.firstDraw = false;
    } else {
      var newline = BABYLON.MeshBuilder.CreateLines("lines", {
        points: this.myPoints,
        instance: this.line
      }, scene);
    }

  }
}
