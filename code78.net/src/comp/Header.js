import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header({aboutRef, serviceRef, contactRef}) {
    const navigate = useNavigate();
    const location = useLocation();
    const scrollToSection = async elementRef => {
        window.scrollTo({
            top: elementRef.current?.offsetTop,
            behavior: "smooth"
        });
    }
    
    if (location.pathname !== "/") {
        return (
            <>
                <div className="headerShadow"></div>
                <header>
                    <h1 className="glitch glitch1" data-glitch="code78.net">code78.net</h1>
                    {window.innerWidth > 650 ?
                    <nav>
                        <Link to="/" className='navBtn glow'>Home</Link>
                        <Link to="/planner" className='navBtn glow'>Planner</Link>
                    </nav>
                    : null}
                    <div className="scanLines"></div>
                </header>
            </>
        );
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
                    <Link to="/planner" className='navBtn glow'>Planner</Link>
                </nav>
                : null}
                <div className="scanLines"></div>
            </header>
        </>
    );
}