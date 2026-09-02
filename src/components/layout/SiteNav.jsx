import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest('.site-nav')) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  return (
    <nav className="site-nav" data-scrolled={scrolled}>
      <div className="wrap">
        <NavLink to="/" className="brand">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <path d="M24 4 L42 11 V22 C42 33 34.5 41 24 44 C13.5 41 6 33 6 22 V11 Z" fill="#2d9e42" stroke="#e8f5e9" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M16 24 L21.5 29.5 L33 17" stroke="#0a0f0d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          Node
        </NavLink>
        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
        >
          <span className="t-icon-swap" data-state={open ? 'b' : 'a'}>
            <span className="t-icon" data-icon="a" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </span>
            <span className="t-icon" data-icon="b" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </span>
          </span>
        </button>
        <ul className={`nav-links ${open ? 'active' : ''}`}>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/blog">Blog</NavLink></li>
          <li><NavLink to="/resume">Resume</NavLink></li>
          <li><NavLink to="/contact" className="nav-cta">Contact</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
