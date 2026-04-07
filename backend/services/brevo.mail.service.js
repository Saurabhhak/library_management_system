const SibApiV3Sdk = require("sib-api-v3-sdk");

// Init Brevo
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Send OTP Email
const sendEmail = async (toEmail, otp) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "APV Library",
      },
      to: [{ email: toEmail }],
      subject: "Password Reset OTP",
      htmlContent: getTemplate(otp),
    });
    console.log(`OTP sent to ${toEmail}`);
    return true;

  } catch (error) {
    console.error("EMAIL ERROR:", error.response?.text || error.message);
    throw new Error("Email sending failed");
  }
};
// Clean reusable template
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

module.exports = sendEmail;