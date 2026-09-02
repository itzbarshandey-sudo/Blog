import { useEffect, useRef } from 'react';

/**
 * Parallax hook — writes `--py` to the element based on its position
 * in the viewport, so a parallax CSS rule can translate it accordingly.
 *
 * Skips work when prefers-reduced-motion is set.
 */
export default function useParallax(strength = 12) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = null;
    const update = () => {
      raf = null;
      const r = el.getBoundingClientRect();
      // Center of element relative to viewport center, normalized to [-1, 1]
      const center = r.top + r.height / 2;
      const vh = window.innerHeight;
      const t = (center - vh / 2) / vh; // ~[-0.5, 0.5]
      el.style.setProperty('--py', `${t * -strength}px`);
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}
