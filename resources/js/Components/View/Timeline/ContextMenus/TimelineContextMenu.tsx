export type TimelineContextMenuCallbacks = {
    onNewElement: () => void,
}

export type TimelineContextMenuProps = {
    layerId: string,
    x: number,
    y: number,
    callbacks: TimelineContextMenuCallbacks
}

export default function TimelineContextMenu({layerId, x, y, callbacks} : TimelineContextMenuProps) {

    return (
        <ul id="timeline-context-menu" style={{top: y + 5, left: x + 5}} className="min-w-24 w-fit z-[3] h-fit rounded bg-white border-2 border-turquoise-200 shadow-md absolute">
            <li onClick={callbacks.onNewElement} className="hover:bg-gray-200 cursor-pointer pl-2 pr-2 h-8 flex items-center">New Element</li>
        </ul>
    );
}