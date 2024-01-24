<?php

namespace App\Graflow\Types;

class AssetFolder
{
    public function __construct(string $name)
    {
        $this->name = $name;
        $this->type = "folder";
        $this->items = [];
    }

    public string $type;
    public string $name;
    public array $items;
}

?>