/* script.js */
document.addEventListener('DOMContentLoaded', () => {

  // 0. Hero Terminal Typewriter Animation
  const heroSub = document.querySelector('.hero .hero-sub');
  if (heroSub) {
    const fullText = heroSub.textContent.trim();
    heroSub.textContent = '';
    
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    heroSub.appendChild(cursor);

    let charIndex = 0;
    const typingSpeed = 18; // Speed in ms per character

    function typeChar() {
      if (charIndex < fullText.length) {
        const textNode = document.createTextNode(fullText.charAt(charIndex));
        heroSub.insertBefore(textNode, cursor);
        charIndex++;
        setTimeout(typeChar, typingSpeed);
      }
    }

    // Small delay before typing begins
    setTimeout(typeChar, 300);
  }

  // 1. Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });
  }

  // 2. Navbar Scroll Effect
  const siteNav = document.querySelector('.site-nav');
  if (siteNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteNav.setAttribute('data-scrolled', 'true');
      } else {
        siteNav.setAttribute('data-scrolled', 'false');
      }
    }, { passive: true });
  }

  // 3. Scroll Reveal Animations (fade and slide up)
  const sections = document.querySelectorAll('section .wrap > *, .card, .stat-strip > div');
  sections.forEach(el => el.classList.add('reveal'));

  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    });
  }, revealOptions);

  sections.forEach(section => {
    revealOnScroll.observe(section);
  });

  // 4. Hero Sticker Parallax (Mouse movement tracking)
  const heroArt = document.querySelector('.hero-art');
  const stickers = document.querySelectorAll('.sticker');
  
  if (heroArt && stickers.length > 0) {
    window.addEventListener('mousemove', (e) => {
      // Calculate mouse position relative to the window center
      const mouseX = (e.clientX - window.innerWidth / 2) / 50;
      const mouseY = (e.clientY - window.innerHeight / 2) / 50;

      stickers.forEach((sticker, index) => {
        // Vary the speed slightly based on index
        const speed = 1 + (index * 0.2);
        sticker.style.setProperty('--mx', mouseX * speed);
        sticker.style.setProperty('--my', mouseY * speed);
      });
    });
  }

  // 5. Card Hover Glow Effect
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 6. Contact Form Validation
  const contactForm = document.getElementById('contact-form');
  const formCard = document.querySelector('.form-card');
  
  if (contactForm && formCard) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      
      // Reset errors
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
        // In a real app, you would send the data here.
      }
    });

    // Clear error on input
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.field').classList.remove('error');
      });
    });
  }
    
  // 7. Dynamic Data Loader (Live updates via data/profile.json & posts/manifest.json)
  
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
            <a href="post.html?post=${post.slug}" class="card reveal active" style="text-decoration:none;color:inherit; animation-delay: ${idx * 0.1}s;">
              <span class="pill-tag tag-${post.category || 'network'}" style="margin-bottom:14px;">${post.categoryLabel || 'Note'}</span>
              <h3 style="color:var(--ink);">${post.title}</h3>
              <p style="margin-bottom:0;">${post.excerpt}</p>
              <span style="display:block; margin-top:1rem; font-size:0.85rem; color:var(--ink-light);">${post.date}</span>
            </a>
          `).join('');
        } else {
          homePostGrid.innerHTML = `<p class="loading-state" style="grid-column:1/-1; text-align:center; color:var(--ink-light);">No posts published yet — check back soon or add write-ups in <code>posts/</code>!</p>`;
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

        // Skills
        if (skillsList && Array.isArray(profile.skills) && profile.skills.length > 0) {
          const tags = ['tag-network', 'tag-web', 'tag-malware', 'tag-privacy', 'tag-awareness'];
          skillsList.innerHTML = profile.skills.map((skill, i) => `
            <span class="pill-tag ${tags[i % tags.length]}">${skill}</span>
          `).join('');
        }

        // Certifications
        if (certsList) {
          if (Array.isArray(profile.certifications) && profile.certifications.length > 0) {
            certsList.innerHTML = profile.certifications.map(c => `
              <p style="margin-bottom:6px;font-size:14.5px;"><strong>${c.status || 'Certified'}:</strong> ${c.title}</p>
            `).join('');
          } else {
            certsList.innerHTML = `<p style="margin-bottom:0;font-size:14.5px;color:var(--ink-light);">No certifications yet — currently preparing for future credentials.</p>`;
          }
        }

        // Learning Path Timeline
        if (timelineList) {
          if (Array.isArray(profile.learningPath) && profile.learningPath.length > 0) {
            timelineList.innerHTML = profile.learningPath.map(item => `
              <div class="timeline-item">
                <span class="when">${item.when}</span>
                <h3>${item.title}</h3>
                <span class="org">${item.org || ''}</span>
                <p>${item.description}</p>
              </div>
            `).join('');
          } else {
            timelineList.innerHTML = `
              <div class="card" style="padding: 1.5rem; background: var(--paper-alt);">
                <p style="margin-bottom:0; color:var(--ink-light);">Self-directed study log — updates will appear here live as milestones and tracks are completed.</p>
              </div>
            `;
          }
        }

        // Projects
        if (projectsList) {
          if (Array.isArray(profile.projects) && profile.projects.length > 0) {
            projectsList.innerHTML = profile.projects.map(proj => `
              <div class="card">
                <div class="icon-badge" style="background:#e4f2ff;">
                  <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7" fill="none" stroke="#14181a" stroke-width="2"/><path d="M9 9h.01M15 9h.01M8 15c1.2 1 2.6 1 4 0" stroke="#14181a" stroke-width="1.6" stroke-linecap="round"/></svg>
                </div>
                <h3>${proj.title}</h3>
                <p>${proj.description}</p>
                ${proj.link ? `<a class="link-row" href="${proj.link}" target="_blank" rel="noopener noreferrer" style="font-size:14px; font-weight:600;">View on GitHub &rarr;</a>` : ''}
              </div>
            `).join('');
          }
        }

        // Education
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

