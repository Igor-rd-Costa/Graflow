<?php

use App\Http\Controllers\AssetController;
use App\Http\Controllers\ComponentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TimelineController;
use App\Livewire\Forms\LoginForm;
use App\Models\Project;
use Illuminate\Foundation\Application;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    $connected = true;
    try 
    {
        Http::get('http://localhost:5173/');
    } catch (ConnectionException)
    {
        Log::info("No vite connection");
        $connected = false;
    };
    if ($connected)
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
    
    return view('welcome');
});

// View Route
Route::get('/view/{uuid?}', function(?string $uuid = null) 
{
    if ($uuid != null)
    {
        $user = Auth::user();
        $project = Project::with('user:id')->where('user_id', $user->id)->where('file_name', $uuid)->get()->first();
        return Inertia::render('View/Index', ['project' => $project]);
    }
    return Inertia::render('View/Index');
})->middleware(['auth', 'verified'])->name('view');

//Projects routes
Route::get('projects', [ProjectController::class, 'Projects'])->middleware(['auth', 'verified'])->name('projects.index');
Route::post('test', [ProjectController::class, 'Test'])->middleware(['auth', 'verified'])->name('test');
Route::get('project/{uuid}', [ProjectController::class, 'Project'])->middleware(['auth', 'verified'])->name('project.index');
Route::get('project/file/{id}', [ProjectController::class, 'File'])->middleware(['auth', 'verified'])->name('project.file');
Route::post('project', [ProjectController::class, 'Store'])->middleware(['auth', 'verified'])->name('project.store');
Route::put('project/{project}', [ProjectController::class, 'Update'])->middleware(['auth', 'verified'])->name('project.update');
Route::patch('project/{project}', [ProjectController::class, 'Update'])->middleware(['auth', 'verified'])->name('project.update');
Route::delete('project/{project}', [ProjectController::class, 'Destroy'])->middleware(['auth', 'verified'])->name('project.destroy');
//

//Asset routes
Route::post('assets', [AssetController::class, 'Store'])->middleware(['auth', 'verified'])->name('assets.store');
Route::delete('assets', [AssetController::class, 'Destroy'])->middleware(['auth', 'verified'])->name('assets.destroy');
Route::post('assets/folder', [AssetController::class, 'FolderStore'])->middleware(['auth', 'verified'])->name('assets.folder.store');
Route::delete('assets/folder', [AssetController::class, 'FolderDestroy'])->middleware(['auth', 'verified'])->name('assets.folder.destroy');
Route::delete('assets/reset', [AssetController::class, 'Reset'])->middleware(['auth', 'verified'])->name('assets.reset');
//

//Timeline routes
Route::post('layer', [TimelineController::class, 'Store'])->middleware(['auth', 'verified'])->name('layer.store');
Route::post('element', [TimelineController::class, 'ElementStore'])->middleware(['auth', 'verified'])->name('element.store');
Route::delete('layer/reset', [TimelineController::class, 'Reset'])->middleware(['auth', 'verified'])->name('layer.reset');

//

//Component routes
Route::post('component', [ComponentController::class, 'Store'])->middleware(['auth', 'verified'])->name('component.store');
Route::patch('component', [ComponentController::class, 'Update'])->middleware(['auth', 'verified'])->name('component.update');

//

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
