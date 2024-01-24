import PrimaryButton from "@/Components/PrimaryButton";
import ProjectService from "@/Services/ProjectService";
import { useState } from "react";


export type AssetImportFormProps = {
    onClose: (success : boolean) => void,
    path: string
}

enum AssetImportFormViewMode {
    IMPORT_VIEW, IMPORT_INFO_VIEW
}

type CloseSource = 'x' | 'import'

export default function AssetImportForm({onClose, path} : AssetImportFormProps) {
    const [ formViewMode, SetFormViewMode ] = useState<AssetImportFormViewMode>(AssetImportFormViewMode.IMPORT_VIEW);
    
    function BrowseFiles(event : React.MouseEvent) {
        const input = document.getElementById('file-upload-input') as HTMLInputElement | null;
        if (input === null)
            return;

        input.click();
    }

    function HandleChange(event : React.ChangeEvent) {
        console.log(event);
        const input = (event.target as HTMLInputElement);
        if (input.files && input.files.length > 0) {
            const inputFile = input.files[0];
            if (inputFile.type === 'image/png') {
                SetFormViewMode(AssetImportFormViewMode.IMPORT_INFO_VIEW);
            }
        }
    }

    async function ImportFile() {
        const input = document.getElementById('file-upload-input') as HTMLInputElement | null;
        if (input === null || input.files === null)
            return;

        const file = input.files[0];
        const result = await ProjectService.ImportAsset(path, file);
        if (result) {
            onClose(true);
        }
    }

    function HandleDrop(event : React.DragEvent) {
        event.preventDefault();
        const inputFile = event.dataTransfer.files[0];
        if (inputFile.type === 'image/png') {
            SetFormViewMode(AssetImportFormViewMode.IMPORT_INFO_VIEW);
        }
    }

    function HandleDragOver(event : React.DragEvent) {
        event.preventDefault();
    }

    function HandleClose(event : React.MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.id === 'close-icon') {
            onClose(false);
            return;
        }

        onClose(true);
    }

    let fileName = '';

    if (formViewMode === AssetImportFormViewMode.IMPORT_INFO_VIEW) {
        const input = document.getElementById('file-upload-input') as HTMLInputElement | null;
        if (input === null || input.files === null)
            return;

        const file = input.files[0];
        fileName = file.name;
    }
    
    return (
        <>
        {formViewMode === AssetImportFormViewMode.IMPORT_VIEW && 
            <div className="w-[20rem] h-[20rem] bg-white border border-turquoise-300 rounded absolute 
            left-[50%] top-[50%] -translate-x-2/4 -translate-y-2/4 overflow-hidden p-5">
                <div id="close-icon" onClick={HandleClose} className="absolute top-0 right-2 text-turquoise-500 select-none cursor-pointer hover:text-turquoise-300">X</div>
                <div onDragOver={HandleDragOver} onDrop={HandleDrop} onClick={(event)=>{event.preventDefault()}} className="w-full h-full block grid grid-rows-[2fr_3fr] justify-items-center border-2 border-turquoise-300 border-dashed">
                    <img className="w-[4rem] h-[4rem] bg-turquoise-100 self-end"></img>
                    <div className="text-center pt-8">
                        <div className="text-xl text-turquoise-500">Drag and drop your files here</div>
                        <div className="pt-4 pb-6">or</div>
                        <PrimaryButton onClick={BrowseFiles}>
                            Browse Files
                        </PrimaryButton>
                    </div>
                </div>
            </div>}
        {formViewMode === AssetImportFormViewMode.IMPORT_INFO_VIEW && 
            <div className="w-[20rem] h-[20rem] bg-white border border-turquoise-300 rounded absolute 
            left-[50%] top-[50%] -translate-x-2/4 -translate-y-2/4 overflow-hidden">
                <div id="close-icon" onClick={HandleClose} className="absolute top-0 right-2 text-turquoise-500 select-none cursor-pointer hover:text-turquoise-300">X</div>
                <div className="h-full grid grid-rows-[2rem_1fr_2rem]">
                    <div className="text-turquoise-500 border-b pl-2">Import Asset</div>
                    <div className="pl-2 pt-2">
                        <label className="pr-1">Name:</label>
                        <input className="p-0 pl-1 w-40 rounded border-0 focus:ring-turquoise-500" defaultValue={fileName} readOnly></input>
                    </div>
                    <PrimaryButton onClick={ImportFile} className="w-fit h-fit ml-2 -mt-2">Import</PrimaryButton>
                </div>
            </div>}
        <input onChange={HandleChange} id="file-upload-input" type="file" className="opacity-0 absolute top-0 left-0 z-[-1]"></input>
        </>
    );
}