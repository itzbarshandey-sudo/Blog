// Reusable mascot component with subtle hover/float animation.
// The image is decorative, so it's marked aria-hidden.
export default function Mascot({ src, alt = '', width = 380, height = 396, className = 'page-mascot' }) {
  return (
    <div className={`mascot-wrap ${className}`} aria-hidden="true">
      <div className="mascot-glow" />
      <img src={src} alt={alt} className="mascot-img" width={width} height={height} />
    </div>
  );
}
