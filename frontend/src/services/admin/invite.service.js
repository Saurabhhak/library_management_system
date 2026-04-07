import API from "../../api/axiosInstance";

/* ---------------------------------------------
   INVITE SERVICE
   Handles admin invitation system (Super Admin)
--------------------------------------------- */

/* ---------------- SEND INVITE ---------------- */
// Send invite to new admin
export const sendInvite = (data) => API.post("/invite", data);

/* ---------------- GET ALL INVITES ---------------- */
// Get all sent invites (optional - if backend supports)
export const getInvites = () => API.get("/invite");

/* ---------------- RESEND INVITE ---------------- */
// Resend invite email (optional - if backend supports)
export const resendInvite = (id) => API.post(`/invite/resend/${id}`);

/* ---------------- DELETE INVITE ---------------- */
// Cancel/Delete invite (optional - if backend supports)
export const deleteInvite = (id) => API.delete(`/invite/${id}`);
