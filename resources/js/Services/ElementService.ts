import { Graflow } from "@/types/GraflowTypes";
import ProjectService from "./ProjectService";
import { connected } from "process";
import axios from "axios";
import Vec3 from "@/Engine/Math/Vec3";


export type SelectionChangeCallback = (element : Graflow.Element | null) => void;

export default class ElementService 
{
    private static selectedElement : Graflow.Element | null = null;
    private static selectionChangeListeners : SelectionChangeCallback[] = [];

    public static SetSelectedElement(uuid : string | null) : void {
        let element : Graflow.Element | null = null;
        if (uuid === null) {
            this.selectedElement = null;
        } else {
            element = ProjectService.GetElement(uuid);
            this.selectedElement = element;
        }
        this.selectionChangeListeners.forEach(listener => listener(element));
    }

    public static GetSelectedElement() : Graflow.Element | null {
        return this.selectedElement;
    }

    public static RegisterSelectionChangeListener(callback : SelectionChangeCallback) : void {
        if (!this.selectionChangeListeners.includes(callback))
            this.selectionChangeListeners.push(callback);
    }

    public static async UpdateComponent(type : Graflow.ComponentType, field : Graflow.TransformComponentField, data : any) {
        if (this.selectedElement === null)
            return false;
        const result = (await axios.patch<boolean>(
            route('component.update'), {
                id: ProjectService.GetId(), 
                element: this.selectedElement.uuid, 
                type: type, 
                field: field, 
                value: data 
            }
        )).data;

        if (result) {
            const elements =ProjectService.GetElements();
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].uuid === this.selectedElement.uuid) {
                    elements[i].position = new Vec3(data[0], data[1], data[2]);
                }
            }
        }
        return result;
    }
}