import AssetContextMenu, { AssetContextMenuCallbacks } from "@/Components/View/AssetExplorer/AssetContextMenu";
import AssetImportForm from "@/Components/View/AssetExplorer/AssetImportForm";
import AssetItem from "@/Components/View/AssetExplorer/AssetItem";
import ContextMenu, { ContextMenuCallbacks } from "@/Components/View/AssetExplorer/ContextMenu";
import FolderContextMenu, { FolderContextMenuCallbacks } from "@/Components/View/AssetExplorer/FolderContextMenu";
import ProjectService, { Asset, AssetFolder } from "@/Services/ProjectService";
import { useEffect, useState } from "react";

type ContextMenuInfo = {
    kind: ContextMenuKind,
    open: boolean,
    x: number,
    y: number
}

enum ContextMenuKind {
    CONTEXT_MENU, FOLDER_CONTEXT_MENU, ASSET_CONTEXT_MENU
}

type AssetExplorerProps = {
    isLoaded: boolean
}

let selectedItem : HTMLElement | null = null;
let loaded = false;
export default function AssetExplorer({ isLoaded } : AssetExplorerProps) {
    const [ contextMenuInfo, SetContextMenuInfo ] = useState<ContextMenuInfo>({kind: ContextMenuKind.CONTEXT_MENU, open: false, x: 0, y: 0});
    const [ path, SetPath ] = useState<string>('');
    const [ assets, SetAssets ] = useState<JSX.Element[]>([]);
    const [ showAssetImportForm, SetShowAssetImportForm ] = useState(false);

    const contextMenuCallBacks : ContextMenuCallbacks = {
        onCreateFolder: CreateFolder,
        onImportAsset: OpenAssetImportForm
    }
    const folderContextMenuCallbacks : FolderContextMenuCallbacks = {
        onDeleteFolder: DeleteFolder,
    }
    const assetContextMenuCallbacks : AssetContextMenuCallbacks = {
        onDeleteAsset: DeleteAsset,
    }

    useEffect(() => {
        if (isLoaded && !loaded) {
            const assets = ProjectService.GetAssets();
            SetAssets(RenderAssets(assets));
            loaded = true;
        }
    }, [isLoaded]);


    function OnGlobalClick(event : MouseEvent) {
        if (event.target) {
            const target = event.target as HTMLElement;
            if (target.closest('#context-menu') === null && contextMenuInfo.open === true) {
                SetContextMenuInfo({kind: contextMenuInfo.kind, open: false, x: 0, y: 0});
            }
        }
    }

    useEffect(() => {
        document.addEventListener('click', OnGlobalClick);

        return () => {document.removeEventListener('click', OnGlobalClick)};
    }, [contextMenuInfo]);

    function ShowContextMenu() {
        switch(contextMenuInfo.kind) {
            case ContextMenuKind.CONTEXT_MENU: 
                return <ContextMenu x={contextMenuInfo.x} y={contextMenuInfo.y} callbacks={contextMenuCallBacks}></ContextMenu>;
            case ContextMenuKind.FOLDER_CONTEXT_MENU: 
                return <FolderContextMenu x={contextMenuInfo.x} y={contextMenuInfo.y} callbacks={folderContextMenuCallbacks}></FolderContextMenu>;
            case ContextMenuKind.ASSET_CONTEXT_MENU:
                return <AssetContextMenu x={contextMenuInfo.x} y={contextMenuInfo.y} callbacks={assetContextMenuCallbacks}></AssetContextMenu>
            default: 
                return <ContextMenu x={contextMenuInfo.x} y={contextMenuInfo.y} callbacks={contextMenuCallBacks}></ContextMenu>;    
        }
    }

    function HandleMouseUp(event : React.MouseEvent) {
        const target = event.target as HTMLElement;
        if (event.button === 0) {
            let item = target.closest('#asset-file') as HTMLElement | null;
            if (item === null) {
                item = target.closest('#asset-folder') as HTMLElement | null;
            }

            if (item === null) {
                UnselectItem();
                return;
            }

            SelectItem(item);

        } else if (event.button === 2) {
            let assetItem = target.closest('#asset-file');
            if (assetItem !== null) {
                SelectItem(assetItem as HTMLElement);
                SetContextMenuInfo({kind: ContextMenuKind.ASSET_CONTEXT_MENU, open: true, x: event.pageX, y: event.pageY });
                return;
            }
            assetItem = target.closest('#asset-folder');
            if (assetItem !== null) {
                SelectItem(assetItem as HTMLElement);
                SetContextMenuInfo({kind: ContextMenuKind.FOLDER_CONTEXT_MENU, open: true, x: event.pageX, y: event.pageY });
                return;
            }
            
            SetContextMenuInfo({kind: ContextMenuKind.CONTEXT_MENU, open: true, x: event.pageX, y: event.pageY });
        }
    }

    function UnselectItem() {
        if (selectedItem !== null) {
            selectedItem.classList.remove('asset-manager-item-selected');
            selectedItem = null;
        }
    }

    function SelectItem(item : HTMLElement) {
        if (item === selectedItem)
            return;
        UnselectItem();
        selectedItem = item;
        selectedItem.classList.add('asset-manager-item-selected');
    }

    function BlockContextMenu(event : React.MouseEvent) {
        const target = event.currentTarget;
        if (target.closest("#asset-header") === null)
            event.preventDefault();
    }

    function HandleDoubleClick(event : React.MouseEvent) {
        const target = event.target;
        const folder = (target as HTMLElement).closest('#asset-folder');
        if (folder) {
            const folderName = folder.getAttribute('data-name');
            console.log("Folder name:", folderName);
            if (folderName) {
                let currentP : string[] = [];
                if (path.length > 0) {
                    currentP = path.split('/');
                }
                currentP.push(folderName);
                UnselectItem();
                SetPath(currentP.join('/'));
            }
        }
    }


    async function CreateFolder() {
        await ProjectService.CreateFolder(path);
        const assets = ProjectService.GetAssets();
        SetAssets(RenderAssets(assets));
        SetContextMenuInfo({kind: contextMenuInfo.kind, open: false, x: 0, y: 0});
    }

    async function DeleteFolder() {
        if (selectedItem === null)
            return;

        const name = selectedItem.getAttribute('data-name');
        if (name === null)
            return;

        let requestPath = name;
        if (path.length > 0)
            requestPath = path + '/' + name;

        await ProjectService.DeleteFolder(requestPath);
        const assets = ProjectService.GetAssets();
        UnselectItem();
        SetAssets(RenderAssets(assets));
        SetContextMenuInfo({kind: contextMenuInfo.kind, open: false, x: 0, y: 0});
    }

    async function DeleteAsset() {
        if (selectedItem === null)
            return;

        const hash = selectedItem.getAttribute('data-name');
        if (hash === null)
            return;

        let requestPath = path;
        
        const result = await ProjectService.DeleteAsset(hash, requestPath);
        if (result) {
            const assets = ProjectService.GetAssets();
            UnselectItem();
            SetAssets(RenderAssets(assets));
            SetContextMenuInfo({kind: contextMenuInfo.kind, open: false, x: 0, y: 0});
        }
    }

    function OpenAssetImportForm() {
        SetShowAssetImportForm(true);
        SetContextMenuInfo({kind: contextMenuInfo.kind, open: false, x: 0, y: 0 });
    }

    function CloseAssetImportForm(success : boolean) {
        SetShowAssetImportForm(false);
        if (success) {
            const assets = ProjectService.GetAssets();
            SetAssets(RenderAssets(assets));
        }
    }

    function BackFolder() {
        if (path.length > 0) {
            let newPath = path.split('/');
            newPath.pop();
            UnselectItem();
            SetPath(newPath.join('/'));
        }
    }
  
    const currentPath = path.length > 0 ? ('/' + path) : '';
    useEffect(() => {
        SetAssets(RenderAssets(ProjectService.GetAssets()));
    }, [path])

    function DrawAssets(assets : Asset[]) {
        const renderedAssets : JSX.Element[] = [];
        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            if (asset.type === 'folder')
                renderedAssets.push(<AssetItem key={i} type={asset.type} name={asset.name}></AssetItem>);
            else
                renderedAssets.push(<AssetItem key={i} type={asset.type} name={asset.name} extension={asset.extension} hash={asset.hash}></AssetItem>);
        }
        return renderedAssets;
    }

    function RenderAssets(assets : Asset[]) {
        let pathArray = path.split('/');
        for (let i = 0; i < pathArray.length; i++) {
            for (let j = 0; j < assets.length; j++) {
                if (assets[j].type === 'folder' && assets[j].name === pathArray[i]) {
                    assets = (assets[j] as AssetFolder).items;
                    break;
                }
            }
        }
        return DrawAssets(assets);
    }

    return (
        <>
        {showAssetImportForm && <AssetImportForm onClose={CloseAssetImportForm} path={path}></AssetImportForm>}
        {contextMenuInfo.open && ShowContextMenu() }
        <section className='border border-gray-500 min-w-[84px] rounded overflow-hidden'>
            <div className="rounded bg-white xl:w-[236px] md:w-[160px] sm:w-[84px] h-full">
                <div id="asset-header" className="border-b rounded-t pl-2 h-[25px] border-gray-200 text-turquoise-500">
                    Assets
                </div>
                <div className="text-sm text-gray-500 border-b border-gray-200 h-[21px] grid grid-rows-1 grid-cols-[21px_1fr]">
                    <button className="bg-turquoise-500 w-[21px] h-[21px] text-white hover:bg-turquoise-200" onClick={BackFolder}>B</button>
                    <div className="pl-2 pr-2 truncate" title={currentPath}>
                        {currentPath}
                    </div>
                </div>
                <div id='asset-manager-item-wrapper' className="flex flex-wrap content-start gap-6 p-4 h-[calc(100%-25px-21px)] overflow-y-scroll overflow-x-hidden"
                onDoubleClick={HandleDoubleClick} onMouseUp={HandleMouseUp} onContextMenu={BlockContextMenu}>
                    {assets}    
                </div>
            </div>
        </section>
        </>
    );
}