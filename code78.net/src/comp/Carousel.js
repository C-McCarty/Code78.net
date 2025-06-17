import { useEffect, useRef, useState } from 'react';
import c from "../CSS/carousel.module.css";
import P from './P';
import items from "../data/services.json";

export default function Carousel() {
    const [pos, setPos] = useState(1);
    const [cItems, setItems] = useState([]);

    const carouselRef = useRef(null);

    useEffect(() => {
        const a = items.map((el, i) => <div className={i === pos ? c.innerWrap : `${c.innerWrap} ${c.inactive}`}><P key={i} pos={pos} selfPos={i} title={el.title} content={el.content} /></div>);
        setItems(a);
    }, [items, pos]);
    useEffect(() => {
        if (!carouselRef.current) return;
        carouselRef.current.style.width = 35 * cItems.length + "vw";
        carouselRef.current.style.left = (pos * -35) + 15 + "vw";
    }, [cItems]);

    const handlePosChange = x => {
        if (x > 0) {
            if (pos > cItems.length - 2) {
                setPos(0);
            } else {
                setPos(pos + 1);
            }
        }
        if (x < 0) {
            if (pos < 1) {
                setPos(cItems.length - 1);
            } else {
                setPos(pos - 1);
            }
        }
    }

    return (
        <div className={c.carouselWrap}>
            <div className={c.carousel} ref={carouselRef}>
                {cItems}
            </div>
            <div className={c.left} onClick={() => handlePosChange(-1)}></div>
            <div className={c.right} onClick={() => handlePosChange(1)}></div>
        </div>
    );
}