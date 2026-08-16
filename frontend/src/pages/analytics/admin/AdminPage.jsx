import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminChart from "../../../components/charts/admin/AdminChart";
import styles from "./AdminPage.module.css";
import { getAdmins } from "../../../services/admin/admin.service";

export default function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");

  /* FETCH REAL DATA */
  useEffect(() => {
    (async () => {
      try {
        const res = await getAdmins();
        setAdmins(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch admins:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* NORMALIZE ROLES */
  const normalized = admins.map((a) => ({
    ...a,
    role: (a.role || "admin").toLowerCase(),
  }));

  /* FILTER BY DROPDOWN */
  const filtered = normalized.filter((a) => {
    if (selectedRole && a.role !== selectedRole) return false;
    return true;
  });

  /* CALCULATE STATS (Added Librarian) */
  const total = filtered.length;
  const superAdmins = filtered.filter((a) => a.role === "superadmin").length;
  const adminsCount = filtered.filter((a) => a.role === "admin").length;
  const librariansCount = filtered.filter((a) => a.role === "librarian").length;

  /* PASS TO CHARTJS */
  const chartData = {
    labels: ["Super Admin", "Admin", "Librarian"],
    values: [superAdmins, adminsCount, librariansCount],
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <i className="fa-solid fa-spinner fa-spin" /> Loading Analytics...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ── HEADER & TOOLBAR ── */}
      <div className={styles.headerBar}>
        <h1 className={styles.title}>
          <i className="fa-solid fa-chart-line" /> Staff Analytics
        </h1>

        <div className={styles.toolbar}>
          <Link to="/admininventory" className={styles.btnOutline}>
            <i className="fa-solid fa-table" /> Admin Inventory
          </Link>

          {/* FILTER DROPDOWN */}
          <select
            value={selectedRole}
            className={styles.selectBox}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="librarian">Librarian</option>
          </select>

          {/* CLEAR FILTER */}
          {selectedRole && (
            <button
              className={styles.clearBtn}
              onClick={() => setSelectedRole("")}
            >
              <i className="fa-solid fa-xmark" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── TOP STATS OVERVIEW ── */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.total}`}>
          <div className={styles.statIcon}>
            <i className="fa-solid fa-users" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{total}</span>
            <span className={styles.statLabel}>Total Staff</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.super}`}>
          <div className={styles.statIcon}>
            <i className="fa-solid fa-shield-halved" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{superAdmins}</span>
            <span className={styles.statLabel}>Super Admins</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.admin}`}>
          <div className={styles.statIcon}>
            <i className="fa-solid fa-user-gear" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{adminsCount}</span>
            <span className={styles.statLabel}>Admins</span>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.librarian}`}>
          <div className={styles.statIcon}>
            <i className="fa-solid fa-book-open-reader" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{librariansCount}</span>
            <span className={styles.statLabel}>Librarians</span>
          </div>
        </div>
      </div>

      {/* ── EMPTY STATE ── */}
      {total === 0 && (
        <div className={styles.emptyState}>
          <i className="fa-solid fa-folder-open" />
          <p>No analytics data found for the selected filter.</p>
        </div>
      )}

      {/* ── CHARTS RENDERING ── */}
      {total > 0 && (
        <div className={styles.chartsGrid}>
          <AdminChart
            chartData={chartData}
            type="doughnut"
            title="Role Distribution"
            icon="fa-chart-pie"
            badgeText="System Users"
          />

          <AdminChart
            chartData={chartData}
            type="bar"
            title="Role Comparison"
            icon="fa-chart-column"
            badgeText="Headcount"
          />
        </div>
      )}
    </div>
  );
}
