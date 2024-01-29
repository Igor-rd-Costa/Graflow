import ProjectService from "./ProjectService";
import axios from "axios";
import { GfElement } from "@/Types/Graflow/Element";
import { GfComponent, GfComponentType, GfTransformComponent } from "@/Types/Graflow/Compoments";


export type SelectionChangeCallback = (element : GfElement | null) => void;

export default class ElementService 
{
    private static selectedElement : GfElement | null = null;
    private static selectionChangeListeners : SelectionChangeCallback[] = [];

    public static SetSelectedElement(uuid : string | null) : void {
        let element : GfElement | null = null;
        if (uuid) {
            element = ProjectService.GetElement(uuid);
            this.selectedElement = element;
        }
        this.selectionChangeListeners.forEach(listener => listener(element));
    }

    public static GetSelectedElement() : GfElement | null {
        return this.selectedElement;
    }

    public static RegisterSelectionChangeListener(callback : SelectionChangeCallback) : void {
        if (!this.selectionChangeListeners.includes(callback))
            this.selectionChangeListeners.push(callback);
    }
}