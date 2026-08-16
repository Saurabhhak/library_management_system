import API from "../../api/axiosInstance";

/* ════════════════════════════════════════════════════════════════
   ADMIN/LIBRARIAN PROTECTED ROUTES
════════════════════════════════════════════════════════════════ */

// Admin enrolling a Student, Teacher, or Professor
export const enrollInstitutionalMember = (data) => API.post("/members", data);

// Fetch all members for Inventory
export const getMembers = () => API.get("/members");

// Fetch single member details for editing
export const getMemberById = (id) => API.get(`/members/${id}`);

// Admin updates member details
export const updateMember = (id, data) => API.put(`/members/${id}`, data);

// Admin soft-deletes a member
export const deleteMember = (id) => API.delete(`/members/${id}`);
