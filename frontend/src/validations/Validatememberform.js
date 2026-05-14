const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/; // 10-digit Indian mobile

export function validateMemberForm(data, mode = "create") {
  const err = {};
  const req = (field, msg) => {
    if (!String(data[field] ?? "").trim()) err[field] = msg;
  };

  req("first_name", "First name is required.");
  req("phone", "Phone number is required.");
  req("state_id", "State is required.");
  req("city_id", "City is required.");

  /* Phone format */
  if (data.phone && !PHONE_RE.test(data.phone))
    err.phone = "Enter a valid 10-digit mobile number.";

  /* Email — only on create */
  if (mode === "create") {
    if (!data.email) err.email = "Email is required.";
    else if (!EMAIL_RE.test(data.email))
      err.email = "Enter a valid email address.";
  }

  /* Password — only on create */
  if (mode === "create") {
    if (!data.password) err.password = "Password is required.";
    else if (data.password.length < 8)
      err.password = "Password must be at least 8 characters.";

    if (!data.confirm_password)
      err.confirm_password = "Please confirm your password.";
    else if (data.password !== data.confirm_password)
      err.confirm_password = "Passwords do not match.";
  }

  return err;
}
