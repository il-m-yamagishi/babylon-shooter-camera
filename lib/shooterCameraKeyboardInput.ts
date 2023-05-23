/**
 * @license Apache-2.0
 */

import type { KeyboardInfo } from "@babylonjs/core/Events/keyboardEvents";
import type { Observer } from "@babylonjs/core/Misc/observable";
import type { Engine } from "@babylonjs/core/Engines/engine";
import type { ICameraInput } from "@babylonjs/core/Cameras/cameraInputsManager";
import type { Nullable } from "@babylonjs/core/types";
import { ShooterCamera } from "./shooterCamera";

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
    private _pressedKeys: Record<string, boolean> = {
        forward: false,
        backward: false,
        left: false,
        right: false,
    };

    /**
     * Observer when it emits on blur
     */
    private _onCanvasBlurObserver: Nullable<Observer<Engine>> = null;
    /**
     * Observer when it emits on keyboard changes
     */
    private _onKeyboardObserver: Nullable<Observer<KeyboardInfo>> = null;

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
        if (!this.camera) {
            // Do nothing when no camera
            return;
        }

        if (!this._onCanvasBlurObserver) {
            this._onCanvasBlurObserver = this.camera.getScene().getEngine().onCanvasBlurObservable.add(() => {
                this._pressedKeys["forward"] = false;
                this._pressedKeys["backward"] = false;
                this._pressedKeys["left"] = false;
                this._pressedKeys["right"] = false;
            });
        }

        if (!this._onKeyboardObserver) {
            this._onKeyboardObserver = this.camera.getScene().onKeyboardObservable.add((info) => {
                const evt = info.event;
                if (evt.metaKey) {
                    return;
                }

                let changed = false;


            });
        }
    }

    /**
     * @inheritdoc
     */
    public detachControl(): void {
        if (this.camera) {
            const scene = this.camera.getScene();
            if (scene) {
                scene.onKeyboardObservable.remove(this._onKeyboardObserver);
            }

            const engine = scene.getEngine();
            if (engine) {
                engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
            }
        }

        this._onKeyboardObserver = null;
        this._onCanvasBlurObserver = null;
        this._keycodes = [];
    }
}
