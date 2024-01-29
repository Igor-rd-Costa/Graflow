import { useEffect, useRef } from "react"




export default function PropertiesPanelContextMenu({isChild, x, y, children} : {isChild: boolean, x: number, y: number, children?: JSX.Element}) {
    const ulElement = useRef(null);

    useEffect(() => {
        if (ulElement.current === null) {
            return;
        }

        const ul = ulElement.current as HTMLElement;
        const width = ul.getBoundingClientRect().width;
        const height = ul.getBoundingClientRect().height;
        const left = ul.getBoundingClientRect().left;
        const top = ul.getBoundingClientRect().top;
        let valX = width + left;
        let valY = height + top;
        const liParent = ul.parentElement;
        
        if (isChild) {
            if(liParent === null) {
                return;
            }
            const ulParent = liParent.closest('#properties-panel-context-menu');
            if (ulParent === null)
                return;

            const ulTop = ulParent.getBoundingClientRect().top + 2;
            const liTop = liParent.getBoundingClientRect().top - ulTop;
            valX = ulParent.getBoundingClientRect().width - 4;
            valY = liTop

            const pWidth = ulParent.getBoundingClientRect().width;
            const pLeft = ulParent.getBoundingClientRect().left;
            if ((pWidth + pLeft + width) > window.innerWidth) {
                valX = -width;
                ul.style.borderTopRightRadius = '0';
                ul.style.borderBottomRightRadius = '0';
            } else {
                ul.style.borderTopLeftRadius = '0';
                ul.style.borderBottomLeftRadius = '0';
            }
            ul.style.left = valX + 'px';
            ul.style.top = (valY - y) + 'px';
        }
        else {
            if (valX > window.innerWidth) {
                valX = window.innerWidth - width;
                ul.style.left = valX + 'px';
            }
            if (valY > window.innerHeight) {
                valY = window.innerHeight - height;
                ul.style.top = valY + 'px';
            }
        }
    }, [x, y]);

    return (
        <ul ref={ulElement} style={{top: y, left: x}} id="properties-panel-context-menu" className="z-[3] rounded bg-white min-w-[6rem] w-fit whitespace-nowrap border-2 border-turquoise-200 shadow-md context-menu absolute">
            {children}
        </ul>
    )
}