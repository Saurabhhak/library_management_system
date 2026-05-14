// services/mail/templates.js
"use strict";

// ── OTP Email ─────────────────────────────────────────────────────────────────
const otpTemplate = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a73e8,#0d47a1);padding:32px 40px;text-align:center;border-radius:10px 10px 0 0;">
            <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:1px;">APV Library</h1>
            <p style="margin:4px 0 0;color:#c5d9f5;font-size:12px;">Online Library Management System</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="margin:0 0 10px;color:#1a1a2e;font-size:18px;">Password Reset Request</h2>
            <p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.6;">
              Use the OTP below to reset your password.
              <strong>Do not share this code with anyone.</strong>
            </p>

            <!-- OTP Box -->
            <div style="text-align:center;padding:0 0 24px;">
              <div style="display:inline-block;background:#eef4ff;border:2px dashed #1a73e8;
                          border-radius:10px;padding:18px 48px;">
                <span style="font-size:34px;font-weight:700;letter-spacing:10px;
                             color:#1a73e8;font-family:'Courier New',monospace;">
                  ${otp}
                </span>
              </div>
            </div>

            <!-- Warning -->
            <div style="background:#fff8e1;border-left:4px solid #f59e0b;border-radius:4px;padding:12px 16px;">
              <p style="margin:0;color:#92400e;font-size:13px;">
                This OTP is valid for <strong>2 minutes</strong> only.
                If you did not request this, please ignore this email.
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8faff;padding:18px 40px;text-align:center;
                     border-top:1px solid #e8edf5;border-radius:0 0 10px 10px;">
            <p style="margin:0;color:#999;font-size:11px;line-height:1.6;">
              This is an automated message. Please do not reply.<br/>
              &copy; ${new Date().getFullYear()} APV Library. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── Feedback Notification Email ───────────────────────────────────────────────
const feedbackTemplate = ({ name, email, message, id, submittedAt }) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#fff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a73e8,#0d47a1);padding:28px 40px;text-align:center;border-radius:10px 10px 0 0;">
            <h1 style="margin:0;color:#fff;font-size:20px;">📬 New Feedback</h1>
            <p style="margin:4px 0 0;color:#c5d9f5;font-size:12px;">APV Library Management System</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;width:80px;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;"><b>${name}</b></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:13px;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;">
                  <a href="mailto:${email}" style="color:#1a73e8;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;font-size:13px;vertical-align:top;">Message</td>
                <td style="padding:10px 0;font-size:14px;color:#333;line-height:1.6;">${message}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8faff;padding:14px 40px;text-align:center;
                     border-top:1px solid #e8edf5;border-radius:0 0 10px 10px;">
            <p style="margin:0;color:#aaa;font-size:11px;">
              Feedback ID #${id} &nbsp;·&nbsp; ${submittedAt}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

module.exports = { otpTemplate, feedbackTemplate };
