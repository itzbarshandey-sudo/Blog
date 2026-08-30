/* server.js — Node backend for the contact form */
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3001;

/* ──────────────────────── Middleware ──────────────────────── */

// Security headers
app.use(helmet());

// CORS — allow your frontend origin (update for production)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));

// Parse JSON bodies
app.use(express.json({ limit: '16kb' }));

// Rate limiting — 5 submissions per IP per 15 minutes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many submissions — please try again later.' },
});

/* ──────────────────────── Email transport ──────────────────────── */

// Configure your SMTP credentials in .env (see .env.example)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ──────────────────────── Routes ──────────────────────── */

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Contact form endpoint
app.post(
  '/api/contact',
  contactLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).escape(),
    body('email').trim().isEmail().normalizeEmail(),
    body('topic').trim().isLength({ min: 1, max: 200 }).escape(),
    body('message').trim().isLength({ min: 10, max: 5000 }).escape(),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed.',
        details: errors.array().map(e => ({ field: e.path, msg: e.msg })),
      });
    }

    const { name, email, topic, message } = req.body;

    // Build email
    const mailOptions = {
      from: `"Node Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `[Node] ${topic} — from ${name}`,
      text: [
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Topic:   ${topic}`,
        ``,
        `Message:`,
        message,
      ].join('\n'),
      html: `
        <h2 style="margin:0 0 8px;">New message from Node contact form</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Name</td><td>${name}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Topic</td><td>${topic}</td></tr>
        </table>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e2e8f0;">
        <p style="font-family:sans-serif;font-size:14px;white-space:pre-line;">${message}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✓ Contact email sent — from: ${email}, topic: ${topic}`);
      return res.json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
      console.error('✗ Failed to send contact email:', err.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to send message. Please try again later or email directly.',
      });
    }
  }
);

/* ──────────────────────── Start ──────────────────────── */

app.listen(PORT, () => {
  console.log(`\n🛡️  Node backend running on http://localhost:${PORT}`);
  console.log(`   POST /api/contact  — contact form endpoint`);
  console.log(`   GET  /api/health   — health check\n`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('   ⚠  SMTP credentials not set — emails will fail.');
    console.warn('      Copy .env.example → .env and fill in your SMTP details.\n');
  }
});
