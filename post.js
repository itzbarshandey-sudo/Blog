/* post.js */
document.addEventListener('DOMContentLoaded', () => {
  const postRoot = document.getElementById('post-root');
  if (!postRoot) return;

  const urlParams = new URLSearchParams(window.location.search);
  const postSlug = urlParams.get('post');

  if (!postSlug) {
    postRoot.innerHTML = `<p class="loading-state">No post specified.</p>`;
    return;
  }

  fetch(`posts/${postSlug}.md`)
    .then(res => {
      if (!res.ok) throw new Error('Post not found');
      return res.text();
    })
    .then(markdown => {
      // Very basic frontmatter parser (--- ... ---)
      let content = markdown;
      let title = "Untitled";
      let date = "";
      
      const frontmatterRegex = /^---\s*[\r\n]([\s\S]*?)[\r\n]---/;
      const match = markdown.match(frontmatterRegex);
      
      if (match) {
        const fm = match[1];
        content = markdown.replace(frontmatterRegex, '').trim();
        
        // Extract title and date
        const titleMatch = fm.match(/title:\s*(.*)/);
        if (titleMatch) title = titleMatch[1];
        
        const dateMatch = fm.match(/date:\s*(.*)/);
        if (dateMatch) date = dateMatch[1];
      }

      // Update document title
      document.title = `${title} — Node`;

      // Render markdown using marked.js
      let htmlContent = "";
      if (typeof marked !== 'undefined') {
        htmlContent = marked.parse(content);
      } else {
        htmlContent = `<p>Error: Markdown parser not loaded.</p>`;
      }

      postRoot.innerHTML = `
        <h1 style="margin-bottom: 0.5rem; font-size: clamp(2rem, 4vw, 3rem);">${title}</h1>
        <div style="color: var(--ink-light); margin-bottom: 3rem; font-weight: 500;">${date}</div>
        <div class="post-content">
          ${htmlContent}
        </div>
      `;
    })
    .catch(err => {
      console.error(err);
      postRoot.innerHTML = `<p class="loading-state">Error loading post: ${err.message}</p>`;
    });
});
