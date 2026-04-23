import { useEffect, useState } from "react";
import { getMembers } from "../../../services/member/member.service";
import MemberCharts from "../../../components/charts/members/MemberCharts";
import styles from "./MemberPage.module.css";
import { Link } from "react-router-dom";

function MemberPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");

  /* FETCH */
  useEffect(() => {
    (async () => {
      try {
        const res = await getMembers();
        setMembers(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* NORMALIZE */
  const normalized = members.map((m) => ({
    ...m,
    status: (m.status || "inactive").toLowerCase(),
  }));

  /* FILTER */
  const filtered = normalized.filter((m) => {
    if (selectedStatus && m.status !== selectedStatus) return false;
    return true;
  });

  /* STATS */
  const total = filtered.length;
  const active = filtered.filter((m) => m.status === "active").length;
  const inactive = filtered.filter((m) => m.status === "inactive").length;

  /* CHART DATA */
  const chartData = {
    labels: ["Active", "Inactive"],
    values: [active, inactive],
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>
          Member Analytics <i className="fa-solid fa-chart-line"></i>
        </h1>

        {/* RIGHT SIDE CONTROLS */}
        <div className={styles.headerActions}>
          <Link
            to="/memberinventory"
            className={styles.inventoryBtn}
            title="Go to Member Inventory"
          >
            <i className="fa-solid fa-table"></i> Member Inventory
          </Link>

          {/* FILTER */}
          <select
            value={selectedStatus}
            className={styles.selectItem}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* CLEAR */}
          {selectedStatus && (
            <button
              className={styles.clearBtn}
              onClick={() => setSelectedStatus("")}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className={styles.stats}>
        <div className={styles.card}>Total: {total}</div>
        <div className={`${styles.card} ${styles.active}`}>
          Active: {active}
        </div>
        <div className={`${styles.card} ${styles.inactive}`}>
          Inactive: {inactive}
        </div>
      </div>

      {/* EMPTY */}
      {total === 0 && <p>No members found</p>}

      {/* CHARTS */}
      {total > 0 && (
        <div className={styles.grid} title="ticks">
          {/* DONUT */}
          <MemberCharts
            chartData={chartData}
            type="doughnut"
            title="Active vs Inactive"
            colorScheme="status"
          />

          {/* BAR */}
          <MemberCharts
            chartData={chartData}
            type="bar"
            title="Member Comparison"
          />
        </div>
      )}
    </div>
  );
}

export default MemberPage;
