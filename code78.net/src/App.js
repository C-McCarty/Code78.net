import { useState } from 'react';
import './App.css';
import Header from './comp/Header';
import Hero from './comp/Hero';
import Section from './comp/Section';
import Footer from './comp/Footer';
import ComingSoon from './comp/ComingSoon';

function App() {
    const [page, setPage] = useState(0);

    // Main Page
    if (page === 0) {
        return (
            <div className="App">
                <Header setPage={setPage} page={page} />
                <Hero />
                <div className="main">
                    <Section>
                        <h2>This is a header2</h2>
                    </Section>
                </div>
                <Footer />
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
            </div>
        );
    }

    // Coming Soon Page
    return (
        <div className="App">
            <Header setPage={setPage} page={page} />
            <ComingSoon />
            <Footer />
        </div>
    );
}

export default App;
