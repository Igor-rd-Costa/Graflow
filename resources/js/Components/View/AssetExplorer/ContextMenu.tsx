
export type ContextMenuCallbacks = {
    onCreateFolder: () => void,
    onImportAsset: () => void
}

export type ContextMenuProps = {
    x: number,
    y: number,
    callbacks: ContextMenuCallbacks
}

export default function ContextMenu({x, y, callbacks} : ContextMenuProps) {
    
    return (
        <ul id="context-menu" style={{top: y + 5, left: x + 5}} className="min-w-24 w-fit h-fit rounded bg-white border-2 border-turquoise-200 shadow-md absolute">
            <li onClick={callbacks.onCreateFolder} className="hover:bg-gray-200 cursor-pointer pl-2 pr-2 h-8 flex items-center">Create Folder</li>
            <li onClick={callbacks.onImportAsset} className="hover:bg-gray-200 cursor-pointer pl-2 pr-2 h-8 flex items-center">Import Asset</li>
        </ul>
    );
}