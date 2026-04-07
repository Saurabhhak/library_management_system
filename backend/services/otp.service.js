const db = require("../config/db");
//   --------- Save OTP --------------
const saveOtp = async (email, otp) => {
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await db.query(
    "INSERT INTO otp_verifications (email, otp, expires_at) VALUES ($1,$2,$3)",
    [email, otp, expiresAt],
  );
};
//   --------- Verify OTP --------------
const verifyOtp = async (email, otp) => {
  const result = await db.query(
    `SELECT * FROM otp_verifications 
     WHERE email=$1 AND otp=$2 
     ORDER BY id DESC LIMIT 1`,
    [email, otp],
  );x 

  if (!result.rows.length) return false;

  const record = result.rows[0];

  if (new Date() > record.expires_at) return false;

  await db.query("UPDATE otp_verifications SET is_verified=true WHERE id=$1", [
    record.id,
  ]);

  return true;
};

module.exports = { saveOtp, verifyOtp };
