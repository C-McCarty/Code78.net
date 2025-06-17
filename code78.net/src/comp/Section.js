import { useState, useEffect, useRef } from "react";
import c from "../CSS/section.module.css";

export default function Section({children, secRef}) {
    return (
        <section ref={secRef} className={c.section}>
            <div className={c.innerWrap}>
                <div className={c.grid}></div>
                {children}
            </div>
        </section>
    );
}