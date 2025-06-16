import { useEffect, useRef, useState } from 'react';
import './App.css';
import Header from './comp/Header';
import Section from './comp/Section';
import P from './comp/P';
import ContactForm from './comp/ContactForm';
import CircuitBkg from './comp/CircuitBkg';
import Footer from './comp/Footer';
import Carousel from './comp/Carousel';
import TabUI from './comp/TabUI';

function App() {
    const [section, setSection] = useState(0);
    const aboutRef = useRef(null);
    const serviceRef = useRef(null);
    const contactRef = useRef(null);

    useEffect(() => {
        const glitchedElements = document.querySelectorAll(".glitch");
        const timeouts = [];
        const MIN_DELAY = 5000;
        const MAX_DELAY = 10000;
        glitchedElements.forEach((el) => {
            const glitchLoop = () => {
                const delay = Math.random() * MIN_DELAY + (MAX_DELAY - MIN_DELAY);

                const timeout = setTimeout(() => {
                    el.className = "glitch";
                    const CHANCE = Math.random();
                    const ANIM_CODE = (CHANCE < 0.2 ? 1 : CHANCE < 0.5 ? 3 : 2);
                    setTimeout(() => {
                        el.classList.add(`glitch${ANIM_CODE}`);
                    }, Math.random() * 1);

                    glitchLoop();
                }, delay);

                timeouts.push(timeout);
            };

            glitchLoop();
        });

        return () => {
            timeouts.forEach(clearTimeout);
        };
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
                    <h2 className='glitch' data-glitch="Who We Are">Who We Are</h2>
                    <P content="We're a dedicated team of full-stack developers who build reliable, easy-to-use websites and applications. We focus on clear communication, clean code, and making sure everything works the way it should. Whether you're starting from scratch or improving what you already have, we’re here to help!" />
                </Section>
                <Section secRef={serviceRef}>
                    <h2  className='glitch' data-glitch="What We Do">What We Do</h2>
                    {window.innerWidth > 1100 ? 
                    <Carousel />
                    : <TabUI />}
                </Section>
                <Section secRef={contactRef}>
                    <h2 className='glitch' data-glitch="Get In Touch">Get In Touch</h2>
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
