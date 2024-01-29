export default class Vec3 extends Float32Array {
    public constructor(x : number = 0.0, y : number = 0.0, z : number = 0.0) {
        super([x, y, z]);
    }

    
    public get x() : number {
        return this[0];
    }

    public get y() : number {
        return this[1];
    }

    public get z() : number {
        return this[2];
    }
    

    public Equals(other : Vec3) : boolean {
        return (this[0] === other[0] && this[1] === other[1] && this[2] === other[2]);
    }

    public Sum(other : Vec3) : Vec3 {
        return new Vec3(this[0] + other[0], this[1] + other[1], this[2] + other[2]);
    }

    public Subtract(other : Vec3) : Vec3 {
        return new Vec3(this[0] - other[0], this[1] - other[1], this[2] - other[2]);
    }

    public Multiply(other : Vec3) {
        return new Vec3(this[0] * other[0], this[1] * other[1], this[2] * other[2]);
    }

    public ScalarMultiply(scalar : number) {
        return new Vec3(scalar * this[0], scalar * this[1], scalar * this[2]);
    }
}