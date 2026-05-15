// services/mail/email.service.js
"use strict";

/**
 * Unified mailer: tries SendGrid first, falls back to Nodemailer.
 *
 * ENV (at least one pair required):
 *   SENDGRID_API_KEY          – SendGrid API key
 *   SENDGRID_SENDER_EMAIL     – verified sender
 *
 *   SMTP_HOST / SMTP_PORT     – Nodemailer fallback (default: smtp.gmail.com:587)
 *   SMTP_USER / SMTP_PASS     – SMTP credentials
 *   SMTP_FROM_NAME            – display name (default: "APV Library")
 */

const SENDER_NAME = process.env.SMTP_FROM_NAME || "APV Library";
const SENDER_EMAIL =
  process.env.SENDGRID_SENDER_EMAIL || process.env.SMTP_USER || "";

/* ── Lazy-loaded drivers (avoids crash if package missing) ─────────── */
let _sg = null;
let _nm = null;

const getSg = () => {
  if (!_sg) {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    _sg = sgMail;
  }
  return _sg;
};

const getNmTransport = () => {
  if (!_nm) {
    const nodemailer = require("nodemailer");
    _nm = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return _nm;
};

/* ── Core send ─────────────────────────────────────────────────────── */
/**
 * @param {{ to: string, subject: string, html: string, text?: string }} opts
 * @returns {Promise<boolean>}
 */
const sendMail = async ({ to, subject, html, text = "" }) => {
  if (!to || !subject || !html) {
    throw new Error("[EmailService] to, subject, and html are required.");
  }

  const recipient = to.trim().toLowerCase();

  /* ── Try SendGrid ─────────────────────────────────────────────── */
  if (process.env.SENDGRID_API_KEY) {
    try {
      const sg = getSg();
      const [res] = await sg.send({
        to: recipient,
        from: { email: SENDER_EMAIL, name: SENDER_NAME },
        subject,
        html,
        text,
      });
      console.log(
        `[EmailService] SendGrid → ${recipient} | HTTP ${res.statusCode}`,
      );
      return true;
    } catch (sgErr) {
      const errs = sgErr.response?.body?.errors;
      if (errs?.length) {
        errs.forEach((e) =>
          console.error(
            `[EmailService] SendGrid error — ${e.field || "general"}: ${e.message}`,
          ),
        );
      } else {
        console.error("[EmailService] SendGrid failed:", sgErr.message);
      }
      console.warn("[EmailService] Falling back to Nodemailer…");
    }
  }

  /* ── Fallback: Nodemailer ─────────────────────────────────────── */
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      "[EmailService] No working mailer configured. " +
        "Set SENDGRID_API_KEY or SMTP_USER/SMTP_PASS.",
    );
  }

  try {
    const transport = getNmTransport();
    const info = await transport.sendMail({
      from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
      to: recipient,
      subject,
      html,
      text,
    });
    console.log(
      `[EmailService] Nodemailer → ${recipient} | msgId: ${info.messageId}`,
    );
    return true;
  } catch (nmErr) {
    console.error("[EmailService] Nodemailer failed:", nmErr.message);
    throw new Error("Email delivery failed. Please try again later.");
  }
};

module.exports = sendMail;
