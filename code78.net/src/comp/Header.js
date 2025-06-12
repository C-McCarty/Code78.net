import { useState } from 'react';

export default function Header({aboutRef, serviceRef, contactRef}) {
    const scrollToSection = elementRef => {
        window.scrollTo({
            top: elementRef.current?.offsetTop,
            behavior: "smooth"
        });
    }


    return (
        <>
            <div className="headerShadow"></div>
            <header>
                <h1 className="glitch glitch1" data-glitch="code78.net">code78.net</h1>
                {window.innerWidth > 650 ?
                <nav>
                    <div className='navBtn glow' onClick={()=>scrollToSection(aboutRef)}>About</div>
                    <div className='navBtn glow' onClick={()=>scrollToSection(serviceRef)}>Services</div>
                    <div className='navBtn glow' onClick={()=>scrollToSection(contactRef)}>Contact</div>
                </nav>
                : null}
                <div className="scanLines"></div>
            </header>
        </>
    );
}