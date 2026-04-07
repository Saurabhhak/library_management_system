export const getAdminRoleData = (admins = []) => {
  let admin = 0;
  let superadmin = 0;

  admins.forEach((a) => {
    if (a.role === "admin") admin++;
    if (a.role === "superadmin") superadmin++;
  });

  return {
    labels: ["Admin", "Super Admin"],
    data: [admin, superadmin],
  };
};