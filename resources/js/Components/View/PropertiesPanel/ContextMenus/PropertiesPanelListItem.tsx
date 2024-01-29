import { useState } from "react";


type TestListItemProps = {
    onClick?: ((event: React.MouseEvent) => void) | (() => void);
    text: string,
    children?: JSX.Element;
}

export default function PropertiesPanelListItem({onClick, text, children} : TestListItemProps) {
    const [isChildVisible, SetIsChildVisible ] = useState(false);

    function OnMouseEnter(event : React.MouseEvent) {   
        SetIsChildVisible(true);
    }

    function OnMouseLeave(event : React.MouseEvent) {
       SetIsChildVisible(false);
    }


    return (
        <li id="test-list-item" onClick={onClick} onMouseEnter={OnMouseEnter} onMouseLeave={OnMouseLeave} className="hover:bg-gray-200 cursor-pointer w-full pl-2 pr-2 h-8 w-fit flex items-center">
            {text}
            {isChildVisible && children}
        </li>
    )
}