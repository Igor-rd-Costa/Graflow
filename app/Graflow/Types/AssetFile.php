<?php

namespace App\Graflow\Types;

class AssetFile
{
    public function __construct(string $name, string $extension, string $hash)
    {
        $this->type = "file";
        $this->name = $name;
        $this->extension = $extension;
        $this->hash = $hash;
    }

    public string $type;
    public string $name;
    public string $extension;
    public string $hash;
}

?>