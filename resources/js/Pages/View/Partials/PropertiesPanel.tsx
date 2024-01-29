import TransformComponent from "@/Components/View/PropertiesPanel/Components/TransformComponent";
import PropertiesPanelContextMenu from "@/Components/View/PropertiesPanel/ContextMenus/PropertiesPanelContextMenu";
import PropertiesPanelListItem from "@/Components/View/PropertiesPanel/ContextMenus/PropertiesPanelListItem";
import ComponentService from "@/Services/ComponentService";
import ElementService from "@/Services/ElementService"
import ProjectService from "@/Services/ProjectService";
import { GfComponentType } from "@/Types/Graflow/Compoments";
import { GfElement } from "@/Types/Graflow/Element";
import { useEffect, useState } from "react";


type Properties = {
    name: string,
    uuid: string,
}

enum ContextMenuKind {
    CONTEXT_MENU, COMPONENT_CONTEXT_MENU
}

type ContextMenuInfo = {
    kind: ContextMenuKind,
    open: boolean,
    x: number,
    y: number
}

export default function PropertiesPanel() {
    const [ properties, SetProperties ] = useState<Properties | null>(null);
    const [ components, SetComponents ] = useState<JSX.Element[]>([]);
    const [ contextMenuInfo, SetContextMenuInfo ] = useState<ContextMenuInfo>({kind: ContextMenuKind.CONTEXT_MENU, open: false, x: 0, y: 0});

    async function AddTransformComponent() {
        const result = await ComponentService.AddComponent(GfComponentType.TRANSFORM_COMPONENT);
        if (result !== false) {
            let comps : JSX.Element[] = [];
            components.forEach(component => {
                comps.push(component);
            });
            comps.push(<TransformComponent key={components.length} id={result.uuid} transforms={{position: result.position, rotation: result.rotation, scale: result.scale}}></TransformComponent>)
            SetComponents(comps);
        }
        SetContextMenuInfo({kind: contextMenuInfo.kind, open: false, x: 0, y: 0});
    }

    useEffect(() => {
        ElementService.RegisterSelectionChangeListener(OnElementSelectionChange);
    }, [])

    useEffect(() => {
        document.addEventListener('click', OnGlobalMouseDown);

        return ()=> {document.removeEventListener('click', OnGlobalMouseDown)};
    }, [])

    function OnElementSelectionChange(element : GfElement | null) {
        let prop : Properties | null = null;
        if (element === null) {
            SetComponents([]);
            SetProperties(prop);
            return;
        }
        prop = {name: "New Element", uuid: element.uuid };
        let comps : JSX.Element[] = [];
        element.components.forEach((component, index) => {
            const comp = ProjectService.FindComponent(component);
            if (comp !== null) {
                switch(comp.type) {
                    case GfComponentType.TRANSFORM_COMPONENT: {
                        comps.push(<TransformComponent key={index} id={comp.uuid} transforms={{position: comp.position, rotation: comp.rotation, scale: comp.scale}}></TransformComponent>)
                    } break;
                }
            }
        })
        SetComponents(comps);
        SetProperties(prop);
    }
    
    function OnGlobalMouseDown(event : MouseEvent) {
        if (event.target === null)
            return;

        const target = event.target as HTMLElement;

        if (target.closest("#properties-panel-context-menu"))
            return;

        if (event.button !== 2) {
            if (contextMenuInfo.open)
                SetContextMenuInfo({kind: contextMenuInfo.kind, open: false, x: 0, y: 0});       
        }
    }

    function OnMouseUp(event : React.MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.id !== "properties-panel")
            return;

        if (event.button === 2 && properties !== null) {
            SetContextMenuInfo({kind: ContextMenuKind.CONTEXT_MENU, open: true, x: event.pageX, y: event.pageY});
        }
    }

    function OnContextMenu(event : React.MouseEvent) {
        if (!event.ctrlKey && properties !== null){
            event.preventDefault();
        }
    }

    return (
        <>
            {contextMenuInfo.open && 
            <PropertiesPanelContextMenu isChild={false} x={contextMenuInfo.x + 5} y={contextMenuInfo.y + 5}>
                <PropertiesPanelListItem text="Add Component">
                    <PropertiesPanelContextMenu isChild={true} x={0} y={2}>
                        <PropertiesPanelListItem onClick={AddTransformComponent} text="Transform Component"></PropertiesPanelListItem>
                    </PropertiesPanelContextMenu>
                </PropertiesPanelListItem>
            </PropertiesPanelContextMenu>}
            <section onMouseUp={OnMouseUp} onContextMenu={OnContextMenu} id="properties-panel" className="bg-gray-200 border border-gray-500 rounded row-span-2 w-[285px]">
            <div className="border-b bg-white rounded-t pl-2 h-[25px] border-gray-300 text-turquoise-500">Properties</div>
            <div className="border-b border-gray-300 shadow">
            {properties !== null &&
            <>
                <div id="element-basic-info" className="pl-2 pt-2 bg-white grid grid-cols-[2.5rem_1fr] grid-rows-[1.25rem_1.25rem_1rem] text-sm">
                    <img className="w-[2.5rem] h-[2.5rem]"></img>
                    <div className="pl-2 col-start-2 row-start-1">
                        <span className="text-turquoise-500 select-none">Name:</span>
                        <span className="pl-1">{properties.name}</span>
                    </div>
                </div>
                {components}
            </>
             }
            </div>
            </section>
        </>
    )
}