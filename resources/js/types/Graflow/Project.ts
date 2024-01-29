import { Asset } from "@/Services/ProjectService";
import { GfElement, GfLayer } from "./Element";
import { GfTransformComponent } from "./Compoments";

export enum GfGraphType {
    GRAPH_2D
}

export type GfGraph = {
    type: GfGraphType
}

export type GfProjectFile = {
    version: string,
    graph: GfGraph,
    elements: GfElement[];
    transformComponents: GfTransformComponent[];
    assets: Asset[],
    layers: GfLayer[]
}