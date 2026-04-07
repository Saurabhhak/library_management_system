// utils/token.js

const crypto = require("crypto");

/*
|--------------------------------------------------------------------------
| GENERATE SECURE TOKEN
|--------------------------------------------------------------------------
| Used for: verify email, invite, reset password
|--------------------------------------------------------------------------
*/
const generateToken = (size = 32) => {
  return crypto.randomBytes(size).toString("hex");
};

module.exports = generateToken;