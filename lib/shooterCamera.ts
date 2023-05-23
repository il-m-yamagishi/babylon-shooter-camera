/**
 * @license Apache-2.0
 */

import { Scene, Vector3 } from "@babylonjs/core";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { ShooterCameraInputsManager } from "./shooterCameraInputsManager";

export class ShooterCamera extends FreeCamera {
    public inputs: any;

    public constructor(name: string, position: Vector3, scene?: Scene, setActiveOnSceneIfNoneActive = true) {
        super(name, position, scene, setActiveOnSceneIfNoneActive);
        this.inputs.clear();
        this.inputs = new ShooterCameraInputsManager(this);
    }
}
