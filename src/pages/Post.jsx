import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PillTag from '../components/ui/PillTag.jsx';
import Button from '../components/ui/Button.jsx';
import { getPostBySlug } from '../data/posts.js';
import './Post.css';

export default function Post() {
  const { slug } = useParams();
  const post = useMemo(() => getPostBySlug(slug), [slug]);

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  // Extract body (everything after the second ---)
  const body = post.raw.split('---').slice(2).join('---').trim();

  return (
    <article>
      <header className="post-header">
        <div className="wrap">
          <Link to="/blog" className="back-link">← Back to blog</Link>
          <PillTag category={post.category || 'network'}>{post.categoryLabel || 'Note'}</PillTag>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-meta">{post.date}</p>
        </div>
      </header>
      <div className="post-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
      <div className="post-footer">
        <div className="wrap">
          <Button to="/blog" variant="ghost">← All posts</Button>
          <Button to="/contact" variant="primary">Discuss this post</Button>
        </div>
      </div>
    </article>
  );
}
