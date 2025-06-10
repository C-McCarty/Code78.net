import { useEffect, useRef, useState } from 'react';
import './App.css';
import Header from './comp/Header';
import Hero from './comp/Hero';
import Section from './comp/Section';
import ContactForm from './comp/ContactForm';
import CircuitBkg from './comp/CircuitBkg';
import Footer from './comp/Footer';

function App() {
    const [section, setSection] = useState(0);
    const aboutRef = useRef(null);
    const serviceRef = useRef(null);
    const contactRef = useRef(null);

    useEffect(() => {
        const glitchedElements = document.querySelectorAll(".glitch");

        glitchedElements.forEach((el, i) => {
            const delay = (Math.random() * 2).toFixed(2) + "s";
            el.style.setProperty("--delay", delay);
        });
    }, []);

    // Main Page
    return (
        <div className="App">
            <CircuitBkg />
            <CircuitBkg />
            <CircuitBkg />
            <CircuitBkg />
            <Header aboutRef={aboutRef} serviceRef={serviceRef} contactRef={contactRef} />
            <div className="main">
                <Section secRef={aboutRef}>
                    <h2>Who We Are</h2>
                    <p>We're a dedicated team of web developers who build reliable, easy-to-use websites and web apps. We focus on clear communication, clean code, and making sure everything works the way it should. Whether you're starting from scratch or need help improving what you already have, we’re here to help.</p>
                </Section>
                <Section secRef={serviceRef}>
                    <h2>What We Do</h2>
                </Section>
                <Section secRef={contactRef}>
                    <h2>Get In Touch</h2>
                    <ContactForm />
                </Section>
            </div>
            <Footer />
            <div className="scanLines"></div>
        </div>
    );
    // 404 Page
    return (
        <div className="App">
            <CircuitBkg page={section} />
            <CircuitBkg page={section} />
            <CircuitBkg page={section} />
            <CircuitBkg page={section} />
            <Header setPage={setSection} page={section} glitch={true} />
            <Section error404={true} />
            <Footer />
            <div className="scanLines"></div>
        </div>
    );
}

export default App;
