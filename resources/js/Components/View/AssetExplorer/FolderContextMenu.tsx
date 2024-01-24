import { ContextMenuProps } from "./ContextMenu";

export type FolderContextMenuCallbacks = {
    onDeleteFolder: () => void
}

export type FolderContextMenuProps = {
    x: number,
    y: number,
    callbacks: FolderContextMenuCallbacks
}

export default function FolderContextMenu({x, y, callbacks } : FolderContextMenuProps) {
    
    return (
        <ul id="context-menu" style={{top: y + 5, left: x + 5}} className="min-w-24 w-fit h-fit rounded bg-white border-2 border-turquoise-200 shadow-md absolute">
            <li onClick={callbacks.onDeleteFolder} className="hover:bg-gray-200 cursor-pointer pl-2 pr-2 h-8 flex items-center">Delete Folder</li>
        </ul>
    );
}