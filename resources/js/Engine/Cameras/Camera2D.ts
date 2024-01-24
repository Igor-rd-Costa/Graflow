import Input from "../Input";
import Mat4 from "../Math/Mat4";
import Vec3 from "../Math/Vec3";
import Renderer from "../Renderer/Renderer";
import { CameraMovementMode, Key } from "../Types/Enums";
import CameraBase from "./CameraBase";



export default class Camera2D extends CameraBase {
    private position : Vec3;
    private view : Mat4;
    private movementMode : CameraMovementMode;

    public constructor(position : Vec3) {
        super();
        this.position = position;
        this.view = new Mat4();
        //TODO add support for CameraMovementMode.MOUSE_MOVEMENT_MODE 
        this.movementMode = CameraMovementMode.KEYBOARD_MOVEMENT_MODE;
        this.view.value[12] = this.position.value[0];
        this.view.value[13] = this.position.value[1];
        this.view.value[14] = this.position.value[2];
    }

    public Update(delta : number) {
        if (this.movementMode === CameraMovementMode.KEYBOARD_MOVEMENT_MODE) {
            if (Input.IsKeyDown(Key.KEY_W)) {
                this.position = this.position.Sum(new Vec3(0.0, -1.0, 0.0).ScalarMultiply(delta));
            }
            else if (Input.IsKeyDown(Key.KEY_S)) {
                this.position = this.position.Sum(new Vec3(0.0, 1.0, 0.0).ScalarMultiply(delta));
            }
            
            if (Input.IsKeyDown(Key.KEY_D)) {
                this.position = this.position.Sum(new Vec3(-1.0, 0.0, 0.0).ScalarMultiply(delta));
            }
            else if (Input.IsKeyDown(Key.KEY_A)) {
                this.position = this.position.Sum(new Vec3(1.0, 0.0, 0.0).ScalarMultiply(delta));
            }
        }

        this.view.value[12] = this.position.value[0];
        this.view.value[13] = this.position.value[1];
        this.view.value[14] = this.position.value[2];
    }

    public View() {
        return this.view;
    }

    public override Position(): Vec3 {
        return this.position;    
    }
}