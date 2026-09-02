import ContactForm from '../components/form/ContactForm.jsx';
import './Contact.css';

export default function Contact() {
  return (
    <div>
      <header className="page-hero">
        <div className="wrap">
          <p className="section-label">
            <span className="label-dot"></span>
            Get in touch
          </p>
          <h1 className="page-title">Let&apos;s talk security.</h1>
          <p className="page-sub">
            Responsible disclosures, collaboration ideas, or just a question about a post — I read everything and reply when I can.
          </p>
        </div>
      </header>

      <section className="contact-section">
        <div className="wrap contact-grid">
          <div className="contact-info">
            <div className="card">
              <h3>Direct channels</h3>
              <a className="link-row" href="mailto:itzbarshandey@gmail.com">itzbarshandey@gmail.com</a>
              <a className="link-row" href="https://github.com/itzbarshandey-sudo" target="_blank" rel="noopener noreferrer">GitHub: itzbarshandey-sudo</a>
              <a className="link-row" href="https://www.youtube.com/@itsmeNode" target="_blank" rel="noopener noreferrer">YouTube: @itsmeNode</a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
