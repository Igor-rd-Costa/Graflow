
export type ElementContextMenuCallbacks = {
    onDelete: () => void,
}

export type ElementContextMenuProps = {
    x: number,
    y: number,
    callbacks: ElementContextMenuCallbacks
}

export default function TimelineElementContextMenu({x, y, callbacks} : ElementContextMenuProps) {

    return (
        <ul id="context-menu" style={{top: y + 5, left: x + 5}} className="min-w-24 w-fit h-fit z-[3] rounded bg-white border-2 border-turquoise-200 shadow-md absolute">
            <li onClick={callbacks.onDelete} className="hover:bg-gray-200 cursor-pointer pl-2 pr-2 h-8 flex items-center">Delete</li>
        </ul>
    );
}