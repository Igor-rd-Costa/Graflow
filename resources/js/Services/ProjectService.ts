import Vec3 from "@/Engine/Math/Vec3";
import { Project } from "@/Pages/Projects/Index";
import { Graflow } from "@/types/GraflowTypes";
import axios from "axios";

export type AssetFile = { name: string, extension: string, hash : string, type: 'file' }
export type AssetFolder = { name: string, type: 'folder', items: (AssetFile |AssetFolder)[] };
export type Asset = AssetFile  | AssetFolder
export enum GraphType {
    GRAPH_2D
}
export type Graph = {
    type: GraphType
}

export type ProjectFile = {
    version: string,
    graph: Graph,
    elements: Graflow.FileElement[];
    components: string[];
    assets: Asset[],
    layers: Graflow.Layer[]
}

export default class ProjectService
{
    private static id : number = -1;
    private static graph : Graph;
    private static name : string = "";
    private static assets : Asset[] = [];
    private static elements : Graflow.Element[] = [];
    private static components : string[] // TODO change type;
    private static layers : Graflow.Layer[] = [];

    public static GetId() {
        return this.id;
    }
    
    public static GetAssets() {
        return this.assets;
    }

    public static GetLayers() {
        return this.layers;
    }

    public static GetName() {
        return this.name;
    }

    public static GetElements() {
        return this.elements;
    }

    public static GetElement(elementUuid : string) {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].uuid === elementUuid) {
                return this.elements[i];
            }
        }
        return null;
    }

    public static async LoadProject(project : Project) {
        this.name = project.name;
        this.id = project.id;
        const projFile = (await axios.get(route('project.file', {id: this.id}))).data as ProjectFile;
        this.graph = projFile.graph;
        this.assets = projFile.assets;
        this.layers = projFile.layers;
        this.elements = projFile.elements.map((element) => {
            return {
                start: element.start,
                duration: element.duration,
                position: new Vec3(element.position.x, element.position.y, element.position.z),
                components: element.components,
                uuid: element.uuid
            };
        });
        this.components = projFile.components;
    }

    public static async CreateFolder(path : string) {
        const result  = await axios.post(route('assets.folder.store'), { body: {id: this.id, path: path }});
        let assets = this.assets;
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
        const result = (await axios.delete(route('assets.folder.destroy'), {data: {path: path, id: this.id}})).data;
        if (result === false) {
            console.error('Failed to delete folder at path %s', path);
            return;
        }
        
        let assets = this.assets;
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
        formData.append('id', this.id.toString());
        formData.append('path', path);
        formData.append('data', file);
        const result = (await axios.post<AssetFile | null>(route('assets.store'), formData)).data;
        if (result !== null) {
            let assets = this.assets;
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
        const result = (await axios.delete<boolean>(route('assets.destroy'), {data: {id: this.id, hash: hash, path: path }})).data;
        if (result) {
            let assets = this.assets;
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
        const layerId = (await axios.post<string>(route('layer.store'), {id: this.id})).data;
        const layer : Graflow.Layer = {id: layerId, elements: []};
        this.layers.unshift(layer);
        return layerId;
    }

    public static async AddElementToLayer(layerId : string) {
        const element = (await axios.post<Graflow.Element|null>(route('element.store'), {id: this.id, layerId: layerId})).data;
        if (element === null)
            return;

        const pos = (element.position as unknown) as {x: number, y: number, z: number};
        element.position = new Vec3(pos.x, pos.y, pos.x);
        for (let i = 0; i < this.layers.length; i++) {
            if (this.layers[i].id === layerId) {
                this.layers[i].elements.push(element.uuid);
                break;
            }
        }
        this.elements.push(element);
    }

    public static async ResetLayers() {
        await axios.delete(route('layer.reset'), {data: {id: this.id}});
    }

    public static async ResetAssets() {
        await axios.delete(route('assets.reset'), {data: {id: this.id}});
    }
}