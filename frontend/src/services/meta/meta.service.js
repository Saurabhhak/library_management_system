import API from "../../api/axiosInstance";

/* ---------------- META DATA ---------------- */

// states
export const getStates = () => API.get("/meta/states");

// cities
export const getCitiesByState = (stateId) => API.get(`/meta/cities/${stateId}`);
