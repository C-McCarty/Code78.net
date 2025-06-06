import c from "../CSS/section.module.css";

export default function Section({children}) {
    return(
        <section className={c.section}>
            <div className={c.innerWrap}>
                {children}
            </div>
        </section>
    );
}