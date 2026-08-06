// ─────────────────────────────────────────────────────────────────────────────
//  swalAlert.js   →  src/utils/swalAlert.js
//
//  ONE place for every popup in the app. Every page imports from here instead
//  of calling Swal.fire() directly — keeps style consistent and easy to theme.
//
//  Usage:
//    import { successAlert, errorAlert, confirmAlert, infoAlert } from "../../utils/swalAlert";
//    successAlert("Book Issued!", "Returned successfully");
//    const ok = await confirmAlert("Confirm Return", "Return this book?");
//    if (ok) { ... }
// ─────────────────────────────────────────────────────────────────────────────
import Swal from "sweetalert2";

// ── Shared dark theme (matches #0d1117 / #161b22 LMS palette) ───────────────
const base = {
  background: "#161b22",
  color: "#c9d1d9",
  confirmButtonColor: "#2ee6a6",
  cancelButtonColor: "#30363d",
  customClass: {
    popup: "swal-lms-popup",
  },
};

// ── ✅ Success ────────────────────────────────────────────────────────────
export const successAlert = (title, text = "") =>
  Swal.fire({
    ...base,
    icon: "success",
    title,
    text,
    timer: 2200,
    showConfirmButton: false,
  });

// ── ❌ Error ──────────────────────────────────────────────────────────────
export const errorAlert = (title, text = "Something went wrong") =>
  Swal.fire({
    ...base,
    icon: "error",
    title,
    text,
    confirmButtonText: "OK",
  });

// ── ⚠️ Warning (validation issues, soft blocks) ──────────────────────────
export const warningAlert = (title, text = "") =>
  Swal.fire({
    ...base,
    icon: "warning",
    title,
    text,
    confirmButtonText: "OK",
  });

// ── ℹ️ Info ───────────────────────────────────────────────────────────────
export const infoAlert = (title, text = "") =>
  Swal.fire({
    ...base,
    icon: "info",
    title,
    text,
    confirmButtonText: "Got it",
  });

// ── ❓ Confirm (returns true/false) ───────────────────────────────────────
export const confirmAlert = async (title, html = "", confirmText = "Yes") => {
  const result = await Swal.fire({
    ...base,
    icon: "question",
    title,
    html,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
  });
  return result.isConfirmed;
};

// ── 🔒 Access denied (used by admin-only buttons) ────────────────────────
export const accessDeniedAlert = (
  text = "You are not authorized for this action.",
) =>
  Swal.fire({
    ...base,
    icon: "error",
    title: "Access Denied",
    text,
  });

// ── 🔄 Loading (call .close() on the returned object to dismiss) ─────────
export const loadingAlert = (title = "Please wait…") => {
  Swal.fire({
    ...base,
    title,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  });
  return { close: () => Swal.close() };
};

// ── 🧯 Generic API error parser ──────────────────────────────────────────
// Pass the caught `err` from an axios call — extracts the backend message.
export const apiErrorAlert = (err, fallbackTitle = "Request Failed") => {
  const message =
    err?.response?.data?.message || err?.message || "Unexpected error occurred";
  return errorAlert(fallbackTitle, message);
};
