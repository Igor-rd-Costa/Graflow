<?php

namespace App\Graflow\Types\Components; 
use App\Graflow\Types\Components\Component;


class TransformComponent extends Component
{
    public array $position;
    public array $rotation;
    public array $scale;

    public function __construct()
    {
        parent::__construct(ComponentType::TRANSFORM_COMPONENT);
        $this->position = [0.0, 0.0, 0.0];
        $this->rotation = [0.0, 0.0, 0.0];
        $this->scale = [1.0, 1.0, 1.0];
    }
}


?>