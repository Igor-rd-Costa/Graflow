<?php

namespace App\Graflow\Types;

use Illuminate\Support\Str;

class Element
{
    public int $start;
    public int $duration;
    public Vec3 $position;
    public string $uuid;
    public array $components;

    public function __construct(int $start, int $duration, Vec3 $position)
    {
        $this->start = $start;
        $this->duration = $duration;
        $this->position = $position;
        $this->uuid = Str::uuid();
        $this->components = [];
    }
}

?>