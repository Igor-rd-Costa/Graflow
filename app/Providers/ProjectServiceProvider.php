<?php

namespace App\Providers;

use App\Services\ProjectService;
use Illuminate\Support\ServiceProvider;

class ProjectServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(ProjectService::class, function () {
            return new ProjectService;
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
