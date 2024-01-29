<?php

namespace App\Http\Controllers;

use App\Graflow\Types\Components\Component;
use App\Graflow\Types\Components\ComponentType;
use App\Graflow\Types\Components\TransformComponent;
use App\Graflow\Types\Components\TransformComponentFields;
use App\Models\Project;
use App\Services\ProjectService;
use GuzzleHttp\Psr7\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ComponentController extends Controller
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService) {
        $this->projectService = $projectService;
    }

    public function Store(Request $request) 
    {
        $user = Auth::user();
        $id = $request->input('projId');
        $elementId = $request->input("elementId");
        $type = ComponentType::from($request->input('type'));

        $project = Project::with('user:id')->where('user_id', $user->id)->find($id);
        $projFilePath = $this->projectService->FilePath($project);
        $projFile = json_decode(Storage::disk('local')->get($projFilePath));
        $elements = &$projFile->elements;
        for ($i = 0; $i < count($elements); $i++) 
        {
            if ($elements[$i]->uuid === $elementId)
            {
                $component = $this->CreateComponent($type);
                $this->InsertComponent($component, $projFile);
                array_push($elements[$i]->components, new Component($type, $component->uuid));
                Storage::disk('local')->put($projFilePath, json_encode($projFile));
                return Response(json_encode($component));
            }
        }
        return Response(false);
    }

    public function Update(Request $request)
    {
        $user = Auth::user();
        $id = $request->input('projId');
        $compId = $request->input('compId');
        Log::info($id);
        Log::info($compId);
        $compField = TransformComponentFields::from($request->input('compField'));
        $newVal = $request->input('newVal');

        $project = Project::with('user:id')->where('user_id', $user->id)->find($id);
        $projFilePath = $this->projectService->FilePath($project);
        $projFile = json_decode(Storage::disk('local')->get($projFilePath));
        $components = &$projFile->transformComponents;
        for ($i = 0; $i < count($components); $i++)
        {
            $component = &$components[$i];
            if ($component->uuid === $compId)
            {
                Log::info("Found Component!");
                switch($compField)
                {
                    case TransformComponentFields::POSITION_FIELD: {
                        Log::info("Updating position!");
                        $component->position = $newVal; 
                    } break;
                    case TransformComponentFields::ROTATION_FIELD: {
                        $component->rotation = $newVal;
                    } break;
                    case TransformComponentFields::SCALE_FIELD: {
                        $component->scale = $newVal;
                    } break;
                }
            }
        }
        Storage::disk('local')->put($projFilePath, json_encode($projFile));
        return Response(true);
    }


    private function CreateComponent(ComponentType $type)
    {
        switch($type)
        {
            case ComponentType::TRANSFORM_COMPONENT: {
                return new TransformComponent();
            } break;
        }
    }

    private function InsertComponent(Component $component, $projFile)
    {
        switch($component->type)
        {
            case ComponentType::TRANSFORM_COMPONENT: {
                array_push($projFile->transformComponents, $component);
                return;
            } break;
        }
    }
}
