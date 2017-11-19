import Finger from './finger.js';
import * as BABYLON from 'babylonjs';

export default class Hand {
  constructor(mesh, skeleton) {
    this.pointables = {};
    this.myPoints;
    this.fingers = {};
    this.colliders = {};
    this.mesh = mesh;
    this.mesh.scaling = new BABYLON.Vector3(100,100,100);
    this.mesh.position = new BABYLON.Vector3(0, 121, 0);
    this.skeleton = skeleton;
    this.bones = {'thumb': {}, 'index': {}, 'middle': {}, 'ring': {}, 'pinky': {}, 'arm': null, 'palm': null};
    for (var i = 0, len = skeleton.bones.length; i < len; i++) {
      var bone = skeleton.bones[i];
      bone.markAsDirty();
      if (bone.name.split('-').length > 1){
        var bonetype = bone.name.split('-')[0];
        var bonename = bone.name.split('-')[1];
        this.bones[bonetype][bonename] = skeleton.bones[i];
      } else {
        this.bones[bone.name] = skeleton.bones[i];
      }
    }
  }

  toVector(a){
    //return new BABYLON.Vector3(a[0],a[1], a[2]);
    return new BABYLON.Vector3(-a[0]/100, a[1]/100, a[2]/100);
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
      console.log(proximal['scaleLength'])
      middle['length'] = data['bones'][2]['length'];
      distal['length'] = data['bones'][3]['length'];
      var direction = this.toVector(data['direction']);
      this.bones[finger]['distal'].setPosition(distal['pos']);
      this.bones[finger]['middle'].setPosition(middle['pos']);
      this.bones[finger]['proximal'].setPosition(proximal['pos']);
     }
  }

  updateHand(scene, data) {
    this.updateFinger('thumb', data.thumb);
    this.updateFinger('index', data.indexFinger);
    this.updateFinger('middle', data.middleFinger);
    this.updateFinger('ring', data.ringFinger);
    this.updateFinger('pinky', data.pinky);
    this.bones['palm'].setPosition(this.toVector(data['palmPosition']));
    this.bones['arm'].setPosition(this.toVector(data['palmPosition']));
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
      if (this.fingers[finger]) {
        this.fingers[finger].updateFinger(tip, dip, mcp, pip, carp)
      } else {
        this.fingers[finger] = new Finger(tip, dip, mcp, pip, carp)
      }
      for (var key in this.colliders) {
        this.fingers[finger].registerCollider(this.colliders[key])
      }
    }
  }

  registerCollider(name, mesh) {
    if (this.colliders[name] == null){
      this.colliders[name] = mesh;
    }
  }

  drawHand(scene) {
    this.correctHand();
    for (var i = 0; i < this.pointables.length; i++) {
      this.fingers[i].drawLine(scene);
    }
  }
}
