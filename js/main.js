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

    createCar(scene);
    createBall(scene);
    createCage(scene);
    createLights(scene);

    return scene;
}

function createGround(scene) {
    const groundOptions = { width: 6000, height: 4000, subdivisions: 20, minHeight: 0, maxHeight: 100 };
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGround("ground", groundOptions);
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("images/terrainFoot.jpg");
    ground.material = groundMaterial;
    // to be taken into account by collision detection
    ground.checkCollisions = true;
    //groundMaterial.wireframe=true;
    return ground;
}

function createCage(scene) {
    BABYLON.SceneLoader.ImportMeshAsync("cage", "../models/", "cage.glb", scene).then((result) => {
        var cage1 = result.meshes[0];
        cage1.scaling = new BABYLON.Vector3(0.75, 0.75, 0.75);
        cage1.position = new BABYLON.Vector3(-3000, 0, -220);
        cage1.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(90), BABYLON.Space.LOCAL);
    });

    BABYLON.SceneLoader.ImportMeshAsync("cage", "../models/", "cage.glb", scene).then((result) => {
        var cage2 = result.meshes[0];
        cage2.scaling = new BABYLON.Vector3(0.75, 0.75, 0.75);
        cage2.position = new BABYLON.Vector3(3000, 0, 180);
        cage2.rotate(BABYLON.Axis.Y, BABYLON.Tools.ToRadians(-90), BABYLON.Space.LOCAL);
    });
}


function createBall(scene) {
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 50, scene);
    sphere.position.y = 25;

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

let zMovement = 2;
function createCar(scene) {
    var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), scene);
    camera.radius = -150;
    camera.heightOffset = 50;
    camera.cameraAcceleration = 0.1;
    camera.maxCameraSpeed = 5;

    BABYLON.SceneLoader.ImportMeshAsync("car", "../models/", "car.glb", scene).then((result) => {
        var car = result.meshes[0];


        car.scaling = new BABYLON.Vector3(30, 30, 30);
        car.position = new BABYLON.Vector3(0, 0, 0);
        car.name = "car";

        // By default the box/tank is in 0, 0, 0, let's change that...
        car.position.y = 0.6;
        car.speed = 3;
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

        camera.lockedTarget = car;
    });


}


window.addEventListener("resize", () => {
    engine.resize()
});
