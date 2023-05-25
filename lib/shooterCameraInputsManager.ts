/**
 * @license Apache-2.0
 */

import { CameraInputsManager } from "@babylonjs/core/Cameras/cameraInputsManager";
import { ShooterCamera } from "./shooterCamera";
import { ShooterCameraKeyboardInput } from "./shooterCameraKeyboardInput";
import { ShooterCameraMouseInput } from "./shooterCameraMouseInput";

export class ShooterCameraInputsManager extends CameraInputsManager<ShooterCamera> {
    /** @internal */
    public _keyboard: ShooterCameraKeyboardInput;

    /** @internal */
    public _mouse: ShooterCameraMouseInput;

    public constructor(camera: ShooterCamera) {
        super(camera);
        this.add(this._keyboard = new ShooterCameraKeyboardInput());
        this.add(this._mouse = new ShooterCameraMouseInput(false));
    }
}
