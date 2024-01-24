<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProjectService
{    
    private string $projFileVersion = '0.0.1';
    private const PROJ_EXTENSION = ".gfproj";

    public function CreateProject(Project $project)
    {
       $LocalDisk = Storage::disk('local');
       $userId = $project['user_id'];

        $this->MakeUserFolder($userId);
        $projectDir = 'u'.$userId.'/'. $project['file_name'] . '/'; 
        $projectFileName = $project['file_name'].'.gfproj';

        $LocalDisk->makeDirectory($projectDir);
        $LocalDisk->put($projectDir . $projectFileName, $this->GenerateNewGFProjContent());
    }

    public function FolderPath(Project $project)
    {
        return 'u'.$project->user_id.'/'.$project->file_name.'/';
    }

    public function FilePath(Project $project)
    {
        return $this->FolderPath($project).$project->file_name.ProjectService::PROJ_EXTENSION;
    }

    public function GetCurrentGFProjVersion()
    {
        return $this->projFileVersion;
    }

    private function GenerateNewGFProjContent() : string
    {
        return "{\"version\":\"" . $this->projFileVersion . "\",\"graph\":{\"type\":0},\"assets\":[],\"elements\":[],\"components\":[],\"layers\":[]}";
    }

    private function MakeUserFolder(int $userId) : void
    {
        $localDisk = Storage::disk('local');
        if ($localDisk->exists('/u'.$userId))
            return;

        $localDisk->makeDirectory('u'.$userId);
    }

}



?>