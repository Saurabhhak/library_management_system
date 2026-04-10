// email-sendgrid.js
// Primary provider — SendGrid
// Free tier: 100 emails/day forever | https://sendgrid.com
//
// Setup:
//   1. Sign up at sendgrid.com
//   2. Settings → API Keys → Create API Key (Mail Send only)
//   3. Settings → Sender Authentication → verify your sender email
//
// npm install @sendgrid/mail
//
// .env required:
//   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxx
//   SENDGRID_SENDER_EMAIL=you@yourdomain.com

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getTemplate = (otp) => `
  <div style="font-family:Arial;max-width:600px;margin:auto;padding:20px">
    <h2>Password Reset OTP</h2>
    <p>Your OTP is:</p>
    <div style="padding:15px;background:#f4f4f4;text-align:center;font-size:24px">
      <b>${otp}</b>
    </div>
    <p>Expires in 2 minutes</p>
  </div>
`;

const sendEmail = async (toEmail, otp) => {
  try {
    await sgMail.send({
      to: toEmail,
      from: {
        email: process.env.SENDGRID_SENDER_EMAIL,
        name: "APV Library",
      },
      subject: "Password Reset OTP",
      html: getTemplate(otp),
    });
    console.log(`[SendGrid] OTP sent to ${toEmail}`);
    return true;
  } catch (error) {
    // SendGrid puts error details inside error.response.body
    const detail = error.response?.body?.errors?.[0]?.message || error.message;
    console.error("[SendGrid] EMAIL ERROR:", detail);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;