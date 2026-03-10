export const validateAdminForm = (userinfo) => {
  const newErrors = {};

  if (!userinfo.first_name) newErrors.first_name = "First name required";
  if (!userinfo.last_name) newErrors.last_name = "Last name required";
  if (!userinfo.email) newErrors.email = "Email required";
  if (!userinfo.phone) newErrors.phone = "Phone required";
  if (!userinfo.state_id) newErrors.state_id = "State required";
  if (!userinfo.city_id) newErrors.city_id = "City required";
  if (!userinfo.role) newErrors.role = "Role required";
  if (!userinfo.password) newErrors.password = "Password required";
  if (!userinfo.confirm_password)
    newErrors.confirm_password = "Confirm password required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[A-Za-z\s]{3,30}$/;

  if (userinfo.first_name && !nameRegex.test(userinfo.first_name)) {
    newErrors.first_name = "Only letters allowed (3-30 characters)";
  }

  if (userinfo.last_name && !nameRegex.test(userinfo.last_name)) {
    newErrors.last_name = "Only letters allowed (3-30 characters)";
  }

  if (userinfo.email && !emailRegex.test(userinfo.email)) {
    newErrors.email = "Invalid email format";
  }

  // password optional in update
  if (userinfo.password || userinfo.confirm_password) {
    const passwordRegex =
      /^(?=(?:.*[a-z]){3,})(?=.*[A-Z])(?=(?:.*\d){2,3})(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(userinfo.password)) {
      newErrors.password =
        "Password must contain 1 capital, 3 lowercase, 2-3 numbers, 1 special character and be at least 8 characters";
    }

    if (userinfo.password !== userinfo.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }
  }

  return newErrors;
};
