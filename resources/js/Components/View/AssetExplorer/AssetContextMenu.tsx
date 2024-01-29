export type AssetContextMenuCallbacks = {
    onDeleteAsset: () => void,
}

export type AssetContextMenuProps = {
    x: number,
    y: number,
    callbacks: AssetContextMenuCallbacks
}

export default function AssetContextMenu({x, y, callbacks} : AssetContextMenuProps) {
    
    return (
        <ul id="context-menu" style={{top: y + 5, left: x + 5}} className="min-w-24 w-fit z-[3] h-fit rounded bg-white border-2 border-turquoise-200 shadow-md absolute">
            <li onClick={callbacks.onDeleteAsset} className="hover:bg-gray-200 cursor-pointer pl-2 pr-2 h-8 flex items-center">Delete Asset</li>
        </ul>
    );
}