import Renderer from "../Renderer";
import { GLBufferUsage } from "../../Types/Enums";




export default class IndexBuffer {
    private buffer : WebGLBuffer | null = null;

    public constructor(data : Int32Array, usage : GLBufferUsage) {
        const GL = Renderer.GetContext();
        this.buffer = GL.createBuffer();
        if (this.buffer === null) {
            Renderer.Error("Failed to create index buffer.");
            return;
        }
        this.Bind();
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, data, usage);
    }

    public Unbind() {
        const GL = Renderer.GetContext();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    }

    public Bind() {
        const GL = Renderer.GetContext();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.buffer);
    }

    public Delete() {
        const GL = Renderer.GetContext();
        GL.deleteBuffer(this.buffer);
    }
}