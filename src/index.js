import styles from './index.css';
import * as BABYLON from 'babylonjs';
import * as GUI from "babylonjs-gui";
import {createbook, loadshelf, loadhand} from './meshloader.js';
import Hand from './hand.js';
import * as Leap from 'leapjs';
import * as Play from 'leapjs-playback';

window.addEventListener('DOMContentLoaded', function() {
  var books = [];
  var scene;
  var camera;
  var ray;
  var animationReady = true;
  var mouseOnly = false;
  var currentMeshSelected = null;
  var canvas = document.getElementById('canvas');
  var engine = new BABYLON.Engine(canvas, true);
  var hands = {};
  var handbox;
  var assetsManager;
  var n = new BABYLON.Vector3(-1, 1, 1);
  Leap.Controller.plugin('playback', Play.playback);

  var controller = new Leap.Controller({})
  var setLight = function() {
    var light = new BABYLON.DirectionalLight("dir01",
      new BABYLON.Vector3(-0, -1, -1.0), scene);
    light.position = new BABYLON.Vector3(50, 250, 200);
    light.shadowOrthoScale = 2.0;
  }
  var createGUI = function(){
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var ellipse = new BABYLON.GUI.Ellipse();
    ellipse.width = "5px"
    ellipse.height = "5px";
    ellipse.thickness = 1;
    ellipse.background = "Red";
    advancedTexture.addControl(ellipse);

  }

  var createAssetsManager = function(){
    assetsManager = new BABYLON.AssetsManager(scene);
    var meshTask = assetsManager.addMeshTask( "hand", "HandModel", "/assets/models/hands/", "Hand.babylon");
    meshTask.onSuccess = function (task) {
      hands['right'] = new Hand(
        task.loadedMeshes[0],
        task.loadedSkeletons[0]
      );
    }
  }
  var createScene = function() {
    scene = new BABYLON.Scene(engine);
    handbox = BABYLON.MeshBuilder.CreateBox("handbox", {
      height: 100,
      width: 20,
      depth: 40
    }, scene);
    handbox.scaling = new BABYLON.Vector3(1,1,1)
    scene.enablePhysics();
    scene.collisionsEnabled = true;
    createCamera();
    setLight();
    createGround();
    createBookshelf();
    createGUI();
    createAssetsManager();
    return scene;
  }


  var createBookshelf = function() {

    //var bookshelf = loadshelf(scene);
    //var hand = loadhand(scene);
    for (var i = 0; i < 0; i++) {
      books[i] = createbook(scene, 5);
      books[i].physicsImpostor = new BABYLON.PhysicsImpostor(
        books[i],
        BABYLON.PhysicsImpostor.BoxImpostor, {
          mass: 1,
          restitution: 1,
          friction: 1
        },
        scene
      );

    }
  }
  // Ground
  var createGround = function() {
    var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 0, scene, false);
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0.9
      },
      scene
    );
  }
  var createCamera = function() {

    camera = new BABYLON.VRDeviceOrientationFreeCamera(
      "WebVRCamera", new BABYLON.Vector3(0, 190, 300), scene);
    camera.setTarget(new BABYLON.Vector3(0, 190, 0))
    camera.checkCollisions = true;
    camera.attachControl(canvas, true);

    scene.registerBeforeRender(function() {
      castRayAndSelectObject();
    });

  }


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
    var animationBox = new BABYLON.Animation(
      "ForwardAnimation",
      "position.x",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

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
    mesh.animations.push(animationBox);
  }

  controller
    //.use('playback', {recording: '/assets/leap-record-1.json'})
    .connect();

  scene = createScene();
  scene.registerBeforeRender(function() {
    var frame = controller.frame();
    for (var i = 0, len = frame.hands.length; i < len; i++) {
      if (frame.hands[i].type == 'right'){
        //console.log(frame.hands[i]);
        handbox.position = new BABYLON.Vector3.FromArray(frame.hands[i].palmPosition).multiply(n);
        handbox.rotation.z = frame.hands[i].roll()*(-1)
        handbox.rotation.x = frame.hands[i].pitch()*(-1)
        //hands['right'].updateHand(scene, frame.hands[i]);
      }
    }
  })

  assetsManager.onFinish = function (tasks) {
      engine.runRenderLoop(function () {
            scene.render();
      });
  };

  assetsManager.load();

});
