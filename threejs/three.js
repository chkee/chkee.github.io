/*
    This is the main script for the engine.
    It is possible to manually load a json file by adding "?file=fileName.json" at the end of the URL.
    For example: websiteAddress.com/index.html?file=sprint5.json

    When there's no argument in the URL, default.json will be loaded.
*/

// Constants
var XAXIS = new THREE.Vector3(1,0,0);
var YAXIS = new THREE.Vector3(0,1,0);
var ZAXIS = new THREE.Vector3(0,0,1);

var fileURL = '';

var container; // A div element that will hold the renderer
var renderer;  // The Three.js webGL renderer

var currentCamera;  // A camera object that gives the viewpoint
var originalCameraFov;
var scene;          // The scene graph
var model;          // The 3D model
var light1, light2; // The lights
var selected;

var mouseX = 0, mouseY = 0;         // The position of the mouse
var mousePrevX = 0, mousePrevY = 0; // previous mouse position
var mouseDown = 0;                  // mouse button currently pressed
var shiftDown = false;
var cameraMode = false;
var windowX = window.innerWidth;    // half the width of the window
var windowY = window.innerHeight;   // half the height of the window

var selectedModel = 0;  // Select the first model initially
var modelCount = 0;
var Zkey = 0;

var startTime = 0;
var frameDuration = 0;

var pressedKeys = {};
var modelToFaceCamera = [];
var modelToMove = [];

var wasdEnabled = false;
var mouseEnabled = false;
var modelSelectionEnabled = false;
var whiteBackground = false;
var initialLoad = true;

var audio = new Audio();

/* To record the current volume state of audio, 
so that the audio will stay mute/unmute when switching between demos */
var currentVolume = 0.7;

// To get parameter from URL
var GET = {};
var query = window.location.search.substring(1).split("&");
for (var i = 0, max = query.length; i < max; i++){
    if (query[i] === "") // check for trailing & with no param
        continue;
    var param = query[i].split("=");
    GET[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
}

fileURL = GET["file"];
if(fileURL != undefined){
	var text1 = document.getElementById('default-text-1');
	var text2 = document.getElementById('default-text-2');
	text1.style.visibility = 'hidden';
	text2.style.visibility = 'hidden';
}else{
	console.log("NO ARGUMENT");
	fileURL = "threejs/default.json";
	
}

// Executed when the page is loaded.
init();
animate();
loadFile(fileURL);



/*
    ======================================================================
        Initialization related functions
    ======================================================================
*/

function init(){
    // Create container and add it to the page
    container = document.createElement('div');
    document.body.appendChild(container);

    // Create renderer and add it to the container (div element)
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Add event listeners so we can respond to events
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mousewheel', onDocumentMouseWheel, false);
    document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false); // firefox
    window.addEventListener('resize', onWindowResize, false);

    // postprocessing
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, currentCamera));
    

    var effect = new THREE.ShaderPass(THREE.RGBShiftShader);
    effect.uniforms['amount'].value = 0.0018;
    effect.renderToScreen = true;
    composer.addPass(effect);

    // Create the scene 
    //scene = new THREE.Scene();
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 1000);
}

/* This function will clear the current scene and load another scene according to the JSON file from fileURL */
function loadFile(fileURL){

    this.fileURL = fileURL;

    //console.log("file name = ", fileURL);
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", fileURL, true);
    httpRequest.send(null);
    httpRequest.onload = function(){

		// Clear the current scene before loading another one
		clearScene();
		
		var obj = JSON.parse(httpRequest.responseText);
		
		/*
		// Uncomment for debugging purpose
        var element = document.getElementById("left");
		element.innerHTML = httpRequest.responseText;
		var x = obj["type"];
		element.innerHTML = x;
		*/
		
		parseScene(obj, scene)
		selected = scene.children[selectedModel];

        // Zoom out if window width is too narrow
        if((window.innerWidth < 950) && (fileURL != "threejs/default.json")){
            currentCamera.fov = originalCameraFov + 10;
            currentCamera.updateProjectionMatrix();
        } 
        else{
            currentCamera.fov = originalCameraFov;
        }
	}
}

/* Stop audio, clear all currently loaded objects */
function clearScene(){

    // Clear center text after initial load
    if(initialLoad === true){
        initialLoad = false;
    }
    else{
        document.getElementById('center').innerHTML = "";
    }
    
    // Reset Audio
    audio.pause();
    audio.currentTime = 0;
    for (var i = scene.children.length; i >= 0; i--){
        var sceneObjects = scene.children[i];
        scene.remove(sceneObjects);
    }
}



/*
    ======================================================================
        Load required objects according to input JSON file
    ======================================================================
*/

// Read JSON input file (parseNode) and load objects accordingly
function parseScene(parseNode, sceneNode){

    if (parseNode === undefined || sceneNode === undefined) return;

    // Load script files 
    if ("scriptFiles" in parseNode){
        var scriptList = parseNode["scriptFiles"];
        for (var i=0; i < scriptList.length; i++){
            var scriptURL = scriptList[i];
            loadScript(scriptURL);
        }
    }

    // User data that will be placed in the nodes
    if ("userData" in parseNode){
        sceneNode["userData"] = parseNode["userData"];
    }
    else{
        sceneNode["userData"] = {};
    }
    
    // The name of the node
    if ("name" in parseNode){
        sceneNode["name"] = parseNode["name"];
    }
    
    // Load and play background music
    if ("backgroundMusic" in parseNode){
        audio = new Audio(parseNode["backgroundMusic"]);
        audio.volume = currentVolume;
        audio.addEventListener('ended', function(){
            if(this.duration > 0 && !this.paused){
            }
            else{
               this.currentTime = 0;
               this.play();
           }
       }, false);

        audio.play();
    }

    if("wasdEnabled" in parseNode){
        if(parseNode["wasdEnabled"] == "true"){
           wasdEnabled = true;
           console.log("WASD Enabled");
       }
       else{
           wasdEnabled = false;
       }
    }
    if("mouseEnabled" in parseNode){
        if(parseNode["mouseEnabled"] == "true"){
            mouseEnabled = true;
            console.log("Mouse enabled");
        }
        else{
            mouseEnabled = false;
        }
    }
    if("modelSelectionEnabled" in parseNode){
        if(parseNode["modelSelectionEnabled"] == "true"){
            modelSelectionEnabled = true;
            console.log("Model selection enabled");
        }
        else{
            modelSelectionEnabled = false;
        }
    }

    if("whiteBackground" in parseNode){
        if(parseNode["whiteBackground"] == "true"){
            whiteBackground = true;
            //console.log("White background enabled");
        }
        else{
            whiteBackground = false;
        }
    }

    if("children" in parseNode){
        var children = parseNode["children"];
        for(var i = 0; i< children.length; i++){
            var childrenParseNode = children[i];
            console.log(childrenParseNode.type)

            if(childrenParseNode["type"] == "camera"){
                var camera = parseCamera(childrenParseNode, sceneNode);
            }
            else if(childrenParseNode["type"] == "mesh"){
                if(childrenParseNode["geometry"] == "spriteCube" && childrenParseNode["faceCamera"] == "true"){
                    modelToFaceCamera.push(i);
                }
                modelToMove.push(i);
                var mesh = parseMesh(childrenParseNode, sceneNode);
            }
            else if(childrenParseNode["type"] == "directionalLight"){
                var light = parseDirectionalLight(childrenParseNode, sceneNode);
            }
            else if(childrenParseNode["type"] == "ambientLight"){
                parseAmbientLight(childrenParseNode, sceneNode);
            }
            else if(childrenParseNode["type"] == "pointLight"){
                parsePointLight(childrenParseNode, sceneNode);
            }
            else if(childrenParseNode["type"] == "sprite"){
                modelToMove.push(i);
                parseSprite(childrenParseNode, sceneNode);
            }
            else if(childrenParseNode["type"] == "node"){
                var childParseNode = childrenParseNode;
                var childSceneNode = new THREE.Object3D();

                if(childParseNode["isRoot"] == "true"){
                    modelToMove.push(i);
                }

                sceneNode.add(childSceneNode);
                parseScene(childrenParseNode, childSceneNode);
            }
        }
    }
}

function loadScript(scriptURL){
    console.log("loadScript " + scriptURL + "\n");

    // Create an element for the script
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptURL;

    // Add the script element to the head of the page
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
}

function parseCamera(parseObj, sceneNode){
    var near = 0.1;
    var far = 1000.0;
    var aspect = window.innerWidth / window.innerHeight;
    var fovy = 90.0;
    var eye = [0.0, 0.0, 100.0];
    var vup = [0.0, 1.0, 0.0];
    var center = [0.0, 0.0, 0.0];

    if ("near"   in parseObj) near   = parseObj["near"];
    if ("far"    in parseObj) far    = parseObj["far"];
    if ("fov"    in parseObj) fovy   = parseObj["fov"];
    if ("eye"    in parseObj) eye    = parseObj["eye"];
    if ("vup"    in parseObj) vup    = parseObj["vup"];
    if ("center" in parseObj) center = parseObj["center"];

    originalCameraFov = fovy;

    var camera = new THREE.PerspectiveCamera( fovy, aspect, near, far );
    camera.position.set( eye[0], eye[1], eye[2] );
    camera.up.set( vup[0], vup[1], vup[2] );
    camera.lookAt( new THREE.Vector3(center[0], center[1], center[2]) );

    currentCamera = camera;

    // Zoom out if the screen width is too narrow
    if((window.innerWidth < 950) && (fileURL != "default.json")){
        currentCamera.fov = originalCameraFov + 20;
        currentCamera.updateProjectionMatrix();
    }else{
        currentCamera.fov = originalCameraFov;
    }
}

function parseMesh(parseObj, sceneNode){

    var mesh;
    var colorCode = new THREE.Color(parseObj["material"].diffuseColor[0],parseObj["material"].diffuseColor[1],parseObj["material"].diffuseColor[2]);
    var specularCode = new THREE.Color(parseObj["material"].specularColor[0],parseObj["material"].specularColor[1],parseObj["material"].specularColor[2])
    var scale = [];
    
    //Draw geometries according to the input file
    if(parseObj["geometry"] == "cube"){

        var geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 1, 1, 1);
        var material = new THREE.MeshPhongMaterial({ 
            color: colorCode, 
            specular: specularCode,
            shininess: 100
        }); 

        mesh = new THREE.Mesh(geometry, material);
    }

    if(parseObj["geometry"] == "sphere"){

        var geometry = new THREE.SphereGeometry(1, 10, 10);
        var material = new THREE.MeshPhongMaterial( { 
            color: colorCode, 
            specular: specularCode,
            shininess: 100
        });

        mesh = new THREE.Mesh(geometry, material);
    }

    if(parseObj["geometry"] == "cone"){
        var geometry = new THREE.CylinderGeometry(0,1,2,50,1, false);
        var material = new THREE.MeshPhongMaterial({ 
            color: colorCode, 
            specular: specularCode,
            shininess: 100
        });

        mesh = new THREE.Mesh(geometry, material);
    }

    if(parseObj["geometry"] == "torus"){
        var geometry = new THREE.TorusGeometry(1, 0.3, 14, 100);
        var material = new THREE.MeshPhongMaterial( { 
            color: colorCode, 
            specular: specularCode,
            shininess: 100
        });

        mesh = new THREE.Mesh(geometry, material);
    }
    
    if(parseObj["geometry"] == "cylinder"){
        var scale = parseObj["material"].scale;
        var geometry = new THREE.CylinderGeometry(1, 1, 2, 22);
        var material = new THREE.MeshPhongMaterial({ 
            color: colorCode, 
            specular: specularCode,
            shininess: 100
        });

        mesh = new THREE.Mesh(geometry, material);
    }

    if(parseObj["geometry"] == "pyramid"){
        var geometry = new THREE.CylinderGeometry(0, 3.5, 4, 4);
        var material = new THREE.MeshLambertMaterial( { 
            color: colorCode, 
            specular: specularCode,
        });

        mesh = new THREE.Mesh(geometry, material);
    }

    if(parseObj["geometry"] == "plane"){
        var geometry = new THREE.PlaneGeometry(25, 25);
        var material = new THREE.MeshPhongMaterial({ 
            color: colorCode, 
            specular: specularCode,
            shininess: 100,
            side: THREE.DoubleSide
        });

        mesh = new THREE.Mesh( geometry, material);
        
        // Default value if rotation is not defined
        if (!parseObj["rotation"]){
            mesh.rotation.x = Math.PI/2;
        }
        
    }
    
    if(parseObj["geometry"] == "spriteCube"){

        var texture = new THREE.ImageUtils.loadTexture(parseObj["material"]["texture"]);
        var material = new THREE.MeshPhongMaterial({map: texture});
        var geometry = new THREE.CubeGeometry(2, 2, 2);
        mesh = new THREE.Mesh( geometry, material );
    }
    
    if (parseObj["translate"]) {
        var translate = parseObj["translate"];
        mesh.position.x = translate[0];
        mesh.position.y = translate[1];
        mesh.position.z = translate[2];
    }
    if (parseObj["scale"]) {
        var scale = parseObj["scale"];
        mesh.scale.x = scale[0];
        mesh.scale.y = scale[1];
        mesh.scale.z = scale[2];
    }
    if (parseObj["rotation"]) {
        var rotate = parseObj["rotation"];
        var axis = new THREE.Vector3(rotate[0], rotate[1], rotate[2]);
        var radians = rotate[3];
        mesh.rotateOnAxis(axis, radians);
    }

    mesh.castShadow = true;
    mesh.receiveShadow = false;
    mesh.geometry.verticesNeedUpdate = true;
    sceneNode.add(mesh);
}

function parseDirectionalLight(parseObj, SceneNode){
    var light
    var colorCode = new THREE.Color(parseObj["color"][0],parseObj["color"][1],parseObj["color"][2]);
    var light = new THREE.DirectionalLight( colorCode );
    light.position.set(parseObj["position"][0],parseObj["position"][1],parseObj["position"][2]);
    light.castShadow = true;
    light.shadowDarkness = 0.5;
    SceneNode.add(light);

    return light;
}

function parseAmbientLight(parseObj, sceneNode){

    // Default color if not specified
    var color = [1.0, 1.0, 1.0];

    if ("color" in parseObj){color = parseObj["color"];}
    var c = new THREE.Color(color[0], color[1], color[2]);	
    var light = new THREE.AmbientLight(c);
    sceneNode.add(light);
}

function parsePointLight(parseObj, sceneNode){

    var color = [1.0, 1.0, 1.0];
    var position = [1.0, 1.0, 1.0];
    var distance = 0.0;

    if ("color"    in parseObj) color    = parseObj["color"];
    if ("position" in parseObj) position = parseObj["position"];
    if ("distance" in parseObj) distance = parseObj["distance"];
    var c = new THREE.Color(color[0], color[1], color[2]);	
    var light = new THREE.PointLight(c, 1.0, distance);
    light.position.set(position[0], position[1], position[2]);
    sceneNode.add(light);
}

function parseSprite(parseObj, sceneNode){
    var type = parseObj["type"];
    var name = parseObj["name"];
    var dimension = parseObj["dimension"];
    var position = parseObj["translate"];
    var materialArray = parseObj["material"];
    var color = materialArray["diffuseColor"];
    var spriteFile = materialArray["spriteFile"];
    var scale = parseObj["scale"];
    var setColor = new THREE.Color(color[0], color[1], color[2]);
    
    var map = THREE.ImageUtils.loadTexture(spriteFile);
    var material = new THREE.SpriteMaterial({map: map, color:setColor});
    
    var sprite3D = new THREE.Object3D();
    
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(scale[0], scale[1], scale[2]);
    sprite.position.set(position[0], position[1], position[2]);
    
    var runnerGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
    sprite3D.add(sprite);
    
    sprite3D.minFilter = THREE.linearFilter;
    
    sprite3D.castShadow = true;
    sprite3D.receiveShadow = true;
    
    sceneNode.add(sprite3D);
}

function parseObjFile(parseObj, sceneNode){
    var material = parseMaterial(parseObj["material"]);
    var modelURL = parseObj["geometry"];

    // Callbacks for different aspects of loading
    var onLoad = function (mesh) {
        mesh.traverse(onTraverse);
        parseTransform(parseObj, mesh);
        sceneNode.add(mesh);
    }
    var onTraverse = function(child){
        if (child instanceof THREE.Mesh){
            child.material = material;
        }
    };
    var onProgress = function(xhr){
        // nothing
    };
    var onError = function(xhr){ 
        console.log("Error! could not load " + modelURL);
    };

    // Actually load the model using the callbacks previously defined
    var loader = new THREE.OBJLoader(manager);
    loader.load(modelURL, onLoad, onProgress, onError);
}



/*
    ======================================================================
        Render scene
    ======================================================================
*/

function runScripts(sceneNode){

    var scripts = sceneNode.userData.scripts;
    
    if (scripts === undefined){
        return;
    }

    for (var j=0; j<scripts.length; j++){
        var s = scripts[j];
        var f = window[s]; // look up function by name
        if (f !== undefined) f(sceneNode);
    }
}

function animate(){
	// requestAnimationFrame schedules a call to animate again
	requestAnimationFrame(animate); 
	animateFrame();
	//render();
    composer.passes[0].camera = currentCamera;
    composer.passes[0].scene = scene;
    renderer.setClearColor(0xffffff, 1);
    composer.render();
}

function animateFrame(){
    if (currentCamera !== undefined) currentCamera.updateProjectionMatrix();
    if (scene  !== undefined) scene.traverse(runScripts);
	// Will only work if mouse is enabled (through input file)
    if (mouseEnabled == true){
        if(cameraMode == true){
            selected.rotateX((mouseY-mousePrevY)*0.005);
            selected.rotateY((mouseX-mousePrevX)*0.005);
        }
        // selected.rotateX((mouseY-mousePrevY)*0.01);
        //selected.rotateY((mouseX-mousePrevX)*0.01);

		// Setup mouse operations
		// When Z key is being pressed, mouse buttons will only affect the selected model's Z-axis
		// Left click for rotation
		// Right click for changing position in X and Y axis
		if (Zkey == 1 && mouseDown == 1 || Zkey == 1 && mouseDown == 3){
			console.log("moving Z axis");
			selected.position.z += (mouseY-mousePrevY) * -0.05;
		}
		else if (mouseDown == 1){
			console.log("mouse 1");
			var ry = new THREE.Quaternion();
			ry.setFromAxisAngle( YAXIS, (mouseX-mousePrevX)*0.01 );
			var rx = new THREE.Quaternion();
			rx.setFromAxisAngle( XAXIS, (mouseY-mousePrevY)*0.01 );
			var r = new THREE.Quaternion();
			r.multiplyQuaternions(rx, ry);
			r.multiplyQuaternions(r, selected.quaternion);
			selected.setRotationFromQuaternion(r);
		}
		else if (mouseDown == 3){
			console.log("mouse 3");
			selected.position.x += (mouseX-mousePrevX) * 0.05;
			selected.position.y += (mouseY-mousePrevY) * -0.05;
		}

		// Update previous position here because animateFrame out of sync
		// with onDocumentMouseMove
		mousePrevX = mouseX;
		mousePrevY = mouseY;
	}

    for(i = 0; i<= modelToFaceCamera.length - 1; i++){
        var faceCameraModel = scene.children[modelToFaceCamera[i]];
        faceCameraModel.lookAt(currentCamera.position);
    }


    
    //if (scene !== undefined) scene.traverse(runScripts);
}


function render(){
	if(whiteBackground == true){
		console.log("WHITE BACKGROUND");
		renderer.setClearColor( 0xffffff, 1);
	}

	//renderer.render( scene, currentCamera );
}



/*
    ======================================================================
        Scene control
    ======================================================================

*/

function onWindowResize(){
    windowX = window.innerWidth;
    windowY = window.innerHeight;

    currentCamera.aspect = window.innerWidth / window.innerHeight;
    currentCamera.updateProjectionMatrix();

    console.log("window width = " + window.innerWidth);

    // Zoom out if window width is too narrow
    if((window.innerWidth < 950) && (fileURL != "threejs/default.json")){
        currentCamera.fov = originalCameraFov + 20;
        currentCamera.updateProjectionMatrix();
    }else{
        currentCamera.fov = originalCameraFov;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}


/* Handle basic keyboard control */
document.onkeydown = checkKeyDown;
window.onkeyup = checkKeyUp;

// Setup keyboard commands
// Swift key will change the model selection
// Holding Z key will switch model movement from X and Y axis to Z axis
// Holding X key will enable user to control light1 (scene.children[1])
// Holding C key will enable user to control the camera (scene.children[0])
function checkKeyDown(e){
    e = e || window.event;

    var key = e.keyCode ? e.keyCode : e.which;
    pressedKeys[key] = true;
    
    // prevent scrolling
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) e.preventDefault();

    
    if(e.keyCode == 87){
        console.log("W down");
        wasdMovement("W");
    }
    
    if(e.keyCode == 65){
        console.log("A down");
        wasdMovement("A");
    }
    
    if(e.keyCode == 83){
        console.log("S down");
        wasdMovement("S");
    }
    
    if(e.keyCode == 68){
        console.log("D down");
        wasdMovement("D");
    }
    
    if(e.keyCode == 16){
        shiftDown = 1;
        console.log("shift down");
    }
    
    if (e.keyCode == 69){
        console.log("E down");
        wasdMovement("E");
    }
    
    if(e.keyCode == 81){
        console.log("Q down");
        wasdMovement("Q");
    }
    
    if(e.keyCode == 82){
        console.log("R down");
        wasdMovement("R");
    }
    
    if(e.keyCode == 70){
        console.log("F down");
        wasdMovement("F");
    }

}

function checkKeyUp(e){
    e = e || window.event;
    
    var key = e.keyCode ? e.keyCode : e.which;
    delete pressedKeys[key];
    console.log("onKeyDown " + key + "\n");
    
    if(e.keyCode == 87){
        console.log("W up");
    }
    
    if(e.keyCode == 65){
        console.log("A up");
    }
    
    if(e.keyCode == 83){
        console.log("S up");
    }
    
    if(e.keyCode == 68){
        console.log("D up");
    }

    if(e.keyCode == 16){
        shiftDown = 0;
        console.log("shift up");
        
        // Will only work if model selection is enabled (through input file)
        if(modelSelectionEnabled == true){
            if(selectedModel == scene.children.length-1){
                selectedModel = 3;
                selected = scene.children[selectedModel];
            }
            else{
                selectedModel++;
                selected = scene.children[selectedModel];
            }
        }
    }

     if (e.keyCode == 69){
        console.log("E up")
    }

    if(e.keyCode == 81){
        console.log("Q down");
    }
}


function wasdMovement(command){
    // Will only work if WASD key is enabled (through input file)
    if(wasdEnabled == true){
        var movementScale = 0.5;
        var rotateScale = 0.05;
        var angle = currentCamera.rotation.y;

        if(command == "A"){
            currentCamera.position.x -= movementScale * Math.cos(angle);
            currentCamera.position.z += movementScale * Math.sin(angle);
        }
        if(command == "D"){
            currentCamera.position.x += movementScale * Math.cos(angle);
            currentCamera.position.z -= movementScale * Math.sin(angle);

        }
        if(command == "W"){
            currentCamera.position.z -= movementScale * Math.cos(angle);
            currentCamera.position.x -= movementScale * Math.sin(angle);
        }
        if(command == "S"){
            currentCamera.position.z += movementScale * Math.cos(angle);
            currentCamera.position.x += movementScale * Math.sin(angle);
        }

        if(command == "Q"){
            currentCamera.rotation.y += rotateScale;
        }

        if(command == "E"){
            currentCamera.rotation.y -= rotateScale;
        }

        if(command == "R"){
            currentCamera.position.y += movementScale;
        }

        if(command == "F"){
            currentCamera.position.y -= movementScale;
        }
    }
}

/* Handle basic mouse control */
function onDocumentMouseWheel(event){
    // Will only work if mouse is enabled (through input file)
    if(mouseEnabled == true){
        if(Zkey == 1 && event.wheelDelta > 0 || Zkey == 1 && event.detail > 0){
            selected.position.z += 1;
        }
        
        else if(Zkey == 1 && event.wheelDelta < 0 || Zkey == 1 && event.detail < 0){
            selected.position.z -= 1;
        }
        
        else if(event.detail > 0 || event.wheelDelta > 0){
            selected.scale.x *= 1.1;
            selected.scale.y *= 1.1;
            selected.scale.z *= 1.1;
        }
        else{
            selected.scale.x /= 1.1;
            selected.scale.y /= 1.1;
            selected.scale.z /= 1.1;
        }
    }
}

function onDocumentMouseUp(event){
    mouseDown = 0;
}

function onDocumentMouseDown(event){
    mouseDown = event.which;
}

function onDocumentMouseMove(event) {
    mousePrevX = mouseX;
    mousePrevY = mouseY;
    mouseX = event.clientX * 0.2;
    mouseY = event.clientY * 0.2;
}

/*
    ======================================================================
        Others
    ======================================================================
*/

// Toggle audio mute/unmute
function mute(){
    if(audio.volume > 0){
        audio.volume = 0;
        currentVolume = 0;
        document.getElementById("mute-shape").style.opacity = 0.8;
    }
    else{
        audio.volume = 0.7;
        currentVolume = 0.7;
        document.getElementById("mute-shape").style.opacity = 0.4;
    }
}

// Get elapsed time since loaded
function getElapsedTime(){
    var d = new Date();
    var t = d.getTime() * 0.001 - startTime;
    return t;
}