import { useEffect, useRef } from 'react';
import Button from '../components/ui/Button.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import LearnMoreLink from '../components/ui/LearnMoreLink.jsx';
import SkillCard from '../components/ui/SkillCard.jsx';
import PostCard from '../components/ui/PostCard.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';
import { postsList } from '../data/posts.js';
import './Home.css';

const skills = [
  {
    title: 'Network Security',
    description: 'Firewalls, segmentation, port analysis. Understanding why "just open the port" is rarely the right answer.',
    color: '#2d9e42',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d9e42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
    tags: [
      { label: 'TCP/IP', category: 'network' },
      { label: 'Firewalls', category: 'network' },
    ],
  },
  {
    title: 'Ethical Hacking',
    description: "CTF challenges and lab environments. Learning to think from an attacker's perspective to defend better.",
    color: '#ffb454',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffb454" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    tags: [
      { label: 'CTFs', category: 'web' },
      { label: 'Kali Linux', category: 'web' },
    ],
  },
  {
    title: 'Python & Automation',
    description: 'Writing scripts to automate security tasks, parse logs, and build small tools. Python first, always.',
    color: '#4dabf7',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4dabf7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    tags: [
      { label: 'Python', category: 'privacy' },
      { label: 'Linux CLI', category: 'privacy' },
    ],
  },
];

export default function Home() {
  const revealRef = useScrollReveal();
  const taglineRef = useRef(null);

  // Tagline reveal — word by word activation on scroll
  useEffect(() => {
    if (!taglineRef.current) return;
    const words = taglineRef.current.querySelectorAll('.tw');
    const trigger = 0.6;
    let rafId = null;

    function updateWords() {
      rafId = null;
      const triggerY = window.innerHeight * trigger;
      words.forEach((word) => {
        const rect = word.getBoundingClientRect();
        if (rect.top < triggerY) word.classList.add('is-active');
      });
    }

    function onScroll() {
      if (rafId === null) rafId = requestAnimationFrame(updateWords);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateWords();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const featuredPosts = postsList.slice(0, 3);

  return (
    <div ref={revealRef}>
      {/* Hero */}
      <header className="hero">
        <div className="wrap hero-wrap">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span className="eyebrow-dot"></span>
              Cybersecurity learning in public
            </p>
            <h1 className="hero-headline">
              I learn security by<br />
              <span className="headline-accent">writing it down</span>
            </h1>
            <p className="hero-sub">
              Notes from the lab, write-ups from CTFs, and notes on everyday defense. Everything I learn goes here — in public — so you can see how I think.
            </p>
            <div className="hero-cta">
              <Button to="/blog" variant="primary">Read the blog</Button>
              <Button to="/resume" variant="ghost">View resume</Button>
            </div>
            <p className="hero-proof">
              <span className="eyebrow-dot"></span>
              1 post published &nbsp;·&nbsp; Actively learning &nbsp;·&nbsp; Kolkata, India
            </p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <img src="/assets/mascot.webp" alt="" className="hero-mascot" width="380" height="396" />
          </div>
        </div>
      </header>

      {/* Tagline */}
      <section className="tagline-section" aria-label="Tagline">
        <div className="wrap">
          <p className="tagline-text" id="tagline-text" ref={taglineRef}>
            <span className="tw">Learning</span>
            <span className="tw">security</span>
            <span className="tw">is</span>
            <span className="tw">a</span>
            <span className="tw">craft.</span>
            <br />
            <span className="tw">I</span>
            <span className="tw">document</span>
            <span className="tw">every</span>
            <span className="tw">step.</span>
          </p>
        </div>
      </section>

      {/* Blog */}
      <section className="section-blog" id="blog">
        <div className="wrap">
          <SectionHeader
            label="From the blog"
            title="Notes, write-ups,<br />lessons learned."
            action={<LearnMoreLink to="/blog" className="btn btn-ghost btn-sm">All posts</LearnMoreLink>}
          />
          <div className="post-grid">
            {featuredPosts.length > 0 ? (
              featuredPosts.map((p, i) => <PostCard key={p.slug} post={p} delay={i} />)
            ) : (
              <p className="empty-state">No posts yet — first write-up coming soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section-resume" id="resume">
        <div className="wrap">
          <SectionHeader
            label="What I&apos;m building"
            title="Skills in progress,<br />not just on paper."
            action={<LearnMoreLink to="/resume" className="btn btn-ghost btn-sm">Full resume</LearnMoreLink>}
          />
          <div className="skills-grid">
            {skills.map((s, i) => <SkillCard key={i} {...s} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-cta">
        <div className="wrap">
          <div className="cta-block">
            <p className="section-label">
              <span className="label-dot"></span>
              Get in touch
            </p>
            <h2 className="cta-headline">Working on something interesting,<br />or want to talk security?</h2>
            <p className="cta-body">Responsible disclosures, collaboration ideas, or just a question about a post — I read everything and reply when I can.</p>
            <Button to="/contact" variant="primary">Send a message</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
