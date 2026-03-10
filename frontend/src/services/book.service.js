import API from "../api/axiosInstance";

export const getBooks = () => API.get("/books");

export const createBook = (data) => API.post("/books", data);

export const updateBook = (id, data) => API.put(`/books/${id}`, data);

export const deleteBook = (id) => API.delete(`/books/${id}`);
