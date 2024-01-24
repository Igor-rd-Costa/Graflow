import TimelineElement from "./TimelineElement";
import ProjectService from "@/Services/ProjectService";

type LayerProps = {
    id : string,
    elements: string[],
    onDrop: (e : React.DragEvent) => void,
}

export default function TimelineLayer({id, elements, onDrop} : LayerProps) {
    function HandleDragOver(event : React.DragEvent) {
        event.preventDefault();
    }
    
    return (
        <div onDragOver={HandleDragOver} id="timeline-row" className="flex border-b border-turquoise-200 relative h-full w-full" data-layerid={id}>
            {elements.map((value : string, index : number) => {
                const element = ProjectService.GetElement(value);
                if (element === null) {
                    console.error("Invalid element %s", value);
                    return <></>;
                }
                return <TimelineElement key={index} uuid={element.uuid} start={element.start} duration={element.duration} maxDuration={300}></TimelineElement>;
            })}
        </div>
    )
}