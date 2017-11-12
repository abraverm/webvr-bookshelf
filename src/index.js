import styles from './index.css';
import * as BABYLON from 'babylonjs';
import * as GUI from "babylonjs-gui";
import {createbook, loadshelf} from './meshloader.js'
import hand from './hand.js'
import * as Leap from 'leapjs'

window.addEventListener('DOMContentLoaded', function() {
  var leapobj = document.getElementById('leapobj');
  var books = [];
  var scene;
  var camera;
  var ray;
  var wscs = [];
  var target2;
  var animationReady = true;
  var particleSystem;
  var haloCenter = new BABYLON.Vector3(0, 0, 0);
  var objectSelected = false;
  var objectSelecting = false;
  var currentMeshSelected = null;
  var teleportationAllowed;
  var canvas = document.getElementById('canvas');
  var engine = new BABYLON.Engine(canvas, true);
  var rightHand = undefined;
  var leftHand = undefined;
  var isRightHand = false;
  var isLeftHand = false;

  var createScene = function() {
    scene = new BABYLON.Scene(engine);
    scene.enablePhysics();
    createCamera();
    var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-0, -1, -1.0), scene);
    light.position = new BABYLON.Vector3(50, 250, 200);
    light.shadowOrthoScale = 2.0;
    CreateGround();
    createBookshelf();
    for (var i = 0; i < books.length; i++) {
      createAnimation(scene, books[i]);
      books[i].physicsImpostor = new BABYLON.PhysicsImpostor(books[i], BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 1,
        restitution: 0,
        friction: 1
      }, scene);
    }
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var ellipse1 = new BABYLON.GUI.Ellipse();
    ellipse1.width = "5px"
    ellipse1.height = "5px";
    ellipse1.thickness = 1;
    ellipse1.background = "Red";
    advancedTexture.addControl(ellipse1);
    return scene;
  }


  var createBookshelf = function() {

    var bookshelf = loadshelf(scene);
    for (var i = 0; i < 7; i++) {
      books[i] = createbook(scene, 5);
    }
  }
  // Ground
  var CreateGround = function() {
    var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene, false);
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
      mass: 0,
      restitution: 0.9
    }, scene);
  }
  var createCamera = function() {
    var j = [0, 21, 0]

    if (navigator.getVRDisplays) {
      camera = new BABYLON.WebVRFreeCamera("WebVRCamera", new BABYLON.Vector3(140, 50, -20), scene);
    } else {
      camera = new BABYLON.VRDeviceOrientationFreeCamera("WebVRCamera", new BABYLON.Vector3(170, 50, -20), scene);
    }
    camera.setTarget(new BABYLON.Vector3(j[0], j[1], j[2]))

    camera.attachControl(canvas, true);

    scene.registerBeforeRender(function() {
      castRayAndSelectObject();
    });

  }

  var mouseOnly = false;

  var castRayAndSelectObject = function() {
    var ray;
    if (mouseOnly || !camera.leftController) {
      ray = camera.getForwardRay();
    } else {
      ray = camera.leftController.getForwardRay();
    }


    var hit = scene.pickWithRay(ray, function(mesh) {
      return mesh
    });

    if (hit.pickedMesh) {
      if (hit.pickedMesh === undefined || hit.pickedMesh.hasAnimation) {
        return;

      }
      currentMeshSelected = hit.pickedMesh;
      //currentMeshSelected.material.diffuseColor = BABYLON.Color3.Red();
      bookMovement(currentMeshSelected);

    }
  }
  var bookMovement = function(mesh) {
    scene.onPointerDown = function(evt, pickResult) {
      // if the click hits the ground object, we change the impact position
      if (animationReady) {
        scene.beginAnimation(mesh, 0, 20, true);

      }

    };
  }
  var createAnimation = function(scene, mesh) {
    var animationBox = new BABYLON.Animation("ForwardAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    // Animation keys
    var keys = [];
    keys.push({
      frame: 0,
      value: 0
    });

    keys.push({
      frame: 20,
      value: 20
    });

    animationBox.setKeys(keys);
    //mesh.position.x = 5;
    mesh.animations.push(animationBox);


  }
  var controller = Leap.loop({
    enableGestures: true
  }, function(frame) {
    if (frame.hands.length > 0) {
      if (frame.hands[0] != undefined && frame.hands[0].type == "right") {
        if (rightHand == undefined) {
          rightHand = new hand(frame.hands[0].pointables, frame.hands[0].type);
        } else {
          rightHand.updateHand(frame.hands[0].pointables, frame.hands[0].type);
        }
        rightHand.drawHand(scene)
        if (frame.hands[1] != undefined && frame.hands[1].type == "left") {
          if (leftHand == undefined) {
            leftHand = new hand(frame.hands[1].pointables, frame.hands[1].type);
          } else {
            leftHand.updateHand(frame.hands[1].pointables, frame.hands[1].type);
          }
          leftHand.drawHand(scene)

        }
      }
      if (frame.hands[0] != undefined && frame.hands[0].type == "left") {
        if (leftHand == undefined) {
          leftHand = new hand(frame.hands[0].pointables, frame.hands[0].type);
        } else {
          leftHand.updateHand(frame.hands[0].pointables, frame.hands[0].type);
        }
        leftHand.drawHand(scene)

        if (frame.hands[1] != undefined && frame.hands[1].type == "right") {
          if (rightHand == undefined) {
            rightHand = new hand(frame.hands[1].pointables, frame.hands[1].type);
          } else {
            rightHand.updateHand(frame.hands[1].pointables, frame.hands[1].type);
          }
          rightHand.drawHand(scene)

        }
      }
    }
  });
  scene = createScene();
  engine.runRenderLoop(function() {
    scene.render();
  });
});
