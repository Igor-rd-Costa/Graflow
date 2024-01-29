<?php

namespace App\Http\Controllers;

use App\Graflow\Types\Element;
use App\Graflow\Types\Layer;
use App\Graflow\Types\Vec3;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TimelineController extends Controller
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    //create layer
    public function Store(Request $request)
    {
        $user = Auth::user();
        $id = $request->input('id');
        $project = Project::with('user:id')->where('user_id', $user->id)->where('id', $id)->first();
        $projFilePath = $this->projectService->FilePath($project);
        $projFile = json_decode(Storage::disk('local')->get($projFilePath));

        $layers = &$projFile->layers;
        $newLayer = new Layer;
        array_unshift($layers, $newLayer);
        Storage::disk('local')->put($projFilePath, json_encode($projFile));
        $project->update(['updated_at' => now()]);
        return Response($newLayer->id);
    }

    //add element to layer
    public function ElementStore(Request $request)
    {
        $user = Auth::user();
        $project = Project::with('user:id')->where("user_id", $user->id)->find($request->input('id'));
        $projFilePath = $this->projectService->FilePath($project);
        $projFile = json_decode(Storage::disk('local')->get($projFilePath));
        $layers = &$projFile->layers;
        $foundLayer = false;
        $element = new Element(0, 30);
        foreach ($layers as &$layer) 
        {
            if ($layer->id === $request->input('layerId'))
            {
                //TODO dynamic start position. Maybe change default duration/position
                array_push($projFile->elements, $element);
                array_push($layer->elements, $element->uuid);
                $foundLayer = true;
                break;
            }
        }

        if ($foundLayer) 
        {
            Storage::disk('local')->put($projFilePath, json_encode($projFile));
            return Response(json_encode($element));
        }
        return Response(null);
    }


    public function Reset(Request $request)
    {
        $user = Auth::user();
        $id = $request->input('id');
        $project = Project::with('user:id')->where("user_id", $user->id)->find($id);
        $projFilePath = $this->projectService->FilePath($project);
        $projFile = json_decode(Storage::disk('local')->get($projFilePath));
        $projFile->layers = [];
        $projFile->elements = [];
        $projFile->transformComponents = [];
        Storage::disk('local')->put($projFilePath, json_encode($projFile));
    }
}
