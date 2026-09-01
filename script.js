/* script.js — Node v3.0 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile nav
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-nav') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Nav scroll effect
  const siteNav = document.querySelector('.site-nav');
  if (siteNav) {
    window.addEventListener('scroll', () => {
      siteNav.setAttribute('data-scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // 3. Scroll reveal — fade up + blur out
  const revealEls = document.querySelectorAll('.card, .post-card, .skill-card, .section-header, .cta-block, .stat-strip > div');
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // 4. Tagline reveal — word by word activation on scroll (B11)
  const taglineText = document.getElementById('tagline-text');
  if (taglineText) {
    const words = Array.from(taglineText.querySelectorAll('.tw'));
    const trigger = 0.6; // % of viewport at which a word activates

    let rafId = null;
    const updateWords = () => {
      rafId = null;
      const triggerY = window.innerHeight * trigger;
      words.forEach((word) => {
        const rect = word.getBoundingClientRect();
        if (rect.top < triggerY) {
          word.classList.add('is-active');
        }
      });
    };

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(updateWords);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateWords();
  }

  // 5. Card hover glow tracking
  document.querySelectorAll('.post-card, .card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

  // 6. Contact form validation
  const contactForm = document.getElementById('contact-form');
  const formCard = document.querySelector('.form-card');
  if (contactForm && formCard) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      document.querySelectorAll('.field.error').forEach(f => f.classList.remove('error'));

      const name = contactForm.elements['name'];
      const email = contactForm.elements['email'];
      const message = contactForm.elements['message'];

      if (!name.value || name.value.trim().length < 2) {
        name.closest('.field').classList.add('error'); isValid = false;
      }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value || !emailRe.test(email.value)) {
        email.closest('.field').classList.add('error'); isValid = false;
      }
      if (!message.value || message.value.trim().length < 10) {
        message.closest('.field').classList.add('error'); isValid = false;
      }

      if (isValid) formCard.classList.add('success-mode');
    });

    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => input.closest('.field')?.classList.remove('error'));
    });
  }

  // 7. Dynamic data loaders (posts, stats, profile)
  const statStrip = document.getElementById('stat-strip');
  if (statStrip) {
    fetch('data/profile.json')
      .then(r => r.ok ? r.json() : null)
      .then(p => {
        if (p?.stats?.length) {
          statStrip.innerHTML = p.stats.map(s => `
            <div class="reveal is-active">
              <div class="num">${s.num}</div>
              <div class="label">${s.label}</div>
            </div>`).join('');
        }
      })
      .catch(() => {});
  }

  const homePostGrid = document.getElementById('home-post-grid');
  if (homePostGrid) {
    fetch('posts/manifest.json')
      .then(r => r.ok ? r.json() : [])
      .then(posts => {
        if (Array.isArray(posts) && posts.length > 0) {
          homePostGrid.innerHTML = posts.slice(0, 3).map((p, i) => `
            <a href="post.html?post=${p.slug}" class="post-card reveal is-active" style="animation-delay:${i * 0.08}s">
              <span class="pill-tag tag-${p.category || 'network'}">${p.categoryLabel || 'Note'}</span>
              <h3>${p.title}</h3>
              <p>${p.excerpt}</p>
              <span class="post-date">${p.date}</span>
            </a>
          `).join('');
        }
      })
      .catch(() => {});
  }

  // Resume page dynamic loaders (kept for compatibility)
  const resumeTargets = ['resume-skills-list', 'resume-certs', 'resume-timeline', 'resume-projects', 'resume-education'];
  const hasResume = resumeTargets.some(id => document.getElementById(id));
  if (hasResume) {
    fetch('data/profile.json')
      .then(r => r.ok ? r.json() : null)
      .then(profile => {
        if (!profile) return;
        const skillsList = document.getElementById('resume-skills-list');
        if (skillsList && profile.skills?.length) {
          const tags = ['tag-network', 'tag-web', 'tag-malware', 'tag-privacy', 'tag-awareness'];
          skillsList.innerHTML = profile.skills.map((s, i) =>
            `<span class="pill-tag ${tags[i % tags.length]}">${s}</span>`).join('');
        }
        const certsList = document.getElementById('resume-certs');
        if (certsList) {
          certsList.innerHTML = profile.certifications?.length
            ? profile.certifications.map(c => `<p style="font-size:0.9rem"><strong>${c.status || 'Certified'}:</strong> ${c.title}</p>`).join('')
            : `<p style="font-size:0.9rem;color:var(--fg-muted)">No certifications yet — preparing for future credentials.</p>`;
        }
        const timelineList = document.getElementById('resume-timeline');
        if (timelineList) {
          if (profile.learningPath?.length) {
            timelineList.innerHTML = profile.learningPath.map(item => `
              <div class="timeline-item">
                <span class="when">${item.when}</span>
                <h3>${item.title}</h3>
                ${item.org ? `<span class="org">${item.org}</span>` : ''}
                <p>${item.description}</p>
              </div>`).join('');
          } else {
            timelineList.innerHTML = `<div class="card" style="padding:1.5rem;background:var(--bg-muted);border:1px dashed var(--border)">
              <p style="font-size:0.9rem">Self-directed study log — updates appear here as milestones are reached.</p>
            </div>`;
          }
        }
        const projectsList = document.getElementById('resume-projects');
        if (projectsList && profile.projects?.length) {
          projectsList.innerHTML = profile.projects.map(proj => `
            <div class="card">
              <h3>${proj.title}</h3>
              <p>${proj.description}</p>
              ${proj.link ? `<a class="link-row" href="${proj.link}" target="_blank" rel="noopener noreferrer">View on GitHub →</a>` : ''}
            </div>`).join('');
        }
        const educationCard = document.getElementById('resume-education');
        if (educationCard && profile.education) {
          educationCard.innerHTML = `
            <h3>${profile.education.institution}</h3>
            <p>${profile.education.details}</p>`;
        }
      })
      .catch(() => {});
  }

});
