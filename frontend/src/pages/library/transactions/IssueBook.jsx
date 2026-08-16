// ─────────────────────────────────────────────────────────────────────────────
//  IssueBook.jsx   →  src/pages/library/transactions/IssueBook.jsx
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

export default function IssueBook() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState(defaultDueDate());
  const [submitting, setSubmitting] = useState(false);

  const [issues, setIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [returningId, setReturningId] = useState(null);

  // ── Load Dropdowns securely ───────────────────────────────────────────────
  useEffect(() => {
    // Fetch Members
    axiosInstance
      .get("/members")
      .then((res) => {
        const list = res.data.data || res.data.members || res.data || [];
        setMembers(list);
      })
      .catch((err) => console.error("Failed to load members", err));

    // Fetch Books
    axiosInstance
      .get("/books")
      .then((res) => {
        const list = res.data.data || res.data.books || res.data || [];
        setBooks(list);
      })
      .catch((err) => console.error("Failed to load books", err));
  }, []);

  const loadIssues = async () => {
    setLoadingIssues(true);
    try {
      const result = await getTransactionsAPI({ status: "issued", limit: 10 });
      setIssues(result.transactions || result.data || []);
    } catch {
      setIssues([]);
    } finally {
      setLoadingIssues(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleIssue = async () => {
    if (!memberId)
      return warningAlert(
        "Select Member",
        "Please choose a member from the dropdown.",
      );
    if (!bookId)
      return warningAlert(
        "Select Book",
        "Please choose a book from the dropdown.",
      );
    if (!dueDate)
      return warningAlert("Set Due Date", "Please choose a due date.");

    const member = members.find((m) => String(m.id) === String(memberId));
    const book = books.find((b) => String(b.id) === String(bookId));

    const memberName = member
      ? `${member.first_name || ""} ${member.last_name || ""}`.trim() ||
        member.name
      : "Member";
    const bookTitle = book ? book.title : "Book";

    const ok = await confirmAlert(
      "Confirm Issue",
      `Issue <b>${bookTitle}</b> to <b>${memberName}</b><br/>due on <b>${fmtDate(dueDate)}</b>?`,
      "Yes, Issue",
    );
    if (!ok) return;

    setSubmitting(true);
    try {
      const res = await issueBookAPI({
        book_id: parseInt(bookId, 10),
        member_id: parseInt(memberId, 10),
        due_date: dueDate,
      });
      successAlert("Book Issued!", res.message || "Book issued successfully.");
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
        res.data?.fine > 0
          ? `Fine collected: ₹${res.data.fine}`
          : "Book returned successfully.",
      );
      loadIssues();
    } catch (err) {
      apiErrorAlert(err, "Return Failed");
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <i className="fa-solid fa-book-bookmark" /> Issue Book
          </h1>
          <p className={styles.pageSubtitle}>
            Assign a book to an institutional member
          </p>
        </div>
        <button
          className={styles.btnGhost}
          onClick={() => navigate("/history")}
        >
          <i className="fa-solid fa-clock-rotate-left" /> View History
        </button>
      </div>

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
              {members.map((m) => {
                const displayName =
                  `${m.first_name || ""} ${m.last_name || ""}`.trim() ||
                  m.name ||
                  m.email;
                return (
                  <option key={m.id} value={m.id}>
                    {displayName} (
                    {m.institutional_id || m.email || `ID: ${m.id}`})
                  </option>
                );
              })}
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
              {books.map((b) => {
                const copies = b.available_copies ?? b.copies ?? 1;
                return (
                  <option key={b.id} value={b.id} disabled={copies <= 0}>
                    {b.title}{" "}
                    {copies <= 0 ? "(unavailable)" : `(${copies} avail.)`}
                  </option>
                );
              })}
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

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Currently Issued</h2>
        <div className={styles.tableWrap}>
          {loadingIssues ? (
            <p className={styles.loading}>Loading…</p>
          ) : issues.length === 0 ? (
            <p className={styles.empty}>No active issues found</p>
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
