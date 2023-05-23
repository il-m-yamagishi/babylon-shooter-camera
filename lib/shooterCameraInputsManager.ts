/**
 * @license Apache-2.0
 */

import { CameraInputsManager } from "@babylonjs/core/Cameras/cameraInputsManager";
import { ShooterCamera } from "./shooterCamera";
import { ShooterCameraKeyboardInput } from "./shooterCameraKeyboardInput";

export class ShooterCameraInputsManager extends CameraInputsManager<ShooterCamera> {
    public constructor(camera: ShooterCamera) {
        super(camera);
        this.add(new ShooterCameraKeyboardInput());
    }
}
