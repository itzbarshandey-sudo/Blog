/* script.js — Node v2.0 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-nav') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. Navbar Scroll Effect
  const siteNav = document.querySelector('.site-nav');
  if (siteNav) {
    window.addEventListener('scroll', () => {
      siteNav.setAttribute('data-scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // 3. Scroll Reveal Animations
  const revealEls = document.querySelectorAll('.card, .stat-strip > div, .timeline-item, .section-head > *');
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  revealEls.forEach(el => revealOnScroll.observe(el));

  // 4. Hero Sticker Parallax
  const heroArt = document.querySelector('.hero-art');
  const stickers = document.querySelectorAll('.sticker');

  if (heroArt && stickers.length > 0) {
    let ticking = false;
    window.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const mouseX = (e.clientX - window.innerWidth / 2) / 50;
          const mouseY = (e.clientY - window.innerHeight / 2) / 50;
          stickers.forEach((sticker, index) => {
            const speed = 1 + (index * 0.15);
            sticker.style.setProperty('--mx', mouseX * speed);
            sticker.style.setProperty('--my', mouseY * speed);
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // 5. Card Hover Glow Effect
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(2);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(2);
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // 6. Contact Form Validation
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
        name.closest('.field').classList.add('error');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value || !emailRegex.test(email.value)) {
        email.closest('.field').classList.add('error');
        isValid = false;
      }

      if (!message.value || message.value.trim().length < 10) {
        message.closest('.field').classList.add('error');
        isValid = false;
      }

      if (isValid) {
        formCard.classList.add('success-mode');
      }
    });

    // Clear errors on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.field')?.classList.remove('error');
      });
    });
  }

  // 7. Dynamic Data Loader
  // A. Home Page: Dynamic Stats Loader
  const statStrip = document.getElementById('stat-strip');
  if (statStrip) {
    fetch('data/profile.json')
      .then(res => res.ok ? res.json() : null)
      .then(profile => {
        if (profile && Array.isArray(profile.stats) && profile.stats.length > 0) {
          statStrip.innerHTML = profile.stats.map(s => `
            <div>
              <div class="num">${s.num}</div>
              <div class="label">${s.label}</div>
            </div>
          `).join('');
        }
      })
      .catch(() => {});
  }

  // B. Home Page: Dynamic Recent Blog Posts Loader
  const homePostGrid = document.getElementById('home-post-grid');
  if (homePostGrid) {
    fetch('posts/manifest.json')
      .then(res => res.ok ? res.json() : [])
      .then(posts => {
        if (Array.isArray(posts) && posts.length > 0) {
          const recent = posts.slice(0, 3);
          homePostGrid.innerHTML = recent.map((post, idx) => `
            <a href="post.html?post=${post.slug}" class="card reveal active" style="text-decoration:none;color:inherit;animation-delay:${idx * 0.1}s;">
              <span class="pill-tag tag-${post.category || 'network'}" style="margin-bottom:12px;">${post.categoryLabel || 'Note'}</span>
              <h3 style="color:var(--fg);">${post.title}</h3>
              <p style="margin-bottom:0;">${post.excerpt}</p>
              <span style="display:block;margin-top:0.75rem;font-size:0.8rem;color:var(--fg-dim);font-family:var(--font-mono);">${post.date}</span>
            </a>
          `).join('');
        }
      })
      .catch(() => {});
  }

  // C. Resume Page: Dynamic Live Data Loader
  const skillsList = document.getElementById('resume-skills-list');
  const certsList = document.getElementById('resume-certs');
  const timelineList = document.getElementById('resume-timeline');
  const projectsList = document.getElementById('resume-projects');
  const educationCard = document.getElementById('resume-education');

  if (skillsList || certsList || timelineList || projectsList || educationCard) {
    fetch('data/profile.json')
      .then(res => res.ok ? res.json() : null)
      .then(profile => {
        if (!profile) return;

        if (skillsList && Array.isArray(profile.skills) && profile.skills.length > 0) {
          const tags = ['tag-network', 'tag-web', 'tag-malware', 'tag-privacy', 'tag-awareness'];
          skillsList.innerHTML = profile.skills.map((skill, i) =>
            `<span class="pill-tag ${tags[i % tags.length]}">${skill}</span>`
          ).join('');
        }

        if (certsList) {
          if (Array.isArray(profile.certifications) && profile.certifications.length > 0) {
            certsList.innerHTML = profile.certifications.map(c =>
              `<p style="margin-bottom:6px;font-size:0.9rem;"><strong>${c.status || 'Certified'}:</strong> ${c.title}</p>`
            ).join('');
          } else {
            certsList.innerHTML = `<p style="margin-bottom:0;font-size:0.9rem;color:var(--fg-dim);">No certifications yet — preparing for future credentials.</p>`;
          }
        }

        if (timelineList) {
          if (Array.isArray(profile.learningPath) && profile.learningPath.length > 0) {
            timelineList.innerHTML = profile.learningPath.map(item => `
              <div class="timeline-item">
                <span class="when">${item.when}</span>
                <h3>${item.title}</h3>
                ${item.org ? `<span class="org">${item.org}</span>` : ''}
                <p>${item.description}</p>
              </div>
            `).join('');
          } else {
            timelineList.innerHTML = `
              <div class="card" style="padding:1.25rem;background:var(--bg-muted);border:1px dashed var(--border);">
                <p style="margin-bottom:0;font-size:0.9rem;">Self-directed study log — updates appear here as milestones are reached.</p>
              </div>
            `;
          }
        }

        if (projectsList) {
          if (Array.isArray(profile.projects) && profile.projects.length > 0) {
            projectsList.innerHTML = profile.projects.map(proj => `
              <div class="card">
                <div class="icon-badge" style="background:rgba(77,171,247,0.1);border-color:rgba(77,171,247,0.3);">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#4dabf7" stroke-width="2" stroke-linecap="round">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <h3>${proj.title}</h3>
                <p>${proj.description}</p>
                ${proj.link ? `<a class="link-row" href="${proj.link}" target="_blank" rel="noopener noreferrer">View on GitHub &rarr;</a>` : ''}
              </div>
            `).join('');
          }
        }

        if (educationCard && profile.education) {
          educationCard.innerHTML = `
            <h3>${profile.education.institution}</h3>
            <p style="margin-bottom:0;">${profile.education.details}</p>
          `;
        }
      })
      .catch(() => {});
  }

});
