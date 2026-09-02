import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Module-level state: holds the click coordinates from the most recent
// <Link> click so the curtain can emanate from there.
let pendingOrigin = null;
export function setPendingOrigin(x, y) {
  pendingOrigin = { x, y };
}

const REDUCED = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SUPPORTS_VT = typeof document !== 'undefined' && 'startViewTransition' in document;

// Coordinates in CSS for the radial reveal center
function cssX(x) { return `${x}px`; }
function cssY(y) { return `${y}px`; }

export default function PageTransition({ children }) {
  const location = useLocation();
  const navType = useNavigationType();
  const [reveal, setReveal] = useState(null); // { x, y, key }
  const [covering, setCovering] = useState(false);
  const isFirst = useRef(true);

  // Capture clicks on internal links
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;
      if (link.target === '_blank') return;
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return;
      // Only treat as nav if the href is a different route than the current one
      if (link.pathname === location.pathname && !link.search && !link.hash) return;
      setPendingOrigin(e.clientX, e.clientY);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [location.pathname]);

  // Skip first render — we don't want a transition on initial mount
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (REDUCED) return;
    if (navType === 'POP') return; // browser back/forward — let the browser handle it

    const origin = pendingOrigin || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    pendingOrigin = null;

    if (SUPPORTS_VT) {
      // Use the native View Transitions API
      document.documentElement.style.setProperty('--vt-x', cssX(origin.x));
      document.documentElement.style.setProperty('--vt-y', cssY(origin.y));
      document.startViewTransition(() => {
        // React already updated the DOM by the time this callback runs
      });
    } else {
      // Fallback: a custom CSS-driven reveal
      setCovering(true);
      setReveal({ x: origin.x, y: origin.y, key: location.pathname });
    }
  }, [location.pathname, navType]);

  const onCoverEnd = useCallback(() => {
    setCovering(false);
    setReveal(null);
  }, []);

  return (
    <>
      {children}
      {covering && reveal && (
        <div
          key={reveal.key}
          className="page-reveal-cover"
          style={{ '--reveal-x': cssX(reveal.x), '--reveal-y': cssY(reveal.y) }}
          onAnimationEnd={onCoverEnd}
          aria-hidden="true"
        />
      )}
    </>
  );
}
