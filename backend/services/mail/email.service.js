// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// const getTemplate = (otp) => `
//   <div style="font-family:Arial;max-width:600px;margin:auto;padding:20px">
//     <h2>Password Reset OTP</h2>
//     <p>Your OTP is:</p>
//     <div style="padding:15px;background:#f4f4f4;text-align:center;font-size:24px">
//       <b>${otp}</b>
//     </div>
//     <p>Expires in 2 minutes</p>
//   </div>
// `;

// const sendEmail = async (toEmail, otp) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"APV Library" <${process.env.SMTP_USER}>`,
//       to: toEmail,
//       subject: "Your OTP Code",
//       html: getTemplate(otp),
//     });

//     console.log("Email sent:", info.messageId);
//     return true;
//   } catch (error) {
//     console.error("EMAIL ERROR:", error);
//     throw error;
//   }
// };

// module.exports = sendEmail;

// services/mail/email.service.js
// SendGrid OTP Email Service
//
// .env:
//   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxx
//   SENDGRID_SENDER_EMAIL=you@yourdomain.com
//
// npm install @sendgrid/mail
"use strict";

const sgMail = require("@sendgrid/mail");

// ── Guard: fail fast on missing env vars ──────────────────────────────────────
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("[EmailService] SENDGRID_API_KEY is not set.");
}
if (!process.env.SENDGRID_SENDER_EMAIL) {
  throw new Error("[EmailService] SENDGRID_SENDER_EMAIL is not set.");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ── HTML Template ─────────────────────────────────────────────────────────────
const getOtpTemplate = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Password Reset OTP</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
               style="background:#fff;border-radius:10px;overflow:hidden;
                      box-shadow:0 4px 12px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a73e8,#0d47a1);
                        padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:24px;letter-spacing:1px;">
                APV Library
              </h1>
              <p style="margin:6px 0 0;color:#c5d9f5;font-size:13px;">
                Online Library Management System
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px;color:#1a1a2e;font-size:20px;">
                Password Reset Request
              </h2>
              <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                We received a request to reset your password.
                Use the OTP below to proceed.
                <strong>Do not share this code with anyone.</strong>
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:0 0 28px;">
                    <div style="display:inline-block;background:#eef4ff;
                                border:2px dashed #1a73e8;border-radius:10px;
                                padding:20px 48px;">
                      <span style="font-size:36px;font-weight:700;letter-spacing:10px;
                                   color:#1a73e8;font-family:'Courier New',monospace;">
                        ${otp}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#fff8e1;border-left:4px solid #f59e0b;
                              border-radius:4px;padding:14px 18px;">
                    <p style="margin:0;color:#92400e;font-size:14px;">
                      This OTP is valid for <strong>2 minutes</strong> only.
                      If you did not request this, please ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8faff;padding:20px 40px;text-align:center;
                        border-top:1px solid #e8edf5;">
              <p style="margin:0;color:#999;font-size:12px;line-height:1.6;">
                This is an automated message. Please do not reply.<br/>
                &copy; ${new Date().getFullYear()} APV Library. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ── Core Send Function ────────────────────────────────────────────────────────
/**
 * Sends an OTP email via SendGrid.
 *
 * Import and call:
 *   const sendEmail = require("./email.service");
 *   await sendEmail(email, otp);
 *
 * @param {string}        toEmail
 * @param {string|number} otp
 * @returns {Promise<boolean>}
 */
const sendEmail = async (toEmail, otp) => {
  if (!toEmail || typeof toEmail !== "string") {
    throw new Error("[EmailService] Invalid recipient email address.");
  }
  if (!otp) {
    throw new Error("[EmailService] OTP value is required.");
  }

  const msg = {
    to: toEmail.trim().toLowerCase(),
    from: {
      email: process.env.SENDGRID_SENDER_EMAIL,
      name: "APV Library",
    },
    subject: "Your Password Reset OTP",
    html: getOtpTemplate(String(otp)),
    text: `APV Library - Password Reset\n\nYour OTP is: ${otp}\n\nExpires in 2 minutes.\nIgnore this if you did not request a reset.`,
  };

  try {
    const [response] = await sgMail.send(msg);
    console.log(
      `[EmailService] OTP sent to ${toEmail} | HTTP ${response.statusCode}`,
    );
    return true;
  } catch (error) {
    const sgErrors = error.response?.body?.errors;
    if (sgErrors?.length) {
      sgErrors.forEach((e) =>
        console.error(
          `[EmailService] SendGrid error - ${e.field || "general"}: ${e.message}`,
        ),
      );
      throw new Error(`Email sending failed: ${sgErrors[0].message}`);
    }
    console.error("[EmailService] Unexpected error:", error.message);
    throw new Error("Email sending failed. Please try again later.");
  }
};

// ── Self-Test  →  node email.service.js ──────────────────────────────────────
if (require.main === module) {
  (async () => {
    try {
      require("dotenv").config();
    } catch {
      /* env already loaded */
    }

    const testEmail =
      process.env.TEST_EMAIL || process.env.SENDGRID_SENDER_EMAIL;
    const testOtp = Math.floor(100000 + Math.random() * 900000);

    console.log(
      `\n[EmailService] Self-test → sending OTP ${testOtp} to ${testEmail}\n`,
    );
    try {
      await sendEmail(testEmail, testOtp);
      console.log("[EmailService] Test passed — check your inbox!");
    } catch (err) {
      console.error("[EmailService] Test failed:", err.message);
      process.exit(1);
    }
  })();
}

// Default export — used as: const sendEmail = require("./email.service")
module.exports = sendEmail;
