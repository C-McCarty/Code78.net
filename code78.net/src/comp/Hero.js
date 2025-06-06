import { useState } from 'react';
import c from "../CSS/hero.module.css";

export default function Hero() {
    const CTA = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
        });
    }

    return(
        <div className={c.hero}>
            <div className={c.innerWrap}>
                {/* Cool stuff goes here */}
                <div className={c.ctaWrap}>
                    <button className={c.cta} onClick={CTA}>See More</button>
                </div>
            </div>
        </div>
    );
}