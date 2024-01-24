import Vec3 from "@/Engine/Math/Vec3";
import ElementService from "@/Services/ElementService"
import { Graflow } from "@/types/GraflowTypes";
import React, { ChangeEvent, Component, FormEvent, FormEventHandler, useEffect, useRef, useState } from "react";


type Properties = {
    name: string,
    format: number,
    position : {x: string, y: string, z: string}
}

export default function PropertiesPanel() {
    const [ properties, SetProperties ] = useState<Properties | null>(null);
    const transformPositionX = useRef(null);
    const transformPositionY = useRef(null);
    const transformPositionZ = useRef(null);
    useEffect(() => {
        ElementService.RegisterSelectionChangeListener(OnElementSelectionChange);
    }, [])

    function OnElementSelectionChange(element : Graflow.Element | null) {
        if (element === null) {
            SetProperties(null);
            return;
        }
        let pos = {
            x: element.position.value[0].toString(), 
            y: element.position.value[1].toString(), 
            z: element.position.value[2].toString()
        };
        SetProperties({name: "Element Name", position: pos, format: 0});
    }

    async function HandleChange(event : FormEvent) {
        if (event.type !== 'change')
            return;

        const target = event.target as HTMLElement;
        if (target.classList.contains('component-transform-position')) {
            if (transformPositionX.current === null 
                || transformPositionY.current === null 
                || transformPositionZ.current === null) {
                    return;
                }

            const pos = {
                x: (transformPositionX.current as HTMLInputElement).value,
                y: (transformPositionY.current as HTMLInputElement).value,
                z: (transformPositionZ.current as HTMLInputElement).value
            };
            const position = new Vec3(
                parseFloat(pos.x),
                parseFloat(pos.y),
                parseFloat(pos.z)
            );
            ElementService.UpdateComponent(
                Graflow.ComponentType.TRANSFORM_COMPONENT, 
                Graflow.TransformComponentField.POSITION_FIELD, 
                position.value
            ).then(result => {
                if (result) {
                    SetProperties({name: "Element Name", position: pos, format: 0});
                }
            });

        }
    }
    
    return (
        <>
            <section className="bg-gray-200 border border-gray-500 rounded row-span-2 w-[285px]">
            <div className="shadow border-b bg-white rounded-t pl-2 h-[25px] border-gray-300 text-turquoise-500">Properties</div>
            {properties !== null &&
            <>
                <div id="element-basic-info" className="pl-2 pt-2 bg-white grid grid-cols-[2.5rem_1fr] grid-rows-[1.25rem_1.25rem_1rem] text-sm">
                    <img className="w-[2.5rem] h-[2.5rem]"></img>
                    <div className="pl-2 col-start-2 row-start-1">
                        <span className="text-turquoise-500 select-none">Name:</span>
                        <span className="pl-1">{properties.name}</span>
                    </div>
                    <div className="pl-2 col-start-2 row-start-2 select-none">
                        <span className="text-turquoise-500">Type:</span>
                        <span className="pl-1">
                        {/*Maybe change color to show its not editable*/}
                        ElementType
                        </span>
                    </div>
                </div>
                <div id="element-component" className="row-start-4 col-span-2 bg-white text-sm border-b border-t border-gray-300">
                    <div className="border-b border-gray-300 pl-2 text-turquoise-500 shadow select-none">Transform</div>
                    <div className="grid grid-rows-[1.5rem] grid-cols-[1.7rem_repeat(3,auto_3.8rem)] p-2 pr-0 items-center">
                        <img className="w-[1.5rem] h-[1.5rem]"></img>
                        <label className="w-fit pl-1 pr-1 h-[1.2rem] text-turquoise-500">X:</label>
                        <input onChange={HandleChange} ref={transformPositionX} value={properties.position.x} id="transform-position-x" type="number"
                        className="component-transform-position w-[3.5rem] pl-1 p-0 h-[1.4rem] rounded text-sm focus:border-turquoise-500 focus:ring-turquoise-500"/>
                        <label className="w-fit pl-1 pr-1 h-[1.2rem] text-turquoise-500">Y:</label>
                        <input onChange={HandleChange} ref={transformPositionY} value={properties.position.y} id="transform-position-y" type="number"
                        className="component-transform-position w-[3.5rem] pl-1 p-0 h-[1.4rem] rounded text-sm focus:border-turquoise-500 focus:ring-turquoise-500"/>
                        <label className="w-fit pl-1 pr-1 h-[1.2rem] text-turquoise-500">Z:</label>
                        <input onChange={HandleChange} ref={transformPositionZ} value={properties.position.z} id="transform-position-z" type="number"
                        className="component-transform-position w-[3.5rem] pl-1 p-0 h-[1.4rem] rounded text-sm focus:border-turquoise-500 focus:ring-turquoise-500"/>
                    </div>
                </div>
            </>
             }
            </section>
        </>
    )
}