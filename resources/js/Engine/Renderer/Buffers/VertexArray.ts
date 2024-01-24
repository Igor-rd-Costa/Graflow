import Renderer from "../Renderer";
import { VertexAttrib } from "../../Types/Types";




export default class VertexArray {
    private vao : WebGLVertexArrayObject | null = null;
    private attribs = new Map<string, VertexAttrib>();  

    public constructor() {
        const GL = Renderer.GetContext();
        this.vao = GL.createVertexArray();
        if (this.vao === null) {
            Renderer.Error("Failed to create VAO.");
            return;
        }
        this.Bind();
    }

    public Bind() {
        const GL = Renderer.GetContext();
        GL.bindVertexArray(this.vao);
    }

    public Unbind() {
        const GL = Renderer.GetContext();
        GL.bindVertexArray(null);
    }

    public Delete() {
        const GL = Renderer.GetContext();
        GL.deleteVertexArray(this.vao);
    }

    public SetVertexAttribs(attributesInfo : {name: string, info: VertexAttrib}[]) {
        for (let i = 0; i < attributesInfo.length; i++) {
            this.attribs.set(attributesInfo[i].name, attributesInfo[i].info);
        }
    }

    public EnableAttribs(program : WebGLProgram) {
        const GL = Renderer.GetContext();
        this.attribs.forEach((attrib, name) => {
            const attribPos = GL.getAttribLocation(program, name);
            if (attribPos === -1) {
                Renderer.Error("Invalid vertex attribute name " + name + ".");
            } else {
                GL.vertexAttribPointer(attribPos, attrib.count, attrib.type, attrib.normalized, attrib.stride, attrib.offset);
                GL.enableVertexAttribArray(attribPos);
            }
        })
    }
}