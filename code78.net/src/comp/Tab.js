import { useState } from 'react';
import c from "../CSS/tabUI.module.css";

export default function Tab({children, onClick, active}) {
    return (
        <div onClick={onClick} className={active ? `${c.tab} ${c.active}` : c.tab}>
            <h6>{children}</h6>
        </div>
    );
}