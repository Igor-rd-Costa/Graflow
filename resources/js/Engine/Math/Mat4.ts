export default class Mat4 {
    public value = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ]);
    
    
    public constructor() {
        
    }
    
    public Equals(other : Mat4) : boolean {
        return (
            this.value[0]  === other.value[0]  && this.value[1]  === other.value[1]  && 
            this.value[2]  === other.value[2]  && this.value[3]  === other.value[3]  &&
            this.value[4]  === other.value[4]  && this.value[5]  === other.value[5]  && 
            this.value[6]  === other.value[6]  && this.value[7]  === other.value[7]  &&
            this.value[8]  === other.value[8]  && this.value[9]  === other.value[9]  && 
            this.value[10] === other.value[10] && this.value[11] === other.value[11] &&
            this.value[12] === other.value[12] && this.value[13] === other.value[13] && 
            this.value[14] === other.value[14] && this.value[15] === other.value[15]
            );
    }
    
    public Sum(other : Mat4) : Mat4 {
        const mat4 = new Mat4;
        mat4.value = new Float32Array([
            this.value[0] + other.value[0], this.value[1] + other.value[1], this.value[2] + other.value[2], this.value[3] + other.value[3],
            this.value[4] + other.value[4], this.value[5] + other.value[5], this.value[6] + other.value[6], this.value[7] + other.value[7],
            this.value[8] + other.value[8], this.value[9] + other.value[9], this.value[10] + other.value[10], this.value[11] + other.value[11],
            this.value[12] + other.value[12], this.value[13] + other.value[13], this.value[14] + other.value[14], this.value[15] + other.value[15],
        ]);
        return mat4;
    }
    
    public Subtract(other : Mat4) : Mat4 {
        const mat4 = new Mat4;
        mat4.value = new Float32Array([
            this.value[0] - other.value[0], this.value[1] - other.value[1], this.value[2] - other.value[2], this.value[3] - other.value[3],
            this.value[4] - other.value[4], this.value[5] - other.value[5], this.value[6] - other.value[6], this.value[7] - other.value[7],
            this.value[8] - other.value[8], this.value[9] - other.value[9], this.value[10] - other.value[10], this.value[11] - other.value[11],
            this.value[12] - other.value[12], this.value[13] - other.value[13], this.value[14] - other.value[14], this.value[15] - other.value[15],
        ]);
        return mat4;
    }
    
    public ScalarMultiply(scalar : number) : Mat4 {
        const mat4 = new Mat4;
        mat4.value = new Float32Array([
            scalar * this.value[0], scalar * this.value[1], scalar * this.value[2], scalar * this.value[3],
            scalar * this.value[4], scalar * this.value[5], scalar * this.value[6], scalar * this.value[7],
            scalar * this.value[8], scalar * this.value[9], scalar * this.value[10], scalar * this.value[11],
            scalar * this.value[12], scalar * this.value[13], scalar * this.value[14], scalar * this.value[15],
        ])
        return mat4;
    }
    
    public Multiply(other : Mat4) : Mat4 {
        const mat4 = new Mat4;
        mat4.value = new Float32Array([
            ((this.value[0] * other.value[0]) + (this.value[1] * other.value[4]) + (this.value[2] * other.value[8])  + (this.value[3] * other.value[12])),
            ((this.value[0] * other.value[1]) + (this.value[1] * other.value[5]) + (this.value[2] * other.value[9])  + (this.value[3] * other.value[13])),
            ((this.value[0] * other.value[2]) + (this.value[1] * other.value[6]) + (this.value[2] * other.value[10]) + (this.value[3] * other.value[14])),
            ((this.value[0] * other.value[3]) + (this.value[1] * other.value[7]) + (this.value[2] * other.value[11]) + (this.value[3] * other.value[15])),
            
            ((this.value[4] * other.value[0]) + (this.value[5] * other.value[4]) + (this.value[6] * other.value[8])  + (this.value[7] * other.value[12])),
            ((this.value[4] * other.value[1]) + (this.value[5] * other.value[5]) + (this.value[6] * other.value[9])  + (this.value[7] * other.value[13])),
            ((this.value[4] * other.value[2]) + (this.value[5] * other.value[6]) + (this.value[6] * other.value[10]) + (this.value[7] * other.value[14])),
            ((this.value[4] * other.value[3]) + (this.value[5] * other.value[7]) + (this.value[6] * other.value[11]) + (this.value[7] * other.value[15])),
            
            ((this.value[8] * other.value[0]) + (this.value[9] * other.value[4]) + (this.value[10] * other.value[8])  + (this.value[11] * other.value[12])),
            ((this.value[8] * other.value[1]) + (this.value[9] * other.value[5]) + (this.value[10] * other.value[9])  + (this.value[11] * other.value[13])),
            ((this.value[8] * other.value[2]) + (this.value[9] * other.value[6]) + (this.value[10] * other.value[10]) + (this.value[11] * other.value[14])),
            ((this.value[8] * other.value[3]) + (this.value[9] * other.value[7]) + (this.value[10] * other.value[11]) + (this.value[11] * other.value[15])),
            
            ((this.value[12] * other.value[0]) + (this.value[13] * other.value[4]) + (this.value[14] * other.value[8])  + (this.value[15] * other.value[12])),
            ((this.value[12] * other.value[1]) + (this.value[13] * other.value[5]) + (this.value[14] * other.value[9])  + (this.value[15] * other.value[13])),
            ((this.value[12] * other.value[2]) + (this.value[13] * other.value[6]) + (this.value[14] * other.value[10]) + (this.value[15] * other.value[14])),
            ((this.value[12] * other.value[3]) + (this.value[13] * other.value[7]) + (this.value[14] * other.value[11]) + (this.value[15] * other.value[15])),
        ]);
        return mat4;
    }
}