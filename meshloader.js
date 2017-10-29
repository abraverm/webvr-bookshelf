/*
var createbooks = function(scene, numBooks, distance) {
  var posForBook = -45; //initial book y position
  var mesh;
  BABYLON.SceneLoader.ImportMesh("book4", "./models/book/", "blank-book.babylon", scene, function(newMeshes) {
    mesh = newMeshes[0];
    mesh.position = new BABYLON.Vector3(00, 30, posForBook)
    mesh.scaling = new BABYLON.Vector3(30, 30, 30);
    mesh.rotation.y = Math.PI;
  });
  console.log(mesh);
}
*/
var posForBook = -35
var createbook = function(scene,distance) {
  var mesh = BABYLON.MeshBuilder.CreateBox("mesh", {
    height: 5,
    width: 2,
    depth: 0.5
  }, scene);
  mesh.position = new BABYLON.Vector3(0, 30, posForBook)
  mesh.scaling = new BABYLON.Vector3(3, 2, 3);
  mesh.rotation.y = Math.PI;
  posForBook += distance;
  return mesh;
}
var loadshelf = function(scene) {
  BABYLON.SceneLoader.ImportMesh("Bookshelf_Design_4__3_Sections_", "./models/bookshelf/", "bookshelf-design-4-3-sections.babylon", scene, function(newMeshes) {
    var mesh = newMeshes[0];
    mesh.position = new BABYLON.Vector3(0, 21, 0)

    mesh.scaling = new BABYLON.Vector3(1, 1, 1);
    mesh.rotation.y = 30;
    return mesh;
  })
}
