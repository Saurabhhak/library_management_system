export const ROLE_LABELS = {
  superadmin: { label: "Super Admin", badgeClass: "badge--superadmin" },
  admin: { label: "Admin", badgeClass: "badge--admin" },
  librarian: { label: "Librarian", badgeClass: "badge--librarian" },
  staff: { label: "Staff", badgeClass: "badge--staff" },
  member: { label: "Member", badgeClass: "badge--member" },
};

export const MEMBER_TYPE_LABELS = {
  student: { label: "Student", badgeClass: "badge--student" },
  teacher: { label: "Teacher", badgeClass: "badge--teacher" },
  professor: { label: "Professor", badgeClass: "badge--professor" },
  staff: { label: "Staff", badgeClass: "badge--staff" },
  guest: { label: "Guest", badgeClass: "badge--guest" },
};

export function getRoleInfo(role) {
  return (
    ROLE_LABELS[role] ?? {
      label: role ?? "Unknown",
      badgeClass: "badge--member",
    }
  );
}
export function getMemberTypeInfo(type) {
  return (
    MEMBER_TYPE_LABELS[type] ?? {
      label: type ?? "Guest",
      badgeClass: "badge--guest",
    }
  );
}
