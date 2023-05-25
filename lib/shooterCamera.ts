/**
 * @license Apache-2.0
 */

import { Scene, Vector3 } from "@babylonjs/core";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { ShooterCameraInputsManager } from "./shooterCameraInputsManager";

export class ShooterCamera extends FreeCamera {
    public inputs: any;
    private _inputs: ShooterCameraInputsManager;

    /** Get move speed to forward. default: 1.0 */
    public get forwardSpeed(): number {
        return this._inputs._keyboard._forwardSpeed;
    }

    /** Set move speed to forward. default: 1.0 */
    public set forwardSpeed(value: number) {
        this._inputs._keyboard._forwardSpeed = value;
    }

    /** Get move speed to horizontal. default: 1.0 */
    public get horizontalSpeed(): number {
        return this._inputs._keyboard._horizontalSpeed;
    }

    /** Set move speed to horizontal. default: 1.0 */
    public set horizontalSpeed(value: number) {
        this._inputs._keyboard._horizontalSpeed = value;
    }

    /** Get move speed to backward. default: 1.0 */
    public get backwardSpeed(): number {
        return this._inputs._keyboard._backwardSpeed;
    }

    /** Set move speed to backward. default: 1.0 */
    public set backwardSpeed(value: number) {
        this._inputs._keyboard._backwardSpeed = value;
    }

    /** Get move speed to dash. default: 1.3 */
    public get dashSpeed(): number {
        return this._inputs._keyboard._dashSpeed;
    }

    /** Set move speed to dash. default: 1.3 */
    public set dashSpeed(value: number) {
        this._inputs._keyboard._dashSpeed = value;
    }

    public constructor(name: string, position: Vector3, scene?: Scene, setActiveOnSceneIfNoneActive = true) {
        super(name, position, scene, setActiveOnSceneIfNoneActive);
        this.inputs.clear();
        this.inputs = new ShooterCameraInputsManager(this);
        this._inputs = this.inputs; // for typing
    }
}
