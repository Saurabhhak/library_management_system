const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendOTPEmail, sendResetEmail } = require("../../utils/emailService");

// helper: make JWT
const makeToken = (id) =>
  jwt.sign({ id, role: "member" }, process.env.JWT_SECRET, { expiresIn: "7d" });

/* ── 1. Send registration OTP ── */
const sendRegistrationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email required" });

    // Email already registered?
    const exists = await pool.query(
      "SELECT id FROM members WHERE email=$1 AND is_deleted=false",
      [email],
    );
    if (exists.rows.length)
      return res
        .status(409)
        .json({
          success: false,
          message: "Email already registered. Please login.",
        });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `INSERT INTO pending_registrations (email, otp, otp_expires)
       VALUES ($1,$2,$3)
       ON CONFLICT (email) DO UPDATE SET otp=$2, otp_expires=$3, is_verified=false, created_at=NOW()`,
      [email, otp, expires],
    );

    await sendOTPEmail(email, otp);
    res.json({ success: true, message: "OTP sent. Valid for 10 minutes." });
  } catch (err) {
    console.error("sendRegistrationOTP:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

/* ── 2. Verify registration OTP ── */
const verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const row = await pool.query(
      "SELECT * FROM pending_registrations WHERE email=$1",
      [email],
    );

    if (!row.rows.length)
      return res
        .status(400)
        .json({
          success: false,
          message: "OTP not requested. Send OTP first.",
        });

    if (new Date() > new Date(row.rows[0].otp_expires))
      return res
        .status(400)
        .json({ success: false, message: "OTP expired. Request a new one." });

    if (otp !== row.rows[0].otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    await pool.query(
      "UPDATE pending_registrations SET is_verified=true WHERE email=$1",
      [email],
    );
    res.json({
      success: true,
      message: "Email verified. Complete your registration.",
    });
  } catch (err) {
    console.error("verifyRegistrationOTP:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ── 3. Complete registration ── */
const completeMemberRegistration = async (req, res) => {
  try {
    const {
      email,
      first_name,
      last_name,
      phone,
      password,
      state_id,
      city_id,
      date_of_birth,
    } = req.body;

    // Must have verified OTP
    const verified = await pool.query(
      "SELECT id FROM pending_registrations WHERE email=$1 AND is_verified=true",
      [email],
    );
    if (!verified.rows.length)
      return res
        .status(403)
        .json({
          success: false,
          message: "Email not verified. Verify OTP first.",
        });

    // Double-check no duplicate
    const dup = await pool.query("SELECT id FROM members WHERE email=$1", [
      email,
    ]);
    if (dup.rows.length)
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO members
        (first_name, last_name, email, phone, password, state_id, city_id, date_of_birth, is_email_verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true) RETURNING id, first_name, last_name, email, phone, status`,
      [
        first_name,
        last_name,
        email,
        phone,
        hashed,
        state_id || null,
        city_id || null,
        date_of_birth || null,
      ],
    );

    // Clean up temp record
    await pool.query("DELETE FROM pending_registrations WHERE email=$1", [
      email,
    ]);

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token: makeToken(result.rows[0].id),
      data: result.rows[0],
    });
  } catch (err) {
    console.error("completeMemberRegistration:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ── 4. Login ── */
const memberLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      "SELECT * FROM members WHERE email=$1 AND is_deleted=false",
      [email],
    );

    if (!result.rows.length)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });

    const member = result.rows[0];

    if (member.status === "inactive")
      return res
        .status(403)
        .json({
          success: false,
          message: "Your account is inactive. Contact admin.",
        });

    const match = await bcrypt.compare(password, member.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });

    res.json({
      success: true,
      message: "Login successful",
      token: makeToken(member.id),
      data: {
        id: member.id,
        first_name: member.first_name,
        last_name: member.last_name,
        email: member.email,
      },
    });
  } catch (err) {
    console.error("memberLogin:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ── 5. Forgot password – send OTP ── */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pool.query(
      "SELECT id FROM members WHERE email=$1 AND is_deleted=false",
      [email],
    );

    // Always return same response (security: don't leak if email exists)
    const GENERIC = {
      success: true,
      message: "If that email is registered, a reset code was sent.",
    };

    if (!result.rows.length) return res.json(GENERIC);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      "UPDATE members SET reset_otp=$1, reset_otp_expires=$2 WHERE email=$3",
      [otp, expires, email],
    );

    await sendResetEmail(email, otp);
    res.json(GENERIC);
  } catch (err) {
    console.error("forgotPassword:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ── 6. Verify reset OTP ── */
const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await pool.query(
      "SELECT reset_otp, reset_otp_expires FROM members WHERE email=$1",
      [email],
    );

    if (!result.rows.length)
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });

    const { reset_otp, reset_otp_expires } = result.rows[0];

    if (!reset_otp || new Date() > new Date(reset_otp_expires))
      return res
        .status(400)
        .json({ success: false, message: "OTP expired. Request a new one." });

    if (otp !== reset_otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    // Issue a short-lived reset token
    const reset_token = crypto.randomBytes(32).toString("hex");
    const reset_token_expires = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `UPDATE members SET reset_otp=NULL, reset_otp_expires=NULL,
       reset_token=$1, reset_token_expires=$2 WHERE email=$3`,
      [reset_token, reset_token_expires, email],
    );

    res.json({ success: true, reset_token });
  } catch (err) {
    console.error("verifyResetOTP:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ── 7. Reset password ── */
const resetPassword = async (req, res) => {
  try {
    const { reset_token, new_password } = req.body;
    const result = await pool.query(
      "SELECT id FROM members WHERE reset_token=$1 AND reset_token_expires > NOW()",
      [reset_token],
    );

    if (!result.rows.length)
      return res
        .status(400)
        .json({
          success: false,
          message: "Reset link expired or invalid. Request again.",
        });

    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query(
      `UPDATE members SET password=$1, reset_token=NULL, reset_token_expires=NULL, updated_at=NOW()
       WHERE id=$2`,
      [hashed, result.rows[0].id],
    );

    res.json({
      success: true,
      message: "Password reset successful. Please login.",
    });
  } catch (err) {
    console.error("resetPassword:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ── 8. Google OAuth callback ── */
const googleAuthCallback = (req, res) => {
  const token = makeToken(req.user.id);
  // Redirect frontend to handle the token
  res.redirect(
    `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`,
  );
};

module.exports = {
  sendRegistrationOTP,
  verifyRegistrationOTP,
  completeMemberRegistration,
  memberLogin,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  googleAuthCallback,
};
