// ─────────────────────────────────────────────────────────────────────────────
//  transactionService.js   →  src/services/transactionService.js
//
//  Pure API layer — no Swal, no UI logic. Pages call these functions and
//  handle success/error themselves using src/utils/swalAlert.js.
//
//  Assumes an axios instance at src/utils/axiosInstance.js that already
//  attaches the Authorization header. Adjust the import path if different.
// ─────────────────────────────────────────────────────────────────────────────
import axiosInstance from "../../api/axiosInstance";

const BASE = "/transactions";

export const issueBookAPI = (payload) =>
  axiosInstance.post(`${BASE}/issue`, payload).then((res) => res.data);

export const returnBookAPI = (issue_id) =>
  axiosInstance.post(`${BASE}/return`, { issue_id }).then((res) => res.data);

export const getTransactionsAPI = (params = {}) =>
  axiosInstance.get(BASE, { params }).then((res) => res.data);

export const getTransactionStatsAPI = () =>
  axiosInstance.get(`${BASE}/stats`).then((res) => res.data);
