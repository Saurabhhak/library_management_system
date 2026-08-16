import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { useAuth } from "../../context/AuthContext";
import { getBooks } from "../../services/books/book.service";
import {
  getMyStats,
  getMyTransactions,
} from "../../services/transactions/transactionService";
import WelcomeNotification from "../../components/layout/Welcomenotification";
import styles from "./MemberDashboard.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const PALETTE = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#ef4444",
];

export default function MemberDashboard() {
  const { user, isCampusUser } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(true);

  const [myStats, setMyStats] = useState({
    active_issues: 0,
    total_read: 0,
    overdue: 0,
    total_fine: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [catChartData, setCatChartData] = useState(null);
  const [activityChartData, setActivityChartData] = useState(null);

  useEffect(() => {
    if (!sessionStorage.getItem("welcomeShown")) {
      setShowWelcome(true);
      sessionStorage.setItem("welcomeShown", "true");
    }

    const fetchData = async () => {
      try {
        // 1. Fetch Stats
        const statsData = await getMyStats();
        if (statsData) setMyStats(statsData);

        // 2. Fetch Books for Collection Chart
        const bookRes = await getBooks();
        const books = bookRes.data?.data || bookRes.data || [];
        const counts = books.reduce((acc, b) => {
          const cat = b.category || "General";
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});

        setCatChartData({
          labels: Object.keys(counts),
          datasets: [
            {
              data: Object.values(counts),
              backgroundColor: PALETTE,
              borderColor: "#0d1117",
              borderWidth: 3,
              hoverOffset: 8,
            },
          ],
        });

        // 3. Fetch Transactions for Table
        const txList = await getMyTransactions();
        const safeTxList = Array.isArray(txList) ? txList : [];
        setTransactions(safeTxList);

        // Generate dynamic reading habits chart
        const monthCounts = {};
        safeTxList.forEach((tx) => {
          const m = new Date(tx.issue_date).toLocaleString("default", {
            month: "short",
          });
          monthCounts[m] = (monthCounts[m] || 0) + 1;
        });

        setActivityChartData({
          labels: Object.keys(monthCounts).length
            ? Object.keys(monthCounts).reverse()
            : ["No Activity"],
          datasets: [
            {
              label: "Books Borrowed",
              data: Object.values(monthCounts).length
                ? Object.values(monthCounts).reverse()
                : [0],
              backgroundColor: "#3b82f6",
              borderRadius: 6,
              barPercentage: 0.5,
            },
          ],
        });
      } catch (err) {
        console.error("Dashboard data load failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { color: "#cbd5e1", font: { family: "Inter", size: 11 } },
      },
      tooltip: {
        backgroundColor: "#161b22",
        titleColor: "#fff",
        padding: 12,
        cornerRadius: 8,
      },
    },
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { stepSize: 1, color: "#64748b" },
      },
      x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#161b22",
        titleColor: "#fff",
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const getStatusBadge = (status, dueDate) => {
    if (status === "returned")
      return (
        <span className={`${styles.badge} ${styles.badgeSuccess}`}>
          Returned
        </span>
      );
    if (new Date(dueDate) < new Date())
      return (
        <span className={`${styles.badge} ${styles.badgeDanger}`}>Overdue</span>
      );
    return (
      <span className={`${styles.badge} ${styles.badgeWarning}`}>
        Active Issue
      </span>
    );
  };

  if (loading)
    return (
      <div
        className={styles.page}
        style={{ textAlign: "center", marginTop: "10vh", color: "#64748b" }}
      >
        <i className="fa-solid fa-spinner fa-spin fa-2x" />
      </div>
    );

  return (
    <div className={styles.page}>
      {showWelcome && (
        <WelcomeNotification
          userName={user?.first_name}
          onClose={() => setShowWelcome(false)}
        />
      )}

      <header className={`${styles.hero} ${styles.fadeUp}`}>
        <h1 className={styles.title}>
          Welcome to your Library, <span>{user?.first_name}</span>
        </h1>
        <div className={styles.idBadge}>
          {isCampusUser ? (
            <>
              <i className="fa-solid fa-id-card" /> ID:{" "}
              {user?.institutional_id || "N/A"}
            </>
          ) : (
            <>
              <i className="fa-solid fa-user" /> Digital Access
            </>
          )}
        </div>
        <p className={styles.sub}>
          Track your reading progress, manage due dates, and explore our massive
          collection.
        </p>
      </header>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.fadeUp} ${styles.delay1}`}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}
          >
            <i className="fa-solid fa-book-open-reader" />
          </div>
          <div>
            <h3 className={styles.statVal}>{myStats.active_issues}</h3>
            <p className={styles.statLabel}>Active Issues</p>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.fadeUp} ${styles.delay2}`}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}
          >
            <i className="fa-solid fa-check-double" />
          </div>
          <div>
            <h3 className={styles.statVal}>{myStats.total_read}</h3>
            <p className={styles.statLabel}>Total Read</p>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.fadeUp} ${styles.delay3}`}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}
          >
            <i className="fa-solid fa-clock" />
          </div>
          <div>
            <h3 className={styles.statVal}>{myStats.overdue}</h3>
            <p className={styles.statLabel}>Overdue Books</p>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.fadeUp} ${styles.delay4}`}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
          >
            <i className="fa-solid fa-indian-rupee-sign" />
          </div>
          <div>
            <h3 className={styles.statVal}>₹{myStats.total_fine}</h3>
            <p className={styles.statLabel}>Unpaid Fines</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={`${styles.chartBox} ${styles.fadeUp} ${styles.delay2}`}>
          <div className={styles.chartTitle}>
            <span>
              <i className="fa-solid fa-layer-group" /> Collection Breakdown
            </span>{" "}
            <span className={styles.chartBadge}>Real-time</span>
          </div>
          <div className={styles.chartArea}>
            {catChartData && (
              <Doughnut data={catChartData} options={donutOptions} />
            )}
          </div>
        </div>

        <div className={`${styles.chartBox} ${styles.fadeUp} ${styles.delay3}`}>
          <div className={styles.chartTitle}>
            <span>
              <i className="fa-solid fa-chart-column" /> Reading Habits
            </span>{" "}
            <span className={styles.chartBadge}>Monthly</span>
          </div>
          <div className={styles.chartArea}>
            {activityChartData && (
              <Bar data={activityChartData} options={barOptions} />
            )}
          </div>
        </div>
      </div>

      <div
        className={`${styles.tableSection} ${styles.fadeUp} ${styles.delay4}`}
      >
        <div className={styles.sectionHeader}>
          <h2>
            <i className="fa-solid fa-clock-rotate-left" /> Recent Borrowings
          </h2>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Book Title</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.emptyCell}>
                    <i className="fa-solid fa-folder-open" />
                    <p>No recent borrowing history found.</p>
                  </td>
                </tr>
              ) : (
                transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontWeight: 600, color: "#f8fafc" }}>
                      {tx.book_title}
                    </td>
                    <td>
                      {new Date(tx.issue_date).toLocaleDateString("en-IN")}
                    </td>
                    <td style={{ color: "#3b82f6" }}>
                      {new Date(tx.due_date).toLocaleDateString("en-IN")}
                    </td>
                    <td>{getStatusBadge(tx.status, tx.due_date)}</td>
                    <td
                      style={{
                        color: tx.fine > 0 ? "#ef4444" : "#10b981",
                        fontWeight: 600,
                      }}
                    >
                      {tx.fine > 0 ? `₹${tx.fine}` : "0"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
