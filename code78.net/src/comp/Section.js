import { useState, useEffect, useRef } from "react";
import c from "../CSS/section.module.css";

export default function Section({children, secRef}) {
    const glassRef = useRef(null);
    const [offsetY, setOffsetY] = useState(0);
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (glassRef.current) {
                const rect = glassRef.current.getBoundingClientRect();
                const scrollTop = window.scrollY || window.pageYOffset;
                const elementTop = rect.top + scrollTop;
                const currentScroll = scrollTop;

                // Compute how far the element is from the top
                const distanceFromTop = elementTop - currentScroll;

                // Adjust this factor for stronger/weaker parallax
                const parallaxSpeed = 0.5;

                setOffsetY(distanceFromTop * parallaxSpeed);
            }
        };

        // Initial calculation and on scroll
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section ref={secRef} className={c.section}>
            {window.innerWidth > 1100 ? <>
                <div className={c.bkgGlass} style={{ transform: `translateY(${offsetY/10}px)` }}></div>
                <div className={c.bkgGlass} style={{ transform: `translateY(${offsetY/10}px)` }}></div>
            </> : null}
            <div className={c.innerWrap}>
                {children}
            </div>
        </section>
    );
}