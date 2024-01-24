<?php

namespace App\Graflow\Types;

use Illuminate\Support\Str;

class Layer
{
    public string $id;
    public array $elements;

    public function __construct()
    {
        $this->id = Str::uuid();
        $this->elements = [];
    }
}

?>