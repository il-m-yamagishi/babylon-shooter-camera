/**
 * @license Apache-2.0
 */

import type { ICameraInput } from "@babylonjs/core/Cameras/cameraInputsManager";
import { FreeCameraMouseInput } from "@babylonjs/core/Cameras/Inputs/freeCameraMouseInput";
import { ShooterCamera } from "./shooterCamera";

export class ShooterCameraMouseInput extends FreeCameraMouseInput implements ICameraInput<ShooterCamera> {
    public camera!: ShooterCamera;

    public getClassName(): string {
        return "ShooterCameraMouseInput";
    }

    public getSimpleName(): string {
        return "mouse";
    }

    public attachControl(noPreventDefault?: boolean | undefined): void {
        super.attachControl(noPreventDefault);
    }

    public detachControl(): void {
        super.detachControl();
    }
}
