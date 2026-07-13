import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Planner from './pages/Planner';
import NotFound from './pages/NotFound';
import './App.css';
import Header from './comp/Header';
import { useEffect, useRef } from 'react';
import CircuitBkg from './comp/CircuitBkg';
import Footer from './comp/Footer';
import useGlitchAnimation from './hooks/useGlitchAnimation';

function App() {
    useGlitchAnimation();

    const aboutRef = useRef(null);
    const serviceRef = useRef(null);
    const workRef = useRef(null);
    const contactRef = useRef(null);

    // useEffect(() => {
    //     const glitchedElements = document.querySelectorAll(".glitch");
    //     const timeouts = [];
    //     const MIN_DELAY = 5000;
    //     const MAX_DELAY = 10000;
    //     glitchedElements.forEach((el) => {
    //         const glitchLoop = () => {
    //             const delay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;

    //             const timeout = setTimeout(() => {
    //                 el.className = "glitch";
    //                 const CHANCE = Math.random();
    //                 const ANIM_CODE = (CHANCE < 0.2 ? 1 : CHANCE < 0.5 ? 3 : 2);
    //                 setTimeout(() => {
    //                     el.classList.add(`glitch${ANIM_CODE}`);
    //                 }, Math.random() * 1);

    //                 glitchLoop();
    //             }, delay);

    //             timeouts.push(timeout);
    //         };

    //         glitchLoop();
    //     });

    //     return () => {
    //         timeouts.forEach(clearTimeout);
    //     };
    // }, []);

    return (
        <Router>
            <div className="App">
                <CircuitBkg />
                <CircuitBkg />
                <div className="glass"></div>
                <Header aboutRef={aboutRef} serviceRef={serviceRef} workRef={workRef} contactRef={contactRef} />
                <Routes>
                    <Route path="/" element={<Home aboutRef={aboutRef} serviceRef={serviceRef} workRef={workRef} contactRef={contactRef} />} />
                    <Route path="/planner" element={<Planner />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
