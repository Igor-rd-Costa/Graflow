import Vec3 from "@/Engine/Math/Vec3";
import { useRef } from "react";


type Vec3InputProps = {
    onChange: (newVal : Vec3) => void,
    imgSrc: string,
    step: number,
    imgTitle: string,
    defVal: Vec3,
}

export default function Vec3Input( {onChange, imgSrc, step, imgTitle, defVal } : Vec3InputProps) {
    let oldVal = defVal;
    const vecValX = useRef(null);
    const vecValY = useRef(null);
    const vecValZ = useRef(null);

    function HandleChange(event : React.ChangeEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains('vec3-input')) {
            if (vecValX.current === null || vecValY.current === null || vecValZ.current === null) {
                return;
            }
            let x = parseFloat((vecValX.current as HTMLInputElement).value);
            let y = parseFloat((vecValY.current as HTMLInputElement).value);
            let z = parseFloat((vecValZ.current as HTMLInputElement).value);
            if (isNaN(x)) {
                (vecValX.current as HTMLInputElement).value = `${oldVal[0]}`;
                x = oldVal[0];
            }
            if (isNaN(y)) {
                (vecValY.current as HTMLInputElement).value = `${oldVal[1]}`;
                y = oldVal[1];
            }
            if (isNaN(z)) {
                (vecValZ.current as HTMLInputElement).value = `${oldVal[2]}`;
                z = oldVal[2];
            }
            const newVal = new Vec3(x, y, z);
            oldVal = newVal;
            onChange(newVal);
        }
    }

    return (
        <div id="vec3-input-wrapper" className="grid grid-rows-[1.5rem] grid-cols-[1.7rem_repeat(3,auto_3.8rem)] p-2 pr-0 items-center border-b border-gray-300">
            <img title={imgTitle} className="w-[1.5rem] h-[1.5rem]"></img>
            <label className="w-fit pl-1 pr-1 h-[1.2rem] text-turquoise-500">X:</label>
            <input onChange={HandleChange} ref={vecValX} defaultValue={defVal[0]} type="number" step={step}
            className="vec3-input w-[3.5rem] pl-1 p-0 h-[1.4rem] rounded text-sm focus:border-turquoise-500 focus:ring-turquoise-500"/>
            <label className="w-fit pl-1 pr-1 h-[1.2rem] text-turquoise-500">Y:</label>
            <input onChange={HandleChange} ref={vecValY} defaultValue={defVal[1]} type="number" step={step}
            className="vec3-input w-[3.5rem] pl-1 p-0 h-[1.4rem] rounded text-sm focus:border-turquoise-500 focus:ring-turquoise-500"/>
            <label className="w-fit pl-1 pr-1 h-[1.2rem] text-turquoise-500">Z:</label>
            <input onChange={HandleChange} ref={vecValZ} defaultValue={defVal[2]} type="number" step={step}
            className="vec3-input w-[3.5rem] pl-1 p-0 h-[1.4rem] rounded text-sm focus:border-turquoise-500 focus:ring-turquoise-500"/>
        </div>
    )
}
