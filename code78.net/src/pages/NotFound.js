import Section from "../comp/Section";

export default function NotFound() {
    return (
        <>
            <Section secRef={null} error404 />
            <div className="scanLines"></div>
        </>
    );
}