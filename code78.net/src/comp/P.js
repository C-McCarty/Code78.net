import { useEffect, useRef, useState } from 'react';
import c from "../CSS/terminal.module.css";

export default function P({ title=null, content, pos="noPos", selfPos="noPos" }) {
    const [text, setText] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const pRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (pRef.current) {
            observer.observe(pRef.current);
        }
        return () => observer.disconnect();
    }, []);
    
    useEffect(() => {
        if (!isVisible || text.length === content.length || pos !== selfPos) return;

        const nextChar = content[text.length];
        const delay = (nextChar === "." ? 200 : nextChar === "," ? 150 : nextChar === " " ? 70 : 20);

        const timeout = setTimeout(() => {
            setText(prev => prev + content[prev.length]);
        }, delay + Math.random() * 5);

        return () => clearTimeout(timeout);
    }, [text, content, isVisible, pos]);

    const finishAnim = () => {
        setText(content);
    }

    return (
        <div className={c.terminalWrap}>
            {title === null ? null :
            <div className={c.terminalHeader}>
                <h6>{title}</h6>
            </div>
            }
            <div className={c.terminalBody}>
                <p ref={pRef} className={c.terminalText}>
                    <span>&gt; </span>
                    {text}
                    <span className={text.length === content.length ? 'blink' : null}>|</span>
                </p>
                {text.length === content.length ? null : <div className={c.skip} onClick={finishAnim}></div>}
            </div>
        </div>
    );
}
