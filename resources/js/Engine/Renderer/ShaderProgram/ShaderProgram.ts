import Renderer from "../Renderer";
import { GLShaderType } from "../../Types/Enums";
import Shader from "./Shader";




export default class ShaderProgram {
    private program : WebGLProgram | null = null;

    public constructor(vertShader : Shader, fragShader : Shader) {
        const GL = Renderer.GetContext();
        this.program = GL.createProgram();

        if (this.program === null) {
            Renderer.Error("Failed to create shader program.");
            return;
        }

        GL.attachShader(this.program, vertShader.GetHandle());
        GL.attachShader(this.program, fragShader.GetHandle());

        GL.linkProgram(this.program);
    }
    
    public Bind() {
        const GL = Renderer.GetContext();
        GL.useProgram(this.program);
    }

    public GetHandle() {
        return this.program!;
    }

    public static Create(vertFile : string, fragFile : string) {
        const GL = Renderer.GetContext();
        const vertShader = new Shader(GLShaderType.VERTEX, vertFile);
        const fragShader = new Shader(GLShaderType.FRAGMENT, fragFile);
        const program = new ShaderProgram(vertShader, fragShader);
        vertShader.Delete();
        fragShader.Delete();
        
        return program;
    }
}