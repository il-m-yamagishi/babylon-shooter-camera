/**
 * @license Apache-2.0
 */

import {
    ArcRotateCamera,
    Color3,
    CreateBox,
    CreateCapsule,
    CreateGroundFromHeightMap,
    DirectionalLight,
    Engine,
    Ray,
    RayHelper,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core";
import { AdvancedDynamicTexture, Control, TextBlock } from "@babylonjs/gui";
import { ShooterCamera } from "./lib/shooterCamera";

import "pepjs";
import { WebGPUMaterialContext } from "@babylonjs/core/Engines/WebGPU/webgpuMaterialContext";

window.addEventListener('load', () => {
    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement | null;

    if (!canvas) {
        throw new Error('Undefined canvas#renderCanvas');
    }

    const engine = new Engine(canvas);
    const scene = new Scene(engine);
    scene.collisionsEnabled = true;
    scene.gravity = new Vector3(0, -0.4, 0);

    createGround(scene);

    const cameraMesh = CreateCapsule("CameraMesh", {
        height: 1.7,
        radius: 0.5,
        updatable: true,
    }, scene);
    cameraMesh.position = new Vector3(0, 20, 0);
    cameraMesh.checkCollisions = true;
    const cameraMeshForward = CreateBox("CameraMeshForward", {
        size: 0.2,
    }, scene);
    cameraMeshForward.parent = cameraMesh;
    cameraMeshForward.position = new Vector3(0, 0.8, 0.5);

    const camera = new ArcRotateCamera("MainCamera", Math.PI / 4, Math.PI / 4, 10, new Vector3(0, 2, 0), scene, true);

    // const camera = new ShooterCamera("ShooterCamera", new Vector3(0, 50, 0), scene);
    // camera.speed = 1.0;
    // camera.horizontalSpeed = 0.8;
    // camera.backwardSpeed = 0.6;
    // camera.attachControl(true);
    // camera.checkCollisions = true;
    // camera.applyGravity = true;
    // camera.ellipsoid = new Vector3(1.2, 1.6, 1.2);

    window.addEventListener("click", () => {
        // engine.enterPointerlock();
    });
    const light = new DirectionalLight("MainLight", new Vector3(0.3, -0.76, 0.55), scene);

    const ray = new Ray(cameraMesh.position, cameraMesh.forward, 2);
    const a = RayHelper.CreateAndShow(ray, scene, Color3.White());

    const guiTex = AdvancedDynamicTexture.CreateFullscreenUI("GUI");
    const posText = new TextBlock("PosText");
    posText.color = "white";
    posText.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    posText.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    guiTex.addControl(posText);

    engine.runRenderLoop(() => {
        cameraMesh.rotation.y += 0.01;
        // cameraMesh.computeWorldMatrix(true);
        cameraMesh.moveWithCollisions(new Vector3(-0.02, -0.1, 0));
        a.detachFromMesh();
        a.attachToMesh(cameraMesh, cameraMesh.forward.clone(), Vector3.Zero(), 2);
        posText.text = cameraMesh.forward.toString();
        camera.position = cameraMesh.position.clone().addInPlaceFromFloats(0, 20, -20);
        camera.target = cameraMesh.position;
        scene.render();
    });
    window.addEventListener('resize', () => engine.resize());
});

function createGround(scene: Scene): void {
    const scale = 50;
    const tex = new Texture("https://assets.babylonjs.com/textures/grass.png", scene);
    tex.uScale = scale;
    tex.vScale = scale;
    const texN = new Texture("https://assets.babylonjs.com/textures/grassn.png", scene);
    texN.uScale = scale;
    texN.vScale = scale;
    const mat = new StandardMaterial("groundMat", scene);
    mat.diffuseTexture = tex;
    mat.bumpTexture = texN;
    mat.specularColor = Color3.Black();
    const ground = CreateGroundFromHeightMap(
        "ground",
        "https://assets.babylonjs.com/textures/heightMap.png",
        {
            width: scale * 10,
            height: scale * 10,
            subdivisions: 50,
            maxHeight: 20,
            updatable: false,
        },
        scene,
    );
    ground.material = mat;
    ground.receiveShadows = true;
    ground.checkCollisions = true;
}
