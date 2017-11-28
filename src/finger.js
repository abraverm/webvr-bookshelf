import * as BABYLON from 'babylonjs';

export default class Finger {
  constructor() {
    this.tip, this.dip, this.mcp, this.pip, this.carp;
    this.bones = {
      'distal': null,
      'middle': null,
      'proximal': null
    };
  }

  setBone(name, bone){
    this.bones[name] = bone;
  }

  updateBone(bone, jointA, jointB){
    var position = BABYLON.Vector3.Center(jointA, jointB);
    bone.setPosition(position);
  }

 updateFinger(){
   this.updateBone(this.bones['distal'], this.tip, this.dip);
   this.updateBone(this.bones['middle'], this.dip, this.mcp);
   this.updateBone(this.bones['proximal'], this.mcp, this.pip);
  }

  leapDataToVector(joint) {
    return BABYLON.Vector3.FromArray(this.data[joint+'Position']
    ).scale(0.01);
  }

  update(data) {
    this.data = data;
    this.tip = this.leapDataToVector('tip');
    this.dip = this.leapDataToVector('dip');
    this.mcp = this.leapDataToVector('mcp');
    this.pip = this.leapDataToVector('pip');
    this.carp = this.leapDataToVector('carp');
    this.updateFinger();
  }
}
