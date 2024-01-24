import Mat4 from "../Math/Mat4";
import Vec3 from "../Math/Vec3";




export default abstract class CameraBase {
    public abstract Update(delta : number) : void;
    public abstract Position() : Vec3;
    public abstract View() : Mat4;
}