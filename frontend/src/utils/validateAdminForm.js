export const validateAdminForm = (userinfo, mode = "create") => {
  const errors = {};

  /* ---------- CLEAN VALUES ---------- */
  const first_name = userinfo.first_name?.trim();
  const last_name = userinfo.last_name?.trim();
  const email = userinfo.email?.trim();
  const phone = userinfo.phone?.trim();

  /* ---------- REGEX ---------- */
  const nameRegex = /^[A-Za-z\s]{3,30}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  /* --------------------------------------
     CREATE MODE (INVITE SYSTEM)
     Only basic fields required
  -------------------------------------- */
  if (mode === "create") {
    if (!first_name) errors.first_name = "First name required";
    if (!last_name) errors.last_name = "Last name required";
    if (!email) errors.email = "Email required";

    if (first_name && !nameRegex.test(first_name)) {
      errors.first_name = "Only letters (3-30 chars)";
    }

    if (last_name && !nameRegex.test(last_name)) {
      errors.last_name = "Only letters (3-30 chars)";
    }

    if (email && !emailRegex.test(email)) {
      errors.email = "Invalid email format";
    }
  }

  /* --------------------------------------
     UPDATE / COMPLETE PROFILE
     Full validation required
  -------------------------------------- */
  if (mode === "update" || mode === "completeProfile") {
    if (!first_name) errors.first_name = "First name required";
    if (!last_name) errors.last_name = "Last name required";
    if (!phone) errors.phone = "Phone required";
    if (!userinfo.state_id) errors.state_id = "State required";
    if (!userinfo.city_id) errors.city_id = "City required";

    if (first_name && !nameRegex.test(first_name)) {
      errors.first_name = "Only letters (3-30 chars)";
    }

    if (last_name && !nameRegex.test(last_name)) {
      errors.last_name = "Only letters (3-30 chars)";
    }

    if (phone && !phoneRegex.test(phone)) {
      errors.phone = "Phone must be 10 digits";
    }
  }

  return errors;
};
