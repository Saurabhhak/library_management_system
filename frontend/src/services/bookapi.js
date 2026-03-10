import API from "./api";

export const getBooks = () => API.get("/books");

export const createBook = (data) => API.post("/books", data);

API.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return req;
});
