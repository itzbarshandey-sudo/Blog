import { Link } from 'react-router-dom';

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

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
