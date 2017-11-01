/*
    This is a game where you win by turning all balls into green color.

    CHEAT: press '0' to stop NPC balls from moving
*/

var gameOver = false;
var needRestart = false;

var elementLeft = document.getElementById("top-left");
elementLeft.style.fontSize = "15px";
var elementCenter = document.getElementById("center");
elementCenter.style.fontSize = "20px";

var elementRight = document.getElementById("top-right");

// Clear text
elementLeft.innerHTML = "";
elementRight.innerHTML = "";
elementCenter.innerHTML = "";

// Initial instruction
elementLeft.innerHTML = "Controls: Arrow Keys<br/>Objective: Turn all the balls into green color";

// Print message according to whether the player won
function printMessage(){
    if(gameOver == true){
        elementCenter.innerHTML = "YOU WIN<br/>PRESS SPACEBAR TO RESTART THE GAME";
        elementLeft.innerHTML = "";
    }
    else{
        elementCenter.innerHTML = "";
        elementLeft.innerHTML = "Controls: Arrow Keys<br/>Objective: Turn all the balls into green color";
    }
}

function npcMovement(sceneNode){
    if (gameOver === false){
        var elapsedTime = getElapsedTime();
        var userData = sceneNode["userData"];
        var children = sceneNode.children;
    
        if(needRestart === true){
            for (var i=0; i<children.length; i++){
                children[i].touched = false;
            }
            needRestart = false;
        }
	
        for (var i=0; i<children.length; i++){
            var x = Math.cos(elapsedTime*1.15*(1.0+i*0.1) + 2.0*i);
            var y = Math.sin(elapsedTime*1.27 + 2.0*i);
            
            x = 10.0*x*x*x*1.1;
            y = 6.0*y*y*y*1.2;
		
            if(pressedKeys[48]){
                // Cheating by pressing 0 to stop NPC movement
            }
            else{
                children[i].position.x = x;
                children[i].position.y = y;
            }
            

            var player = scene.getObjectByName("player");
            var npcRadius = player.scale.x;
            var playerRadius = children[i].scale.x;
            var dist = children[i].position.distanceTo(player.position);
            
            // Define colliding variable to determine if the NPC are still colliding with the player
            // Only change color when they're done colliding
            if(children[i].colliding == undefined){
                children[i].colliding = false;
            }
            
            // Define touched variable as a on/off switch to determine color changes
            if(children[i].touched == undefined){
                children[i].touched = false;
            }

            // Balls that are untouched will be in red color
            if(children[i].touched == false){
                children[i].material.color.setHex(0xDB6370);
            }

            
            
            
            // When NPC collides with player
            // Only change color upon initial contact
            // Will not be changing until player leaves the NPC and contact again
            if (dist < npcRadius + playerRadius){
                
                if(children[i].colliding == false){
                    // on/off switch
                    if(children[i].touched == false){
                        children[i].touched = true;
                        children[i].material.color.setHex(0x48B270);
                    }
                    else{
                        children[i].touched = false;
                        children[i].material.color.setHex(0xDB6370);
                    }
                    children[i].colliding = true;
                }
            }
            else{
                if(children[i].colliding == true){
                    children[i].colliding = false;
                }
            }
        }
        
        // Total green balls count
        var total = 0;
        for (var i=0; i<children.length; i++)
        {
            if(children[i].touched == true){total++;}
        }
        // Win condition
        if (total == children.length){
            console.log("totalTOUCH = " + total);
            pressedKeys = [];
            gameOver = true;
            printMessage();
            
        }
    }
}

// Handle player movement
function playerScript(player){
    
    if(gameOver === false){
        if(gameOver === false){
            //Right
            if (pressedKeys[37]) {player.position.x -= 0.5;}
            // Left
            if (pressedKeys[39])
            {player.position.x += 0.5;}
            // Up
            if (pressedKeys[38])
            {player.position.y += 0.5;}
            // Down
            if (pressedKeys[40])
            {player.position.y -= 0.5;}
        }
        
    }
    else{
        // Spacebar to restart the game, only works when gameOver is true
        if(pressedKeys[32]){

            if(gameOver == true){
                gameOver = false;
                needRestart = true;
                printMessage();

            }
        }
    }   
}