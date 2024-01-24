import { useEffect, useRef } from "react";

enum CursorState {
    NORMAL, RESIZE
}

type TimelineElementProps = {
    start : number,
    duration : number,
    maxDuration : number,
    uuid: string
}

export default function TimelineElement({ start, duration, maxDuration, uuid } : TimelineElementProps) {
    const elementRef = useRef(null);
    let cursorState : CursorState = CursorState.NORMAL;
    let filename = "Filename.png";

    useEffect(() => {
        if (elementRef.current) {
            let element = elementRef.current as HTMLElement;
            element.addEventListener('mousemove', OnMouseMove);
        }
    });

    const OnMouseMove = (event : MouseEvent) => {
        if (!elementRef.current)
            return;

        const element = elementRef.current as HTMLElement;
        const posX = event.clientX - element.getBoundingClientRect().x;

        if (posX <= 5 || posX >= (element.getBoundingClientRect().width - 5)) {
            element.style.cursor = 'e-resize';
            cursorState = CursorState.RESIZE;
        }
        else {
            element.style.cursor = '';
            cursorState = CursorState.NORMAL;
        }
    }

    const left = (start / maxDuration) * 100;
    const width = (duration / maxDuration) * 100;

    return (
        <div ref={elementRef} style={{width: `${width}%`, left: `${left}%`}} data-uuid={uuid} 
            className="timeline-element h-full rounded border absolute border-gray-500 bg-gray-400 z-[1]">
            <div className="grid grid-cols-[auto_1fr] grid-rows-1 h-full w-full">
                <div className="h-[100%] bg-turquoise-150"></div>
                <div className="pl-2 truncate self-center select-none">
                    {filename}
                </div>
            </div>
        </div>
    )
}