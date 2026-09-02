import { useState, useRef, useEffect } from 'react';

function showError(fieldRef, inputRef, setErrors) {
  if (!fieldRef.current) return;
  fieldRef.current.classList.add('is-error', 'error');
  if (inputRef.current) inputRef.current.classList.add('is-error');

  if (inputRef.current) {
    inputRef.current.classList.remove('is-shaking');
    void inputRef.current.offsetWidth;
    inputRef.current.classList.add('is-shaking');
    const shakeMs = 80 * 2 + 60 * 2;
    setTimeout(() => inputRef.current?.classList.remove('is-shaking'), shakeMs + 20);
  }

  if (fieldRef.current._revertTimer) clearTimeout(fieldRef.current._revertTimer);
  fieldRef.current._revertTimer = setTimeout(() => {
    fieldRef.current._revertTimer = null;
    fieldRef.current.classList.remove('is-error', 'error');
    if (inputRef.current) inputRef.current.classList.remove('is-error');
  }, 80 * 2 + 60 * 2 + 3000);

  setErrors((e) => e + 1);
}

function clearError(fieldRef, inputRef) {
  if (!fieldRef.current) return;
  if (fieldRef.current._revertTimer) {
    clearTimeout(fieldRef.current._revertTimer);
    fieldRef.current._revertTimer = null;
  }
  fieldRef.current.classList.remove('is-error', 'error');
  if (inputRef.current) inputRef.current.classList.remove('is-error', 'is-shaking');
}

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [, setErrors] = useState(0);

  const nameField = useRef(null);
  const emailField = useRef(null);
  const messageField = useRef(null);
  const nameInput = useRef(null);
  const emailInput = useRef(null);
  const messageInput = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError(null);

    const form = e.currentTarget;
    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const message = form.elements['message'].value.trim();
    const topic = form.elements['topic']?.value || '';

    let isValid = true;
    if (!name || name.length < 2) { showError(nameField, nameInput, setErrors); isValid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(emailField, emailInput, setErrors); isValid = false; }
    if (!message || message.length < 10) { showError(messageField, messageInput, setErrors); isValid = false; }

    if (!isValid) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setServerError(data.error || 'Failed to send. Please try again.');
      }
    } catch (err) {
      setServerError('Network error — please email me directly at itzbarshandey@gmail.com');
    } finally {
      setSubmitting(false);
    }
  }

  function onInput(fieldRef, inputRef) {
    return () => clearError(fieldRef, inputRef);
  }

  return (
    <div className={`form-card card ${success ? 'success-mode' : ''}`}>
      <div className="form-success">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d9e42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12.5l2.5 2.5L16 9" />
        </svg>
        <p>Thanks — your message has been sent. I&apos;ll get back to you soon.</p>
      </div>
      <form id="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="field t-input-wrap" ref={nameField}>
          <label htmlFor="name">Your name</label>
          <div className="t-input">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Jordan Lee"
              autoComplete="name"
              ref={nameInput}
              onInput={onInput(nameField, nameInput)}
              disabled={submitting}
            />
          </div>
          <div className="field-error t-error-msg">Please enter at least 2 characters.</div>
        </div>
        <div className="field t-input-wrap" ref={emailField}>
          <label htmlFor="email">Email address</label>
          <div className="t-input">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              ref={emailInput}
              onInput={onInput(emailField, emailInput)}
              disabled={submitting}
            />
          </div>
          <div className="field-error t-error-msg">Please enter a valid email address.</div>
        </div>
        <div className="field">
          <label htmlFor="topic">What&apos;s this about</label>
          <select id="topic" name="topic" disabled={submitting}>
            <option>General question</option>
            <option>Blog post feedback</option>
            <option>Security disclosure</option>
            <option>Collaboration idea</option>
            <option>Something else</option>
          </select>
        </div>
        <div className="field t-input-wrap" ref={messageField}>
          <label htmlFor="message">Message</label>
          <div className="t-input">
            <textarea
              id="message"
              name="message"
              placeholder="What&apos;s on your mind?"
              ref={messageInput}
              onInput={onInput(messageField, messageInput)}
              disabled={submitting}
            />
          </div>
          <div className="field-error t-error-msg">Please write at least 10 characters.</div>
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send message'}
        </button>
        {serverError && (
          <p className="form-note" style={{ color: 'var(--danger)' }}>{serverError}</p>
        )}
        <p className="form-note">This form validates and sends through a serverless function — your message reaches me directly.</p>
      </form>
    </div>
  );
}
