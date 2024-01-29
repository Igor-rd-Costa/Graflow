export default class Mat4 extends Float32Array {
    public constructor(items? : number[]) {
        if (items === undefined) {
            super([
                1.0, 0.0, 0.0, 0.0, 
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            ]);
            return;
        }
        super([
            items[0], items[1], items[2], items[3],
            items[4], items[5], items[6], items[7],
            items[8], items[9], items[10], items[11],
            items[12], items[13], items[14], items[15]
        ]);
    }
    
    public Equals(other : Mat4) : boolean {
        return (
            this[0]  === other[0]  && this[1]  === other[1]  && 
            this[2]  === other[2]  && this[3]  === other[3]  &&
            this[4]  === other[4]  && this[5]  === other[5]  && 
            this[6]  === other[6]  && this[7]  === other[7]  &&
            this[8]  === other[8]  && this[9]  === other[9]  && 
            this[10] === other[10] && this[11] === other[11] &&
            this[12] === other[12] && this[13] === other[13] && 
            this[14] === other[14] && this[15] === other[15]
            );
    }
    
    public Sum(other : Mat4) : Mat4 {
        const mat4 = new Mat4([
            this[0] + other[0], this[1] + other[1], this[2] + other[2], this[3] + other[3],
            this[4] + other[4], this[5] + other[5], this[6] + other[6], this[7] + other[7],
            this[8] + other[8], this[9] + other[9], this[10] + other[10], this[11] + other[11],
            this[12] + other[12], this[13] + other[13], this[14] + other[14], this[15] + other[15],
        ]);
        return mat4;
    }
    
    public Subtract(other : Mat4) : Mat4 {
        const mat4 = new Mat4([
            this[0] - other[0], this[1] - other[1], this[2] - other[2], this[3] - other[3],
            this[4] - other[4], this[5] - other[5], this[6] - other[6], this[7] - other[7],
            this[8] - other[8], this[9] - other[9], this[10] - other[10], this[11] - other[11],
            this[12] - other[12], this[13] - other[13], this[14] - other[14], this[15] - other[15],
        ]);
        return mat4;
    }
    
    public ScalarMultiply(scalar : number) : Mat4 {
        const mat4 = new Mat4([
            scalar * this[0], scalar * this[1], scalar * this[2], scalar * this[3],
            scalar * this[4], scalar * this[5], scalar * this[6], scalar * this[7],
            scalar * this[8], scalar * this[9], scalar * this[10], scalar * this[11],
            scalar * this[12], scalar * this[13], scalar * this[14], scalar * this[15],
        ])
        return mat4;
    }
    
    public Multiply(other : Mat4) : Mat4 {
        const mat4 = new Mat4([
            ((this[0] * other[0]) + (this[1] * other[4]) + (this[2] * other[8])  + (this[3] * other[12])),
            ((this[0] * other[1]) + (this[1] * other[5]) + (this[2] * other[9])  + (this[3] * other[13])),
            ((this[0] * other[2]) + (this[1] * other[6]) + (this[2] * other[10]) + (this[3] * other[14])),
            ((this[0] * other[3]) + (this[1] * other[7]) + (this[2] * other[11]) + (this[3] * other[15])),
            
            ((this[4] * other[0]) + (this[5] * other[4]) + (this[6] * other[8])  + (this[7] * other[12])),
            ((this[4] * other[1]) + (this[5] * other[5]) + (this[6] * other[9])  + (this[7] * other[13])),
            ((this[4] * other[2]) + (this[5] * other[6]) + (this[6] * other[10]) + (this[7] * other[14])),
            ((this[4] * other[3]) + (this[5] * other[7]) + (this[6] * other[11]) + (this[7] * other[15])),
            
            ((this[8] * other[0]) + (this[9] * other[4]) + (this[10] * other[8])  + (this[11] * other[12])),
            ((this[8] * other[1]) + (this[9] * other[5]) + (this[10] * other[9])  + (this[11] * other[13])),
            ((this[8] * other[2]) + (this[9] * other[6]) + (this[10] * other[10]) + (this[11] * other[14])),
            ((this[8] * other[3]) + (this[9] * other[7]) + (this[10] * other[11]) + (this[11] * other[15])),
            
            ((this[12] * other[0]) + (this[13] * other[4]) + (this[14] * other[8])  + (this[15] * other[12])),
            ((this[12] * other[1]) + (this[13] * other[5]) + (this[14] * other[9])  + (this[15] * other[13])),
            ((this[12] * other[2]) + (this[13] * other[6]) + (this[14] * other[10]) + (this[15] * other[14])),
            ((this[12] * other[3]) + (this[13] * other[7]) + (this[14] * other[11]) + (this[15] * other[15])),
        ]);
        return mat4;
    }
}