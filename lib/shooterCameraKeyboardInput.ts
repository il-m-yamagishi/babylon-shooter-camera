/**
 * @license Apache-2.0
 */

import { DeviceType } from "@babylonjs/core/DeviceInput/InputDevices/deviceEnums";
import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Observer } from "@babylonjs/core/Misc/observable";
import type { ICameraInput } from "@babylonjs/core/Cameras/cameraInputsManager";
import type { Nullable } from "@babylonjs/core/types";
import { DeviceSourceManager } from "@babylonjs/core/DeviceInput/InputDevices/deviceSourceManager";
import { ShooterCamera } from "./shooterCamera";
import { DeviceSourceType } from "@babylonjs/core/DeviceInput/internalDeviceSourceManager";

type CheckKeyName = "forward" | "backward" | "left" | "right";

/**
 * Class for Keyboard input
 * @see FreeCameraKeyboardInput
 */
export class ShooterCameraKeyboardInput implements ICameraInput<ShooterCamera> {
    /**
     * @inheritdoc
     */
    public camera: Nullable<ShooterCamera> = null;

    /**
     * ForwardKey character code
     */
    public forwardKey = "W".charCodeAt(0);

    /**
     * BackwardKey character code
     */
    public backwardKey = "S".charCodeAt(0);

    /**
     * LeftKey character code
     */
    public leftKey = "A".charCodeAt(0);

    /**
     * RightKey character code
     */
    public rightKey = "D".charCodeAt(0);

    /**
     * Key map which pressed at current frame
     */
    private _pressedKeys: Record<CheckKeyName, boolean> = {
        forward: false,
        backward: false,
        left: false,
        right: false,
    };

    /**
     * DeviceSourceManager
     */
    private _deviceSourceManager: Nullable<DeviceSourceManager> = null;

    /**
     * Observer when it emits on blur
     */
    private _onCanvasBlurObserver: Nullable<Observer<Engine>> = null;

    /**
     * Observer when it emits on device connected
     */
    private _onDeviceConnectedObserver: Nullable<Observer<DeviceSourceType>> = null;

    /**
     * @inheritdoc
     */
    public getClassName(): string {
        return "ShooterCameraKeyboardInput";
    }

    /**
     * @inheritdoc
     */
    public getSimpleName(): string {
        return "keyboard";
    }

    /**
     * @inheritdoc
     */
    public attachControl(noPreventDefault?: boolean | undefined): void {
        if (!this.camera || !this.camera.getScene() || !this.camera.getScene().getEngine()) {
            // Do nothing when no camera
            return;
        }

        if (!this._onCanvasBlurObserver) {
            this._onCanvasBlurObserver = this.camera.getScene().getEngine().onCanvasBlurObservable.add(() => {
                this._clearPressedKeys();
            });
        }

        if (!this._onDeviceConnectedObserver) {
            this._deviceSourceManager = new DeviceSourceManager(this.camera.getScene().getEngine());
            this._onDeviceConnectedObserver = this._deviceSourceManager.onDeviceConnectedObservable.add((evt) => {
                if (evt.deviceType !== DeviceType.Keyboard) {
                    return;
                }
                evt.onInputChangedObservable.add((keyboard) => {
                    if (keyboard.metaKey) {
                        return;
                    }

                    let changed = false;
                    const down = keyboard.type === "keydown";
                    if (keyboard.inputIndex === this.forwardKey) {
                        changed = changed || this._checkKeyDown("forward", down);
                    }
                    if (keyboard.inputIndex === this.backwardKey) {
                        changed = changed || this._checkKeyDown("backward", down);
                    }
                    if (keyboard.inputIndex === this.leftKey) {
                        changed = changed || this._checkKeyDown("left", down);
                    }
                    if (keyboard.inputIndex === this.rightKey) {
                        changed = changed || this._checkKeyDown("right", down);
                    }

                    if (changed && !noPreventDefault) {
                        keyboard.preventDefault();
                    }
                });
            });
        }
    }

    private _checkKeyDown(name: CheckKeyName, down: boolean): boolean {
        if (down) {
            if (!this._pressedKeys[name]) {
                this._pressedKeys[name] = true;
                console.log(name, true);
                return true;
            }
        } else {
            if (this._pressedKeys[name]) {
                this._pressedKeys[name] = false;
                console.log(name, false);
                return true;
            }
        }
        return false;
    }

    /**
     * @inheritdoc
     */
    public detachControl(): void {
        if (this._deviceSourceManager) {
            this._deviceSourceManager.onDeviceConnectedObservable.remove(this._onDeviceConnectedObserver);
            this._onDeviceConnectedObserver = null;
        }
        if (this.camera) {
            const scene = this.camera.getScene();
            const engine = scene.getEngine();
            if (engine) {
                engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
            }
        }

        this._onCanvasBlurObserver = null;
        this._clearPressedKeys();
    }

    private _clearPressedKeys(): void {
        this._pressedKeys["forward"] = false;
        this._pressedKeys["backward"] = false;
        this._pressedKeys["left"] = false;
        this._pressedKeys["right"] = false;
    }
}
