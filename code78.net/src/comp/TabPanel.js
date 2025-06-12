import { useState } from 'react';
import c from "../CSS/tabUI.module.css";
import P from "./P";

export default function TabPanel({children, active}) {
    return(
        <div className={c.tabPanel}>
            {active ? 
            <P content={children} />
            : null}
        </div>
    );
}