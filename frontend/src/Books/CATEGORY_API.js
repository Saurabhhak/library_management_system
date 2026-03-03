import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/categories",
});

export const getCategories = () => API.get("/");
export const createCategory = (data) => API.post("/", data);
export const updateCategory = (id, data) => API.put(`/${id}`, data);
export const deleteCategory = (id) => API.delete(`/${id}`);
