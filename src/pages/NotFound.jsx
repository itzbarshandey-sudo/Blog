import Button from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="wrap">
        <p className="section-label"><span className="label-dot"></span>404</p>
        <h1 className="page-title">Page not found.</h1>
        <p className="page-sub">That URL doesn&apos;t lead anywhere. Try heading home or checking the blog.</p>
        <div className="hero-cta" style={{ marginTop: '2rem' }}>
          <Button to="/" variant="primary">Go home</Button>
          <Button to="/blog" variant="ghost">Read the blog</Button>
        </div>
      </div>
    </div>
  );
}
