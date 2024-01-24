
type AssetItemProps = {
    name: string
    extension?: string
    hash?: string
    type: 'file' | 'folder'
}

export default function AssetItem({name, extension, hash, type } : AssetItemProps) { 
    let bgColor = 'bg-red-200';
    let divId = 'asset-file';

    if (type === 'folder') {
        bgColor = 'bg-yellow-200';
        divId = 'asset-folder';
    }
    
    function HandleDragStart(event : React.DragEvent) {
        event.dataTransfer.setData('file-hash', (hash as string)); // only used on file assets which always have a hash
    }

    return (
        <div id={divId} className="h-fit w-[52px] p-1 grid border border-transparent rounded cursor-pointer" 
        draggable={type==='file'} onDragStart={type==='file' ? HandleDragStart : ()=>{}} data-name={type === 'file' ? hash : name}>
            <svg className={"w-[42px] h-[42px] " + bgColor}>

            </svg>
            <span className="text-[0.7rem] w-full text-center select-none">
                {type==='file' ? (name+'.'+extension) : name}
            </span>
        </div>
    );
}