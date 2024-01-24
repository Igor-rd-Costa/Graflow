import { TimelineState } from "@/Pages/View/Partials/Timeline";
import { useEffect, useState } from "react";


export type TimeRulerProps = {
    start : number,
    end: number,
    divisions : number
    zoom: number
}

export default function TimeRuler( { start, end, divisions } : TimelineState) {
    const elements : JSX.Element[] = [];

    for (let i = start + divisions; true; ) {
        elements.push((
            <div key={i} className="grid min-w-[6rem] grid-cols-[1fr_0.1rem] items-end w-full h-full border-b bg-white border-turquoise-500 select-none">
                <div className="pr-[0.1rem] text-sm text-turquoise-500 pb-1">{ToTime(i)}</div>
                <div className="border-r border-turquoise-500 h-[1.2rem]"></div>
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
        <div id="timeline-ruler" className="flex text-right sticky top-0 items-end shadow rounded-t h-8 min-w-full w-fit z-[2]">
            {elements}
        </div>
    )

    function ToTime(timestamp : number) {
        let minute : number | string = Math.floor(timestamp / 60);
        let second : number | string = (timestamp % 60);

        if (minute < 10)
            minute = `0${minute}`;

        if (second < 10)
            second = `0${second}`;

        return `${minute}:${second}`;
    }
}