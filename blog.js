/* blog.js */
document.addEventListener('DOMContentLoaded', () => {
  const postGrid = document.getElementById('post-grid');
  const featuredSlot = document.getElementById('featured-slot');
  const filterPills = document.querySelectorAll('.filter-pill');
  
  if (!postGrid) return;

  let allPosts = [];

  // Fetch the posts manifest
  fetch('posts/manifest.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load posts manifest');
      return res.json();
    })
    .then(posts => {
      allPosts = posts;
      renderPosts('all');
      setupFilters();
    })
    .catch(err => {
      console.error(err);
      postGrid.innerHTML = `<p class="loading-state">Error loading posts. Please make sure you are running a local server.</p>`;
    });

  function renderPosts(filter) {
    postGrid.innerHTML = '';
    featuredSlot.innerHTML = '';

    const filtered = filter === 'all' 
      ? allPosts 
      : allPosts.filter(p => p.category === filter);

    if (filtered.length === 0) {
      postGrid.innerHTML = `<p class="loading-state">No posts found for this category.</p>`;
      return;
    }

    filtered.forEach((post, index) => {
      const card = document.createElement('a');
      card.href = `post.html?post=${post.slug}`;
      card.className = `card reveal`;
      card.style.textDecoration = 'none';
      card.style.color = 'inherit';
      
      // Delay animation for a staggered effect
      card.style.animationDelay = `${index * 0.1}s`;

      card.innerHTML = `
        <span class="pill-tag tag-${post.category}" style="margin-bottom:14px;">${post.categoryLabel}</span>
        <h3 style="color: var(--ink);">${post.title}</h3>
        <p style="margin-bottom: 0;">${post.excerpt}</p>
        <span style="display: block; margin-top: 1rem; font-size: 0.85rem; color: var(--ink-light);">${post.date}</span>
      `;
      
      // Add hover glow logic manually for dynamically added cards
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      if (post.featured && filter === 'all' && index === 0) {
        // Option to put it in featured slot, but let's just put it in the grid for simplicity
        postGrid.appendChild(card);
      } else {
        postGrid.appendChild(card);
      }
      
      // Trigger reveal immediately for new items
      requestAnimationFrame(() => {
        card.classList.add('active');
      });
    });
  }

  function setupFilters() {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        // Update active state
        filterPills.forEach(p => p.setAttribute('aria-pressed', 'false'));
        pill.setAttribute('aria-pressed', 'true');
        
        // Filter and render
        const filter = pill.getAttribute('data-filter');
        renderPosts(filter);
      });
    });
  }
});
