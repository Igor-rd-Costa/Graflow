import Engine from "@/Engine/Engine";
import Input from "@/Engine/Input";
import Vec3 from "@/Engine/Math/Vec3";
import Renderer from "@/Engine/Renderer/Renderer";
import { useEffect, useState } from "react"

type ViewportSize = {
    width: number,
    height: number
}

export default function Viewport() {
    const size : ViewportSize = {width: 1280, height: 720 };
    let gl : WebGL2RenderingContext | null = null;

    useEffect(()=>{
      Engine.Init();
    }, []);

    function HandleKeyDown(event : KeyboardEvent) {
      const key = event.code;

      if (event.repeat === false)
        Input.RegisterKeyPress(key);
    }

    function HandleKeyUp(event : KeyboardEvent) {
      const key = event.code;

      if (event.repeat === false)
        Input.RegisterKeyRelease(key);
    }
    
    function HandleMouseDown(event : React.MouseEvent) {
      if (event.button === 2) {
        document.addEventListener('keydown', HandleKeyDown);
        document.addEventListener('keyup', HandleKeyUp);
      }
    }
    
    function HandleMouseUp(event : React.MouseEvent) {
      if (event.button === 2) {
        document.removeEventListener('keydown', HandleKeyDown);
        document.removeEventListener('keyup', HandleKeyUp);
        Input.ResetState();
      }
    }

    function BlockContextMenu(event : React.MouseEvent) {
      event.preventDefault();
    }

    return (
        <div id="viewport-wrapper" className='border border-gray-500 w-full h-full overflow-hidden' onContextMenu={BlockContextMenu} onMouseUp={HandleMouseUp} onMouseDown={HandleMouseDown}>
            <canvas id="viewport" width={size.width} height={size.height}></canvas>
        </div>
    )
}