import usePageCurtain from '../../hooks/usePageCurtain.js';

export default function PageCurtain() {
  const { active, xy } = usePageCurtain();
  if (!active) return null;
  return (
    <div
      className="page-curtain is-active"
      style={{ '--curtain-x': `${xy.x}px`, '--curtain-y': `${xy.y}px` }}
      aria-hidden="true"
    />
  );
}
