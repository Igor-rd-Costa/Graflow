<?php

namespace App\Graflow\Types;

class Vec3 {    
    public float $x;
    public float $y;
    public float $z;

    public function __construct(float $x, float $y, float $z)
    {   
        $this->x = $x;
        $this->y = $y;
        $this->z = $z;
    }
}

?>
