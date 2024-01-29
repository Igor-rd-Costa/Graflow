import Vec3 from "@/Engine/Math/Vec3";
    
export enum GfComponentType {
    TRANSFORM_COMPONENT
}

export class GfComponent {
    public type: GfComponentType;
    public uuid: string;
    
    public constructor(hash : string, type : GfComponentType) {
        this.uuid = hash;
        this.type = type;
    }
};

export class GfTransformComponent extends GfComponent {
    public position : Vec3 = new Vec3(0.0, 0.0, 0.0);
    public rotation : Vec3 = new Vec3(0.0, 0.0, 0.0);
    public scale : Vec3 = new Vec3(1.0, 1.0, 1.0);
    
    public constructor(hash : string) {
        super(hash, GfComponentType.TRANSFORM_COMPONENT);
    }
}