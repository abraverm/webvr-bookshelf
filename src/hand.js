import Finger from './finger.js';

export default class Hand {
  constructor(pointables, handtype) {
    this.pointables = pointables;
    this.handtype = handtype;
    this.myPoints;
    this.fingers = {};
  }

  updateHand(pointables, handtype) {
    this.pointables = pointables;
    this.handtype = handtype;
  }
  correctHand() {
    for (var i = 0; i < this.pointables.length; i++) {
      var point = this.pointables[i]
      var finger = point['type']
      var tip = point["tipPosition"]
      var carp = point["carpPosition"]
      var dip = point["dipPosition"]
      var mcp = point["mcpPosition"]
      var pip = point["pipPosition"]
      if (this.fingers[finger] != null) {
        this.fingers[finger].updateFinger(tip, dip, mcp, pip, carp)
      } else {
        this.fingers[finger] = new Finger(tip, dip, mcp, pip, carp)
      }
    }
  }

  drawHand(scene) {
    this.correctHand();
    for (var i = 0; i < this.pointables.length; i++) {
      this.fingers[i].drawLine(scene);
    }
  }
}
