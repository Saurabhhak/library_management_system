/* ── ADMIN ROLES ── */
export const ROLE_LABELS = {
  superadmin: { label: "Super Admin", badgeClass: "badge--superadmin" },
  admin: { label: "Admin", badgeClass: "badge--admin" },
  librarian: { label: "Librarian", badgeClass: "badge--librarian" },
};

/* ── MEMBER ROLES (University Standard) ── */
export const MEMBER_TYPE_LABELS = {
  student: { label: "Student", badgeClass: "badge--student" },
  teacher: { label: "Teacher", badgeClass: "badge--teacher" },
  professor: { label: "Professor", badgeClass: "badge--professor" },
};

export function getRoleInfo(role) {
  return (
    ROLE_LABELS[role] ?? {
      label: role ?? "Unknown",
      badgeClass: "badge--unknown",
    }
  );
}

export function getMemberTypeInfo(type) {
  return (
    MEMBER_TYPE_LABELS[type] ?? {
      label: type ?? "Unknown",
      badgeClass: "badge--unknown",
    }
  );
}
