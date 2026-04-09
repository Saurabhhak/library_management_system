import { useEffect, useState } from "react";
import { getMembers } from "../../services//member/member.service";
import { getMembersCountByState } from "../../utils/stateCount";
import MemberCharts from "../../components/charts/MemberCharts";
import styles from "./MemberPage.module.css";

function MemberPage() {
  const [members, setMembers] = useState([]);
  const [stateCounts, setStateCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getMembers();
        const data = res?.data?.data || [];

        setMembers(data);

        const counts = getMembersCountByState(data);
        setStateCounts(counts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <p>Loading member analytics...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Member Analytics</h1>

      {/* STATS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p>Total Members</p>
          <h2>{members.length}</h2>
        </div>

        <div className={styles.statCard}>
          <p>Total States</p>
          <h2>{Object.keys(stateCounts).length}</h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className={styles.grid}>
        <MemberCharts
          stateCounts={stateCounts}
          type="doughnut"
          title="State Distribution"
        />

        <MemberCharts
          stateCounts={stateCounts}
          type="bar"
          title="State Comparison"
        />

        <MemberCharts
          stateCounts={stateCounts}
          type="line"
          title="Growth View"
        />

        <MemberCharts
          stateCounts={stateCounts}
          type="polar"
          title="Polar Distribution"
        />
      </div>
    </div>
  );
}

export default MemberPage;