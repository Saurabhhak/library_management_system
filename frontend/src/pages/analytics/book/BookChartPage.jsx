import { useEffect, useState } from "react";
import { getBooks } from "../../../services/books/book.service";
import BookChart from "../../../components/charts/book/BookChart";
import styles from "./BookChartPage.module.css";
import { Link } from "react-router-dom";

/* ──────────────────────────────────────────
   COPIES RANGE DEFINITIONS
   Used for both the filter dropdown and
   all four chart buildData functions.
────────────────────────────────────────── */
const COPIES_RANGES = [
  { value: "1-4", label: "1 – 4 copies", check: (c) => c >= 1 && c <= 4 },
  { value: "5-10", label: "5 – 10 copies", check: (c) => c >= 5 && c <= 10 },
  { value: "11-20", label: "11 – 20 copies", check: (c) => c >= 11 && c <= 20 },
  { value: "20+", label: "20+ copies", check: (c) => c > 20 },
];

/* ──────────────────────────────────────────
   CHART DEFINITIONS
   All four charts show "Books by Copies Range".
   Each uses a different chart type.
────────────────────────────────────────── */
const CHARTS = [
  { id: "doughnut", type: "doughnut", title: "Books by Copies Range" },
  { id: "bar", type: "bar", title: "Books by Copies Range" },
  { id: "polar", type: "polar", title: "Books by Copies Range" },
  { id: "line", type: "line", title: "Books by Copies Range" },
];

/* ──────────────────────────────────────────
   Build chart data from filtered books.
   Counts how many books fall in each range.
────────────────────────────────────────── */
function buildCopiesChartData(books) {
  return {
    labels: COPIES_RANGES.map((r) => r.label),
    values: COPIES_RANGES.map(
      (r) => books.filter((b) => r.check(Number(b.total_copies) || 0)).length,
    ),
  };
}

/* ──────────────────────────────────────────
   PAGE COMPONENT
────────────────────────────────────────── */
function BookChartPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copyFilter, setCopyFilter] = useState(""); // selected range value or ""

  /* Fetch all books once on mount */
  useEffect(() => {
    (async () => {
      try {
        const res = await getBooks();
        setBooks(res?.data?.data || []);
      } catch (err) {
        console.error("Books fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  /* ___  Agar filter empty → sab show warna selected range apply  _____*/
  /* Filter books by selected copies range (or show all if none selected) */
  const filtered = books.filter((book) => {
    if (!copyFilter) return true; // no filter active → show all
    const range = COPIES_RANGES.find((r) => r.value === copyFilter);
    return range ? range.check(Number(book.total_copies) || 0) : true;
  });

  /* Stats for the stat cards */
  const totalBooks = filtered.length;
  const totalCopies = filtered.reduce(
    (sum, b) => sum + (b.total_copies ?? 0),
    0,
  );
  // _____________________________________________________________________
  /* Chart data built from filtered books */
  const chartData = buildCopiesChartData(filtered);

  /* Loading spinner */
  if (loading) {
    return (
      <div className={styles.loaderPage}>
        <div className={styles.loader}></div>
        <p>Loading Book Analytics...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ── HEADER ── */}
      <div className={styles.header}>
        <h1>
          Book Analytics <i className="fa-solid fa-chart-line"></i>
        </h1>

        <div className={styles.headerActions}>
          {/* Link to inventory table */}
          <Link to="/bookinventory" className={styles.inventoryBtn}>
            <i className="fa-solid fa-table"></i> Book Inventory
          </Link>

          {/* Copies range filter dropdown */}
          <select
            value={copyFilter}
            className={styles.selectItem}
            onChange={(e) => setCopyFilter(e.target.value)}
          >
            <option value="">All Copies</option>
            {COPIES_RANGES.map((r) => (
              <option key={r.value} value={r.value} className={styles.options}>
                {r.label}
              </option>
            ))}
          </select>

          {/* Clear button — only visible when a filter is active */}
          {copyFilter && (
            <button
              className={styles.clearBtn}
              onClick={() => setCopyFilter("")}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className={styles.stats}>
        <div className={styles.card}>Books: {totalBooks}</div>
        <div className={styles.card}>Total Copies: {totalCopies}</div>
      </div>

      {/* ── EMPTY STATE ── */}
      {totalBooks === 0 && (
        <p className={styles.noData}>No books match the selected filter.</p>
      )}

      {/* ── CHARTS GRID ── */}
      {totalBooks > 0 && (
        <div className={styles.grid}>
          {CHARTS.map(({ id, type, title }) => (
            <BookChart
              key={id}
              chartData={chartData}
              type={type}
              title={title}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookChartPage;
