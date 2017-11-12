import * as BABYLON from 'babylonjs';

export function createbook(scene,distance) {
  var mesh = BABYLON.MeshBuilder.CreateBox("mesh", {
    height: 5,
    width: 2,
    depth: 0.5
  }, scene);
  var posForBook = -35
  mesh.position = new BABYLON.Vector3(0, 30, posForBook)
  mesh.scaling = new BABYLON.Vector3(3, 2, 3);
  mesh.rotation.y = Math.PI;
  posForBook += distance;
  return mesh;
}
export function loadshelf(scene) {
  BABYLON.SceneLoader.ImportMesh("Bookshelf_Design_4__3_Sections_", "/assets/models/bookshelf/", "bookshelf-design-4-3-sections.babylon", scene, function(newMeshes) {
    var mesh = newMeshes[0];
    mesh.position = new BABYLON.Vector3(0, 21, 0)

    mesh.scaling = new BABYLON.Vector3(1, 1, 1);
    mesh.rotation.y = 30;
    return mesh;
  })
}
