import Renderer from "../Renderer";
import ShaderProgram from "../ShaderProgram/ShaderProgram";
import { GLType, GetSizeOfGLType } from "../../Types/Enums";


export type UniformBufferData = {
    name : string,
    type : GLType
}

export default class UniformBuffer {
    private uniformBuffer : WebGLBuffer | null = null;
    private ubIndex : number = -1;
    private bufferData : Map<string, number> = new Map<string, number>();

    public constructor(program : ShaderProgram, name :string, binding : number, data : UniformBufferData[]) {
        const gl = Renderer.GetContext();
        this.uniformBuffer = gl.createBuffer();
        if (this.uniformBuffer === null) {
            Renderer.Error("Failed to create uniform buffer.");
            return;
        }
            
        this.ubIndex = gl.getUniformBlockIndex(program.GetHandle(), name);
        if (this.ubIndex === gl.INVALID_INDEX) {
            Renderer.Error("ShaderProgram does not contain an uniform block named " + name);
            return;
        }

        gl.uniformBlockBinding(program.GetHandle(), this.ubIndex, binding);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, this.ubIndex, this.uniformBuffer);
        let size = 0;
        for (let i = 0; i < data.length; i++) {
            this.bufferData.set(data[i].name, size);
            size += GetSizeOfGLType(data[i].type);
        }
        gl.bufferData(gl.UNIFORM_BUFFER, size, gl.DYNAMIC_DRAW);
    }

    public WriteUniform(name : string, data : BufferSource) {
        const gl = Renderer.GetContext();
        const offset = this.bufferData.get(name);
        if (offset === undefined) {
            Renderer.Error("Attemp to write to invalid uniform " + name);
            return;
        }
        this.Bind();
        gl.bufferSubData(gl.UNIFORM_BUFFER, offset, data);
        return;
    }

    public Bind() {
        const gl = Renderer.GetContext();
        gl.bindBufferBase(gl.UNIFORM_BUFFER, this.ubIndex, this.uniformBuffer);
    }

    public Delete() {
        const gl = Renderer.GetContext();
        gl.deleteBuffer(this.uniformBuffer);
    }
}