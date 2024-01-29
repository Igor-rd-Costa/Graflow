import Mat4 from "./Mat4";
import Vec3 from "./Vec3";


export namespace GFMath {

    export function Radians(angle : number) {
        return angle * ( Math.PI / 180);
    }

    export function Translate(mat4 : Mat4, offset : Vec3) : Mat4 {
        const newMat4 = mat4;
        newMat4[12] += offset[0];
        newMat4[13] += offset[1];
        newMat4[14] += offset[2];
        
        return newMat4;
    }

    export function Rotate(mat4 : Mat4, angle : number, axis : Vec3) : Mat4 {
        const newMat4 = mat4;

        const a = angle;
        const c = Math.cos(a);
        const s = Math.sin(a);

        //TODO add support for other  axys when adding 3D
        //z axis
        mat4[0] = c;
        mat4[1] = s;
        mat4[4] = -s;
        mat4[5] = c;

        return newMat4;
    }

    export function Scale(mat4 : Mat4, offset : Vec3) : Mat4 {
        const newMat4 = mat4;
        newMat4[0] *= offset[0];
        newMat4[5] *= offset[1];
        newMat4[10] *= offset[2];
        
        return newMat4;
    }

    export function Ortho(left : number, right : number, top : number, bottom : number, near : number, far : number) {
        let m = new Mat4();
        
        m[0] = 2 / (right - left);
        m[5] = 2 / (top - bottom);
        m[10] = -2 / (far - near);

        m[12] = -((right + left) / (right - left));
        m[13] = -((top + bottom) / (top - bottom));
        m[14] = -((far + near) / (far - near));

        return m;
    }
}