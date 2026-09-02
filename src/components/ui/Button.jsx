import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setPendingClickXY } from '../../hooks/usePageCurtain.js';

export default function Button({
  to,
  href,
  variant = 'primary',
  size,
  block,
  className = '',
  children,
  onClick,
  ...rest
}) {
  const classes = ['btn', `btn-${variant}`, size ? `btn-${size}` : '', block ? 'btn-block' : '', className]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e) => {
    if (to) {
      // Capture click for the page-curtain origin
      setPendingClickXY(e.clientX, e.clientY);
    }
    onClick?.(e);
  };

  if (to) {
    return (
      <Link to={to} className={classes} onClick={handleClick} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} onClick={handleClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} onClick={handleClick} {...rest}>
      {children}
    </button>
  );
}
