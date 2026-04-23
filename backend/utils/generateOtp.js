const crypto = require("crypto");

const generateOtp = (length = 6) =>
  crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

module.exports = generateOtp;