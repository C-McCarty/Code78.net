import { useState } from 'react';

export default function Header({setPage=()=>{}, page=null}) {
    return(
        <>
            <div className="headerShadow"></div>
            <header>
                <h1>code78.net</h1>
                <nav>
                    <div className='navBtn glow' onClick={()=>setPage(0)}>Home</div>
                    <div className='navBtn glow' onClick={()=>setPage(1)}>About</div>
                    <div className='navBtn glow' onClick={()=>setPage(2)}>Contact</div>
                </nav>
                <div className="scanLines"></div>
            </header>
        </>
    );
}