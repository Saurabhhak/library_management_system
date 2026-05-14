export const validateFeedbackForm = (data) => {
  const errors = {};

  /* ---------- CLEAN VALUES ---------- */
  const name = data.name?.trim();
  const email = data.email?.trim();
  const message = data.message?.trim();

  /* ---------- REGEX ---------- */
  const nameRegex = /^[A-Za-z\s]{3,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---------- VALIDATION ---------- */
  if (!name) errors.name = "Name is required";
  if (!email) errors.email = "Email is required";
  if (!message) errors.message = "Message is required";

  if (name && !nameRegex.test(name)) {
    errors.name = "Only letters (3-50 chars)";
  }

  if (email && !emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  if (message && message.length < 10) {
    errors.message = "Minimum 10 characters required";
  }

  if (message && message.length > 500) {
    errors.message = "Max 500 characters allowed";
  }

  return errors;
};
