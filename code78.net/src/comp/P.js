import { useEffect, useRef, useState } from 'react';

export default function P({ title, content, pos="noPos", selfPos="noPos" }) {
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
        <div className="terminalWrap">
            <div className="terminalHeader">
                <h6>{title}</h6>
            </div>
            <div className="terminalBody">
                <p ref={pRef} className='p-typed' onClick={finishAnim}>
                    <span>&gt; </span>
                    {text}
                    <span className={text.length === content.length ? 'blink' : null}>|</span>
                </p>
            </div>
        </div>
    );
}
