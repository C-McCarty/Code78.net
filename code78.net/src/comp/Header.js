import { useState } from 'react';

export default function Header({aboutRef, serviceRef, contactRef}) {
    const scrollToSection = elementRef => {
        console.log(elementRef)
        window.scrollTo({
            top: elementRef.current?.offsetTop,
            behavior: "smooth"
        });
    }


    return (
        <>
            <div className="headerShadow"></div>
            <header>
                <h1 className="glitch" data-glitch="code78.net">code78.net</h1>
                <nav>
                    <div className='navBtn glow' onClick={()=>scrollToSection(aboutRef)}>About</div>
                    <div className='navBtn glow' onClick={()=>scrollToSection(serviceRef)}>Services</div>
                    <div className='navBtn glow' onClick={()=>scrollToSection(contactRef)}>Contact</div>
                </nav>
                <div className="scanLines"></div>
            </header>
        </>
    );
}