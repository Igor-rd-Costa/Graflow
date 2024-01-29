import { GfTransformComponent } from "@/Types/Graflow/Compoments";
import ProjectService from "./ProjectService";
import axios from "axios";
import { GfTransformComponentField } from "@/Types/Graflow/Element";




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