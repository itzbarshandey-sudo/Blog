import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import usePrefersReducedMotion from './usePrefersReducedMotion.js';

// Module-level ref so the click position from a Link can be picked up here
// without having to thread props through the entire app.
let pendingClickXY = null;

export function setPendingClickXY(x, y) {
  pendingClickXY = { x, y };
}

export default function usePageCurtain() {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [xy, setXy] = useState({ x: 0, y: 0 });
  const reduce = usePrefersReducedMotion();
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return; // Skip on initial mount
    }
    if (reduce) return;
    if (pendingClickXY) {
      setXy(pendingClickXY);
      pendingClickXY = null;
    } else {
      setXy({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    setActive(true);
    const t = setTimeout(() => setActive(false), 750);
    return () => clearTimeout(t);
  }, [location.pathname, reduce]);

  return { active, xy };
}
