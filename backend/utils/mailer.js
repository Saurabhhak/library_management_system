/* ══════════════════════════════════════════════════════════════════════════════
 * utils/mailer.js
 * Pure nodemailer SMTP mailer — no Brevo, no SendGrid, no external SDKs.
 *
 * Required .env variables:
 *   SMTP_HOST       e.g. smtp.gmail.com
 *   SMTP_PORT       587 (TLS/STARTTLS) or 465 (SSL)
 *   SMTP_USER       your@gmail.com
 *   SMTP_PASS       Gmail App Password (NOT your account password)
 *   MAIL_FROM_NAME  "Library System"  (display name in From header)
 *
 * Gmail quick-start:
 *   1. Enable 2FA on the Gmail account
 *   2. Go to Google Account → Security → App Passwords → create one
 *   3. Use that 16-char password as SMTP_PASS
 * ══════════════════════════════════════════════════════════════════════════════ */
"use strict";

const nodemailer = require("nodemailer");

/* ── Transport (created once, reused for every send) ─────────────────────── */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  /* secure=true uses port 465 SSL; secure=false uses STARTTLS on 587 */
  secure: parseInt(process.env.SMTP_PORT || "587", 10) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  /* Sensible timeouts */
  connectionTimeout: 10_000,
  greetingTimeout: 5_000,
  socketTimeout: 10_000,
});

/* ── Verify connection on startup (optional — logs config errors early) ───── */
if (process.env.NODE_ENV !== "test") {
  transporter.verify((err) => {
    if (err) {
      console.error("[Mailer] SMTP connection failed:", err.message);
    } else {
      console.log("[Mailer] SMTP ready ✓");
    }
  });
}

/* ── Shared HTML wrapper for consistent email styling ─────────────────────── */
function htmlWrapper(content) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;overflow:hidden;
                      box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:24px 32px;text-align:center;">
              <span style="color:#2ee6a6;font-size:20px;font-weight:700;letter-spacing:1px;">
                📚 Library System
              </span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;color:#1e293b;font-size:15px;line-height:1.7;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:16px 32px;
                       text-align:center;font-size:12px;color:#94a3b8;
                       border-top:1px solid #e2e8f0;">
              This is an automated message — please do not reply directly.<br/>
              © ${new Date().getFullYear()} Library System. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

/* ─────────────────────────────────────────────────────────────────────────────
 * sendMail({ to, subject, html, text? })
 *
 * @param {string|string[]} to       — recipient(s)
 * @param {string}          subject  — email subject
 * @param {string}          html     — HTML body (will be wrapped automatically)
 * @param {string}         [text]   — plain-text fallback (auto-generated if omitted)
 * ───────────────────────────────────────────────────────────────────────────── */
async function sendMail({ to, subject, html, text }) {
  const wrappedHtml = htmlWrapper(html);
  const plainText =
    text ??
    wrappedHtml
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

  const info = await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME || "Library System"}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: wrappedHtml,
    text: plainText,
  });

  console.log(`[Mailer] Sent → ${to} | messageId: ${info.messageId}`);
  return info;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Pre-built email templates — import and call directly from controllers
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * OTP email (password reset / verification)
 */
async function sendOtpEmail({ to, otp, expiresMinutes = 10 }) {
  return sendMail({
    to,
    subject: "Your OTP Code — Library System",
    html: `
      <h2 style="margin:0 0 16px;color:#0f172a;">Verification Code</h2>
      <p>Use the OTP below to complete your request. It expires in
         <strong>${expiresMinutes} minutes</strong>.</p>
      <div style="text-align:center;margin:28px 0;">
        <span style="display:inline-block;background:#0f172a;color:#2ee6a6;
                     font-size:32px;font-weight:700;letter-spacing:10px;
                     padding:16px 32px;border-radius:10px;">
          ${otp}
        </span>
      </div>
      <p style="color:#64748b;font-size:13px;">
        If you did not request this, you can safely ignore this email.
      </p>
    `,
  });
}

/**
 * Password reset link email
 */
async function sendPasswordResetEmail({ to, resetLink }) {
  return sendMail({
    to,
    subject: "Reset Your Password — Library System",
    html: `
      <h2 style="margin:0 0 16px;color:#0f172a;">Reset Your Password</h2>
      <p>We received a request to reset your password. Click the button below
         to set a new one. The link expires in <strong>30 minutes</strong>.</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${resetLink}"
           style="display:inline-block;background:#2ee6a6;color:#0a0f1e;
                  text-decoration:none;padding:13px 32px;border-radius:8px;
                  font-weight:700;font-size:15px;">
          Reset Password
        </a>
      </div>
      <p style="color:#64748b;font-size:13px;">
        If the button doesn't work, copy and paste this link:<br/>
        <a href="${resetLink}" style="color:#2ee6a6;word-break:break-all;">${resetLink}</a>
      </p>
      <p style="color:#64748b;font-size:13px;">
        If you didn't request a password reset, no action is needed.
      </p>
    `,
  });
}

/**
 * Welcome email for new members
 */
async function sendWelcomeEmail({ to, name }) {
  return sendMail({
    to,
    subject: "Welcome to the Library System!",
    html: `
      <h2 style="margin:0 0 16px;color:#0f172a;">Welcome, ${name}! 👋</h2>
      <p>Your library account has been created successfully.
         You can now log in and start browsing our collection.</p>
      <ul style="color:#475569;line-height:2;">
        <li>Browse thousands of books in the library</li>
        <li>Track your borrowed books and due dates</li>
        <li>View your borrowing history</li>
      </ul>
      <p>If you have any questions, reach out to the library staff.</p>
    `,
  });
}

module.exports = {
  sendMail,
  sendOtpEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
