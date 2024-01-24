import { useEffect } from "react";
import { TimeRulerProps } from "./TimeRuler";
import { TimelineState } from "@/Pages/View/Partials/Timeline";

export default function TimelineDivisions( {start, end, divisions } : TimelineState) {
    const elements : JSX.Element[] = [];

    for (let i = start + divisions; true; ) {
        elements.push((
            <div key={i} className="min-w-[6rem] items-end w-full h-full border-r border-turquoise-200 border-dotted">
            </div>
        ));

        if (i === end)
            break;

        if (i + divisions <= end)
            i += divisions;
        else {
            i = end;
        }
    }

    return (
        <div id="timeline-divisions" className="flex sticky top-[2rem] items-end h-[calc(100%-2rem)] min-w-full w-fill z-[0]">
            {elements}
        </div>
    )
}