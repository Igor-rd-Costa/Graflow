import { GfComponentType, GfTransformComponent } from "@/Types/Graflow/Compoments";
import ProjectService from "./ProjectService";
import axios from "axios";
import { GfTransformComponentField } from "@/Types/Graflow/Element";
import ElementService from "./ElementService";




export default class ComponentService {

    public static GetTranformComponent(uuid : string) {
        const components = ProjectService.GetTransformComponents();
        let comp : GfTransformComponent | null = null;
        for (let i = 0; i < components.length; i++) {
            if (components[i].uuid === uuid) {
                comp = components[i];
                break;
            }
        }
        return comp;
    }

    public static async AddComponent(type : GfComponentType) {
        const selectedElement = ElementService.GetSelectedElement();
        if (selectedElement === null)
            return false;

        selectedElement.components.forEach(component => {
            if (component.type === type) {
                console.warn("Selected element already has a component of this type.");
                return false;
            }
        })

        const result = (await axios.post<GfTransformComponent|false>(route('component.store'), {projId: ProjectService.GetId(), elementId: selectedElement.uuid, type})).data;
        if (result !== false) {
            selectedElement.components.push({uuid: result.uuid, type: result.type});
            ProjectService.GetTransformComponents().push(result);
        }

        return result;
    }

    public static async UpdateComponent(compId : string, field : GfTransformComponentField, newVal : any) {
        //TODO prob make individual function for each component type
        const result = (await axios.patch(route('component.update'), {projId: ProjectService.GetId(), compId: compId, compField: field, newVal: newVal })).data;
        if (result) {
            const components = ProjectService.GetTransformComponents();
            for (let i = 0; i < components.length; i++) {
                if (components[i].uuid === compId) {
                    switch(field) {
                        case GfTransformComponentField.POSITION_FIELD: {
                            components[i].position = newVal;
                        } break;
                        case GfTransformComponentField.ROTATION_FIELD: {
                            components[i].rotation = newVal;
                        } break;
                        case GfTransformComponentField.SCALE_FIELD: {
                            components[i].scale = newVal;
                        } break;
                    }
                    return;
                }
            }
        }
    }
}