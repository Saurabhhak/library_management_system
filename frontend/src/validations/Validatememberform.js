const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/; // 10-digit Indian mobile

export function validateMemberForm(data, mode = "create") {
  const err = {};

  // Helper to cleanly check required fields
  const req = (field, msg) => {
    if (!String(data[field] ?? "").trim()) err[field] = msg;
  };

  /* ---------- COMMON VALIDATIONS ---------- */
  req("first_name", "First name is required.");
  req("last_name", "Last name is required.");

  if (data.phone && !PHONE_RE.test(data.phone)) {
    err.phone = "Enter a valid 10-digit mobile number.";
  }

  /* ---------- CREATE-ONLY VALIDATIONS ---------- */
  if (mode === "create") {
    req("email", "Email is required.");
    if (data.email && !EMAIL_RE.test(data.email)) {
      err.email = "Enter a valid email address.";
    }
    req("member_type", "Please select a member role.");
  }

  /* ---------- UPDATE-ONLY VALIDATIONS ---------- */
  if (mode === "update") {
    req("status", "Account status is required.");
    if (data.max_books_allowed === "" || Number(data.max_books_allowed) < 1) {
      err.max_books_allowed = "Must allow at least 1 book.";
    }
  }

  return err;
}
