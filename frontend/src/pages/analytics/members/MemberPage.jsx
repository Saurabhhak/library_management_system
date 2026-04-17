import { useEffect, useState, useMemo } from "react";
import { getMembers } from "../../../services/member/member.service";
import { getStates } from "../../../services/meta/states.cities.service";
import MemberCharts from "../../../components/charts/members/MemberCharts";
import styles from "./MemberPage.module.css";

/* ───────── HELPERS ───────── */

// generic counter
const countBy = (arr, fn) =>
  arr.reduce((acc, item) => {
    const key = fn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

// build state chart
const buildStateChartData = (members) => {
  const countMap = countBy(members, (m) => m.stateName);
  return {
    labels: Object.keys(countMap),
    values: Object.values(countMap),
  };
};

/* ───────── COMPONENT ───────── */

function MemberPage() {
  const [members, setMembers] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedState, setSelectedState] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  /* ───── FETCH DATA ───── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, sRes] = await Promise.all([getMembers(), getStates()]);

        setMembers(mRes?.data?.data || []);
        setStates(sRes?.data?.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ───── STATE MAP ───── */
  const stateMap = useMemo(
    () => Object.fromEntries(states.map((s) => [s.id, s.name])),
    [states],
  );

  /* ───── NORMALIZE DATA (🔥 MOST IMPORTANT FIX) ───── */
  const normalizedMembers = useMemo(() => {
    return members.map((m) => ({
      ...m,
      stateId: String(m.state_id ?? m.state?.id ?? ""),
      stateName:
        m.state_name || stateMap[m.state_id] || m.state?.name || "Unknown",
      status: (m.status || "inactive").toLowerCase(),
    }));
  }, [members, stateMap]);

  /* ───── FILTER ───── */
  const filteredMembers = useMemo(() => {
    return normalizedMembers.filter((m) => {
      if (selectedState && m.stateId !== selectedState) return false;
      if (selectedStatus && m.status !== selectedStatus) return false;
      return true;
    });
  }, [normalizedMembers, selectedState, selectedStatus]);

  /* ───── STATS ───── */
  const total = filteredMembers.length;

  const active = filteredMembers.filter((m) => m.status === "active").length;

  const inactive = filteredMembers.filter(
    (m) => m.status === "inactive",
  ).length;

  /* ───── CHARTS ───── */
  const charts = useMemo(() => {
    return {
      statusData: {
        labels: ["Active", "Inactive"],
        values: [active, inactive],
      },
      stateData: buildStateChartData(filteredMembers),
    };
  }, [filteredMembers, active, inactive]);

  /* ───── CLEAR FILTER ───── */
  const handleClear = () => {
    setSelectedState("");
    setSelectedStatus("");
  };

  /* ───── LOADING ───── */
  if (loading) return <p className={styles.loading}>Loading...</p>;

  /* ───── UI ───── */
  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <h1>Member Analytics</h1>

        <div className={styles.filters}>
          {/* STATE FILTER */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.name}
              </option>
            ))}
          </select>

          {/* STATUS FILTER */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* CLEAR */}
          {(selectedState || selectedStatus) && (
            <button className={styles.clearBtn} onClick={handleClear}>
              Clear
            </button>
          )}
        </div>
      </header>

      {/* STATS */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Total Members</div>
          <div className={styles.statValue}>{total}</div>
        </div>

        <div className={`${styles.stat} ${styles.statActive}`}>
          <div className={styles.statLabel}>Active</div>
          <div className={styles.statValue}>{active}</div>
        </div>

        <div className={`${styles.stat} ${styles.statInactive}`}>
          <div className={styles.statLabel}>Inactive</div>
          <div className={styles.statValue}>{inactive}</div>
        </div>
      </div>

      {/* CHARTS */}
      <div className={styles.grid}>
        <MemberCharts
          chartData={charts.statusData}
          type="doughnut"
          title="Active vs Inactive"
          colorScheme="status"
        />

        <MemberCharts
          chartData={charts.stateData}
          type="bar"
          title="State-wise Member Count"
        />
      </div>
    </div>
  );
}

export default MemberPage;
