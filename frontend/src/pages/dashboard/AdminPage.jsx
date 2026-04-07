import { useEffect, useState } from "react";
import AdminChart from "../../components/charts/AdminChart";
import styles from "./AdminPage.module.css";
import { getAdmins } from "../../services/admin/admin.service";

function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await getAdmins();
        setAdmins(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  // Calculate Admin
  const totalAdmins = admins.length;
  const superAdmins = admins.filter((a) => a.role === "superadmin").length;
  const normalAdmins = admins.filter((a) => a.role === "admin").length;

  if (loading) {
    return (
      <div className={styles.message}>
        <i className="fa-solid fa-spinner fa-spin-pulse"></i> Loading admin
        analytics...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Analytics</h1>

      {/* STATS CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p>Total Admins</p>
          <h2>{totalAdmins}</h2>
        </div>

        <div className={styles.statCard}>
          <p>Super Admins</p>
          <h2>{superAdmins}</h2>
        </div>

        <div className={styles.statCard}>
          <p>Admins</p>
          <h2>{normalAdmins}</h2>
        </div>
      </div>

      {/* CHART GRID */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <AdminChart admins={admins} type="donut" title="Admin Distribution" />
        </div>

        <div className={styles.card}>
          <AdminChart admins={admins} type="bar" title="Admin Comparison" />
        </div>

        <div className={styles.card}>
          <AdminChart admins={admins} type="line" title="Admin Trend" />
        </div>
                <div className={styles.card}>
          <AdminChart admins={admins} type="polararea" title="Admin Role Distribution" />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
