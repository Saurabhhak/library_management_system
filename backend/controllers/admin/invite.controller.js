// controllers/admin/invite.controller.js

const crypto = require("crypto");
const db = require("../../config/db");
const sendEmail = require("../../services/admin/email.service");

/* ─────────────────────────────────────────────────────────────────
   SEND ADMIN INVITE  (SuperAdmin only)
───────────────────────────────────────────────────────────────── */
const sendInvite = async (req, res) => {
  const client = await db.connect();

  try {
    const { first_name, last_name, email, role } = req.body;

    // ── Validation ──────────────────────────────────────────────
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: "first_name, last_name and email are required",
      });
    }

    // ── Duplicate check ─────────────────────────────────────────
    const existing = await client.query(
      "SELECT id FROM admin WHERE LOWER(email) = $1",
      [email.trim().toLowerCase()],
    );

    if (existing.rows.length) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists with this email",
      });
    }

    // ── Generate token ──────────────────────────────────────────
    const inviteToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h

    await client.query("BEGIN");

    await client.query(
      `INSERT INTO admin
         (first_name, last_name, email, role,
          invite_token, invite_token_expiry,
          is_active, is_profile_complete)
       VALUES ($1, $2, $3, $4, $5, $6, false, false)`,
      [
        first_name,
        last_name,
        email.trim().toLowerCase(),
        role || "admin",
        inviteToken,
        expiry,
      ],
    );

    await client.query("COMMIT");

    // ── Build invite link ────────────────────────────────────────
    // FRONTEND_URL/accept-invite/:token  — AcceptInvite.jsx reads :token
    const inviteLink = `${process.env.FRONTEND_URL}/accept-invite/${inviteToken}`;

    // ── Email ────────────────────────────────────────────────────
    const html = `
      <h2>You're Invited 🎉</h2>
      <p>Hello ${first_name},</p>
      <p>You have been invited as <strong>${role || "Admin"}</strong>.</p>
      <p>Click below to accept and set up your account:</p>
      <a href="${inviteLink}"
         style="display:inline-block;padding:10px 20px;background:#2563eb;
                color:#fff;text-decoration:none;border-radius:5px;">
        Accept Invite
      </a>
      <p style="color:#666;margin-top:16px;">This link expires in 24 hours.</p>
    `;

    await sendEmail(email, "You're Invited — LMS Admin", html);

    return res.json({ success: true, message: "Invite sent successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[sendInvite] Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send invite" });
  } finally {
    client.release();
  }
};

module.exports = { sendInvite };
