<?php

namespace App\Http\Controllers;

use App\Graflow\Types\AssetFile;
use App\Graflow\Types\AssetFolder;
use App\Graflow\Types\ProjectFile;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AssetController extends Controller
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function Store(Request $request) 
    {
        $user = Auth::user();
        $id = $request->input('id');
        $creationPath = explode('/', $request->input('path'));
        $file = $request->file('data');
        $project = Project::with('user:id')->where('user_id', $user->id)->where('id', $id)->first();
        $projFilePath = $this->projectService->FilePath($project);
        $projFile = json_decode(Storage::disk('local')->get($projFilePath));

        $assets = &$projFile->assets;
        $foundPath = true;
        if (strlen($request->input('path')) !== 0)
        {
            for ($i = 0; $i < count($creationPath); $i++) {
                $foundPath = false;
                $path = &$creationPath[$i];
                for ($j = 0; $j < count($assets); $j++) {
                    $asset = &$assets[$j];
                    if ($asset->type === 'folder' && $asset->name === $path) {
                        $assets = &$asset->items;
                        $foundPath = true;
                        break;
                    }
                }
                if ($foundPath === false) {
                    Log::error("Could not find path " . $request->input('path') . ".");
                    return Response(null);
                }
            }
        }
        
        $fileExtension = $file->getClientOriginalExtension();
        $fileName = trim($file->getClientOriginalName(), '.'.$fileExtension);
        $fileHashName = trim($file->hashName(), '.'.$fileExtension);
        $assetFile = new AssetFile($fileName, $fileExtension, $fileHashName);
        array_push($assets, $assetFile);
        Storage::disk('local')->put($this->projectService->FolderPath($project).'assets/'.$fileHashName, $file->getContent());
        Storage::disk('local')->put($projFilePath, json_encode($projFile));
        $project->update(['updated_at' => now()]);
        return Response(json_encode($assetFile));
    }

    //TODO implement this
    public function Destroy(Request $request)
    {
        $user = Auth::user();
        $id = $request->input('id');
        $hash = $request->input('hash');
        $assetPath = explode('/', $request->input('path'));
        $project = Project::with('user:id')->where('user_id', $user->id)->where('id', $id)->first();
        $projFilePath = $this->projectService->FilePath($project);
        $projFile = json_decode(Storage::disk('local')->get($projFilePath));
        $assets = &$projFile->assets;

        $foundPath = true;
        Log::info("User ".$user->id.": Delete request for asset '".$hash."' at path '".$request->input('path')."'.");
        if (strlen($request->input('path')) > 0)
        {
            for ($i = 0; $i < count($assetPath); $i++) {
                $foundPath = false;
                $path = &$assetPath[$i];
                for ($j = 0; $j < count($assets); $j++) {
                    $asset = &$assets[$j];
                    if ($asset->type === 'folder' && $asset->name === $path) {
                        $assets = &$asset->items;
                        $foundPath = true;
                        break;
                    }
                }
                if ($foundPath === false) {
                    Log::error("Could not find path " . $request->input('path') . ".");
                    return Response(false);
                }
            }
        }
        for ($i = 0; $i < count($assets); $i++)
        {
            $asset = &$assets[$i];
            if ($asset->type === 'file' && $asset->hash === $hash)
            {
                array_splice($assets, $i, 1);
                Storage::disk('local')->put($projFilePath, json_encode($projFile));
                Storage::disk('local')->delete($this->projectService->FolderPath($project).'assets/'.$asset->hash);
                //TODO Check if asset is being used by any elements and remove it from them
                return Response(true);
            }
        }
        
        return Response(false);
    }

    public function FolderStore(Request $request)
    {
        $user = Auth::user();
        $project = Project::with('user:id')->where('user_id', $user->id)->find($request['body']['id']);
        $projFilePath = $this->projectService->FilePath($project);
        $projFile = json_decode(Storage::disk('local')->get($projFilePath));
        $filePath = $request['body']['path'];
        $assets = &$projFile->assets;
        if (!empty($filePath))
        {
            $filePath = explode('/', $filePath);
            for ($i = 0; $i < count($filePath); $i++) {
                for ($j = 0; $j < count($assets); $j++)
                {
                    if ($assets[$j]->type === 'folder' && $assets[$j]->name === $filePath[$i]) {
                        $assets = &$assets[$j]->items;
                    }
                }
                
            }
        }

        $folderName = "New Folder";
        $isNameAvailable = true;
        $count = 0;
        do
        {
            $isNameAvailable = true;
            if ($count > 0)
            {
                $folderName = "New Folder($count)";
            }

            for ($i = 0; $i < count($assets); $i++)
            {
                if ($assets[$i]->type === 'folder' && $assets[$i]->name === $folderName)
                {
                    $isNameAvailable = false;
                    $count++;
                    break;
                }
            }
        } while ($isNameAvailable === false);

        $folder = new AssetFolder($folderName);
        array_push($assets, $folder);
        Storage::disk('local')->put($projFilePath, json_encode($projFile));
        $project->update(['updated_at' => now()]);
        return Response(json_encode($folder));
    }

    public function FolderDestroy(Request $request)
    {
        $user = Auth::user();
        $id = $request['id'];
        $project = Project::with('user:id')->where('user_id', $user->id)->where('id', $id)->first();
        $projFilePath = $this->projectService->FilePath($project);
        $projFile = json_decode(Storage::disk('local')->get($projFilePath));
        $assets = &$projFile->assets;
        $path = explode('/', $request['path']);

        $foundFolder = false;
        for ($i = 0; $i < (count($path) - 1); $i++) {
            $foundFolder = false;
            for ($j = 0; $j < count($assets); $j++) {
                $asset = &$assets[$j];
                if ($asset->type === "folder" && $asset->name === $path[$i]) {
                    $assets = &$asset->items;
                    $foundFolder = true;
                    break;
                }
            }
            if ($foundFolder === false) {
                return Response(false);
            }
        }
        $folder = $path[count($path) - 1];
        for ($i = 0; $i < count($assets); $i++) {
            $foundFolder = false;
            if ($assets[$i]->type === "folder" && $assets[$i]->name === $folder) {
                array_splice($assets, $i, 1);
                $foundFolder = true;
                break;
            }
        }
        if ($foundFolder === false) {
            return Response(false);
        }
        
        Storage::disk('local')->put($projFilePath, json_encode($projFile));
        $project->update(['updated_at' => now()]);
        return Response(true);
    }

    public function Reset(Request $request) 
    {
        $user = Auth::user();
        $id = $request->input('id');
        $project = Project::with('user:id')->where("user_id", $user->id)->find($id);
        $projFilePath = $this->projectService->FilePath($project);
        $projFile = json_decode(Storage::disk('local')->get($projFilePath));
        $projFile->assets = [];
        Storage::disk('local')->deleteDirectory($this->projectService->FolderPath($project).'assets');
        Storage::disk('local')->put($projFilePath, json_encode($projFile));
    }
}
