/* api/contact.js — Vercel Serverless Function for contact form */
const nodemailer = require('nodemailer');

// Vercel reads these from your project's Environment Variables dashboard
const {
  SMTP_HOST = 'smtp.gmail.com',
  SMTP_PORT = '587',
  SMTP_SECURE = 'false',
  SMTP_USER,
  SMTP_PASS,
  CONTACT_EMAIL,
  CORS_ORIGIN = 'https://itsnode.in',
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT, 10),
  secure: SMTP_SECURE === 'true',
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// Simple rate-limit store (resets per cold-start, good enough for serverless)
const ipHits = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_HITS = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip) || { count: 0, start: now };
  if (now - entry.start > WINDOW_MS) {
    ipHits.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count++;
  ipHits.set(ip, entry);
  return entry.count > MAX_HITS;
}

function sanitize(str = '') {
  return String(str).trim().replace(/[<>]/g, '');
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });

  // Rate limit
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ success: false, error: 'Too many submissions — please try again later.' });
  }

  // Parse + validate
  const { name, email, topic, message } = req.body || {};

  const cleanName = sanitize(name);
  const cleanEmail = sanitize(email);
  const cleanTopic = sanitize(topic);
  const cleanMessage = sanitize(message);

  if (!cleanName || cleanName.length < 2 || cleanName.length > 100) {
    return res.status(400).json({ success: false, error: 'Invalid name.' });
  }
  if (!cleanEmail || !validateEmail(cleanEmail) || cleanEmail.length > 254) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }
  if (!cleanMessage || cleanMessage.length < 10 || cleanMessage.length > 5000) {
    return res.status(400).json({ success: false, error: 'Message must be between 10 and 5000 characters.' });
  }

  // Send email
  try {
    await transporter.sendMail({
      from: `"Node Contact Form" <${SMTP_USER}>`,
      to: CONTACT_EMAIL || SMTP_USER,
      replyTo: cleanEmail,
      subject: `[Node] ${cleanTopic || 'Message'} — from ${cleanName}`,
      text: [`Name:    ${cleanName}`, `Email:   ${cleanEmail}`, `Topic:   ${cleanTopic}`, ``, `Message:`, cleanMessage].join('\n'),
      html: `
        <h2 style="margin:0 0 8px;">New message from Node contact form</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Name</td><td>${cleanName}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Email</td><td><a href="mailto:${cleanEmail}">${cleanEmail}</a></td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Topic</td><td>${cleanTopic}</td></tr>
        </table>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e2e8f0;">
        <p style="font-family:sans-serif;font-size:14px;white-space:pre-line;">${cleanMessage}</p>
      `,
    });

    console.log(`✓ Contact email sent from ${cleanEmail}`);
    return res.status(200).json({ success: true, message: 'Message sent!' });
  } catch (err) {
    console.error('✗ Email send failed:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to send — please email me directly.' });
  }
}
