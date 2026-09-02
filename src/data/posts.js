// Posts data — imported at build time via Vite's import.meta.glob
import manifest from '../../posts/manifest.json';

// Parse frontmatter from raw markdown content
function parseFrontmatter(content) {
  const lines = content.split('\n');
  const frontmatter = {};
  let i = 1; // Skip first ---

  while (i < lines.length && lines[i] !== '---') {
    const [key, ...valueParts] = lines[i].split(':');
    if (key && valueParts.length > 0) {
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
    i++;
  }

  return frontmatter;
}

// Get all posts
export const posts = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

export const postsList = Object.entries(posts).map(([path, raw]) => {
  const slug = path.split('/').pop().replace('.md', '');
  const frontmatter = parseFrontmatter(raw);

  // Find manifest entry for this slug
  const manifestEntry = manifest.find(m => m.slug === slug) || {};

  return {
    slug,
    raw,
    ...frontmatter,
    ...manifestEntry,
  };
});

// Get a single post by slug
export function getPostBySlug(slug) {
  return postsList.find(p => p.slug === slug) || null;
}

// Get featured posts
export function getFeaturedPosts() {
  return postsList.filter(p => p.featured);
}
