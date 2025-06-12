import { useEffect, useState } from 'react';
import c from "../CSS/tabUI.module.css";
import items from "../data/services.json";
import Tab from './Tab';
import TabPanel from './TabPanel';

export default function TabUI() {
    const [tabs, setTabs] = useState([]);
    const [tabPanels, setTabPanels] = useState([]);
    const [active, setActive] = useState(0);

    useEffect(() => {
        setTabs(items.map((el, i) => <Tab key={i} active={active === i} onClick={() => setActive(i)} >{el.title}</Tab>));
        setTabPanels(items.map((el, i) => <TabPanel key={i} active={active === i}>{el.content}</TabPanel>));
    }, [items, active]);

    return (
        <div className={c.tabWrap}>
            <div className={c.tabHeader}>
                {tabs}
            </div>
            <div className={c.tabPanelWrap}>
                {tabPanels}
            </div>
        </div>
    );
}