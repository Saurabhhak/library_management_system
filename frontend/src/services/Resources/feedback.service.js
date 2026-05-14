import API from "../../api/axiosInstance";
// Create send Feedback messages
export const sendFeedback = async (data) => {
  const res = await API.post("/feedback", data);
  return res.data;
};
// Get all Feedback messages
export const getFeedbacks = async () => await API.get("/feedback");
// Delete Feedback messages
export const deleteFeedback = async (id) => await API.delete(`/feedback/${id}`);

// Update sendFeedback messages
export const updateFeedbackStatus = async (id, status) =>
  await API.patch(`/feedback/${id}/status`, { status });
