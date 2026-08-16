export const getAdminRoleData = (admins = []) => {
  let admin = 0;
  let superadmin = 0;
  let librarian = 0;

  admins.forEach((a) => {
    if (a.role === "admin") admin++;
    if (a.role === "superadmin") superadmin++;
    if (a.role === "librarian") librarian++; 
  });

  return {
    labels: ["Admin", "Super Admin", "Librarian"],
    values: [admin, superadmin, librarian],
  };
};