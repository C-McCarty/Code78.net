import { useState } from 'react';
import Section from '../comp/Section';

export default function Planner() {
    const [fullscreen, setFullScreen] = useState(false);
    return(
        <Section expandable>
            <div className={fullscreen ? "iframeWrap fullscreen" : "iframeWrap"}>
                <iframe title='questionnaire' className='formPortal' src="https://forms.gle/25ksQdauFq3dY72DA" frameborder="0"></iframe>
                {fullscreen ?
                    <div className="formFullscreen exit" onClick={()=>setFullScreen(false)}></div> :
                    <div className="formFullscreen open" onClick={()=>setFullScreen(true)}></div>
                }
            </div>
        </Section>
    );
}