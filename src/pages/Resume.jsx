import { useRef } from 'react';
import Button from '../components/ui/Button.jsx';
import Mascot from '../components/ui/Mascot.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';
import profile from '../data/profile.js';
import './Resume.css';

const tagCategories = ['tag-network', 'tag-web', 'tag-malware', 'tag-privacy', 'tag-awareness'];

export default function Resume() {
  const revealRef = useScrollReveal();

  const skills = profile.skills || [];
  const learningPath = profile.learningPath || [];
  const projects = profile.projects || [];
  const certifications = profile.certifications || [];
  const education = profile.education;

  return (
    <div ref={revealRef} className="print-resume">
      <header className="page-hero print-hide">
        <div className="wrap page-hero-wrap">
          <div className="page-hero-copy">
            <p className="section-label">
              <span className="label-dot"></span>
              Open to internships and entry-level roles
            </p>
            <h1 className="page-title">Resume</h1>
            <p className="page-sub">Building provable security skills through labs, CTFs, and consistent writing — documented here as I grow.</p>
            <div className="hero-cta">
              <Button href="#" variant="primary" onClick={(e) => { e.preventDefault(); window.print(); }}>Download / print PDF</Button>
              <Button to="/contact" variant="ghost">Get in touch</Button>
            </div>
          </div>
          <div className="page-hero-art" aria-hidden="true">
            <Mascot src="/assets/mascotresume.webp" width={340} height={354} className="page-mascot" />
          </div>
        </div>
      </header>

      <section className="resume-section print-hide">
        <div className="wrap resume-layout">
          <aside className="resume-side">
            <div className="card reveal">
              <h3>Contact</h3>
              <ul className="resume-contact">
                <li><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
                <li><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub: {profile.githubUser}</a></li>
                <li><a href={profile.youtube} target="_blank" rel="noopener noreferrer">YouTube: @itsmeNode</a></li>
              </ul>
            </div>

            <div className="card reveal" id="resume-skills-list">
              <h3>Skills</h3>
              <div className="skill-tags">
                {skills.length > 0 ? (
                  skills.map((s, i) => (
                    <span key={i} className={`pill-tag ${tagCategories[i % tagCategories.length]}`}>{s}</span>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--fg-dim)' }}>Building skills list — check back soon.</p>
                )}
              </div>
            </div>

            <div className="card reveal" id="resume-certs">
              <h3>Certifications</h3>
              {certifications.length > 0 ? (
                certifications.map((c, i) => (
                  <p key={i} style={{ fontSize: '0.9rem' }}>
                    <strong>{c.status || 'Certified'}:</strong> {c.title}
                  </p>
                ))
              ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--fg-dim)' }}>
                  No certifications yet — preparing for future credentials.
                </p>
              )}
            </div>
          </aside>

          <main className="resume-main">
            <div className="card reveal" id="resume-timeline">
              <h3>Learning path</h3>
              {learningPath.length > 0 ? (
                <div className="timeline">
                  {learningPath.map((item, i) => (
                    <div key={i} className="timeline-item">
                      <span className="when">{item.when}</span>
                      <h4>{item.title}</h4>
                      {item.org && <span className="org">{item.org}</span>}
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--fg-dim)' }}>
                  Self-directed study log — updates appear here as milestones are reached.
                </p>
              )}
            </div>

            <div className="card reveal" id="resume-projects">
              <h3>Projects</h3>
              {projects.length > 0 ? (
                <div className="project-list">
                  {projects.map((proj, i) => (
                    <div key={i} className="project-item">
                      <h4>{proj.title}</h4>
                      <p>{proj.description}</p>
                      {proj.tag && <span className="pill-tag tag-network">{proj.tag}</span>}
                      {proj.link && (
                        <a className="link-row" href={proj.link} target="_blank" rel="noopener noreferrer">View on GitHub →</a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--fg-dim)' }}>No projects yet.</p>
              )}
            </div>

            <div className="card reveal" id="resume-education">
              <h3>Education</h3>
              {education ? (
                <>
                  <h4 style={{ marginTop: '0.5rem' }}>{education.institution}</h4>
                  <p style={{ fontSize: '0.9rem' }}>{education.details}</p>
                </>
              ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--fg-dim)' }}>Education info not yet added.</p>
              )}
            </div>
          </main>
        </div>
      </section>

      {/* Print-only resume */}
      <section className="print-only">
        <div className="wrap">
          <h1>Barshan Dey</h1>
          <p>Cybersecurity learner · {profile.email}</p>
          <h2>Skills</h2>
          <p>{skills.join(' · ')}</p>
          <h2>Projects</h2>
          {projects.map((p, i) => (
            <div key={i}>
              <strong>{p.title}</strong>
              <p>{p.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
