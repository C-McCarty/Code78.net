import { useState } from 'react';
import './App.css';
import Header from './comp/Header';
import Hero from './comp/Hero';
import Section from './comp/Section';
import CircuitBkg from './comp/CircuitBkg';
import Footer from './comp/Footer';
import ComingSoon from './comp/ComingSoon';

function App() {
    const [page, setPage] = useState(0);

    // Main Page
    if (page === 0) {
        return (
            <div className="App">
                <CircuitBkg />
                <Header setPage={setPage} page={page} />
                <Hero />
                <div className="main">
                    <Section>
                        <h2>Our Services</h2>
                    </Section>
                    <Section>
                        <h2>About Us</h2>
                        <p>We're a small team of web developers who build reliable, easy-to-use websites and web apps. We focus on clear communication, clean code, and making sure everything works the way it should. Whether you're starting from scratch or need help improving what you already have, we’re here to help.</p>
                    </Section>
                </div>
                <Footer />
                <div className="scanLines"></div>
            </div>
        );
    }
    // About page
    if (page === 1) {
        return (
            <div className="App">
                <Header setPage={setPage} page={page} />
                <div className="main">
                    <Section>
                        <h2>About code78.net</h2>
                    </Section>
                </div>
                <Footer />
                <div className="scanLines"></div>
            </div>
        );
    }

    // Coming Soon Page
    return (
        <div className="App">
            <Header setPage={setPage} page={page} />
            <ComingSoon />
            <Footer />
            <div className="scanLines"></div>
        </div>
    );
}

export default App;
