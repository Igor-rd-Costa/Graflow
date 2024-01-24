import Vec3 from "@/Engine/Math/Vec3"

export namespace Graflow {

    export enum GraphType {
        GRAPH_2D
    }

    export type Graph = {
        type: GraphType
    }

    export type Element = {
        start : number,
        duration : number,
        position : Vec3,
        components: string[];
        uuid: string
    }

    export type FileElement = {
        start : number,
        duration : number,
        position : {x: number, y: number, z: number},
        components: string[];
        uuid: string
    }

    export type Layer = {
        id: string,
        elements : string[]
    }

    export enum ComponentType {
        TRANSFORM_COMPONENT
    }

    export enum TransformComponentField {
        POSITION_FIELD, ROTATION_FIELD, SCALE_FIELD
    }
}