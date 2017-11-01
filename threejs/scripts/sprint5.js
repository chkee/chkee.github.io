/*
    This is a game where you dodge the projectile coming from the boss (the one at the right side), 
    and try to survive as long as you can.

    Note:
    This was a class project I did in Oklahoma State University.
    My original plan was to create a typical boss fight scene where:
    - both player and the boss are able to shoot projectiles at each other
    - both player and boss will have their own health bar
    - collision with the projectile will deduct player/boss's hitpoint
    - player win by shooting at the boss until it has no hitpoint left

    But due to the lack of time, I have turned it into a "dodge and survive" game. 
    I might try to finish it someday in the future.

*/

// For game status
var gameOver = false;
var needRestart = true;

// For NPC Boss animation
var npcShoot = false;
var npcUp = false;

// For instructions
var elementLeft = document.getElementById("top-left");
elementLeft.style.fontSize = "15px";

// For "game over" text
var elementCenter = document.getElementById("center");
elementCenter.style.fontSize = "20px";

// For showing player score
var elementRight = document.getElementById("top-right");
elementRight.style.fontSize = "18px";

// To keep track of player's score
var currentScore = 0;
var highScore = 0;

// Initial text
elementLeft.innerHTML = "Controls: Arrow Keys<br/>Objective: Survive";
elementRight.innerHTML = "Current Score: " + currentScore + " \t\t\t | \t\t\t <tab>High Score: " + highScore;


// Update text
function printMessage(){
    if(gameOver == true){
        elementCenter.innerHTML = "GAME OVER<br/>SCORE: " + currentScore + "<br/><br/>PRESS SPACEBAR TO RESTART THE GAME";
    }
    else{
        elementCenter.innerHTML = "";
        elementLeft.innerHTML = "Controls: Arrow Keys<br/>Objective: Survive";
        elementRight.innerHTML = "Current Score: " + currentScore + " | High Score: " + highScore;
    }
}

// Function to get random integer within given range
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// NPC Boss shooting animation
// Simple up down movement when triggered
function npcShootMovement(sceneNode){
    
    if (sceneNode.shoot === undefined){
        sceneNode.shoot = false;
    }
    
    if(sceneNode.up === undefined){
        sceneNode.up = false;
    }
    
    if(sceneNode.movementMax === undefined && sceneNode.movementMin === undefined){
        sceneNode.movementMax = sceneNode.position.y + 1;
        sceneNode.movementMin = sceneNode.position.y;
    }
    
    if(npcShoot === true && npcUp == true){
        sceneNode.position.y += 0.2;
        if(sceneNode.position.y >= sceneNode.movementMax){
            npcUp = false;
        }
    }

    if (npcShoot === true && npcUp === false){
        sceneNode.position.y -= 0.2;
        if(sceneNode.position.y <= sceneNode.movementMin){
            npcShoot = false;
        }
    }
}

// NPC projectile movement
function npcMovement(sceneNode){
    
    // Execute when the game is not over
    if (gameOver === false){
        var player = scene.getObjectByName("player");
        var elapsedTime = getElapsedTime();
        var userData = sceneNode["userData"];
        var children = sceneNode.children;
    
        if(needRestart === true){
            
            // Initialize all projectile
            for (var i=0; i<children.length; i++){
                children[i].visible = false;
                children[i].position.y = -5;
                children[i].position.x = 18;
            }
            
            // Initialize player's position
            player.position.x = -18
            
            // Initilize first projectile model
            sceneNode.currentNPC = getRandomInt((children.length - 1), 0);
            children[sceneNode.currentNPC].visible = true;
            children[children.length - 1].visible = true;
            
            needRestart = false;
            
            // First NPC Boss animation
            npcShoot = true;
            npcUp = true;
        }
        
        // Default scale variation factor
        if(sceneNode.currentScale === undefined){
            sceneNode.currentScale = 0;
        }
        
        // Default speed multiplier
        if(sceneNode.currentSpeed === undefined){
            sceneNode.currentSpeed = 1;
        }
            
        // Moving the projectile
        children[sceneNode.currentNPC].position.y = -5;
        children[sceneNode.currentNPC].position.x -= 0.4 * sceneNode.currentSpeed;
        children[children.length - 1].position.y = -5;
        children[children.length - 1].position.x -= 0.4 * sceneNode.currentSpeed;

        // If a projectile complete its cycle
        if(children[sceneNode.currentNPC].position.x < -20){
            children[sceneNode.currentNPC].scale.x -= sceneNode.currentScale;
            children[sceneNode.currentNPC].scale.y -= sceneNode.currentScale;
            children[sceneNode.currentNPC].scale.z -= sceneNode.currentScale;
            
            // Prevent the case where models somehow gets smaller and smaller in each cycle
            if(children[sceneNode.currentNPC].scale.x < 1){
                children[sceneNode.currentNPC].scale.x += 0.5;
                children[sceneNode.currentNPC].scale.y += 0.5;
                children[sceneNode.currentNPC].scale.z += 0.5;
            }
            
            // Prevent the case where models somehow gets bigger and bigger in each cycle
            if(children[sceneNode.currentNPC].scale.x > 2.5){
                children[sceneNode.currentNPC].scale.x -= 1;
                children[sceneNode.currentNPC].scale.y -= 1;
                children[sceneNode.currentNPC].scale.z -= 1;
            }
            
            // Reset the model's position and make it invisible
            children[sceneNode.currentNPC].position.x = 15;
            children[sceneNode.currentNPC].visible = false;
            
            children[children.length - 1].position.x = 15;
            children[children.length - 1].visible = false;
            
            // Regenerate random color and select random model and its speed
            sceneNode.currentSpeed = getRandomInt(200, 100) / 100;
            sceneNode.currentNPC = getRandomInt((children.length - 1), 0);
            sceneNode.currentScale = getRandomInt(200, 1) / 100;
            
            // Calculate player score
            currentScore += 1;
            if(currentScore > highScore){highScore = currentScore;}
            
            // Update display
            console.log("Current score = " + currentScore);
            printMessage();
            
            // For NPC Boss movement
            npcShoot = true;
            npcUp = true;
            
            // Setup for the next projectile
            children[sceneNode.currentNPC].scale.x += sceneNode.currentScale
            children[sceneNode.currentNPC].scale.y += sceneNode.currentScale
            children[sceneNode.currentNPC].scale.z += sceneNode.currentScale
            children[sceneNode.currentNPC].visible = true;
            children[children.length - 1].visible = true;
            children[sceneNode.currentNPC].position.x = 15;
            
            var newColor = Math.random() * 0xffffff;
            children[sceneNode.currentNPC].material.color.setHex( newColor );
            children[children.length - 1].color.setHex( newColor );
            children[children.length - 1].intensity = 0.5;
        }
            
        var npcRadius = player.scale.x;
        var playerRadius = children[sceneNode.currentNPC].scale.x;
        var dist = children[sceneNode.currentNPC].position.distanceTo(player.position);
            
           
        // When NPC collides with player
        if (dist < npcRadius + playerRadius){
            //console.log("YOU LOST");
            pressedKeys = [];

            gameOver = true;
            printMessage();
            currentScore = 0;
        }
    }
}



// Handle player movement
function playerScript(player){
    
    // Handle player jumping behavior
    if (player.jump === undefined){
        player.jump = false;
    }
    
    if (player.jumpCount === undefined){
        player.jumpCount = 0;
        player.pressingJump = false;
        player.goingDown = false;
    }
    
    if(player.jumping === undefined){
        player.jumping = true;
    }
    
    
    if(player.jump === true && player.jumping === true){
        player.position.y += 0.6;
    } else if (player.jump === false && player.jumping === true){
        player.position.y -= 0.4;
    }
    
    // Jump height limit
    if(player.position.y > -5){
        player.jump = false;
    }
    
    // If player is in mid-air
    if(player.position.y <= -6.3){
        player.jumping = false;
    }
    
    
    // Player movement will only works when gameOver is false
    if(gameOver === false){
        if(gameOver === false){
            
            //Left
            if (pressedKeys[37] && player.position.x > -21) 
            {player.position.x -= 0.3;}
            
            // Right
            if (pressedKeys[39] && player.position.x < 17)
            {player.position.x += 0.3;}
            
            
            /*
            // Up
            if (pressedKeys[38] && player.position.y < 5){
                player.jump = true;
                player.jumping = true;
                player.pressingJump = true;
            }else{
                
                if(player.position.y >= 5){
                    console.log("REACHED LIMIT DOING DOWN");
                    player.goingDown = true;
                    player.canJump = false;
                }
                
                // Will keep falling until player releases jump key
                if(player.canJump == false && player.pressingJump == true){
                    player.position.y -= 0.4;
                }
                         
                
                if(player.pressingJump == true){
                    console.log("JUMP RELEASED");
                    player.jumpCount += 1;
                    player.pressingJump = false;
                }
            }
            
            */
            
            // === REWRITE JUMPING ===
            if(pressedKeys[38]){
                player.pressingJump = true;
                
                if(player.position.y < 5 && (player.jumpCount < 2) && player.goingDown == false){
                    player.position.y += 0.7; // was 0.6
                } else{
                    player.goingDown = true;
                }
                
                if (player.goingDown == true){
                    player.position.y -= 0.4;
                    
                    if(player.position.y <= -6.3){
                        player.position.y = -6.4;
                    }
                }
                
                
            }else if (!pressedKeys[38]){
                
                if(player.pressingJump == true){
                    player.jumpCount += 1;
                    player.pressingJump = false;
                }
                
                if(player.position.y > -6.3){
                    player.position.y -= 0.4;
                }else{
                    player.position.y = -6.4;
                    player.jumpCount = 0;
                }
                
                if(player.goingDown == true){
                    player.goingDown = false;
                    if(player.jumpCount < 2){
//                        player.goingDown = false;
                    }
//                    player.jumpCount += 1;
                }
            }
            
            
            // Down
            if (pressedKeys[40] && player.position.y >= -6)
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