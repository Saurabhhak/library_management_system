import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import styles from "./MemberDashboard.module.css";

const QUOTES = [
  "A reader lives a thousand lives before he dies. — George R.R. Martin",
  "Today a reader, tomorrow a leader. — Margaret Fuller",
  "The more that you read, the more things you will know. — Dr. Seuss",
  "Books are a uniquely portable magic. — Stephen King",
  "Reading is to the mind what exercise is to the body. — Joseph Addison",
];

function StudyHero({ name }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setQuoteIndex((i) => (i + 1) % QUOTES.length),
      6000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.hero}>
      <div className={styles.bookWrap}>
        <div className={styles.book}>
          <div className={styles.pageLeft} />
          <div className={styles.pageRight} />
          <div className={styles.spine} />
        </div>
      </div>
      <div className={styles.heroText}>
        <h1 className={styles.heroTitle}>
          Welcome back, {name || "Reader"} 📚
        </h1>
        <p key={quoteIndex} className={styles.quote}>
          {QUOTES[quoteIndex]}
        </p>
      </div>
    </div>
  );
}

function DueBadge({ isOverdue, overdueDays }) {
  if (!isOverdue) return <span className={styles.badgeOk}>On time</span>;
  return (
    <span className={styles.badgeOverdue}>
      {overdueDays} day{overdueDays > 1 ? "s" : ""} overdue
    </span>
  );
}

const PAGE_SIZE = 5;

export default function MemberDashboard() {
  const { user } = useAuth();
  const [issued, setIssued] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/transactions/my", {
        params: { status: "issued", page: p, limit: PAGE_SIZE },
      });
      setIssued(data.data.transactions);
      setTotalPages(data.data.pagination.totalPages || 1);
    } catch (err) {
      console.error("[MemberDashboard] load failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [load, page]);

  // Naya issue admin/librarian se hote hi 20s ke andar apne aap dikh jaayega
  useEffect(() => {
    const id = setInterval(() => load(page), 20000);
    return () => clearInterval(id);
  }, [load, page]);

  return (
    <div className={styles.page}>
      <StudyHero name={user?.first_name} />

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Your Issued Books</h2>
          <button
            className={styles.refreshBtn}
            onClick={() => load(page)}
            title="Refresh now"
          >
            <i className="fa-solid fa-arrows-rotate" />
          </button>
        </div>

        {loading ? (
          <p className={styles.loadingText}>Loading…</p>
        ) : issued.length === 0 ? (
          <p className={styles.emptyText}>
            No books issued right now — go grab one! 📖
          </p>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Issued</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {issued.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div className={styles.bookTitle}>{tx.book_title}</div>
                      <div className={styles.bookAuthor}>{tx.book_author}</div>
                    </td>
                    <td>{new Date(tx.issue_date).toLocaleDateString()}</td>
                    <td>{new Date(tx.due_date).toLocaleDateString()}</td>
                    <td>
                      <DueBadge
                        isOverdue={tx.is_overdue}
                        overdueDays={tx.overdue_days}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.pager}>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <i className="fa-solid fa-chevron-left" /> Previous page
              </button>
              <span className={styles.pageIndicator}>
                Page {page} of {totalPages}
              </span>
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next page <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
