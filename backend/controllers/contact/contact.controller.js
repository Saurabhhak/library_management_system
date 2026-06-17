// controllers/resources/contact.controller.js
"use strict";

const db        = require("../../config/db");
const sendMail  = require("../../services/mail/email.service");
const { contactTemplate, contactAutoReplyTemplate } = require("../../services/mail/templates");

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || process.env.SENDGRID_SENDER_EMAIL;

/* ── POST /contact  (public) ────────────────────────────────────── */
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const trimmed = {
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    };

    /* Save to DB */
    const { rows } = await db.query(
      `INSERT INTO contact_us (name, email, subject, message, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, created_at`,
      [
        trimmed.name,
        trimmed.email,
        trimmed.subject,
        trimmed.message,
        req.ip   ?? null,
        req.headers["user-agent"] ?? null,
      ]
    );

    const { id, created_at } = rows[0];
    const submittedAt = new Date(created_at).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    /* Fire-and-forget both emails — don't block the HTTP response */
    Promise.allSettled([
      // Notify admin
      sendMail({
        to: ADMIN_EMAIL,
        subject: `[Contact] ${trimmed.subject} — from ${trimmed.name}`,
        html: contactTemplate({ ...trimmed, submittedAt }),
        text: `New contact from ${trimmed.name} <${trimmed.email}>\n\n${trimmed.message}`,
      }),
      // Auto-reply to user
      sendMail({
        to: trimmed.email,
        subject: "We got your message — APV Library",
        html: contactAutoReplyTemplate({ name: trimmed.name }),
        text: `Hi ${trimmed.name}, we received your message and will reply within 1–2 business days.`,
      }),
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`[submitContact] email[${i}] failed:`, r.reason?.message);
        }
      });
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent. We will get back to you soon.",
      data: { id },
    });
  } catch (err) {
    console.error("[submitContact] error:", err.message);
    return res.status(500).json({ success: false, message: "Failed to submit. Try again later." });
  }
};

/* ── GET /contact  (admin only) ─────────────────────────────────── */
exports.getAllContacts = async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;
    const status = req.query.status || null;
    const search = req.query.search || null;

    const conditions = [];
    const values     = [];
    let   idx        = 1;

    if (status) { conditions.push(`status = $${idx++}`); values.push(status); }
    if (search) {
      conditions.push(`(name ILIKE $${idx} OR email ILIKE $${idx} OR subject ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countRes = await db.query(`SELECT COUNT(*) FROM contact_us ${where}`, values);
    const total    = parseInt(countRes.rows[0].count, 10);

    const { rows } = await db.query(
      `SELECT id, name, email, subject, message, status, created_at, updated_at
       FROM contact_us
       ${where}
       ORDER BY created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset]
    );

    return res.json({
      success: true,
      data: rows,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[getAllContacts] error:", err.message);
    return res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

/* ── PATCH /contact/:id/status  (admin only) ────────────────────── */
exports.updateContactStatus = async (req, res) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;
    const VALID      = ["unread", "read", "resolved"];

    if (!VALID.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${VALID.join(", ")}`,
      });
    }

    const { rows } = await db.query(
      `UPDATE contact_us
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, status, updated_at`,
      [status, id]
    );

    if (!rows.length)
      return res.status(404).json({ success: false, message: "Contact not found" });

    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("[updateContactStatus] error:", err.message);
    return res.status(500).json({ success: false, message: "Update failed" });
  }
};

/* ── DELETE /contact/:id  (admin only) ──────────────────────────── */
exports.deleteContact = async (req, res) => {
  try {
    const { rows } = await db.query(
      `DELETE FROM contact_us WHERE id = $1 RETURNING id`,
      [req.params.id]
    );

    if (!rows.length)
      return res.status(404).json({ success: false, message: "Not found" });

    return res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("[deleteContact] error:", err.message);
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};