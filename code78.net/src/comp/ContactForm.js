import { useEffect, useRef, useState } from 'react';
import c from "../CSS/contactForm.module.css";

export default function ContactForm() {
    const [name, setName] = useState("");
    const handleNameChange = e => setName(e.target.value);
    const [email, setEmail] = useState("");
    const handleEmailChange = e => setEmail(e.target.value);
    const [subject, setSubject] = useState("");
    const handleSubjectChange = e => setSubject(e.target.value);
    const [message, setMessage] = useState("");
    const handleMessageChange = e => setMessage(e.target.value);

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const subjectRef = useRef(null);
    const messageRef = useRef(null);

    useEffect(() => {
        if (nameRef.current && emailRef.current && subjectRef.current && messageRef.current) {
            if (name.trim().length === 0 && document.activeElement !== nameRef.current) {
                console.log('fired');
            }
        }
    }, [name, email, subject, message]);

    return (
        <div className={c.formWrap}>
            <h6>Contact Us</h6>
            <form className={c.contactForm}>
                <div>
                    <label htmlFor="name">Name&gt;</label>
                    <input ref={nameRef} type="text" name="name" id="name" value={name} onChange={handleNameChange} required />
                </div>
                <div>
                    <label htmlFor="email">Email&gt;</label>
                    <input ref={emailRef} type="email" name="email" id="email" value={email} onChange={handleEmailChange} required />
                </div>
                <div>
                    <label htmlFor="subject">Subject&gt;</label>
                    <input ref={subjectRef} type="text" name='subject' id='subject' value={subject} onChange={handleSubjectChange} required />
                </div>
                <div>
                    <label htmlFor="message">Message&gt;</label>
                    <textarea ref={messageRef} name="message" id="message" value={message} onChange={handleMessageChange} required />
                </div>
            </form>
        </div>
    );
}