import Renderer from "../Renderer";





export default class Texture {
    private texture : WebGLTexture | null = null;

    public constructor(buffer : ArrayBuffer, type : string) {
        const gl = Renderer.GetContext();
        this.texture = gl.createTexture();
        if (this.texture === null) {
            Renderer.Error("Failed to create create texture.");
        }
        
        const image = new Image();
        const blob = new Blob([new Uint8Array(buffer)], { type: type });
        image.src = URL.createObjectURL(blob);
        image.onload = this.OnLoad.bind(this);
    }

    OnLoad(event : Event) {
        const img = event.target as HTMLImageElement;
        const gl = Renderer.GetContext();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, img.width, img.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);

        URL.revokeObjectURL(img.src);
    }


    public Delete() {
        const gl = Renderer.GetContext();
        gl.deleteTexture(this.texture);
    }
}