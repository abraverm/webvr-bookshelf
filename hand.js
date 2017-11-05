function hand(pointables, handtype) {
  this.pointables = pointables;
  this.handtype = handtype;
  this.myPoints;
  this.fingers = {};
  this.updateHand = function updateHand(pointables, handtype) {
    this.pointables = pointables;
    this.handtype = handtype;
  }
  this.correctHand = function correctHand() {
    for (var i = 0; i < this.pointables.length; i++) {
      var point = this.pointables[i]
      var finger = point["type"]
      var tip = point["tipPosition"]
      var carp = point["carpPosition"]
      var dip = point["dipPosition"]
      var mcp = point["mcpPosition"]
      var pip = point["pipPosition"]
      if (this.fingers[finger] != null) {
        this.fingers[finger].updateFinger(tip, dip, mcp, pip, carp)
      } else {
        this.fingers[finger] = new finger(tip, dip, mcp, pip, carp)
      }
    }
  }

  this.drawHand = function drawHand(scene) {
    this.correctHand();
    for (var i = 0; i < this.pointables.length; i++) {
      this.fingers[i].drawLine(scene);
      /*
      this.myPoints = []
      var point = this.pointables[i]
      var tip = this.vectorFromJson(point["tipPosition"])
      var carp = this.vectorFromJson(point["carpPosition"])
      var dip = this.vectorFromJson(point["dipPosition"])
      var mcp = this.vectorFromJson(point["mcpPosition"])
      var pip = this.vectorFromJson(point["pipPosition"])
      this.myPoints.push(tip)
      this.myPoints.push(dip)
      this.myPoints.push(mcp)
      this.myPoints.push(pip)
      this.myPoints.push(carp)
      this.drawLine(scene);
      */
    }
  }
}
