const nodemailer = require("nodemailer");

/* ── In-memory OTP store  { email → { otp, expiresAt } } ───────── */
const otpStore = new Map();

/* ── Nodemailer transporter (SMTP — works with Gmail, Brevo, etc.) ─ */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ── Send OTP ───────────────────────────────────────────────────── */
const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // 10 min

  try {
    await transporter.sendMail({
      from: `"LMS System" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0b0e18;color:#dde6f8;border-radius:10px">
          <h2 style="color:#10b981;margin:0 0 12px">Email Verification</h2>
          <p style="color:#8b949e;margin:0 0 24px">Use the code below to verify your email. It expires in <strong style="color:#dde6f8">10 minutes</strong>.</p>
          <div style="letter-spacing:10px;font-size:2rem;font-weight:700;color:#fff;background:#161b22;padding:20px;border-radius:8px;text-align:center">${otp}</div>
          <p style="color:#8b949e;font-size:0.8rem;margin-top:24px">If you didn't request this, ignore this email.</p>
        </div>`,
    });
    res.json({ success: true, message: "OTP sent — check your inbox." });
  } catch (err) {
    console.error("[OTP] sendMail:", err.message);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};

/* ── Verify OTP ─────────────────────────────────────────────────── */
const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record)
    return res
      .status(400)
      .json({ success: false, message: "No OTP found — request a new one." });

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res
      .status(400)
      .json({ success: false, message: "OTP has expired." });
  }

  if (record.otp !== String(otp))
    return res.status(400).json({ success: false, message: "Invalid OTP." });

  otpStore.delete(email);
  res.json({ success: true, message: "Email verified." });
};

module.exports = { sendOtp, verifyOtp };
