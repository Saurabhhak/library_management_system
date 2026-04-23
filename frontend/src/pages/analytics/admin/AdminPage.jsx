import { useEffect, useState } from "react";
import AdminChart from "../../../components/charts/admin/AdminChart";
import styles from "./AdminPage.module.css";
import { getAdmins } from "../../../services/admin/admin.service";
import { Link } from "react-router-dom";

function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");

  /* FETCH */
  useEffect(() => {
    (async () => {
      try {
        const res = await getAdmins();
        setAdmins(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* NORMALIZE */
  const normalized = admins.map((a) => ({
    ...a,
    role: (a.role || "admin").toLowerCase(),
  }));

  /* FILTER */
  const filtered = normalized.filter((a) => {
    if (selectedRole && a.role !== selectedRole) return false;
    return true;
  });

  /* STATS */
  const total = filtered.length;
  const superAdmins = filtered.filter((a) => a.role === "superadmin").length;
  const adminsCount = filtered.filter((a) => a.role === "admin").length;

  /* CHART DATA */
  const chartData = {
    labels: ["Super Admin", "Admin"],
    values: [superAdmins, adminsCount],
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>
          Admin Analytics <i className="fa-solid fa-chart-line"></i>
        </h1>

        <div className={styles.headerActions}>
          <Link to="/admininventory" className={styles.inventoryBtn}>
            <i className="fa-solid fa-table"></i> Admin Inventory
          </Link>

          {/* FILTER */}
          <select
            value={selectedRole}
            className={styles.selectItem}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">All</option>
            <option value="superadmin">Super Admin</option>
            <option value="admin">Admin</option>
          </select>

          {/* CLEAR */}
          {selectedRole && (
            <button
              className={styles.clearBtn}
              onClick={() => setSelectedRole("")}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className={styles.stats}>
        <div className={styles.card}>Total: {total}</div>

        <div className={`${styles.card} ${styles.super}`}>
          Super Admin: {superAdmins}
        </div>

        <div className={`${styles.card} ${styles.admin}`}>
          Admin: {adminsCount}
        </div>
      </div>

      {/* EMPTY */}
      {total === 0 && <p>No admins found</p>}

      {/* CHARTS */}
      {total > 0 && (
        <div className={styles.grid}>
          <AdminChart
            chartData={chartData}
            type="doughnut"
            title="Admin Distribution"
          />

          <AdminChart
            chartData={chartData}
            type="bar"
            title="Admin Comparison"
          />
        </div>
      )}
    </div>
  );
}

export default AdminPage;