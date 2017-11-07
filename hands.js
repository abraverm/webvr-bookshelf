//create a line between joints
var drawAnimation = function(scene, hand, jsonArray){
  for(var i = 0; i<jsonArray.length;i++){
    if(i != jsonArray.length-1){
      setTimeout(function () {
        updateHand(scene, hand, jsonArray[i]);
    },(jsonArray[i+1]["timestamp"]-jsonArray[i]["timestamp"])*10000);

    }
  }
}
var updateHand = function(scene, hand, jsonArray){
  for (var i = 0; i < hand.length; i++) {
    var point = jsonArray["pointables"][i]
    var tip = vectorFromJson(point["tipPosition"])
    var btip = vectorFromJson(point["btipPosition"])
    var carp = vectorFromJson(point["carpPosition"])
    var dip = vectorFromJson(point["dipPosition"])
    var mcp = vectorFromJson(point["mcpPosition"])
    var pip = vectorFromJson(point["pipPosition"])
    hand[i]["a"] = updateLine(scene, hand[i]["a"], tip, btip);
    hand[i]["b"] = updateLine(scene, hand[i]["b"], btip, dip);
    hand[i]["c"] = updateLine(scene, hand[i]["c"], dip, pip);
    hand[i]["d"] = updateLine(scene, hand[i]["d"], pip, mcp);
    hand[i]["e"] = updateLine(scene, hand[i]["e"], mcp, carp);
  }
}

var updateLine = function(scene, line, pointStart, pointEnd){
  //Array of points to construct lines
  var myPoints = [
    pointStart,
    pointEnd
  ];

  //Create lines with updatable parameter set to true for later changes
  var newline = BABYLON.MeshBuilder.CreateLines("lines", {
    points: myPoints,
    instance: line
  }, scene);
  return newline;
}

var drawHand = function(scene, pointables) {
  var hand = {};
  for (var i = 0; i < pointables.length; i++) {
    hand[i] = {};
    var point = pointables[i]
    var tip = vectorFromJson(point["tipPosition"])
    var carp = vectorFromJson(point["carpPosition"])
    var dip = vectorFromJson(point["dipPosition"])
    var mcp = vectorFromJson(point["mcpPosition"])
    var pip = vectorFromJson(point["pipPosition"])
    hand[i]["a"] = drawLine(tip, dip, scene);
    hand[i]["c"] = drawLine(dip, pip, scene);
    hand[i]["d"] = drawLine(pip, mcp, scene);
    hand[i]["e"] = drawLine(mcp, carp, scene);
  }
  return hand;
}

var drawLine = function(pointStart, pointEnd, scene) {
  //Array of points to construct lines
  var myPoints = [
    pointStart,
    pointEnd
  ];

  //Create lines with updatable parameter set to true for later changes
  var line = BABYLON.MeshBuilder.CreateLines("lines", {
    points: myPoints,
    updatable: true
  }, scene);
  return line;
}
var vectorFromJson = function(a) {
  var vector = new BABYLON.Vector3(a[0],a[1],a[2]);
  return vector;
}
