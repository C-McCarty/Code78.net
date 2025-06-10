import c from "../CSS/carousel.module.css";
import P from "./P";

export default function CarouselItem({title, children, pos, selfPos}) {
    return(
        <div className={c.carouselItem}>
            <h5>{title}</h5>
            <P content={children} pos={pos} selfPos={selfPos} />
        </div>
    );
}