import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MemberCharts from "../../../components/charts/members/MemberCharts";
import styles from "../admin/AdminPage.module.css"; // Reusing Admin Grid CSS
import { getMembers } from "../../../services/member/member.service";

export default function MemberPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMembers();
        setMembers(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const normalized = members.map((m) => ({
    ...m,
    status: (m.status || "inactive").toLowerCase(),
  }));
  const filtered = normalized.filter((m) =>
    selectedStatus ? m.status === selectedStatus : true,
  );

  const total = filtered.length;
  const active = filtered.filter((m) => m.status === "active").length;
  const inactive = filtered.filter((m) => m.status === "inactive").length;

  const chartData = {
    labels: ["Active", "Inactive"],
    values: [active, inactive],
  };

  if (loading)
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <i className="fa-solid fa-spinner fa-spin" /> Loading Analytics...
        </div>
      </div>
    );

  return (
    <div className={styles.container}>
      {/* ── HEADER ── */}
      <div className={styles.headerBar}>
        <h1 className={styles.title}>
          <i className="fa-solid fa-users-rays" /> Member Analytics
        </h1>
        <div className={styles.toolbar}>
          <Link to="/memberinventory" className={styles.btnOutline}>
            <i className="fa-solid fa-table" /> Member Inventory
          </Link>
          <select
            value={selectedStatus}
            className={styles.selectBox}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active Members</option>
            <option value="inactive">Inactive / Suspended</option>
          </select>
          {selectedStatus && (
            <button
              className={styles.clearBtn}
              onClick={() => setSelectedStatus("")}
            >
              <i className="fa-solid fa-xmark" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.total}`}>
          <div className={styles.statIcon}>
            <i className="fa-solid fa-users" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{total}</span>
            <span className={styles.statLabel}>Total Members</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.super}`}>
          <div className={styles.statIcon}>
            <i className="fa-solid fa-user-check" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{active}</span>
            <span className={styles.statLabel}>Active</span>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.librarian}`}>
          <div className={styles.statIcon} style={{ color: "#ef4444" }}>
            <i className="fa-solid fa-user-xmark" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{inactive}</span>
            <span className={styles.statLabel}>Inactive</span>
          </div>
        </div>
      </div>

      {/* ── CHARTS ── */}
      {total > 0 ? (
        <div className={styles.chartsGrid}>
          <MemberCharts
            chartData={chartData}
            type="doughnut"
            title="Activity Ratio"
            icon="fa-chart-pie"
            badgeText="Real-time"
          />
          <MemberCharts
            chartData={chartData}
            type="bar"
            title="Status Distribution"
            icon="fa-chart-column"
            badgeText="Headcount"
          />
        </div>
      ) : (
        <div className={styles.emptyState}>
          <i className="fa-solid fa-folder-open" />
          <p>No member data found.</p>
        </div>
      )}
    </div>
  );
}
