import API from "../../api/axiosInstance";


/* -----------------------------------
   ADMIN SERVICE - Production Ready
   Handles:
   - Profile
   - Admin CRUD
----------------------------------- */

/* ---------------- PROFILE ---------------- */

// Get logged-in admin profile
export const getProfile = () => API.get("/admin/profile");

// Delete own account
export const deleteAccount = () => API.delete("/admin/delete-account");

/* ---------------- ADMIN CRUD ---------------- */

// Create new admin
export const createAdmin = (data) => API.post("/admin", data);

// Get all admins
export const getAdmins = () => API.get("/admin");

// Get single admin by ID
export const getAdminById = (id) => API.get(`/admin/${id}`);

// Update admin
export const updateAdmin = (id, data) => API.put(`/admin/${id}`, data);

// Delete admin
export const deleteAdmin = (id) => API.delete(`/admin/${id}`);
