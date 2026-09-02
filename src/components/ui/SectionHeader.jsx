// SectionHeader — eyebrow label + title + optional action.
// The eyebrow uses a small monospace label with a colored dot, very
// "designed product" rather than "developer demo".
export default function SectionHeader({ label, title, action, count }) {
  return (
    <div className="section-header">
      <div>
        <p className="section-label">
          <span className="label-dot"></span>
          {label}
          {count != null && <span className="section-count">{count}</span>}
        </p>
        <h2 className="section-title" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      {action}
    </div>
  );
}
