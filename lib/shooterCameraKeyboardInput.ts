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
import { Vector3 } from "@babylonjs/core";

type CheckKeyName = "forward" | "backward" | "left" | "right" | "dash" | "jump";

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
     * ForwardKey inputIndex
     */
    public forwardKey = "W".charCodeAt(0);

    /**
     * BackwardKey inputIndex
     */
    public backwardKey = "S".charCodeAt(0);

    /**
     * LeftKey inputIndex
     */
    public leftKey = "A".charCodeAt(0);

    /**
     * RightKey inputIndex
     */
    public rightKey = "D".charCodeAt(0);

    /**
     * DashKey inputIndex
     */
    public dashKey = 16; // ShiftLeft

    /**
     * JumpKey inputIndex
     */
    public jumpKey = 32; // Space

    /** @internal */
    public _forwardSpeed = 1.0;

    /** @internal */
    public _horizontalSpeed = 1.0;

    /** @interval */
    public _backwardSpeed = 1.0;

    /** @internal */
    public _dashSpeed = 1.3;

    /** Currently jumping */
    private isJumping = false;

    /** Jumping power +Y angle */
    private jumpPower = 0.0;

    /**
     * Key map which pressed at current frame
     */
    private _pressedKeys: Record<CheckKeyName, boolean> = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        dash: false,
        jump: false,
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
                    if (keyboard.inputIndex === this.dashKey) {
                        changed = changed || this._checkKeyDown("dash", down);
                    }
                    if (keyboard.inputIndex === this.jumpKey) {
                        changed = changed || this._checkKeyDown("jump", down);
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
                return true;
            }
        } else {
            if (this._pressedKeys[name]) {
                this._pressedKeys[name] = false;
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
            this._deviceSourceManager.dispose();
            this._deviceSourceManager = null;
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

    public checkInputs = () => {
        if (!this._onDeviceConnectedObserver || !this.camera) {
            return;
        }

        const camera = this.camera;

        // handle jump
        if (this.isJumping) {
            this.jumpPower *= 0.2;
            if (this.jumpPower < 0.01) {
                this.isJumping = false;
                this.jumpPower = 0.0;
            }
        } else if (this._pressedKeys["jump"]) {
            // start jumping
            this.isJumping = true;
            this.jumpPower = 0.2;
        }

        const dashSpeed = this._pressedKeys["dash"] ? this._dashSpeed : 1.0;
        const speed = camera._computeLocalCameraSpeed() * dashSpeed;
        const zForward = this._pressedKeys["forward"] ? speed * this._forwardSpeed : 0;
        const zBackward = this._pressedKeys["backward"] ? speed * this._backwardSpeed : 0;
        const xForward = this._pressedKeys["right"] ? speed * this._horizontalSpeed : 0;
        const xBackward = this._pressedKeys["left"] ? speed * this._horizontalSpeed : 0;
        const isDiagonalMove = this._isDiagonalMove();
        const z = (zForward - zBackward) / (isDiagonalMove ? 1.41421356 : 1);
        const x = (xForward - xBackward) / (isDiagonalMove ? 1.41421356 : 1);
        camera._localDirection.copyFromFloats(x, this.jumpPower, z);

        if (camera.getScene().useRightHandedSystem) {
            camera._localDirection.z *= -1;
        }

        // Move camera direction
        camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
        Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection);
        camera.cameraDirection.addInPlace(camera._transformedDirection);
    };

    private _isDiagonalMove(): boolean {
        return (this._pressedKeys["forward"] && (this._pressedKeys["left"] || this._pressedKeys["right"])) ||
            (this._pressedKeys["backward"] && (this._pressedKeys["left"] || this._pressedKeys["right"]));
    }

    private _clearPressedKeys(): void {
        this._pressedKeys["forward"] = false;
        this._pressedKeys["backward"] = false;
        this._pressedKeys["left"] = false;
        this._pressedKeys["right"] = false;
    }
}
