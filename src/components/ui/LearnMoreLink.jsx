import { Link } from 'react-router-dom';
import { setPendingClickXY } from '../../hooks/usePageCurtain.js';

export default function LearnMoreLink({ to, className = '', children }) {
  const classes = `t-learn ${className}`.trim();
  return (
    <Link to={to} className={classes} onClick={(e) => setPendingClickXY(e.clientX, e.clientY)}>
      {children}
      <span className="t-learn-chevron">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path className="t-learn-arm t-learn-arm-top" d="M6 4L10 8" />
          <path className="t-learn-arm t-learn-arm-bot" d="M10 8L6 12" />
        </svg>
      </span>
    </Link>
  );
}
