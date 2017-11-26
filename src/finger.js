import * as BABYLON from 'babylonjs';

export default class Finger {
  constructor() {
  }

  toVector(a){
    return new BABYLON.Vector3(-a[0]/100, a[1]/100, a[2]/100);
  }

  setBone(name, bone){
  }

  updateFinger(finger, data){

    if (data){
      var n = new BABYLON.Vector3(-1,1,1);
      var carp = BABYLON.Vector3.FromArray(data['carpPosition']).scale(0.01).multiply(n); // joint 0
      var mcp = BABYLON.Vector3.FromArray(data['mcpPosition']).scale(0.01).multiply(n);   // joint 1
      var pip = BABYLON.Vector3.FromArray(data['pipPosition']).scale(0.01).multiply(n);   // joint 2
      var dip = BABYLON.Vector3.FromArray(data['dipPosition']).scale(0.01).multiply(n);   // joint 3
      var tip = BABYLON.Vector3.FromArray(data['tipPosition']).scale(0.01).multiply(n);   // joint 4
      var metacarpal = {'pos': BABYLON.Vector3.Center(carp, mcp)};         // bone 0
      var proximal = {'pos': BABYLON.Vector3.Center(mcp, pip)};            // bone 1
      var middle = {'pos': BABYLON.Vector3.Center(pip, dip)};              // bone 2
      var distal = {'pos': BABYLON.Vector3.Center(dip, tip)};              // bone 3
      metacarpal['length'] = data['bones'][0]['length']
      proximal['length'] = data['bones'][1]['length'];
      proximal['scaleLength'] = proximal['length']/this.bones[finger]['proximal'].length;
      middle['length'] = data['bones'][2]['length'];
      distal['length'] = data['bones'][3]['length'];
      var direction = this.toVector(data['direction']);
      this.bones[finger]['distal'].setPosition(distal['pos']);
      this.bones[finger]['middle'].setPosition(middle['pos']);
      this.bones[finger]['proximal'].setPosition(proximal['pos']);
     }
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
