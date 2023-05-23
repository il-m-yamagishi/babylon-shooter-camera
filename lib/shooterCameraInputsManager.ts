/**
 * @license Apache-2.0
 */

import { CameraInputsManager } from "@babylonjs/core/Cameras/cameraInputsManager";
import { ShooterCamera } from "./shooterCamera";
import { ShooterCameraKeyboardInput } from "./shooterCameraKeyboardInput";
import { ShooterCameraMouseInput } from "./shooterCameraMouseInput";

export class ShooterCameraInputsManager extends CameraInputsManager<ShooterCamera> {
    public constructor(camera: ShooterCamera) {
        super(camera);
        this.add(new ShooterCameraKeyboardInput());
        this.add(new ShooterCameraMouseInput(false));
    }
}
