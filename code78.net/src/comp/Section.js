import { useState, useEffect, useRef } from "react";
import c from "../CSS/section.module.css";
import P from "./P";
import { Link } from "react-router-dom";

export default function Section({children, secRef, error404=false, expandable=false}) {
    if (error404) {
        return (
            <section className={c.section}>
                <div className={c.innerWrap}>
                    <div className={c.grid}></div>
                    <h2 className='glitch' data-glitch="Error 404">Error 404</h2>
                    <P title={"Page not found"} content="This page either does not exist or has been permanently moved." />
                    <div className={c.buttonWrap}>
                        <Link to="/" className={c.button}>Homepage</Link>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section ref={secRef} className={`${c.section} ${expandable ? c.expandable : ""}`}>
            <div className={c.innerWrap}>
                <div className={c.grid}></div>
                {children}
            </div>
        </section>
    );
}