/* ---------------- META DATA ---------------- */
import API from "../../api/axiosInstance";

// get states list
export const getStates = () => API.get("/meta/states");

// get cities by state
export const getCitiesByState = (stateId) => API.get(`/meta/cities/${stateId}`);
