export function getDashboardPath({ isMember, isStaff }) {
  if (isMember) return "/member/dashboard";
  if (isStaff) return "/home"; // Admin/Librarian dashboard
  return "/login";
}
