import { useEffect, useRef, useState } from 'react';
import c from "../CSS/contactForm.module.css";
import emailjs from "emailjs-com";

export default function ContactForm() {
    // useState
    const [name, setName] = useState("");
    const handleNameChange = e => setName(e.target.value);
    const [email, setEmail] = useState("");
    const handleEmailChange = e => setEmail(e.target.value);
    const [subject, setSubject] = useState("");
    const handleSubjectChange = e => setSubject(e.target.value);
    const [message, setMessage] = useState("");
    const handleMessageChange = e => setMessage(e.target.value);

    const [lines, setLines] = useState(0);

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const subjectRef = useRef(null);
    const messageRef = useRef(null);

    const handleNewLineUp = e => {
        if (lines === 1 && emailRef.current && e.key === "Enter") { emailRef.current.focus(); }
        if (lines === 2 && subjectRef.current && e.key === "Enter") { subjectRef.current.focus(); }
        if (lines === 3 && messageRef.current && e.key === "Enter") { messageRef.current.focus(); }
    }
    const handleNewLineDown = e => {
        console.log(e);
        if (nameRef.current && e.target === nameRef.current && (e.key === "Enter" || e.key === "Tab") && lines < 1) { setLines(1); }
        if (emailRef.current && e.target === emailRef.current && (e.key === "Enter" || e.key === "Tab") && lines < 2) { setLines(2); }
        if (subjectRef.current && e.target === subjectRef.current && (e.key === "Enter" || e.key === "Tab") && lines < 3) { setLines(3); }
    }
    const sendEmail = e => {
        e.preventDefault();
        emailjs.init("OpSgDZ_LlyD5My5_O");
        emailjs.send("code78.net-service","contact_code78.net", {
            name: name,
            email: email,
            subject: subject,
            message: message,
        }).then((response) => {
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
            alert('Message sent!', response.status, response.text);
        }).catch((err) => {
            alert('An error occurred while trying to send your messge. Please try again later.', err.text);
        });
    }

    return (
        <div className={c.formWrap}>
            <h6>Contact Form Prompt</h6>
            <form className={c.contactForm} onSubmit={sendEmail}>
                <p>Contact Us Form</p>
                <p>Copyright (C) Code78.net. All rights reserved.</p>
                <br />
                <div>
                    <label htmlFor="name">Your name&gt;</label>
                    <input ref={nameRef} type="text" name="name" id="name" value={name} onKeyDown={handleNewLineDown} onKeyUp={handleNewLineUp} onChange={handleNameChange} required />
                </div>
                {lines > 0 ? 
                <>
                <div>
                    <label htmlFor="email">Email&gt;</label>
                    <input ref={emailRef} type="email" name="email" id="email" value={email} onKeyDown={handleNewLineDown} onKeyUp={handleNewLineUp} onChange={handleEmailChange} required />
                </div>
                {lines > 1 ?
                <>
                <div>
                    <label htmlFor="subject">Subject&gt;</label>
                    <input ref={subjectRef} type="text" name='subject' id='subject' value={subject} onKeyDown={handleNewLineDown} onKeyUp={handleNewLineUp} onChange={handleSubjectChange} required />
                </div>
                {lines > 2 ?
                <>
                <div>
                    <label htmlFor="message">Message&gt;</label>
                    <textarea ref={messageRef} name="message" id="message" value={message} onChange={handleMessageChange} required />
                </div>
                </>
                : null}
                </>
                : null}
                </>
                : null}
                <div className={c.buttonWrap}>
                    <button>Send</button>
                </div>
            </form>
        </div>
    );
}