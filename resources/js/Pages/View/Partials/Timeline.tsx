import TimelineContextMenu, { TimelineContextMenuCallbacks } from "@/Components/View/Timeline/ContextMenus/TimelineContextMenu";
import TimelineElementContextMenu, { ElementContextMenuCallbacks } from "@/Components/View/Timeline/ContextMenus/TimelineElementContextMenu";
import EmptyTimelineLayer from "@/Components/View/Timeline/EmptyTimelineLayer";
import TimeRuler from "@/Components/View/Timeline/TimeRuler";
import TimelineDivisions from "@/Components/View/Timeline/TimelineDivisions";
import TimelineLayer from "@/Components/View/Timeline/TimelineLayer";
import ElementService from "@/Services/ElementService";
import ProjectService from "@/Services/ProjectService";
import { GfLayer } from "@/Types/Graflow/Element";
import { useEffect, useState } from "react";

export type TimelineState = {
    start : number,
    end : number,
    divisions: number
}

enum ContextMenuKind {
    CONTEXT_MENU, ELEMENT_CONTEXT_MENU
}

type ContextMenuInfo = {
    id: string,
    kind: ContextMenuKind,
    open: boolean,
    x: number,
    y: number
}

type TimelineProps = {
    isLoaded : boolean
}

let loaded = false;
export default function Timeline({ isLoaded } : TimelineProps) {
    const [ rulerState, SetRulerState ] = useState<TimelineState>({start: 0, end: 300, divisions: 15});
    const [layers, SetLayers ] = useState<JSX.Element[]>([<EmptyTimelineLayer key={0}></EmptyTimelineLayer>]);
    const [ contextMenuInfo, SetContextMenuInfo ] = useState<ContextMenuInfo>({id: '', kind: ContextMenuKind.CONTEXT_MENU, open: false, x: 0, y: 0});
    let selectedElement : Element | null = null;
    let zoomLevel = 1.0;
    let zoomIncrement = 0.1;
    let prevWidth = 0;
    let rulerWidth = 0;

    const timelineContextMenuCallbacks : TimelineContextMenuCallbacks = {
        onNewElement: OnCreateElement
    }

    const elementContextMenuCallbacks : ElementContextMenuCallbacks = {
        onDelete: () => {}
    }

    async function OnCreateElement() {
        let layerId = contextMenuInfo.id;
        if (layerId === "Empty") {
            layerId = await ProjectService.CreateLayer();
        }
        await ProjectService.AddElementToLayer(layerId);
        const layers = ProjectService.GetLayers();
        SetContextMenuInfo({id: '', kind: contextMenuInfo.kind, open: false, x: 0, y: 0});
        SetLayers(RenderLayers(layers));
    }

    async function OnGlobalMouseDown(event : MouseEvent) {
        if (event.target === null)
        return;

        const target = event.target as HTMLElement;

        if (target.closest("#timeline-context-menu"))
            return;

        if (contextMenuInfo.open === false)
            return;

        if (target.closest('#timeline-rows')) {
            if (event.button !== 2) {
                const row = target.closest('#timeline-row');
                if (row === null)
                    return;
                const layerId = row.getAttribute("data-layerid");
                if (layerId === null)
                    return;

                SetContextMenuInfo({id: layerId, kind: contextMenuInfo.kind, open: false, x: 0, y: 0});
            }
            return;
        }
        SetContextMenuInfo({id: '', kind: contextMenuInfo.kind, open: false, x: 0, y: 0});
    }

    useEffect(() => {
        document.addEventListener('mousedown', OnGlobalMouseDown);

        return () => {document.removeEventListener('mousedown', OnGlobalMouseDown)};
    })

    function HandleScroll(event : WheelEvent) {
        // down : + deltaY
        // up : - deltaY

        const timeline = document.getElementById('timeline-wrapper') as HTMLElement | null;
        const AdjustScrollPosition = () => {
            if (timeline) {
                const startX = timeline.getBoundingClientRect().x;
                const timelineWidth = timeline.getBoundingClientRect().width;
                const scrollLeft = timeline.scrollLeft;
                const mouseX = event.clientX - startX;
                const scrollWidth = timeline.scrollWidth;
                const mousePercent = mouseX / timelineWidth;
                
                timeline.scrollLeft = scrollLeft + ((scrollWidth - prevWidth) * mousePercent);
                prevWidth = timeline.scrollWidth;
            }
        }

        if (event.ctrlKey === true) {
            event.preventDefault();
            if (event.deltaY < 0) {
                if (zoomLevel !==  20.0) {
                    if ((zoomLevel + zoomIncrement) > 20.0)
                        zoomLevel = 20.0;
                    else 
                        zoomLevel += zoomIncrement;
                    
                    Zoom();
                    AdjustScrollPosition();

                    if (zoomLevel > 10)
                        zoomIncrement = 0.5;
                    else if (zoomLevel > 5)
                        zoomIncrement = 0.2;
                }
            } else {
                if (zoomLevel !==  1.0) {
                    if ((zoomLevel - zoomIncrement) < 1.0)
                        zoomLevel = 1.0;
                    else
                        zoomLevel -= zoomIncrement;
                    
                    Zoom();
                    //AdjustScrollPosition();

                    if (zoomLevel < 5)
                        zoomIncrement = 0.1;
                    else if (zoomLevel < 10)
                        zoomIncrement = 0.2;
                }
            }
            return;
        }

    }

    async function HandleDrop(event : React.DragEvent) {
        const target = event.target as HTMLElement;
        if (target.id !== 'timeline-row') {
            console.error("Drop target was not a timeline-row element");
            return;
        }

        let layerId = target.getAttribute('data-layerid');
        if (layerId === null) {
            return;
        }
        if (layerId === 'Empty') {
            layerId = await ProjectService.CreateLayer();
        }
        
        await ProjectService.AddElementToLayer(layerId);
        const layers = ProjectService.GetLayers();
        SetLayers(RenderLayers(layers));
    }

    const Zoom = () => {
        const timelineRuler = document.getElementById('timeline-ruler') as HTMLElement | null;
        const timelineDivisions = document.getElementById('timeline-divisions') as HTMLElement | null;
        const timelineRows = document.getElementById('timeline-rows') as HTMLElement | null;

        if (timelineRuler === null || timelineDivisions === null || timelineRows === null) {
            return;
        }
        
        timelineRuler.style.width = `${rulerWidth * zoomLevel}px`;
        timelineDivisions.style.width = `${rulerWidth * zoomLevel}px`;
        timelineRows.style.width = `${rulerWidth * zoomLevel}px`;
    }

    function OnMouseUp(event : React.MouseEvent) {
        if (event.button !== 2 || event.ctrlKey)
            return;

        const target = event.target as HTMLElement;
        if (target.closest('.timeline-element')) {
            SetContextMenuInfo({id: '', kind: ContextMenuKind.ELEMENT_CONTEXT_MENU, open: true, x: event.pageX, y: event.pageY});
            return;
        }
        
        const layer = target.closest("#timeline-row");
        if (layer === null)
            return;
        const layerId = layer.getAttribute('data-layerid');
        if (layerId === null)
            return;
        SetContextMenuInfo({id: layerId, kind: ContextMenuKind.CONTEXT_MENU, open: true, x: event.pageX, y: event.pageY});
    }

    function OnMouseDown(event : MouseEvent) {
        const target = event.target as HTMLElement | null;
        if (target === null)
            return;

        if (target.closest("#timeline-context-menu")) {
            return;
        }

        const element = target.closest('.timeline-element');
        if (selectedElement !== null) {
            selectedElement.classList.remove('timeline-element-selected');
        }
        if (element) {
            selectedElement = element;
            selectedElement.classList.add('timeline-element-selected');
        } else {
            if (selectedElement) {
                selectedElement = null;
                ElementService.SetSelectedElement(null);
            }
            return;
        }
        
        const uuid = selectedElement.getAttribute('data-uuid');
        ElementService.SetSelectedElement(uuid);
    }

    useEffect(() => {
        const timeline = document.getElementById('timeline');
        const ruler = document.getElementById('timeline-ruler');
        const timelineDivisions = document.getElementById('timeline-divisions') as HTMLElement | null;
        const rows = document.getElementById('timeline-rows') as HTMLElement | null;
        if (timeline === null || timelineDivisions === null || ruler === null || rows === null)
            return;

        rulerWidth = parseFloat(getComputedStyle(ruler).width);
        prevWidth = ruler.scrollWidth;
        timelineDivisions.style.width = `${rulerWidth}px`;
        rows.style.width = `${rulerWidth}px`;
        timeline.addEventListener('wheel', HandleScroll, {passive: false});
        timeline.addEventListener('mousedown', OnMouseDown, {passive: false});
    }, [])

    useEffect(() => {
        if (isLoaded && !loaded) {
            const layers = ProjectService.GetLayers();
            SetLayers(RenderLayers(layers));
            loaded = true;
        }
    }, [isLoaded]);

    function RenderLayers(layers : GfLayer[]) {

        if (layers.length === 0) {
            return [<EmptyTimelineLayer key={0}></EmptyTimelineLayer>];
        }
        
        let layerElements : JSX.Element[] = [];
        layers.forEach((lay, index) => {
            layerElements.push(<TimelineLayer key={index} elements={lay.elements} id={lay.id} onDrop={HandleDrop}></TimelineLayer>);
        });
        return layerElements;
    }

    function ShowContextMenu() {
        switch(contextMenuInfo.kind) {
            case ContextMenuKind.CONTEXT_MENU: {
                return <TimelineContextMenu layerId={contextMenuInfo.id} x={contextMenuInfo.x} y={contextMenuInfo.y} callbacks={timelineContextMenuCallbacks}></TimelineContextMenu>
            }
            case ContextMenuKind.ELEMENT_CONTEXT_MENU: {
                return <TimelineElementContextMenu x={contextMenuInfo.x} y={contextMenuInfo.y} callbacks={elementContextMenuCallbacks}></TimelineElementContextMenu>
            }
        }
    }

    function OnContextMenu(event: React.MouseEvent) {
        if (!event.ctrlKey){
            event.preventDefault();
        }
    }

    return (
        <>
        {contextMenuInfo.open && ShowContextMenu()}
        <section id="timeline" className='border min-h-[5rem] w-full h-full bg-gray-200 border-gray-500 rounded col-start-2 overflow-hidden'>
            <div id="timeline-wrapper" className="h-full relative overflow-scroll">
                <TimeRuler start={rulerState.start} end={rulerState.end} divisions={rulerState.divisions}/>
                <TimelineDivisions start={rulerState.start} end={rulerState.end} divisions={rulerState.divisions}/>
                <div id="timeline-rows" onMouseUp={OnMouseUp} onContextMenu={OnContextMenu} onDragOver={(e)=>{e.preventDefault()}} onDrop={HandleDrop} 
                style={{width: `${rulerWidth}px`, gridTemplateRows: `repeat(${1 + layers.length}, 5rem) auto`}} 
                className="grid min-w-full min-h-[calc(100%-2rem)] absolute top-8">
                        <EmptyTimelineLayer></EmptyTimelineLayer>
                        {layers}
                    <div className="h-[0.8rem] bg-white">
                </div>
                </div>
            </div>
        </section>
        </>
    )
}