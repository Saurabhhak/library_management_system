import API from "../../api/axiosInstance";

const BASE = "/transactions";

export const issueBookAPI = (payload) =>
  API.post(`${BASE}/issue`, payload).then((res) => res.data);

export const returnBookAPI = (issue_id) =>
  API.post(`${BASE}/return`, { issue_id }).then((res) => res.data);

export const getTransactionsAPI = async (params = {}) => {
  const res = await API.get(BASE, { params });
  return res.data; // Returns { success, transactions, pagination }
};

export const getTransactionStatsAPI = async () => {
  const res = await API.get(`${BASE}/stats`);
  return res.data.data || res.data;
};

export const getMonthlyStatsAPI = async (year) => {
  const res = await API.get(`${BASE}/monthly-stats`, { params: { year } });
  return res.data.data || res.data;
};

/* ── MEMBER PERSONAL APIs (Clean unwrapped data) ── */
export const getMyTransactions = async (params = {}) => {
  const res = await API.get(`${BASE}/my-history`, { params });
  return res.data.data || res.data || [];
};

export const getMyStats = async () => {
  const res = await API.get(`${BASE}/my-stats`);
  return res.data.data || res.data || { active_issues: 0, total_read: 0, overdue: 0, total_fine: 0 };
};