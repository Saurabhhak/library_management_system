import { useEffect, useState } from "react";
import { getMembers } from "../../services/member/member.service";
import { getStates } from "../../services/meta/meta.service";
import MemberCharts from "../../components/charts/MemberCharts";
import styles from "./MemberPage.module.css";

// Returns [{ stateName, count }] only for states that have members
function buildStateData(members = [], states = []) {
  const stateMap = Object.fromEntries(states.map((s) => [s.id, s.name]));

  const countMap = members.reduce((acc, member) => {
    const name = stateMap[member.state_id] || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  // Sort descending by count
  return Object.entries(countMap)
    .map(([stateName, count]) => ({ stateName, count }))
    .sort((a, b) => b.count - a.count);
}

function MemberPage() {
  const [members, setMembers]     = useState([]);
  const [stateData, setStateData] = useState([]); // [{ stateName, count }]
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, statesRes] = await Promise.all([
          getMembers(),
          getStates(),
        ]);

        const membersData = membersRes?.data?.data || [];
        const statesData  = statesRes?.data?.data  || [];

        setMembers(membersData);
        setStateData(buildStateData(membersData, statesData));
      } catch (err) {
        console.error("Failed to load member data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalMembers  = members.length;
  const activeCount   = members.filter((m) => m.status === "active").length;
  const inactiveCount = members.filter((m) => m.status === "inactive").length;
  const stateCount    = stateData.length;

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading member analytics…</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Member Analytics</h1>
          <p className={styles.subtitle}>State-wise member distribution overview</p>
        </div>
      </header>

      {/* STAT CARDS */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Members"  value={totalMembers}  accent="blue"   icon="👥" />
        <StatCard label="Active"         value={activeCount}   accent="green"  icon="✅" />
        <StatCard label="Inactive"       value={inactiveCount} accent="orange" icon="⏸️" />
        <StatCard label="States Covered" value={stateCount}    accent="purple" icon="🗺️" />
      </div>

      {/* CHARTS */}
      <div className={styles.chartsGrid}>
        <MemberCharts stateData={stateData} type="bar"      title="Members per State"     />
        <MemberCharts stateData={stateData} type="doughnut" title="State Distribution"    />
        <MemberCharts stateData={stateData} type="polar"    title="Polar Area View"       />
        <MemberCharts stateData={stateData} type="line"     title="State Trend View"      />
      </div>

      {/* STATE TABLE */}
      <section className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>Members by State</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>State</th>
                <th>Total Members</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {stateData.map(({ stateName, count }, idx) => {
                const pct = totalMembers > 0
                  ? ((count / totalMembers) * 100).toFixed(1)
                  : "0.0";
                return (
                  <tr key={stateName}>
                    <td className={styles.idx}>{idx + 1}</td>
                    <td className={styles.stateName}>{stateName}</td>
                    <td className={styles.count}>{count}</td>
                    <td>
                      <div className={styles.barCell}>
                        <div className={styles.barTrack}>
                          <div
                            className={styles.barFill}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={styles.pct}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, accent, icon }) {
  return (
    <div className={`${styles.statCard} ${styles[accent]}`}>
      <span className={styles.statIcon}>{icon}</span>
      <p className={styles.statLabel}>{label}</p>
      <h2 className={styles.statValue}>{value}</h2>
    </div>
  );
}

export default MemberPage;