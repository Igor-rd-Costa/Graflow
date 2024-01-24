import { GLType } from "./Enums";

export type VertexAttrib = { type: GLType, count: number, normalized: boolean, stride : number, offset : number }

export type ViewportSize = { width: number, height: number }