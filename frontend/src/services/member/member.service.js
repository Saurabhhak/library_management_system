import API from "../../api/axiosInstance";

/* ════════════════════════════════════════════════════════════════
   PUBLIC ROUTES (No Token Required)
════════════════════════════════════════════════════════════════ */

// Self-registration for guests (Requires OTP verified first)
export const registerPublicMember = (data) =>
  API.post("/members/register", data);

/* ════════════════════════════════════════════════════════════════
   ADMIN PROTECTED ROUTES (Requires Admin/Superadmin Token)
════════════════════════════════════════════════════════════════ */

// Admin creating a Student, Professor, or Staff (No OTP required)
export const createMemberByAdmin = (data) => API.post("/members", data);

// Fetch all members for Inventory
export const getMembers = () => API.get("/members");

// Fetch single member details for editing
export const getMemberById = (id) => API.get(`/members/${id}`);

// Admin updates member details
export const updateMember = (id, data) => API.put(`/members/${id}`, data);

// Admin soft-deletes a member
export const deleteMember = (id) => API.delete(`/members/${id}`);
