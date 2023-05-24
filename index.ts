/**
 * @license Apache-2.0
 */

import {
    Color3,
    CreateGroundFromHeightMap,
    DirectionalLight,
    Engine,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core";
import { ShooterCamera } from "./lib/shooterCamera";

import "pepjs";

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

    const camera = new ShooterCamera("ShooterCamera", new Vector3(0, 30, 0), scene);
    camera.attachControl(true);
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = new Vector3(1.2, 1.6, 1.2);
    window.addEventListener("click", () => {
        engine.enterPointerlock();
    });
    const light = new DirectionalLight("MainLight", new Vector3(0.3, -0.76, 0.55), scene);

    engine.runRenderLoop(() => {
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
