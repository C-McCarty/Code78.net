import c from "../CSS/portfolio.module.css";
import items from "../data/portfolio.json";

export default function Portfolio() {
    return (
        <div className={c.grid}>
            {items.map((p, i) => (
                <div className={c.card} key={i}>
                    <div className={c.cardHeader}>
                        <span className={c.cardTitle}>{p.title}</span>
                        <span className={`${c.badge} ${c[p.status]}`}>{p.statusLabel}</span>
                    </div>
                    <div className={c.cardBody}>
                        <div className={c.desc}>{p.description}</div>
                        <div className={c.tags}>
                            {p.stack.map((t, j) => <span className={c.tag} key={j}>{t}</span>)}
                        </div>
                        <div className={c.cardFooter}>
                            {p.url
                                ? <a className={c.liveLink} href={p.url} target="_blank" rel="noreferrer">&gt; {p.linkLabel || "view_project"}</a>
                                : <span className={c.muted}>&gt; details_soon</span>}
                            {p.credit ? <span className={c.credit}>{p.credit}</span> : null}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
