import Vec3 from "@/Engine/Math/Vec3";
import { GfComponent } from "./Compoments";


export type GfElement = {
    start : number,
    duration : number,
    components: GfComponent[];
    uuid: string
}

export type GfLayer = {
    id: string,
    elements : string[]
}

export enum GfTransformComponentField {
    POSITION_FIELD, ROTATION_FIELD, SCALE_FIELD
}