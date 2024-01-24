import Camera from "./Cameras/Camera";
import Input from "./Input";
import Renderer from "./Renderer/Renderer";
import { CameraType } from "./Types/Enums";




export default class Engine {

    public static async Init() {

        Input.Init();
        //TODO Add camera info to project file
        Camera.Init(CameraType.CAMERA_2D);
        await Renderer.Init();
    }
}