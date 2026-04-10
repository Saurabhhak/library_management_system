const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* _______________TEMPLATE _______________*/
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

/* _______________SENDGRID _______________*/
const sendViaSendGrid = async (toEmail, otp) => {
  try {
    const response = await sgMail.send({
      to: toEmail,
      from: {
        email: process.env.SENDGRID_SENDER_EMAIL,
        name: "APV Library",
      },
      subject: "Password Reset OTP",
      html: getTemplate(otp),
    });

    /*________________  IMPORTANT: check status manually */
    const statusCode = response?.[0]?.statusCode;

    if (statusCode !== 202) {
      throw new Error(`SendGrid failed with status ${statusCode}`);
    }

    console.log(`[SendGrid] OTP sent to ${toEmail}`);
    return true;
  } catch (err) {
    const detail =
      err.response?.body?.errors?.[0]?.message || err.message;

    throw new Error(`SendGrid Error: ${detail}`);
  }
};

/* _______________NODEMAILER _______________*/
const sendViaNodemailer = async (toEmail, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      `"APV Library" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Password Reset OTP",
    html: getTemplate(otp),
  });

  console.log(
    `[Nodemailer] OTP sent to ${toEmail} | id: ${info.messageId}`
  );

  return true;
};

/* _______________MAIN FUNCTION _______________*/
const sendEmail = async (toEmail, otp) => {
  /*________________  TRY SENDGRID FIRST */
  try {
    return await sendViaSendGrid(toEmail, otp);
  } catch (primaryError) {
    console.warn(
      `[SendGrid FAILED] ${primaryError.message} → switching to Nodemailer`
    );
  }

  /*________________  FORCE FALLBACK */
  try {
    return await sendViaNodemailer(toEmail, otp);
  } catch (fallbackError) {
    console.error("[Nodemailer FAILED]:", fallbackError.message);

    throw new Error(
      "Email sending failed: both SendGrid and Nodemailer failed"
    );
  }
};

module.exports = sendEmail;