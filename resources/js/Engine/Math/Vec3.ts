export default class Vec3 {
    public value : Float32Array;

    public constructor(x : number = 0.0, y : number = 0.0, z : number = 0.0) {
        this.value = new Float32Array([x, y, z]);
    }

    public Equals(other : Vec3) : boolean {
        return (this.value[0] === other.value[0] && this.value[1] === other.value[1] && this.value[2] === other.value[2]);
    }

    public Sum(other : Vec3) : Vec3 {
        return new Vec3(this.value[0] + other.value[0], this.value[1] + other.value[1], this.value[2] + other.value[2]);
    }

    public Subtract(other : Vec3) : Vec3 {
        return new Vec3(this.value[0] - other.value[0], this.value[1] - other.value[1], this.value[2] - other.value[2]);
    }

    public Multiply(other : Vec3) {
        return new Vec3(this.value[0] * other.value[0], this.value[1] * other.value[1], this.value[2] * other.value[2]);
    }

    public ScalarMultiply(scalar : number) {
        return new Vec3(scalar * this.value[0], scalar * this.value[1], scalar * this.value[2]);
    }
}