import { useState, useEffect, useRef } from "react";
import c from "../CSS/section.module.css";

export default function Section({children, error404=null}) {
    const containerRef = useRef(null);
    const [offsetY, setOffsetY] = useState(0);
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
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

    useEffect(() => {
        if (error404) {
            setGlitch(false);
            const interval = setInterval(() => {
                setGlitch(true);
                console.log('fired');
            }, (Math.random() * 1000) + 1000);
            return () => clearInterval(interval)
        }
    }, [error404]);
    if (error404) {
        return (
            <section ref={containerRef} className={c.section}>
                <div className={c.bkgGlass} style={{ transform: `translateY(${offsetY/10}px)` }}></div>
                <div className={c.bkgGlass} style={{ transform: `translateY(${offsetY/10}px)` }}></div>
                <div className={`${c.innerWrap} ${c.error404}`}>
                    <h2 className="glitch" data-glitch="Error 404">Error 404</h2>
                    <h3 className="glitch" data-glitch="Page Not Found">Page Not Found</h3>
                    <h4 className="glitch" data-glitch="You're not supposed to be here...">You're not supposed to be here...</h4>
                </div>
            </section>
        );
    }
    return (
        <section ref={containerRef} className={c.section}>
            <div className={c.bkgGlass} style={{ transform: `translateY(${offsetY/10}px)` }}></div>
            <div className={c.bkgGlass} style={{ transform: `translateY(${offsetY/10}px)` }}></div>
            <div className={c.innerWrap}>
                {children}
            </div>
        </section>
    );
}