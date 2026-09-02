import { useEffect, useRef } from 'react';

/**
 * Scroll reveal hook — observes elements with `.reveal` and adds `.is-active`
 * when they enter the viewport. Use a small CSS transition to animate them in.
 *
 * The hook also handles stagger via the `--stagger-index` CSS variable, so
 * sibling reveals animate one after the other rather than all at once.
 */
export default function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const root = ref.current;

    const targets = root.querySelectorAll(
      '.reveal, .reveal-stagger > *'
    );
    if (targets.length === 0) return;

    // Stagger: assign an index to children of `.reveal-stagger`
    const groups = root.querySelectorAll('.reveal-stagger');
    groups.forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        child.style.setProperty('--stagger-index', i);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}
