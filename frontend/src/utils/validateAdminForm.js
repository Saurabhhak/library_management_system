const nameRegex = /^[A-Za-z\s]{3,30}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/; // 10-digit Indian mobile starting with 6-9

export const validateAdminForm = (userinfo, mode = "create") => {
  const errors = {};

  /* ---------- CLEAN VALUES ---------- */
  const first_name = userinfo.first_name?.trim();
  const last_name = userinfo.last_name?.trim();
  const email = userinfo.email?.trim();
  const phone = String(userinfo.phone || "").trim();

  /* ---------- COMMON VALIDATIONS (Both Create & Update) ---------- */
  if (!first_name) errors.first_name = "First name is required.";
  else if (!nameRegex.test(first_name))
    errors.first_name = "Only letters allowed (3-30 chars).";

  if (!last_name) errors.last_name = "Last name is required.";
  else if (!nameRegex.test(last_name))
    errors.last_name = "Only letters allowed (3-30 chars).";

  if (!phone) errors.phone = "Phone number is required.";
  else if (!phoneRegex.test(phone))
    errors.phone = "Enter a valid 10-digit mobile number.";

  if (!userinfo.state_id) errors.state_id = "State is required.";
  if (!userinfo.city_id) errors.city_id = "City is required.";
  if (!userinfo.role) errors.role = "Role is required.";
  if (userinfo.is_active === "")
    errors.is_active = "Account status is required.";

  /* ---------- CREATE-ONLY VALIDATIONS ---------- */
  if (mode === "create") {
    if (!email) errors.email = "Email is required.";
    else if (!emailRegex.test(email))
      errors.email = "Enter a valid email format.";

    if (!userinfo.password) errors.password = "Password is required.";
    else if (userinfo.password.length < 8)
      errors.password = "Minimum 8 characters required.";

    if (!userinfo.confirm_password)
      errors.confirm_password = "Confirm your password.";
    else if (userinfo.password !== userinfo.confirm_password)
      errors.confirm_password = "Passwords do not match.";
  }

  return errors;
};
