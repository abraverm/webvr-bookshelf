import Finger from './finger.js';
import * as BABYLON from 'babylonjs';

export default class Hand {
  constructor(mesh, skeleton) {
    this.pointables = {};
    this.myPoints;
    this.fingers = {};
    this.colliders = {};
    this.mesh = mesh;
    this.rotation_z;
    this.rotation_x;
    this.mesh.scaling = new BABYLON.Vector3(100, 100, 100);
    this.mesh.position = new BABYLON.Vector3(0, 121, 0);
    this.skeleton = skeleton;
    this.fingers = {
      'thumb': new Finger(),
      'index': new Finger(),
      'middle': new Finger(),
      'ring': new Finger(),
      'pinky': new Finger()
    };
    this.arm;
    this.palm;
    for (var i = 0, len = skeleton.bones.length; i < len; i++) {
      var bone = skeleton.bones[i];
      //bone.markAsDirty();
      if (bone.name.split('-').length > 1) {
        var bonetype = bone.name.split('-')[0];
        var bonename = bone.name.split('-')[1];
        this.fingers[bonetype].setBone(bonename, skeleton.bones[i]);
      } else {
        if (bone.name == 'arm'){ this.arm = skeleton.bones[i]; }
        if (bone.name == 'palm'){ this.palm = skeleton.bones[i]; }
      }
    }
  }

  toVector(a){
    return new BABYLON.Vector3(-a[0]/100, a[1]/100, a[2]/100);
  }

  updateHand(scene, data) {
    this.rotation_z = data.roll() * (-1);
    this.rotation_x = data.pitch();
    this.mesh.rotation.x = this.rotation_x
    this.mesh.rotation.z = this.rotation_z
    /*
    this.fingers['thumb'].update(data.thumb);
    this.fingers['index'].update(data.indexFinger);
    this.fingers['middle'].update(data.middleFinger);
    this.fingers['ring'].update(data.ringFinger);
    this.fingers['pinky'].update(data.pinky);
    */
    this.palm.setPosition(this.toVector(data['palmPosition']));
    // this.arm.setPosition(this.toVector(data['arm']['nextJoint']));
    // console.log(data)
  }
}
