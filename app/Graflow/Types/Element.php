<?php

namespace App\Graflow\Types;

use Illuminate\Support\Str;

class Element
{
    public int $start;
    public int $duration;
    public string $uuid;
    public array $components;

    public function __construct(int $start, int $duration)
    {
        $this->start = $start;
        $this->duration = $duration;
        $this->uuid = Str::uuid();
        $this->components = [];
    }
}

?>