import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PillTag from '../components/ui/PillTag.jsx';
import Button from '../components/ui/Button.jsx';
import { postsList } from '../data/posts.js';
import useScrollReveal from '../hooks/useScrollReveal.js';
import './Blog.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'network', label: 'Network' },
  { key: 'web', label: 'Web' },
  { key: 'malware', label: 'Malware' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'awareness', label: 'Awareness' },
];

export default function Blog() {
  const [filter, setFilter] = useState('all');
  const revealRef = useScrollReveal();

  const filtered = useMemo(() => {
    if (filter === 'all') return postsList;
    return postsList.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <div ref={revealRef}>
      <header className="page-hero">
        <div className="wrap">
          <p className="section-label">
            <span className="label-dot"></span>
            The blog
          </p>
          <h1 className="page-title">Notes, write-ups,<br />lessons learned.</h1>
          <p className="page-sub">What I&apos;m learning, what worked, and what broke. Short, honest posts about security and building.</p>
        </div>
      </header>

      <section className="blog-list">
        <div className="wrap">
          <div className="filter-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`filter-pill ${filter === cat.key ? 'is-active' : ''}`}
                onClick={() => setFilter(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="post-list">
            {filtered.length > 0 ? (
              filtered.map((post, i) => (
                <Link key={post.slug} to={`/post/${post.slug}`} className="post-row reveal" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="post-row-main">
                    <PillTag category={post.category || 'network'}>{post.categoryLabel || 'Note'}</PillTag>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                  <div className="post-row-meta">
                    <span className="post-date">{post.date}</span>
                    <span className="post-arrow">→</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="empty-state">No posts in this category yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section-cta">
        <div className="wrap">
          <div className="cta-block">
            <p className="section-label">
              <span className="label-dot"></span>
              That&apos;s everything, for now
            </p>
            <h2 className="cta-headline">Have a question<br />about a post?</h2>
            <p className="cta-body">I&apos;m always happy to go deeper on anything I&apos;ve written, or hear about what you&apos;re working on.</p>
            <Button to="/contact" variant="secondary">Get in touch</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
