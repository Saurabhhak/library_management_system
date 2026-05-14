// utils/validateDob.js
const validateDob = (dob) => {
  if (!dob) return "Date of birth is required";

  const date = new Date(dob);

  // Invalid date check
  if (isNaN(date.getTime())) return "Invalid date format";

  const today = new Date();

  // Future date block ❌
  if (date > today) return "DOB cannot be in the future";

  // Age check (18+)
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);

  if (date > cutoff) return "Admin must be at least 18 years old";

  return null;
};

module.exports = validateDob;
