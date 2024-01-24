import { GFMath } from "../Math/GFMath";
import Mat4 from "../Math/Mat4";
import Vec3 from "../Math/Vec3";
import { CameraType } from "../Types/Enums";
import { ViewportSize } from "../Types/Types";
import Camera2D from "./Camera2D";
import Camera3D from "./Camera3D";




export default abstract class Camera {
    private static camera : Camera2D;
    private static viewportSize : ViewportSize = { width: 1280, height: 720 };
    private static zoomLevel : number = 5.0;
    private static projection : Mat4;
    
    public static Init(type : CameraType, position : Vec3 = new Vec3(0.0, 0.0, 0.0)) {
        const wrapper = document.getElementById('viewport-wrapper') as HTMLElement;
        const width = parseInt(getComputedStyle(wrapper).width);
        const height = parseInt(getComputedStyle(wrapper).height);
        this.viewportSize.width = width;
        this.viewportSize.height = height;

        if (type === CameraType.CAMERA_2D) {

            this.camera = new Camera2D(position);
            const aspect = (width / height);
            this.projection = GFMath.Ortho(
                -aspect * this.zoomLevel, aspect * this.zoomLevel, 
                1 * this.zoomLevel, -1 * this.zoomLevel, 
                0.0, 100.0);
                
        }
        else {
            //this.camera = new Camera3D(position);
        }
    }

    public static Update(delta : number) {
        this.camera.Update(delta);
    }

    public static ViewProj() : Mat4 {
        return this.projection.Multiply(this.camera.View());
    }

    public static View() : Mat4 {
        return this.camera.View();
    }
}