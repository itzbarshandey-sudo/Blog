/* script.js — Node v4.0: Enhanced UI, micro-interactions, page transitions */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Page Load Curtain (auto-removes itself via CSS animation)
  const curtain = document.createElement('div');
  curtain.className = 'page-curtain';
  document.body.prepend(curtain);
  setTimeout(() => curtain.remove(), 1400);

  // 2. Scroll Progress Bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  // 3. Custom Cursor (desktop only)
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && window.innerWidth > 1024;

  if (isFinePointer) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX; cursorY = e.clientY;
      dot.style.left = cursorX + 'px';
      dot.style.top = cursorY + 'px';
    }, { passive: true });

    function animateRing() {
      ringX += (cursorX - ringX) * 0.15;
      ringY += (cursorY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Cursor interactions on hoverable elements
    const hoverables = document.querySelectorAll('a, button, .card, .post-card, .skill-card, .filter-pill, .field input, .field select, .field textarea');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('is-hover');
        ring.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('is-hover');
        ring.classList.remove('is-hover');
      });
    });
  }

  // 4. Hero Particles
  const hero = document.querySelector('.hero');
  if (hero) {
    const particles = document.createElement('div');
    particles.className = 'hero-particles';
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('span');
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.animationDuration = (6 + Math.random() * 4) + 's';
      particles.appendChild(p);
    }
    hero.appendChild(particles);
  }

  // 5. Mobile Nav
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

  // 6. Nav scroll + progress bar
  const siteNav = document.querySelector('.site-nav');
  let ticking = false;
  const updateScroll = () => {
    ticking = false;
    const y = window.scrollY;
    if (siteNav) siteNav.setAttribute('data-scrolled', y > 20);
    // Progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });

  // 7. Scroll Reveal + Stagger
  const revealEls = document.querySelectorAll('.card, .post-card, .skill-card, .section-header, .cta-block, .stat-strip > div, .contact-info .card, .resume-side .card, .resume-block');
  revealEls.forEach(el => el.classList.add('reveal'));

  // Mark grids as stagger targets
  document.querySelectorAll('.post-grid, .skills-grid, .grid-2, .grid-3, .contact-info, .resume-side')
    .forEach(el => el.classList.add('stagger'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
  document.querySelectorAll('.stagger').forEach(el => revealObserver.observe(el));

  // 8. Tagline word-by-word activation
  const taglineText = document.getElementById('tagline-text');
  if (taglineText) {
    const words = Array.from(taglineText.querySelectorAll('.tw'));
    words.forEach(w => w.setAttribute('data-text', w.textContent));

    let rafId = null;
    const triggerY = window.innerHeight * 0.6;

    const updateWords = () => {
      rafId = null;
      words.forEach((word) => {
        const rect = word.getBoundingClientRect();
        if (rect.top < triggerY) word.classList.add('is-active');
      });
    };

    window.addEventListener('scroll', () => {
      if (rafId === null) rafId = requestAnimationFrame(updateWords);
    }, { passive: true });
    updateWords();
  }

  // 9. Card 3D Tilt + Cursor Glow
  document.querySelectorAll('.post-card, .card, .skill-card, .cta-block').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);

      // 3D tilt (subtle)
      const tiltX = (y - 50) / -25;
      const tiltY = (x - 50) / 25;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 10. Form Field Float Labels
  document.querySelectorAll('.field input, .field textarea').forEach(input => {
    if (input.placeholder) input.setAttribute('data-placeholder', input.placeholder);
    input.setAttribute('placeholder', ' ');
  });
  document.querySelectorAll('.field').forEach(field => {
    if (field.querySelector('input[placeholder=" "], textarea[placeholder=" "], select')) {
      field.classList.add('float-label');
    }
  });

  // 11. Contact Form Validation + Success Animation
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

      if (isValid) {
        // Trigger success animation
        formCard.classList.add('success-mode');
        // Add a brief glow pulse
        formCard.style.boxShadow = '0 0 40px rgba(45, 158, 66, 0.3)';
        setTimeout(() => { formCard.style.boxShadow = ''; }, 800);
      }
    });

    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => input.closest('.field')?.classList.remove('error'));
    });
  }

  // 12. Dynamic data loaders (posts, stats, profile)
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
            <a href="post.html?post=${p.slug}" class="post-card reveal is-active" style="transition-delay:${i * 0.08}s">
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

  // Resume page loaders
  const resumeTargets = ['resume-skills-list', 'resume-certs', 'resume-timeline', 'resume-projects', 'resume-education'];
  if (resumeTargets.some(id => document.getElementById(id))) {
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

  // 13. Add arrows to ghost buttons
  document.querySelectorAll('.btn-ghost').forEach(btn => {
    if (!btn.querySelector('.arrow')) {
      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = ' →';
      btn.appendChild(arrow);
    }
  });

  // 14. Smooth scroll for hash links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
