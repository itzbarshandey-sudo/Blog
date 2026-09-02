import ContactForm from '../components/form/ContactForm.jsx';
import Mascot from '../components/ui/Mascot.jsx';
import './Contact.css';

export default function Contact() {
  return (
    <div>
      <header className="page-hero">
        <div className="wrap page-hero-wrap">
          <div className="page-hero-copy">
            <p className="section-label">
              <span className="label-dot"></span>
              Get in touch
            </p>
            <h1 className="page-title">Let&apos;s talk security.</h1>
            <p className="page-sub">
              Responsible disclosures, collaboration ideas, or just a question about a post — I read everything and reply when I can.
            </p>
          </div>
          <div className="page-hero-art" aria-hidden="true">
            <Mascot src="/assets/mascotcontact.webp" width={340} height={354} className="page-mascot" />
          </div>
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
            <div className="card contact-promise">
              <h3>What to expect</h3>
              <ul>
                <li>Real replies — I read every message.</li>
                <li>Disclosures handled responsibly and quickly.</li>
                <li>No marketing, no follow-ups unless you ask.</li>
              </ul>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
