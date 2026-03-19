import API from "../api/axiosInstance";

/* ---------------- AUTH ---------------- */

// export const loginAdmin = (data) => API.post("/admin/login", data);
/* ---------------- PROFILE ---------------- */

// get logged in admin profile
// API axios instance me token automatically attach hota hai
export const getProfile = () => API.get("/admin/profile");

// delete logged in account
export const deleteAccount = () => API.delete("/admin/delete-account");

/* ---------------- ADMIN CRUD ---------------- */

// create new admin       (data = parameter)
export const createAdmin = (data) => API.post("/admin", data);

// get all admins
export const getAdmins = () => API.get("/admin");

// get single admin
export const getAdminById = (id) => API.get(`/admin/${id}`);

// update admin
export const updateAdmin = (id, data) => API.put(`/admin/${id}`, data);

// delete admin
export const deleteAdmin = (id) => API.delete(`/admin/${id}`);

/* ---------------- META DATA ---------------- */

// get states list
export const getStates = () => API.get("/meta/states");

// get cities by state
export const getCitiesByState = (stateId) => API.get(`/meta/cities/${stateId}`);
