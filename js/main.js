let canvas;
let engine;
let scene;
// vars for handling inputs
let inputStates = {};

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();



    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime(); // remind you something ?

        scene.render();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);
    let ground = createGround(scene);

    createTank(scene);

    createElvis(scene);
    createSouris(scene);
    createTimmy(scene);
    createLights(scene);

    return scene;
}

function createElvis(scene) {
    BABYLON.SceneLoader.ImportMeshAsync("elvisRun", "../models/", "run.glb", scene).then((result) => {

        var hero = result.meshes[0]; 
        hero.scaling = new BABYLON.Vector3(20, 20, 20);
        hero.position = new BABYLON.Vector3(0, 3, 100);
        hero.name = "elvis";
        scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
        var direction = false;
        scene.registerBeforeRender(function () {
            if (hero.position.z < 200 && direction) {
                hero.position.z += 1;
            }
            else {
                if (direction) {
                    direction = false;
                    hero.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(180), BABYLON.Space.LOCAL);
                    console.log("tourneA");
                }
            }

            if (hero.position.z > -200 && !direction) {
                hero.position.z -= 1;
            }
            else {
                if (!direction) {
                    direction = true;
                    hero.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(180), BABYLON.Space.LOCAL);
                    console.log("tourneB");
                }
            }
        });
    });
}

function createSouris(scene) {
    BABYLON.SceneLoader.ImportMeshAsync("souris", "../models/", "souris.glb", scene).then((result) => {

        var souris = result.meshes[0];
        //Scale the model down        
        souris.scaling = new BABYLON.Vector3(20, 20, 20);
        souris.position = new BABYLON.Vector3(200, 5, -200);
        souris.name = "souris";
        scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
        var direction = false;
        souris.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(90), BABYLON.Space.LOCAL);
        scene.registerBeforeRender(function () {
            if (souris.position.x < 300 && direction) {
                souris.position.x += 0.5;
            }
            else {
                // Swap directions to move left
                if (direction) {
                    direction = false;
                    souris.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(180), BABYLON.Space.LOCAL);
                    console.log("tourneA");
                }
            }

            if (souris.position.x > -400 && !direction) {
                souris.position.x -= 0.5;
            }
            else {
                if (!direction) {
                    direction = true;
                    souris.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(180), BABYLON.Space.LOCAL);
                    console.log("tourneB");
                }
            }
        });
    });
}

function createTimmy(scene) {
    BABYLON.SceneLoader.ImportMeshAsync("timmy", "../models/", "timmy.glb", scene).then((result) => {

        var timmy = result.meshes[0];
        //Scale the model down        
        timmy.scaling = new BABYLON.Vector3(20, 20, 20);
        timmy.position = new BABYLON.Vector3(-200, 5, 200);
        timmy.name = "timmy";
        scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);
        var direction = false;
    });
}

function createGround(scene) {
    const groundOptions = { width: 2000, height: 2000, subdivisions: 20, minHeight: 0, maxHeight: 100, onReady: onGroundCreated };
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/hmap1.png', groundOptions, scene);

    function onGroundCreated() {
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/wood.jpg");
        ground.material = groundMaterial;
        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
    }
    return ground;
}

function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);
    let light1 = new BABYLON.DirectionalLight("dir1", new BABYLON.Vector3(-1, -1, -1), scene);
    light1.position = new BABYLON.Vector3(-200, 200, -200);
    let light2 = new BABYLON.DirectionalLight("dir2", new BABYLON.Vector3(1, -1, 1), scene);
    light2.position = new BABYLON.Vector3(200, 200, 200);
    let light3 = new BABYLON.DirectionalLight("dir3", new BABYLON.Vector3(1, -1, -1), scene);
    light3.position = new BABYLON.Vector3(200, 200, -200);
    let light4 = new BABYLON.DirectionalLight("dir4", new BABYLON.Vector3(-1, -1, 1), scene);
    light4.position = new BABYLON.Vector3(-200, 200, 200);
}

let zMovement = 5;
function createTank(scene) {
    // code de la caméra ici https://playground.babylonjs.com/#AHQEIB#17
    var camera1 = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 100, 300), scene);
    scene.activeCamera = camera1;
    scene.activeCamera.attachControl(canvas, true);
    camera1.lowerRadiusLimit = 2;
    camera1.upperRadiusLimit = 10;

    BABYLON.SceneLoader.ImportMeshAsync("car", "../models/", "car.glb", scene).then((result) => {
        var car = result.meshes[0];

        car.scaling = new BABYLON.Vector3(30, 30, 30);
        car.position = new BABYLON.Vector3(0, 0, 0);
        car.name = "car";

        // By default the box/tank is in 0, 0, 0, let's change that...
        car.position.y = 0.6;
        car.speed = 2;
        car.frontVector = new BABYLON.Vector3(0, 0, 1);

        var inputMap = {};
        scene.actionManager = new BABYLON.ActionManager(scene);
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));

        scene.onBeforeRenderObservable.add(() => {
            let yMovement = 0;

            if (car.position.y > 2) {
                zMovement = 0;
                yMovement = -2;
            }
            var keydown = false;
            //Manage the movements of the character (e.g. position, direction)
            if (inputMap["s"]) {
                car.moveWithCollisions(car.frontVector.multiplyByFloats(car.speed, car.speed, car.speed));
            }
            if (inputMap["z"]) {
                car.moveWithCollisions(car.frontVector.multiplyByFloats(-car.speed, -car.speed, -car.speed));
            }
            if (inputMap["q"]) {
                car.rotation.y -= 0.060;
                car.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-3.5), BABYLON.Space.LOCAL);
                car.frontVector = new BABYLON.Vector3(Math.sin(car.rotation.y), 0, Math.cos(car.rotation.y));
            }
            if (inputMap["d"]) {
                car.rotation.y += 0.060;
                car.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(3.5), BABYLON.Space.LOCAL);
                car.frontVector = new BABYLON.Vector3(Math.sin(car.rotation.y), 0, Math.cos(car.rotation.y));
            }
        });

    });
}


window.addEventListener("resize", () => {
    engine.resize()
});
