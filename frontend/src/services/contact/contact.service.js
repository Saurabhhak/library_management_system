// src/services/contact/contact.service.js
import API from "../../api/axiosInstance";

export const submitContactForm = (data) => API.post("/contact", data);