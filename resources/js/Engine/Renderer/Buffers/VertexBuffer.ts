import Renderer from "../Renderer";
import { GLBufferUsage } from "../../Types/Enums";




export default class VertexBuffer {
    private buffer : WebGLBuffer | null = null;

    public constructor(data : Float32Array, usage : GLBufferUsage) {
        const GL = Renderer.GetContext();
        this.buffer = GL.createBuffer();
        if (this.buffer === null) {
            Renderer.Error("Failed to create vertex buffer.");
            return;
        }
        this.Bind();
        GL.bufferData(GL.ARRAY_BUFFER, data, usage);
    }

    public Unbind() {
        const GL = Renderer.GetContext();
        GL.bindBuffer(GL.VERTEX_SHADER, null);
    }

    public Bind() {
        const GL = Renderer.GetContext();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.buffer);
    }

    public Delete() {
        const GL = Renderer.GetContext();
        GL.deleteBuffer(this.buffer);
    }
}