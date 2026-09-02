export default function PillTag({ category, children }) {
  return <span className={`pill-tag tag-${category}`}>{children}</span>;
}
