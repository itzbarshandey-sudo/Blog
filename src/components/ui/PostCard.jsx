import { Link } from 'react-router-dom';
import PillTag from './PillTag.jsx';

export default function PostCard({ post, delay }) {
  return (
    <Link
      to={`/post/${post.slug}`}
      className="post-card reveal is-active"
      style={{ animationDelay: `${delay * 0.08}s` }}
    >
      <PillTag category={post.category || 'network'}>{post.categoryLabel || 'Note'}</PillTag>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <span className="post-date">{post.date}</span>
    </Link>
  );
}
