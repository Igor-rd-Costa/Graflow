import Renderer from "../Renderer";
import { GLShaderType } from "../../Types/Enums";

export default class Shader {
    private shader : WebGLShader | null = null;

    public constructor(type : GLShaderType, shaderFile : string) {
        const GL = Renderer.GetContext();
        this.shader = GL.createShader(type);
        if (this.shader === null) {
            Renderer.Error("Failed to create shader.");
            return;
        } 
        const shaderSrc = Renderer.shaders.get(shaderFile);
        if (shaderSrc === undefined) {
            Renderer.Error("Could not find shader " + shaderFile);
            return;
        }

        GL.shaderSource(this.shader, shaderSrc);
        GL.compileShader(this.shader);
        //TODO detect errors
    }

    public Delete() {
        const GL = Renderer.GetContext();
        GL.deleteShader(this.shader);
    }

    public GetHandle() {
        return this.shader!;
    }
}