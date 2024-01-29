import Mat4 from "./Mat4";
import Vec3 from "./Vec3";


export namespace GFMath {

    export function Radians(angle : number) {
        return angle * ( Math.PI / 180);
    }

    export function Translate(offset : Vec3) : Mat4 {
        const m = new Mat4;
        m[12] += offset[0];
        m[13] += offset[1];
        m[14] += offset[2];
        
        return m;
    }

    export function RotateX(angle: number) {
        const m = new Mat4;
        const a = angle;
        const c = Math.cos(a);
        const s = Math.sin(a);

        m[5] = c;
        m[6] = s;
        m[9] = -s;
        m[10] = c;
        return m;
    }

    export function RotateY(angle: number) {
        
    }

    export function RotateZ(angle: number) {
        const m = new Mat4;
        const a = angle;
        const c = Math.cos(a);
        const s = Math.sin(a);

        m[0] = c;
        m[1] = s;
        m[4] = -s;
        m[5] = c;

        return m;
    }

    export function Scale(offset : Vec3) : Mat4 {
        const m = new Mat4;
        m[0] *= offset[0];
        m[5] *= offset[1];
        m[10] *= offset[2];
        
        return m;
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