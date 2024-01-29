import ProjectService from "./ProjectService";
import axios from "axios";
import { GfElement, GfTransformComponentField } from "@/Types/Graflow/Element";
import { GfComponentType } from "@/Types/Graflow/Compoments";


export type SelectionChangeCallback = (element : GfElement | null) => void;

export default class ElementService 
{
    private static selectedElement : GfElement | null = null;
    private static selectionChangeListeners : SelectionChangeCallback[] = [];

    public static SetSelectedElement(uuid : string | null) : void {
        let element : GfElement | null = null;
        if (uuid === null) {
            this.selectedElement = null;
        } else {
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

    public static async AddComponent(type : GfComponentType) {
        if (this.selectedElement === null)
            return;

        this.selectedElement.components.forEach(component => {
            if (component.type === type) {
                console.warn("Selected element already has a component of this type.");
                return;
            }
        })

        const result = await axios.post(route('component.store'), {projId: ProjectService.GetId(), elementId: this.selectedElement.uuid, type});
    }
}