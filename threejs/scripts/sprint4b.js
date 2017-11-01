/*
    This is not a game, but rather a scene with bunch of objects assigned with different script
    to make them move/jump around like there's no tomorrow.
*/

var elementLeft = document.getElementById("top-left");
var elementCenter = document.getElementById("center");
var elementRight = document.getElementById("top-right");

// Clear text
elementLeft.innerHTML = "";
elementRight.innerHTML = "";
elementCenter.innerHTML = "";

/*var rightLeftUp = true;
var rightLeftRight = true;*/

// Jumping while rotating
function rotateJump(sceneNode){
    var rotationSpeed = sceneNode.userData["rotationSpeed"];
    var jumpSpeed = sceneNode.userData["jumpSpeed"];
    sceneNode.rotateOnAxis(YAXIS, rotationSpeed);
    
    if (sceneNode.up == undefined){
        sceneNode.up = true;
    }
    
    if(sceneNode.position.y >= 5){sceneNode.up = false;}
    else if (sceneNode.position.y <= 0){sceneNode.up = true;}
    
    if (sceneNode.up == true){
        sceneNode.position.y += jumpSpeed;
    }else{
        sceneNode.position.y -= jumpSpeed;
    }
}

// Rotate the node
function rotateNode(sceneNode){
	var userData = sceneNode["userData"];
//    console.log("ROTATE NODE");
	if (userData !== undefined) {
		var rate = userData["rate"];
		if (rate !== undefined) sceneNode.rotation.y += rate;
		else sceneNode.rotation.y += 0.02;
	}
}

function rightLeftJump(sceneNode){
    
    var elapsedTime = getElapsedTime();
    
    var rightLeftSpeed = sceneNode.userData["rightLeftSpeed"];
    var jumpSpeed = sceneNode.userData["jumpSpeed"];
    var range = sceneNode.userData["range"];
    var arbitaryNumber = sceneNode.userData["arbitaryNumber"];
    
    if(rightLeftSpeed == undefined){rightLeftSpeed = 0.2;}
    if(jumpSpeed == undefined){jumpSpeed = 0.2;}
    if (sceneNode.up == undefined){sceneNode.up = true;}
    if (sceneNode.right == undefined){sceneNode.right = true;}
    if (sceneNode.z == undefined){sceneNode.z = true;}
    
    if (arbitaryNumber == undefined){
        arbitaryNumber = 1.0;
    }else{
        arbitaryNumber = 1 + (arbitaryNumber/100);
    }
    
    // Changing Y position
    if(sceneNode.position.y >= range){sceneNode.up = false;}
    else if (sceneNode.position.y <= 0){sceneNode.up = true;}
    
    var v = jumpSpeed * Math.sin(elapsedTime*0.5 + 2.0);
    
    if (sceneNode.up == true){
        sceneNode.position.y += jumpSpeed * arbitaryNumber;
    }else{
        sceneNode.position.y -= jumpSpeed * arbitaryNumber;
    }
    
    // Changing X position
    if(sceneNode.position.x >= range){sceneNode.right = false;}
    else if (sceneNode.position.x <= (range * -1)){sceneNode.right = true;}
    
    if (sceneNode.right == true){
        sceneNode.position.x += rightLeftSpeed * arbitaryNumber;
        
    }else{
        sceneNode.position.x -= rightLeftSpeed * arbitaryNumber;
    }
    
    
    // Changing Z position
    if(sceneNode.position.z >= range){sceneNode.z = false;}
    else if (sceneNode.position.z <= (range * -1)){sceneNode.z = true;}
    
    if(Math.random() >= 0.5){
        if (sceneNode.z == true){
            sceneNode.position.z += 0.1 * arbitaryNumber;
        }
        else{
            sceneNode.position.z -= 0.1 * arbitaryNumber;
        }
    }
}

function resize(sceneNode){
    var rate = sceneNode.userData["rate"];
    var max = sceneNode.userData["max"];
    var min = sceneNode.userData["min"];
    
    if(rate == undefined){rate = 0.1;}
    if(max == undefined){max = 2;}
    if(min == undefined){min = 0.5;}
    
    if(sceneNode.enlarge == undefined){
        sceneNode.enlarge = true;
    }
    
    if(sceneNode.scale.x >= max){sceneNode.enlarge = false;}
    else if(sceneNode.scale.x <= min){sceneNode.enlarge = true;}
    
    var newX = sceneNode.scale.x;
    var newY = sceneNode.scale.y;
    var newZ = sceneNode.scale.z;
    
    if(sceneNode.enlarge == true){
        newX = sceneNode.scale.x + rate;
        newY = sceneNode.scale.y + rate;
        newZ = sceneNode.scale.z + rate;
    }else{
        newX = sceneNode.scale.x - rate;
        newY = sceneNode.scale.y - rate;
        newZ = sceneNode.scale.z - rate;
    }
    
    sceneNode.scale.set(newX, newY, newZ);
}

function rotating(sceneNode){
    
    var children = sceneNode.children;
    
    var rotatingRate = sceneNode.userData["rotatingRate"];
    
//    sceneNode.rotation.x += rotatingRate;
    
    for(var i = 0; i <= children.length - 1; i++){
        
        if(Math.random() >= 0.5){
            if (i %2 == 0){
                children[i].rotation.z += rotatingRate;
                children[i].rotation.x += 0.003;
            }else{
                children[i].rotation.x += rotatingRate;
                children[i].rotation.z += 0.003;
            }
        }else{
            if (i %2 == 0){
                children[i].rotation.z += rotatingRate * 0.7;
                children[i].rotation.x += 0.005;
            }else{
                children[i].rotation.x += rotatingRate * 0.7;
                children[i].rotation.z += 0.005;
            }
        }
        
    }
}










