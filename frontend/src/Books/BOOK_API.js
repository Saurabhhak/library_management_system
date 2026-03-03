import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/books",
});

API.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return req;
});

export const getBooks = () => API.get("/");
export const createBook = (data) => API.post("/", data);
