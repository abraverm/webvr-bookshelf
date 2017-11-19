import * as BABYLON from 'babylonjs';

export default class Finger {
  constructor(tip, dip, mcp, pip, carp) {
    this.myPoints = [tip, dip, mcp, pip, carp];
    this.firstDraw = true;
    this.line;
  }

  vectorFromJson(a) {
    var Vector = new BABYLON.Vector3(-a[0], a[1]-100, a[2]);
    return Vector;
  }
  updateFinger(tip, dip, mcp, pip, carp) {
    this.myPoints = [tip, dip, mcp, pip, carp];
  }

  toVectors() {
    for (var i = 0; i < this.myPoints.length; i++) {
      this.myPoints[i] = this.vectorFromJson(this.myPoints[i]);

    }
  }

  registerCollider(mesh) {
    this.line.physicsImpostor.registerOnPhysicsCollide(mesh.physicsImpostor,
      function(main, collided){
      console.log("hello")
        collided.object.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
      });
  }

  drawLine(scene) {
    this.toVectors();
    //Array of points to construct lines
    //Create lines with updatable parameter set to true for later changes
    if (this.firstDraw) {
      var line = BABYLON.MeshBuilder.CreateLines("lines", {
        points: this.myPoints,
        updatable: true,
        checkCollisions: true
      }, scene);
      this.line = line;
      this.firstDraw = false;
      this.line.physicsImpostor = new BABYLON.PhysicsImpostor(
        line,
        BABYLON.PhysicsImpostor.ParticleImpostor, {
          mass: 0,
          restitution: 0.9,
          friction: 1
        },
        scene
      );
    } else {
      var newline = BABYLON.MeshBuilder.CreateLines("lines", {
        points: this.myPoints,
        instance: this.line
      }, scene);
    }
  }
}
