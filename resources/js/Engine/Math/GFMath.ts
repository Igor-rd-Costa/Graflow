import Mat4 from "./Mat4";
import Vec3 from "./Vec3";


export namespace GFMath {

    export function Radians(angle : number) {
        return angle * ( Math.PI / 180);
    }
    
    export function Translate(mat4 : Mat4, offset : Vec3) : Mat4 {
        const newMat4 = mat4;
        newMat4.value[12] += offset.value[0];
        newMat4.value[13] += offset.value[1];
        newMat4.value[14] += offset.value[2];
        
        return newMat4;
    }

    export function Rotate(mat4 : Mat4, angle : number, axis : Vec3) : Mat4 {
        const newMat4 = mat4;

        const a = angle;
        const c = Math.cos(a);
        const s = Math.sin(a);

        //TODO add support for other  axys when adding 3D
        //z axis
        mat4.value[0] = c;
        mat4.value[1] = s;
        mat4.value[4] = -s;
        mat4.value[5] = c;

        return newMat4;
    }

    export function Scale(mat4 : Mat4, offset : Vec3) : Mat4 {
        const newMat4 = mat4;
        newMat4.value[0] *= offset.value[0];
        newMat4.value[5] *= offset.value[1];
        newMat4.value[10] *= offset.value[2];
        
        return newMat4;
    }

    export function Ortho(left : number, right : number, top : number, bottom : number, near : number, far : number) {
        let m = new Mat4();
        
        m.value[0] = 2 / (right - left);
        m.value[5] = 2 / (top - bottom);
        m.value[10] = -2 / (far - near);

        m.value[12] = -((right + left) / (right - left));
        m.value[13] = -((top + bottom) / (top - bottom));
        m.value[14] = -((far + near) / (far - near));

        return m;
    }
}