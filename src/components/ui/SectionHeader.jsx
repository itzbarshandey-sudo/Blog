export default function SectionHeader({ label, title, action }) {
  return (
    <div className="section-header">
      <div>
        <p className="section-label">
          <span className="label-dot"></span>
          {label}
        </p>
        <h2 className="section-title" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      {action}
    </div>
  );
}
