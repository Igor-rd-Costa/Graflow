<?php

namespace App\Http\Controllers;

use App\Graflow\Types\Element;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Graflow\Types\Layer;
use App\Graflow\Types\Vec3;

//TODO create separate controllers for some of this functions;
//TODO move types to types file;
class ProjectController extends Controller
{
    protected ProjectService $projectService;
    
    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function Projects()
    {
        $user = Auth::user();
        return Inertia::render('Projects/Index', [
            'projects' => Project::with('user:id')->where('user_id', $user->id)->latest()->get(),
        ]);
    }

    public function Project(string $uuid)
    {
        $user = Auth::user();
        $project = Project::with('user:id')->where('user_id', $user->id)->where('file_name', $uuid)->first();
        if ($project !== null)
            return Inertia::render('View/Index', ['project' => $project]);
        
        return Inertia::render('View/Index');
    }

    public function Store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255'
        ]);
        $validated['file_name'] = (string) Str::uuid();
        $result = $request->user()->projects()->create($validated);

        $this->projectService->CreateProject($result);
        
        return redirect(route('project.index', ['uuid' => $result->file_name]));
    }

    public function Update(Request $request, Project $project)
    {
        //
    }

    public function Destroy(Project $project)
    {
        $this->authorize('delete', $project);
        
        $user = $project->user;
        $projectDir = 'u' . $user->id . '/' . $project->file_name;
        Storage::disk('local')->deleteDirectory($projectDir);

        $project->delete();
        
        return redirect(route('projects.index'));
    }

    public function File(int $id)
    {
        $user = Auth::user();
        $project = Project::with('user:id')->where('user_id', $user->id)->where('id', $id)->first();
        $projFile = Storage::disk('local')->get($this->projectService->FilePath($project));
        return $projFile;
    }
    
}
