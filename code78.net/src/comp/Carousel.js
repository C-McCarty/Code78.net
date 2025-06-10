import { useEffect, useState } from 'react';
import c from "../CSS/carousel.module.css";
import CarouselItem from './CarouselItem';
import items from "../data/carousel.json";

export default function Carousel() {
    const [pos, setPos] = useState(1);
    const [cItems, setItems] = useState([]);

    useEffect(() => {
        const a = items.map((el, i) => <CarouselItem key={i} pos={pos} selfPos={i} title={el.title}>{el.content}</CarouselItem>);
        setItems(a);
    }, [items, pos]);

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

    const posStyle = {
        left: (pos * -35) + 20 + "vw"
    }

    return (
        <div className={c.carouselWrap}>
            <div className={c.carousel} style={posStyle}>
                {cItems}
            </div>
            <div className={c.left} onClick={() => handlePosChange(-1)}></div>
            <div className={c.right} onClick={() => handlePosChange(1)}></div>
        </div>
    );
}