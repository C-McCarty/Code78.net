import Section from '../comp/Section';
import P from '../comp/P';
import ContactForm from '../comp/ContactForm';
import Carousel from '../comp/Carousel';
import TabUI from '../comp/TabUI';
import Portfolio from '../comp/Portfolio';

export default function Home({aboutRef, serviceRef, workRef, contactRef}) {

    return (
            <>
                <div className="main">
                    <Section secRef={aboutRef}>
                        <h2 className='glitch' data-glitch="Who We Are">Who We Are</h2>
                        <P title={"About Us"} content="We're a dedicated team of full-stack developers who build reliable, easy-to-use websites and applications. We focus on clear communication, clean code, and making sure everything works the way it should. Whether you're starting from scratch or improving what you already have, we’re here to help!" />
                    </Section>
                    <Section secRef={serviceRef}>
                        <h2 className='glitch' data-glitch="What We Do">What We Do</h2>
                        {window.innerWidth > 1100 ?
                        <Carousel />
                        : <TabUI />}
                    </Section>
                    <Section secRef={workRef} expandable>
                        <h2 className='glitch' data-glitch="Our Work">Our Work</h2>
                        <Portfolio />
                    </Section>
                    {/* <Section secRef={contactRef}>
                        <h2 className='glitch' data-glitch="Get In Touch">Get In Touch</h2>
                        <ContactForm />
                    </Section> */}
                    <Section secRef={contactRef}>
                        <h2 className='glitch' data-glitch="Get In Touch">Get In Touch</h2>
                        <div className="iframeWrap">
                            <iframe title='contact' className='contact-iframe' src="https://forms.gle/v9UmYvy6ChhuPZuZA" frameborder="0"></iframe>
                        </div>
                    </Section>
                    <div className="scanLines"></div>
                </div>
            </>
        );
}