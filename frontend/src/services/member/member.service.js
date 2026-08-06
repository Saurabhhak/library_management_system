import API from "../../api/axiosInstance";

// Public — self registration (requires OTP verified first, role: "member")
export const createMember = (data) => API.post("/members", data);

// Admin-protected CRUD
export const getMembers = () => API.get("/members");
export const getMemberById = (id) => API.get(`/members/${id}`);
export const updateMember = (id, data) => API.put(`/members/${id}`, data);
export const deleteMember = (id) => API.delete(`/members/${id}`);
