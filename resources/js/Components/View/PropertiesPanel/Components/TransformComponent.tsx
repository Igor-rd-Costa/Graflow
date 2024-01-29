import Vec3 from "@/Engine/Math/Vec3";
import ComponentService from "@/Services/ComponentService";
import ElementService from "@/Services/ElementService";
import { GfComponentType } from "@/Types/Graflow/Compoments";
import { GfTransformComponentField } from "@/Types/Graflow/Element";
import { useRef, useState } from "react";
import Vec3Input from "./Partials/Vec3Input";

type Transforms = {
    position: Vec3,
    rotation: Vec3,
    scale: Vec3
}

type TransformComponentProps = {
    id: string,
    transforms: Transforms
}

export default function TransformComponent({ id, transforms } : TransformComponentProps) {
    const [ isExpanded, SetIsExpanded ] = useState(true);

    function HandlePositionChange(newVal : Vec3) {
        if (newVal.Equals(transforms.position))
            return;
        ComponentService.UpdateComponent(id, GfTransformComponentField.POSITION_FIELD, newVal);
    }

    function HandleRotationChange(newVal : Vec3) {
        if (newVal.Equals(transforms.rotation))
            return;
        ComponentService.UpdateComponent(id, GfTransformComponentField.ROTATION_FIELD, newVal);
    }

    function HandleScaleChange(newVal : Vec3) {
        if (newVal.Equals(transforms.scale))
            return;
        ComponentService.UpdateComponent(id, GfTransformComponentField.SCALE_FIELD, newVal);
    }

    function ToggleExpand() {
        SetIsExpanded(!isExpanded);
    }

    let angle = isExpanded === true ? 0 : 90;
    return (
        <div id="element-component" className="row-start-4 col-span-2 bg-white text-sm border-t border-gray-300">
            <div className="border-b border-gray-300 pl-2 text-turquoise-500 shadow select-none grid items-center grid-rows-1 grid-cols-[auto_1fr]">
                <span>Transform</span> 
                <svg className="justify-self-end mr-4 fill-turquoise-500 hover:fill-turquoise-200 cursor-pointer" 
                    onClick={ToggleExpand} width={14} height={8} style={{rotate: `-${angle}deg`}}>
                    <polygon points="0,0 13,0 6.5,7"/>
                </svg>
            </div>
            <div hidden={!isExpanded}>
                <Vec3Input step={0.1} imgSrc={''} imgTitle="Position" onChange={HandlePositionChange} defVal={transforms.position}/>
                <Vec3Input step={1} imgSrc={''} imgTitle="Rotation" onChange={HandleRotationChange} defVal={transforms.rotation}/>
                <Vec3Input step={0.1} imgSrc={''} imgTitle="Scale" onChange={HandleScaleChange} defVal={transforms.scale}/>
            </div>
        </div>
    )
}