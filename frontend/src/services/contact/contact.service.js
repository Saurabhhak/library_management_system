// src/services/Resources/contact.service.js
import API from "../../api/axiosInstance";

/* ── Public ─────────────────────────────────────────────────────── */

/**
 * POST /contact
 * Submit a contact-us form (no auth required).
 * @param {{ name: string, email: string, subject: string, message: string }} data
 */
export const submitContactForm = (data) => API.post("/contact", data);

/* ── Admin ──────────────────────────────────────────────────────── */

/**
 * GET /contact
 * Fetch all contact submissions with optional server-side filtering.
 * @param {{ page?: number, limit?: number, status?: string, search?: string }} params
 */
export const getContacts = (params = {}) => API.get("/contact", { params });

/**
 * PATCH /contact/:id/status
 * Update the status of a single contact entry.
 * @param {number|string} id
 * @param {"unread"|"read"|"resolved"} status
 */
export const updateContactStatus = (id, status) =>
  API.patch(`/contact/${id}/status`, { status });

/**
 * DELETE /contact/:id
 * Permanently delete a contact entry.
 * @param {number|string} id
 */
export const deleteContact = (id) => API.delete(`/contact/${id}`);
