export const validateAdminForm = (userinfo, mode = "create") => {
  const errors = {};

  /* ---------- REQUIRED FIELDS ---------- */

  if (!userinfo.first_name) errors.first_name = "First name required";
  if (!userinfo.last_name) errors.last_name = "Last name required";

  // Email only required in CREATE
  if (mode === "create" && !userinfo.email)
    errors.email = "Email required";

  if (!userinfo.phone) errors.phone = "Phone required";
  if (!userinfo.role) errors.role = "Role required";
  if (!userinfo.state_id) errors.state_id = "State required";

  if (userinfo.state_id && !userinfo.city_id)
    errors.city_id = "City required";

  // Password only required in CREATE
  if (mode === "create") {
    if (!userinfo.password)
      errors.password = "Password required";
    if (!userinfo.confirm_password)
      errors.confirm_password = "Confirm password required";
  }

  /* ---------- REGEX ---------- */

  const nameRegex = /^[A-Za-z\s]{3,30}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,12}$/;

  /* ---------- NAME ---------- */

  if (userinfo.first_name && !nameRegex.test(userinfo.first_name))
    errors.first_name = "Only letters allowed (3-30 characters)";

  if (userinfo.last_name && !nameRegex.test(userinfo.last_name))
    errors.last_name = "Only letters allowed (3-30 characters)";

  /* ---------- EMAIL ---------- */
  if (mode === "create" && userinfo.email && !emailRegex.test(userinfo.email))
    errors.email = "Invalid email format";

  /* ---------- PHONE ---------- */
  if (userinfo.phone && !phoneRegex.test(userinfo.phone))
    errors.phone = "Phone must be 10-12 digits";

  return errors;
};