import axios from "axios";
import { GLBufferUsage, GLType, Key } from "../Types/Enums";
import ShaderProgram from "./ShaderProgram/ShaderProgram";
import VertexBuffer from "./Buffers/VertexBuffer";
import IndexBuffer from "./Buffers/IndexBuffer";
import VertexArray from "./Buffers/VertexArray";
import Mat4 from "../Math/Mat4";
import UniformBuffer from "./Buffers/UniformBuffer";
import { GFMath } from "../Math/GFMath";
import Input from "../Input";
import Camera from "../Cameras/Camera";
import Vec3 from "../Math/Vec3";
import { ViewportSize } from "../Types/Types";
import ProjectService from "@/Services/ProjectService";
import { GfElement } from "@/Types/Graflow/Element";
import { GfComponentType } from "@/Types/Graflow/Compoments";
import ComponentService from "@/Services/ComponentService";

export default class Renderer {
    private static gl : WebGL2RenderingContext;
    private static viewportSize : ViewportSize = { width: 1280, height: 720 };
    private static transformsUB : UniformBuffer;
    private static zoomLevel = 5;
    public static shaders = new Map<string, string>();

    public static GetContext() {
        return this.gl;
    }

    public static async Init() : Promise<boolean> {
        const canvas = document.getElementById('viewport') as HTMLCanvasElement | null;
        if (canvas === null) {
            this.Error("Could not find viewport.");
            return false;
        }

        const wrapper = document.getElementById('viewport-wrapper') as HTMLElement;
        const width = parseInt(getComputedStyle(wrapper).width);
        const height = parseInt(getComputedStyle(wrapper).height);
        this.viewportSize.width = width;
        this.viewportSize.height = height;

        canvas.width = width;
        canvas.height = height;

        const contextAttribs : WebGLContextAttributes = {
            alpha: true,
            depth: true,
            stencil: true,
            antialias: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false,
            desynchronized: false
        };  

        const cntxt = canvas.getContext('webgl2', contextAttribs);
        if (cntxt === null) {
            this.Error("Failed to initialize WebGL context.");
            return false;
        }

        this.gl = cntxt;
        this.gl.clearColor(0.3, 0.3, 0.3, 1);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        await this.LoadShaders();

        window.addEventListener('resize', this.HandleResize.bind(this));

        const shaderProgram = ShaderProgram.Create('default.vert', 'default.frag');
        const programHandle = shaderProgram.GetHandle();
        if (programHandle === null) {
            return false;
        }

        shaderProgram.Bind();
        const quad = [
            -0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0,
             0.5, -0.5, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
             0.5,  0.5, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
            -0.5,  0.5, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0,        
        ];

        const indices = [
            0, 1, 2,
            2, 3, 0
        ];

        const vertArray = new VertexArray();
        const vertBuffer = new VertexBuffer(new Float32Array(quad), GLBufferUsage.STATIC_DRAW);
        const indexBuffer = new IndexBuffer(new Int32Array(indices), GLBufferUsage.STATIC_DRAW);

        vertArray.SetVertexAttribs([
            {name: 'vPosition', info: { type: GLType.FLOAT, count: 3, normalized: false, stride: 8 * Float32Array.BYTES_PER_ELEMENT, offset: 0}},
            {name: 'vColor', info: { type: GLType.FLOAT, count: 3, normalized: false, stride: 8 * Float32Array.BYTES_PER_ELEMENT, offset: 3 * Float32Array.BYTES_PER_ELEMENT}},
            {name: 'vTexCoord', info: { type: GLType.FLOAT, count: 2, normalized: false, stride: 8 * Float32Array.BYTES_PER_ELEMENT, offset: 6 * Float32Array.BYTES_PER_ELEMENT}},
        ]);

        vertArray.EnableAttribs(programHandle);

        this.transformsUB = new UniformBuffer(shaderProgram, "Transforms", 0, [
            { name: 'viewProj', type: GLType.MAT4 },
            { name: 'model', type: GLType.MAT4 }
        ]);
        
        const aspect = (this.viewportSize.width / this.viewportSize.height);
        this.transforms.proj = GFMath.Ortho(-aspect * this.zoomLevel, aspect * this.zoomLevel, 1 * this.zoomLevel, -1 * this.zoomLevel, 0, 100);
        this.Loop();

        //----

        return true;
    }

    private static transforms = {
        proj: new Mat4(),
    }

    private static startTime = 0;
    private static deltaTime = 0;
    private static model : Mat4 = new Mat4;

    private static Loop() {
        if (this.gl === null) {
            return;
        }
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        const perfNow = performance.now();
        this.deltaTime = (perfNow - this.startTime) / 1000;
        this.startTime = perfNow;

        Camera.Update(this.deltaTime);

        const view = Camera.View();
        const viewProj = this.transforms.proj.Multiply(view);
        this.transformsUB.WriteUniform('viewProj', viewProj);
        
        // TODO:
        // Dynamic frame
        const elements = Renderer.GenerateFrameData(0);
        this.model = new Mat4;
        elements.forEach((element) => {
            element.components.forEach(component => {
                if (component.type === GfComponentType.TRANSFORM_COMPONENT) {
                    const comp = ComponentService.GetTranformComponent(component.uuid);
                    if (comp !== null) {
                        this.model = GFMath.Scale(comp.scale).Multiply(GFMath.RotateZ(GFMath.Radians(comp.rotation[2]))).Multiply(GFMath.Translate(comp.position));
                    }
                }
            })
            this.transformsUB.WriteUniform('model', this.model);

            this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_INT, 0);
        })
        

        Input.UpdateState();
        requestAnimationFrame(this.Loop.bind(this));
    }


    private static async LoadShaders() {
        this.shaders.set('default.vert', (await axios.get('/Shaders/default.vert', {responseType: 'text'})).data);
        this.shaders.set('default.frag', (await axios.get('/Shaders/default.frag', {responseType: 'text'})).data);
    }

    private static showTest = true;
    //TODO expand this. prob move it out of here
    private static GenerateFrameData(position : number) {
        const layers = ProjectService.GetLayers();
        const elements = ProjectService.GetElements();
        const renderedElements : GfElement[] = [];
        layers.forEach((layer) => {
            if (layer.elements.length === 0)
                return;
            layer.elements.forEach((elementUuid) => {
                (() => {
                    elements.forEach((item) => {
                        if(item.uuid === elementUuid) {
                            if (item.start <= position && (item.duration - item.start) >= position) {
                                renderedElements.push(item);
                            }
                        }
                    })
                })();
            })
        })

        return renderedElements;
    }

    private static HandleResize() {
        const wrapper = document.getElementById('viewport-wrapper') as HTMLElement | null;
        if (wrapper === null)
            return;

        const width = parseInt(getComputedStyle(wrapper).width);
        const height = parseInt(getComputedStyle(wrapper).height);
        if (this.viewportSize.width === width && this.viewportSize.height === height)
            return;

        this.ResizeViewport(width, height);
    }

    private static ResizeViewport(width : number, height : number) {
        if (this.gl === null) {
            this.Error("Viewport resize request on invalid context.");
            return;
        }
        const canvas = document.getElementById('viewport') as HTMLCanvasElement;
        canvas.width = width;
        canvas.height = height;
        this.gl.viewport(0, 0, width, height);
        const aspect = width / height;
        this.transforms.proj = GFMath.Ortho(-aspect * this.zoomLevel, aspect * this.zoomLevel, 1 * this.zoomLevel, -1 * this.zoomLevel, 0.0, 100.0);
    }

    public static Error(error : string) {
        console.error("[Renderer Error] " + error);
    }
}