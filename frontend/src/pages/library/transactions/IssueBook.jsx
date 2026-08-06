// ─────────────────────────────────────────────────────────────────────────────
//  IssueBook.jsx   →  src/pages/library/transactions/IssueBook.jsx
//
//  Issue a book to a member. Uses the shared swalAlert utility for every
//  success / error / confirm popup — no inline Swal.fire() calls.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  issueBookAPI,
  returnBookAPI,
  getTransactionsAPI,
} from "../../../services/transactions/transactionService";

import {
  successAlert,
  warningAlert,
  confirmAlert,
  apiErrorAlert,
} from "../../../utils/swalAlert";

import axiosInstance from "../../../api/axiosInstance";
import styles from "./IssueBook.module.css";

// ── helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const defaultDueDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split("T")[0];
};

const tomorrowStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

// ─────────────────────────────────────────────────────────────────────────────
export default function IssueBook() {
  const navigate = useNavigate();

  // ── form state ────────────────────────────────────────────────────────────
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState(defaultDueDate());
  const [submitting, setSubmitting] = useState(false);

  // ── active issues ─────────────────────────────────────────────────────────
  const [issues, setIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [returningId, setReturningId] = useState(null);

  // ── load dropdown options once ───────────────────────────────────────────
  useEffect(() => {
    axiosInstance
      .get("/members?limit=200&status=active")
      .then((res) => {
        setMembers(res.data.members || res.data.data || []);
      })
      .catch(() => {});

    axiosInstance
      .get("/books?limit=200")
      .then((res) => {
        setBooks(res.data.books || res.data.data || []);
      })
      .catch(() => {});
  }, []);

  // ── load active issues ────────────────────────────────────────────────────
  const loadIssues = async () => {
    setLoadingIssues(true);
    try {
      const result = await getTransactionsAPI({ status: "issued", limit: 10 });
      setIssues(result.transactions || []);
    } catch {
      // non-critical — silent fail, table just stays empty
    } finally {
      setLoadingIssues(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  // ── submit issue ──────────────────────────────────────────────────────────
  const handleIssue = async () => {
    if (!memberId)
      return warningAlert("Select Member", "Please choose a member.");
    if (!bookId) return warningAlert("Select Book", "Please choose a book.");
    if (!dueDate)
      return warningAlert("Set Due Date", "Please choose a due date.");

    const member = members.find((m) => String(m.id) === String(memberId));
    const book = books.find((b) => String(b.id) === String(bookId));

    const ok = await confirmAlert(
      "Confirm Issue",
      `Issue <b>${book?.title}</b> to <b>${member?.name}</b><br/>due on <b>${fmtDate(dueDate)}</b>?`,
      "Yes, Issue",
    );
    if (!ok) return;

    setSubmitting(true);
    try {
      const res = await issueBookAPI({
        book_id: bookId,
        member_id: memberId,
        due_date: dueDate,
      });
      successAlert("Book Issued!", res.message);
      setMemberId("");
      setBookId("");
      setDueDate(defaultDueDate());
      loadIssues();
    } catch (err) {
      apiErrorAlert(err, "Issue Failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ── return book ───────────────────────────────────────────────────────────
  const handleReturn = async (row) => {
    const fineMsg = row.is_overdue
      ? `<br/><span style="color:#f85149">Overdue by ${row.overdue_days} day(s) — Fine: ₹${row.current_fine}</span>`
      : `<br/><span style="color:#2ee6a6">No fine — on time</span>`;

    const ok = await confirmAlert(
      "Confirm Return",
      `Return <b>${row.book_title}</b> from <b>${row.member_name}</b>?${fineMsg}`,
      "Return",
    );
    if (!ok) return;

    setReturningId(row.id);
    try {
      const res = await returnBookAPI(row.id);
      successAlert(
        "Returned!",
        res.data.fine > 0
          ? `Fine collected: ₹${res.data.fine}`
          : "No fine applied.",
      );
      loadIssues();
    } catch (err) {
      apiErrorAlert(err, "Return Failed");
    } finally {
      setReturningId(null);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <i className="fa-solid fa-book-bookmark" /> Issue Book
          </h1>
          <p className={styles.pageSubtitle}>Assign a book to a member</p>
        </div>
        <button
          className={styles.btnGhost}
          onClick={() => navigate("/history")}
        >
          <i className="fa-solid fa-clock-rotate-left" /> View History
        </button>
      </div>

      {/* ── Issue form ──────────────────────────────────────────────────── */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>New Issue</h2>

        <div className={styles.formGrid}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Member</label>
            <select
              className={styles.select}
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            >
              <option value="">Select member…</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Book</label>
            <select
              className={styles.select}
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
            >
              <option value="">Select book…</option>
              {books.map((b) => (
                <option
                  key={b.id}
                  value={b.id}
                  disabled={b.available_copies <= 0}
                >
                  {b.title}{" "}
                  {b.available_copies <= 0
                    ? "(unavailable)"
                    : `(${b.available_copies} avail.)`}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Due Date</label>
            <input
              type="date"
              className={styles.dateInput}
              value={dueDate}
              min={tomorrowStr()}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formFooter}>
          <button
            className={styles.btnIssue}
            onClick={handleIssue}
            disabled={submitting}
          >
            {submitting ? "Issuing…" : "Issue Book"}
          </button>
        </div>
      </div>

      {/* ── Active issues ───────────────────────────────────────────────── */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Currently Issued</h2>

        <div className={styles.tableWrap}>
          {loadingIssues ? (
            <p className={styles.loading}>Loading…</p>
          ) : issues.length === 0 ? (
            <p className={styles.empty}>No active issues</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Book</th>
                  <th>Due Date</th>
                  <th>Fine</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((row) => (
                  <tr
                    key={row.id}
                    className={row.is_overdue ? styles.rowOverdue : ""}
                  >
                    <td>{row.member_name}</td>
                    <td>{row.book_title}</td>
                    <td className={row.is_overdue ? styles.overdueDate : ""}>
                      {fmtDate(row.due_date)}
                    </td>
                    <td>
                      {row.current_fine > 0 ? `₹${row.current_fine}` : "—"}
                    </td>
                    <td>
                      <button
                        className={styles.btnReturn}
                        onClick={() => handleReturn(row)}
                        disabled={returningId === row.id}
                      >
                        {returningId === row.id ? "…" : "Return"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
