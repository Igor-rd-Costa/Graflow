import { Project } from "@/Pages/Projects/Index";
import { GfComponent, GfComponentType, GfTransformComponent } from "@/Types/Graflow/Compoments";
import { GfElement, GfLayer } from "@/Types/Graflow/Element";
import { GfGraph, GfGraphType, GfProjectFile } from "@/Types/Graflow/Project";
import axios from "axios";

export type AssetFile = { name: string, extension: string, hash : string, type: 'file' }
export type AssetFolder = { name: string, type: 'folder', items: (AssetFile |AssetFolder)[] };
export type Asset = AssetFile  | AssetFolder

export default class ProjectService
{
    private static projId : number = -1;
    private static projName : string = "";
    private static project : GfProjectFile = {
        version: '0.0.0',
        graph: {type: GfGraphType.GRAPH_2D},
        elements: [],
        assets: [],
        layers: [],
        transformComponents: [],
    };


    public static GetId() {
        return this.projId;
    }
    
    public static GetAssets() {
        return this.project.assets;
    }

    public static GetLayers() {
        return this.project.layers;
    }

    public static GetName() {
        return this.projName;
    }

    public static GetElements() {
        return this.project.elements;
    }

    public static GetElement(elementUuid : string) {
        for (let i = 0; i < this.project.elements.length; i++) {
            if (this.project.elements[i].uuid === elementUuid) {
                return this.project.elements[i];
            }
        }
        return null;
    }

    public static GetTransformComponents() {
        return this.project.transformComponents;
    }

    public static ShowTransform() {
        console.log(this.project.transformComponents);
    }

    public static FindComponent(component : GfComponent) {
        switch(component.type) {
            case GfComponentType.TRANSFORM_COMPONENT: {
                let comp : GfTransformComponent | null = null;
                for (let i = 0; i < this.project.transformComponents.length; i++) {
                    if (this.project.transformComponents[i].uuid === component.uuid) {
                        comp = this.project.transformComponents[i];
                        break;
                    }
                }
                return comp;
            }
            default: {
                console.error("FindComponent unimplemented type " + component.type);
                return null;
            }
        }
    }

    public static async LoadProject(project : Project) {
        this.projName = project.name;
        this.projId = project.id;
        const projFile = (await axios.get(route('project.file', {id: this.projId}))).data as GfProjectFile;
        console.log(projFile);
        this.project = projFile;
        return projFile;
    }

    public static async CreateFolder(path : string) {
        const result  = await axios.post(route('assets.folder.store'), { body: {id: this.projId, path: path }});
        let assets = this.project.assets;
        if (result.data !== 0) {
            if (path.length !== 0) {
                const pathArray = path.split('/');
                for (let i = 0; i < pathArray.length; i++) {
                    for (let j =0; j < assets.length; j++) {
                        if (assets[j].type === 'folder' && assets[j].name === pathArray[i]) {
                            assets = (assets[j] as AssetFolder).items;
                        }
                    }
                }
            }
            assets.push(result.data);
        }
    }

    public static async DeleteFolder(path : string) {
        const result = (await axios.delete(route('assets.folder.destroy'), {data: {path: path, id: this.projId}})).data;
        if (result === false) {
            console.error('Failed to delete folder at path %s', path);
            return;
        }
        
        let assets = this.project.assets;
        const pathArray = path.split('/');
        let folder = pathArray[0];
        if (pathArray.length > 0) {
            for (let i = 0; i < (pathArray.length - 1); i++) {
                const folderName = pathArray[i];
                for (let j = 0; j < (assets.length); j++) {
                    let asset = assets[j];
                    if (asset.type === "folder" && asset.name === folderName) {
                        assets = (asset as AssetFolder).items;
                        break;
                    }
                }
            }
            folder = pathArray[pathArray.length - 1];
        }
        for (let i = 0; i < assets.length; i++) {
            if (assets[i].type === 'folder' && assets[i].name === folder) {
                assets.splice(i, 1);
                break;
            }
        }
    }

    public static async ImportAsset(path : string, file : File) {
        const formData = new FormData();
        formData.append('id', this.projId.toString());
        formData.append('path', path);
        formData.append('data', file);
        const result = (await axios.post<AssetFile | null>(route('assets.store'), formData)).data;
        if (result !== null) {
            let assets = this.project.assets;
            const pathArray = path.split('/');
            if (pathArray.length > 0) {
                for (let i = 0; i < pathArray.length; i++) {
                    const folderName = pathArray[i];
                    for (let j = 0; j < (assets.length); j++) {
                        let asset = assets[j];
                        if (asset.type === "folder" && asset.name === folderName) {
                            assets = (asset as AssetFolder).items;
                            break;
                        }
                    }
                }
            }
            const newFile : AssetFile = result;
            assets.push(newFile);
            return true;
        }
        return false;
    }

    public static async DeleteAsset(hash : string, path : string) {
        const result = (await axios.delete<boolean>(route('assets.destroy'), {data: {id: this.projId, hash: hash, path: path }})).data;
        if (result) {
            let assets = this.project.assets;
            const pathArray = path.split('/');
            if (pathArray.length > 0) {
                for (let i = 0; i < pathArray.length; i++) {
                    const folderName = pathArray[i];
                    for (let j = 0; j < (assets.length); j++) {
                        let asset = assets[j];
                        if (asset.type === "folder" && asset.name === folderName) {
                            assets = (asset as AssetFolder).items;
                            break;
                        }
                    }
                }
            }
            for (let i = 0; i < assets.length; i++) {
                if (assets[i].type === 'file' && (assets[i] as AssetFile).hash === hash) {
                    assets.splice(i, 1);
                    break;
                }
            }
        }
        return result;
    }

    public static async CreateLayer() {
        const layerId = (await axios.post<string>(route('layer.store'), {id: this.projId})).data;
        const layer : GfLayer = {id: layerId, elements: []};
        this.project.layers.unshift(layer);
        return layerId;
    }

    public static async AddElementToLayer(layerId : string) {
        const element = (await axios.post<GfElement|null>(route('element.store'), {id: this.projId, layerId: layerId})).data;
        if (element === null)
            return;

        for (let i = 0; i < this.project.layers.length; i++) {
            if (this.project.layers[i].id === layerId) {
                this.project.layers[i].elements.push(element.uuid);
                break;
            }
        }
        this.project.elements.push(element);
    }

    public static async ResetLayers() {
        await axios.delete(route('layer.reset'), {data: {id: this.projId}});
    }

    public static async ResetAssets() {
        await axios.delete(route('assets.reset'), {data: {id: this.projId}});
    }
}