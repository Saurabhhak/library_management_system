import API from "../../api/axiosInstance";

/* ---------------------------------------
   PROFILE SERVICE
   Handles logged-in admin profile actions
--------------------------------------- */

/* ---------------- COMPLETE PROFILE ---------------- */
// Complete profile after Google invite login
export const completeProfile = (data) =>
  API.put("/admin/complete-profile", data);

/* ---------------- GET PROFILE ---------------- */
// Get logged-in admin profile
export const getProfile = () => API.get("/admin/profile");

/* ---------------- UPDATE PROFILE ---------------- */
// Update logged-in admin profile
export const updateProfile = (data) => API.put("/admin/update-profile", data);

/* ---------------- DELETE ACCOUNT ---------------- */
// Delete own account
export const deleteAccount = () => API.delete("/admin/delete-account");
