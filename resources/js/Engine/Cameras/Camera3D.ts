import Mat4 from "../Math/Mat4";
import Vec3 from "../Math/Vec3";



// TODO implement this
export default class Camera3D {
    public position : Vec3;

    public constructor(position : Vec3) {
        this.position = position;
    }

    public Update(delta : number) {

    }

    public ViewProj() {
        const view = new Mat4();

        return view;
    }
}