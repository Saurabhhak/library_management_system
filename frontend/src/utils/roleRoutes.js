export function getDashboardPath({ isMember, isStaff }) {
  if (isMember) return "/member/dashboard";
  if (isStaff) return "/home";
  return "/login";
}