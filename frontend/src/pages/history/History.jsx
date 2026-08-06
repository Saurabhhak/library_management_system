// ─────────────────────────────────────────────────────────────────────────────
//  History.jsx   →  src/pages/history/History.jsx
//
//  All / Issued / Returned tabs, stats, search, pagination, return action.
//  Uses the shared swalAlert utility — no inline Swal.fire() calls.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import {
  getTransactionsAPI,
  getTransactionStatsAPI,
  returnBookAPI,
} from "../../services/transactions/transactionService";

import { successAlert, confirmAlert, apiErrorAlert } from "../../utils/swalAlert";

import styles from "./History.module.css";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const TABS = [
  { key: "all", label: "All" },
  { key: "issued", label: "Issued" },
  { key: "returned", label: "Returned" },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function History() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";
  const page = parseInt(searchParams.get("page") || "1");

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [returningId, setReturningId] = useState(null);

  useEffect(() => {
    getTransactionStatsAPI().then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTransactionsAPI({ status: activeTab, search, page, limit: 10 });
      setTransactions(result.transactions || []);
      setPagination(result.pagination || {});
    } catch (err) {
      apiErrorAlert(err, "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, page]);

  useEffect(() => { load(); }, [load]);

  const switchTab = (key) => { setSearchParams({ tab: key, page: "1" }); setSearch(""); };
  const goToPage = (p) => setSearchParams({ tab: activeTab, page: String(p) });

  const handleReturn = async (row) => {
    const fineMsg = row.is_overdue
      ? `<br/><span style="color:#f85149">Overdue ${row.overdue_days}d — Fine: ₹${row.current_fine}</span>`
      : `<br/><span style="color:#2ee6a6">No fine</span>`;

    const ok = await confirmAlert(
      "Confirm Return",
      `Return <b>${row.book_title}</b> from <b>${row.member_name}</b>?${fineMsg}`,
      "Return"
    );
    if (!ok) return;

    setReturningId(row.id);
    try {
      const res = await returnBookAPI(row.id);
      successAlert("Returned!", res.data.fine > 0 ? `Fine collected: ₹${res.data.fine}` : "No fine.");
      getTransactionStatsAPI().then((r) => setStats(r.data)).catch(() => {});
      load();
    } catch (err) {
      apiErrorAlert(err, "Return Failed");
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className={styles.page}>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}><i className="fa-solid fa-clock-rotate-left" /> Transaction History</h1>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <div className={styles.statsGrid}>
        <Stat label="Issued" value={stats?.total_issued} color="blue" />
        <Stat label="Returned" value={stats?.total_returned} color="green" />
        <Stat label="Overdue" value={stats?.total_overdue} color="red" />
        <Stat label="Fines Collected" value={stats && `₹${stats.total_fines_collected}`} color="orange" />
        <Stat label="Pending Fines" value={stats && `₹${stats.pending_fines}`} color="purple" />
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className={styles.tabBar}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ""}`}
            onClick={() => switchTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <input
        className={styles.searchInput}
        placeholder="Search member or book…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && load()}
      />

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className={styles.tableWrap}>
        {loading ? (
          <p className={styles.loading}>Loading…</p>
        ) : transactions.length === 0 ? (
          <p className={styles.empty}>No transactions found</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Member</th><th>Book</th><th>Issue Date</th><th>Due Date</th>
                <th>Return Date</th><th>Status</th><th>Fine</th>
                {activeTab !== "returned" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.map((row) => (
                <tr key={row.id} className={row.is_overdue ? styles.rowOverdue : ""}>
                  <td>{row.member_name}</td>
                  <td>{row.book_title}</td>
                  <td>{fmtDate(row.issue_date)}</td>
                  <td className={row.is_overdue ? styles.overdueDate : ""}>{fmtDate(row.due_date)}</td>
                  <td>{fmtDate(row.return_date)}</td>
                  <td>
                    <span className={`${styles.badge} ${
                      row.status === "returned" ? styles.returned : row.is_overdue ? styles.overdue : styles.issued
                    }`}>
                      {row.status === "returned" ? "Returned" : row.is_overdue ? "Overdue" : "Issued"}
                    </span>
                  </td>
                  <td>
                    {row.status === "returned"
                      ? (row.fine_amount > 0 ? `₹${row.fine_amount}` : "—")
                      : (row.current_fine > 0 ? `₹${row.current_fine}` : "—")}
                  </td>
                  {activeTab !== "returned" && (
                    <td>
                      {row.status === "issued" && (
                        <button
                          className={styles.btnReturn}
                          onClick={() => handleReturn(row)}
                          disabled={returningId === row.id}
                        >
                          {returningId === row.id ? "…" : "Return"}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ─────────────────────────────────────────────────── */}
      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
              onClick={() => goToPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className={`${styles.statCard} ${styles[`stat_${color}`]}`}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value ?? "—"}</p>
    </div>
  );
}
