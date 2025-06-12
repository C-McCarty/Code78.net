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

    const [loading, setLoading] = useState(false);

    const [lines, setLines] = useState(0);

    const formRef = useRef(null);
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
        setLoading(true);
        try {
            if (name.trim().length === 0) throw new Error("Must include a name.");
            if (email.trim().length === 0 || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) throw new Error("Must include an email address.");
            if (subject.trim().length === 0) throw new Error("Must include a subject.");
            if (message.trim().length === 0) throw new Error("Must include a message.");
        } catch (err) {
            alert('Error: ' + err.message);
            setLoading(false);
            return;
        }
        emailjs.init("OpSgDZ_LlyD5My5_O");
        emailjs.send("code78.net-service","contact_code78.net", {
            name: name,
            email: email,
            subject: subject,
            message: message,
        }).then(response => {
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
            alert('Message sent!', response.status, response.text);
            setLoading(false);
        }).catch(err => {
            alert('Error: ' + err.message);
        });
    }
    const handleSubmit = e => {
        if (!loading) formRef.current.requestSubmit();
    }

    return (
        <>
            <div className={c.formWrap}>
                <h6>Contact Form Prompt</h6>
                <form className={c.contactForm} onSubmit={sendEmail} ref={formRef}>
                    <p>Contact Us Form</p>
                    <p>Copyright (C) Code78.net. All rights reserved.</p>
                    <br />
                    <div>
                        <label htmlFor="name">Your name&gt;</label>
                        <input ref={nameRef} type="text" name="name" id="name" value={name} onKeyDown={handleNewLineDown} onKeyUp={handleNewLineUp} onChange={handleNameChange} required />
                    </div>
                    <div className={lines < 1 ? c.ghost : null}>
                        <label htmlFor="email">Email&gt;</label>
                        <input ref={emailRef} type="email" name="email" id="email" value={email} onKeyDown={handleNewLineDown} onKeyUp={handleNewLineUp} onChange={handleEmailChange} required />
                    </div>
                    {lines > 0 ?
                    <>
                    <div className={lines < 2 ? c.ghost : null}>
                        <label htmlFor="subject">Subject&gt;</label>
                        <input ref={subjectRef} type="text" name='subject' id='subject' value={subject} onKeyDown={handleNewLineDown} onKeyUp={handleNewLineUp} onChange={handleSubjectChange} required />
                    </div>
                    {lines > 1 ?
                    <>
                    <div className={lines < 3 ? c.ghost : null}>
                        <label htmlFor="message">Message&gt;</label>
                        <textarea ref={messageRef} name="message" id="message" value={message} onChange={handleMessageChange} required />
                    </div>
                    </>
                    : null}
                    </>
                    : null}
                </form>
            </div>
            <div className={c.buttonWrap}>
                <button onClick={handleSubmit} className={loading ? c.loading : null}><span>Send</span><div className={c.loading}></div></button>
            </div>
        </>
    );
}