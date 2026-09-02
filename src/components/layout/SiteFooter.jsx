export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <NavLink to="/" className="brand">
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
                <path d="M24 4 L42 11 V22 C42 33 34.5 41 24 44 C13.5 41 6 33 6 22 V11 Z" fill="#2d9e42" stroke="#e8f5e9" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M16 24 L21.5 29.5 L33 17" stroke="#0a0f0d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              Node
            </NavLink>
            <p>Barshan Dey&apos;s cybersecurity learning journal — built in public, updated regularly.</p>
          </div>
          <div>
            <h4 className="footer-heading">Site</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/resume">Resume</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Elsewhere</h4>
            <ul className="footer-links">
              <li><a href="https://github.com/itzbarshandey-sudo" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://www.youtube.com/@itsmeNode" target="_blank" rel="noopener noreferrer">YouTube</a></li>
              <li><a href="mailto:itzbarshandey@gmail.com">Email</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Barshan Dey</span>
          <span>Built as a personal project</span>
        </div>
      </div>
    </footer>
  );
}

// Local re-imports to keep the file standalone
import { Link } from 'react-router-dom';
