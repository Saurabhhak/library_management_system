import API from "../../api/axiosInstance";

// Create member
export const createMember = (data) => API.post("/members", data);

// Get all members
export const getMembers = () => API.get("/members");

// Get single member
export const getMemberById = (id) => API.get(`/members/${id}`);

// Update member
export const updateMember = (id, data) => API.put(`/members/${id}`, data);

// Delete member
export const deleteMember = (id) => API.delete(`/members/${id}`);
