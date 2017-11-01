/*
	Script for the initial screen
*/


function rotateJump(sceneNode){
    var rotationSpeed = sceneNode.userData["rotationSpeed"];
    sceneNode.rotateOnAxis(YAXIS, rotationSpeed);
    
}