import Vec3 from "@/Engine/Math/Vec3";
import ComponentService from "@/Services/ComponentService";
import ElementService from "@/Services/ElementService";
import { GfComponentType } from "@/Types/Graflow/Compoments";
import { GfTransformComponentField } from "@/Types/Graflow/Element";
import { useRef } from "react";

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
    const transformPositionX = useRef(null);
    const transformPositionY = useRef(null);
    const transformPositionZ = useRef(null);

    function HandleChange(event : React.ChangeEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains('component-transform-position')) {
            if (transformPositionX.current === null || transformPositionY.current === null || transformPositionZ.current === null) {
                return;
            }
            const pos = new Vec3(
                parseFloat((transformPositionX.current as HTMLInputElement).value),
                parseFloat((transformPositionY.current as HTMLInputElement).value),
                parseFloat((transformPositionZ.current as HTMLInputElement).value)
            );
            ComponentService.UpdateComponent(id, GfTransformComponentField.POSITION_FIELD, pos);
        }
    }

    return (
        <div id="element-component" className="row-start-4 col-span-2 bg-white text-sm border-b border-t border-gray-300">
            <div className="border-b border-gray-300 pl-2 text-turquoise-500 shadow select-none">Transform</div>

            <div className="grid grid-rows-[1.5rem] grid-cols-[1.7rem_repeat(3,auto_3.8rem)] p-2 pr-0 items-center">
                <img className="w-[1.5rem] h-[1.5rem]"></img>
                <label className="w-fit pl-1 pr-1 h-[1.2rem] text-turquoise-500">X:</label>
                <input onChange={HandleChange} ref={transformPositionX} defaultValue={transforms.position[0]} id="transform-position-x" type="number"
                className="component-transform-position w-[3.5rem] pl-1 p-0 h-[1.4rem] rounded text-sm focus:border-turquoise-500 focus:ring-turquoise-500"/>
                <label className="w-fit pl-1 pr-1 h-[1.2rem] text-turquoise-500">Y:</label>
                <input onChange={HandleChange} ref={transformPositionY} defaultValue={transforms.position[1]} id="transform-position-y" type="number"
                className="component-transform-position w-[3.5rem] pl-1 p-0 h-[1.4rem] rounded text-sm focus:border-turquoise-500 focus:ring-turquoise-500"/>
                <label className="w-fit pl-1 pr-1 h-[1.2rem] text-turquoise-500">Z:</label>
                <input onChange={HandleChange} ref={transformPositionZ} defaultValue={transforms.position[2]} id="transform-position-z" type="number"
                className="component-transform-position w-[3.5rem] pl-1 p-0 h-[1.4rem] rounded text-sm focus:border-turquoise-500 focus:ring-turquoise-500"/>
            </div>
        </div>
    )
}