// services/mail/templates.js
"use strict";

const YEAR = new Date().getFullYear();

const header = (icon = "📚") => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:linear-gradient(135deg,#1a73e8,#0d47a1);
                 padding:28px 40px;text-align:center;border-radius:10px 10px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:1px;">${icon} APV Library</h1>
        <p style="margin:4px 0 0;color:#c5d9f5;font-size:12px;">Online Library Management System</p>
      </td>
    </tr>
  </table>`;

const footer = () => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#f8faff;padding:16px 40px;text-align:center;
                 border-top:1px solid #e8edf5;border-radius:0 0 10px 10px;">
        <p style="margin:0;color:#999;font-size:11px;line-height:1.6;">
          This is an automated message — please do not reply.<br/>
          &copy; ${YEAR} APV Library. All rights reserved.
        </p>
      </td>
    </tr>
  </table>`;

const wrapper = (body) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:10px;
                    box-shadow:0 4px 12px rgba(0,0,0,0.08);
                    max-width:600px;width:100%;">
        ${body}
      </table>
    </td></tr>
  </table>
</body>
</html>`;

/* ── OTP (registration or generic) ──────────────────────────────── */
const otpTemplate = (
  otp,
  { title = "Email Verification", expiresMin = 2 } = {},
) =>
  wrapper(`
    ${header("🔐")}
    <tr><td style="padding:36px 40px;">
      <h2 style="margin:0 0 10px;color:#1a1a2e;font-size:18px;">${title}</h2>
      <p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.6;">
        Use the one-time code below. <strong>Never share it with anyone.</strong>
      </p>
      <div style="text-align:center;padding:0 0 24px;">
        <div style="display:inline-block;background:#eef4ff;
                    border:2px dashed #1a73e8;border-radius:10px;padding:18px 48px;">
          <span style="font-size:34px;font-weight:700;letter-spacing:10px;
                       color:#1a73e8;font-family:'Courier New',monospace;">${otp}</span>
        </div>
      </div>
      <div style="background:#fff8e1;border-left:4px solid #f59e0b;
                  border-radius:4px;padding:12px 16px;">
        <p style="margin:0;color:#92400e;font-size:13px;">
          This code expires in <strong>${expiresMin} minutes</strong>.
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    </td></tr>
    ${footer()}`);

/* ── Password Reset OTP ──────────────────────────────────────────── */
const passwordResetTemplate = (otp) =>
  otpTemplate(otp, { title: "Password Reset Request", expiresMin: 2 });

/* ── Feedback notification (to admin) ───────────────────────────── */
const feedbackTemplate = ({ name, email, message, id, submittedAt }) =>
  wrapper(`
    ${header("📬")}
    <tr><td style="padding:32px 40px;">
      <h2 style="margin:0 0 20px;color:#1a1a2e;font-size:18px;">New Feedback Received</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;
                     color:#888;font-size:13px;width:80px;vertical-align:top;">Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;">
            <b>${name}</b>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;
                     color:#888;font-size:13px;vertical-align:top;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;">
            <a href="mailto:${email}" style="color:#1a73e8;">${email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top;">Message</td>
          <td style="padding:10px 0;font-size:14px;color:#333;line-height:1.6;">${message}</td>
        </tr>
      </table>
    </td></tr>
    <tr>
      <td style="background:#f8faff;padding:14px 40px;text-align:center;
                 border-top:1px solid #e8edf5;border-radius:0 0 10px 10px;">
        <p style="margin:0;color:#aaa;font-size:11px;">
          Feedback ID #${id} &nbsp;·&nbsp; ${submittedAt}
        </p>
      </td>
    </tr>`);

/* ── Contact Us notification (to admin) ─────────────────────────── */
const contactTemplate = ({ name, email, subject, message, submittedAt }) =>
  wrapper(`
    ${header("✉️")}
    <tr><td style="padding:32px 40px;">
      <h2 style="margin:0 0 20px;color:#1a1a2e;font-size:18px;">New Contact Us Message</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;
                     color:#888;font-size:13px;width:80px;vertical-align:top;">Name</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;">
            <b>${name}</b>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;
                     color:#888;font-size:13px;vertical-align:top;">Email</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;">
            <a href="mailto:${email}" style="color:#1a73e8;">${email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;
                     color:#888;font-size:13px;vertical-align:top;">Subject</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;">
            ${subject}
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top;">Message</td>
          <td style="padding:10px 0;font-size:14px;color:#333;line-height:1.6;">${message}</td>
        </tr>
      </table>
    </td></tr>
    <tr>
      <td style="background:#f8faff;padding:14px 40px;text-align:center;
                 border-top:1px solid #e8edf5;border-radius:0 0 10px 10px;">
        <p style="margin:0;color:#aaa;font-size:11px;">
          Submitted: ${submittedAt}
        </p>
      </td>
    </tr>`);

/* ── Auto-reply to user who submitted contact form ───────────────── */
const contactAutoReplyTemplate = ({ name }) =>
  wrapper(`
    ${header("✅")}
    <tr><td style="padding:36px 40px;">
      <h2 style="margin:0 0 12px;color:#1a1a2e;font-size:18px;">
        We received your message, ${name}!
      </h2>
      <p style="margin:0 0 20px;color:#555;font-size:14px;line-height:1.6;">
        Thank you for reaching out to APV Library. Our team will review your message
        and get back to you within <strong>1–2 business days</strong>.
      </p>
      <div style="background:#e8f5e9;border-left:4px solid #10b981;
                  border-radius:4px;padding:12px 16px;">
        <p style="margin:0;color:#065f46;font-size:13px;">
          If your query is urgent, please visit us directly at the library during working hours.
        </p>
      </div>
    </td></tr>
    ${footer()}`);

module.exports = {
  otpTemplate,
  passwordResetTemplate,
  feedbackTemplate,
  contactTemplate,
  contactAutoReplyTemplate,
};
