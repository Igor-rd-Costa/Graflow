<?php

namespace App\Graflow\Types\Components;
use Illuminate\Support\Str;

class Component
{
    public ComponentType $type;
    public string $uuid;

    public function __construct(ComponentType $type, ?string $uuid = null)
    {
        $this->type = $type;
        if ($uuid === null)
            $this->uuid = Str::uuid();
        else
            $this->uuid = $uuid;
    }
}

?>