import API from "../../api/axiosInstance";

// ─── Profile ──────────────────────────────────────────────
export const getProfile = () => API.get("/admin/profile");
export const deleteAccount = () => API.delete("/admin/delete-account");

// ─── Admin CRUD ───────────────────────────────────────────
export const createAdmin = (data) => API.post("/admin", data);
export const getAdmins = () => API.get("/admin");
export const getAdminById = (id) => API.get(`/admin/${id}`);
export const updateAdmin = (id, data) => API.put(`/admin/${id}`, data);
export const deleteAdmin = (id) => API.delete(`/admin/${id}`);

// ─── Meta ─────────────────────────────────────────────────
export const getStates = () => API.get("/meta/states");
export const getCitiesByState = (stateId) => API.get(`/meta/cities/${stateId}`);
