import { useEffect } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion.js';

export default function usePointerTilt(tiltRef, { max = 12 } = {}) {
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    const card = tilt.querySelector('.t-tilt-card');
    if (!card) return;

    function reset() {
      tilt.classList.remove('is-hover');
      card.classList.remove('is-tilting');
      card.style.setProperty('--tilt-rx', '0deg');
      card.style.setProperty('--tilt-ry', '0deg');
    }

    function track(e) {
      if (reduce) return;
      const r = tilt.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      tilt.classList.add('is-hover');
      card.classList.add('is-tilting');
      card.style.setProperty('--tilt-ry', ((px - 0.5) * max).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-rx', ((0.5 - py) * max).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-gx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--tilt-gy', (py * 100).toFixed(1) + '%');
    }

    function onPointerDown(e) {
      if (e.pointerType !== 'mouse') {
        try { tilt.setPointerCapture(e.pointerId); } catch (_) {}
      }
    }
    function onPointerUp() { reset(); }
    function onPointerCancel() { reset(); }
    function onPointerLeave(e) {
      if (e.pointerType === 'mouse') reset();
    }

    tilt.addEventListener('pointerdown', onPointerDown);
    tilt.addEventListener('pointermove', track);
    tilt.addEventListener('pointerup', onPointerUp);
    tilt.addEventListener('pointercancel', onPointerCancel);
    tilt.addEventListener('pointerleave', onPointerLeave);

    return () => {
      tilt.removeEventListener('pointerdown', onPointerDown);
      tilt.removeEventListener('pointermove', track);
      tilt.removeEventListener('pointerup', onPointerUp);
      tilt.removeEventListener('pointercancel', onPointerCancel);
      tilt.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [tiltRef, reduce, max]);
}
