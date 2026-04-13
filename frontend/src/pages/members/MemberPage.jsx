import { useEffect, useState, useMemo } from "react";
import { getMembers } from "../../services/member/member.service";
import { getStates } from "../../services/meta/meta.service";
import MemberCharts from "../../components/charts/MemberCharts";
import styles from "./MemberPage.module.css";

// ─── helpers ────────────────────────────────────────────────────────────────

function getAge(dob) {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  )
    age--;
  return age;
}

function getAgeGroup(age) {
  if (age === null) return "Unknown";
  if (age < 25) return "< 25";
  if (age < 30) return "25–29";
  if (age < 35) return "30–34";
  if (age < 40) return "35–39";
  return "40+";
}

function countBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

function toChartData(countMap, sortDesc = true) {
  const entries = Object.entries(countMap);
  if (sortDesc) entries.sort((a, b) => b[1] - a[1]);
  return {
    labels: entries.map(([k]) => k),
    values: entries.map(([, v]) => v),
  };
}

// ─── data builders ───────────────────────────────────────────────────────────

function buildStateData(members, states) {
  const stateMap = Object.fromEntries(states.map((s) => [s.id, s.name]));
  const countMap = countBy(members, (m) => stateMap[m.state_id] || "Unknown");
  return Object.entries(countMap)
    .map(([stateName, count]) => ({ stateName, count }))
    .sort((a, b) => b.count - a.count);
}

function buildAllChartData(members, stateMap) {
  // Status
  const statusCount = countBy(members, (m) => m.status || "Unknown");

  // City
  const cityCount = countBy(members, (m) => m.city_name || m.city || "Unknown");
  const cityData = toChartData(cityCount);

  // Expiry — group by YYYY-MM
  const expiryCount = countBy(members, (m) => {
    if (!m.membership_end) return "Unknown";
    return m.membership_end.slice(0, 7); // "YYYY-MM"
  });
  const expiryEntries = Object.entries(expiryCount)
    .filter(([k]) => k !== "Unknown")
    .sort(([a], [b]) => a.localeCompare(b));
  const expiryData = {
    labels: expiryEntries.map(([k]) => k),
    values: expiryEntries.map(([, v]) => v),
  };

  // Books allowed
  const booksCount = countBy(
    members,
    (m) => `${m.max_books_allowed ?? "?"} books`
  );
  const booksData = toChartData(booksCount, false);

  // Age groups
  const AGE_ORDER = ["< 25", "25–29", "30–34", "35–39", "40+", "Unknown"];
  const ageCount = countBy(members, (m) => getAgeGroup(getAge(m.date_of_birth)));
  const ageData = {
    labels: AGE_ORDER.filter((g) => ageCount[g] !== undefined),
    values: AGE_ORDER.filter((g) => ageCount[g] !== undefined).map(
      (g) => ageCount[g]
    ),
  };

  // State (already computed as stateData, also expose as plain {labels, values})
  const stateCount = countBy(
    members,
    (m) => stateMap[m.state_id] || "Unknown"
  );
  const stateChartData = toChartData(stateCount);

  return {
    statusCount,
    cityData,
    expiryData,
    booksData,
    ageData,
    stateChartData,
  };
}

// ─── component ───────────────────────────────────────────────────────────────

function MemberPage() {
  const [members, setMembers] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, statesRes] = await Promise.all([
          getMembers(),
          getStates(),
        ]);
        setMembers(membersRes?.data?.data || []);
        setStates(statesRes?.data?.data || []);
      } catch (err) {
        console.error("Failed to load member data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stateMap = useMemo(
    () => Object.fromEntries(states.map((s) => [s.id, s.name])),
    [states]
  );

  // derive unique expiry years for filter dropdown
  const expiryYears = useMemo(() => {
    const years = new Set(
      members
        .map((m) => m.membership_end?.slice(0, 4))
        .filter(Boolean)
    );
    return [...years].sort();
  }, [members]);

  // apply filters
  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (filterStatus && m.status !== filterStatus) return false;
      if (filterState && String(m.state_id) !== filterState) return false;
      if (filterYear && m.membership_end?.slice(0, 4) !== filterYear)
        return false;
      return true;
    });
  }, [members, filterStatus, filterState, filterYear]);

  const stateData = useMemo(
    () => buildStateData(filtered, states),
    [filtered, states]
  );

  const charts = useMemo(
    () => buildAllChartData(filtered, stateMap),
    [filtered, stateMap]
  );

  // stat cards
  const totalMembers = filtered.length;
  const activeCount = filtered.filter((m) => m.status === "active").length;
  const inactiveCount = filtered.filter((m) => m.status === "inactive").length;
  const avgBooks =
    filtered.length > 0
      ? (
          filtered.reduce((s, m) => s + (m.max_books_allowed || 0), 0) /
          filtered.length
        ).toFixed(1)
      : "0.0";

  const hasFilters = filterStatus || filterState || filterYear;

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
      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Member Analytics</h1>
          <p className={styles.subtitle}>
            {hasFilters
              ? `Showing ${totalMembers} filtered member${totalMembers !== 1 ? "s" : ""}`
              : "Full member distribution overview"}
          </p>
        </div>

        {/* FILTERS */}
        <div className={styles.filters}>
          <select
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            className={styles.filterSelect}
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          >
            <option value="">All states</option>
            {states.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="">All expiry years</option>
            {expiryYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              className={styles.clearBtn}
              onClick={() => {
                setFilterStatus("");
                setFilterState("");
                setFilterYear("");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </header>

      {/* STAT CARDS */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Members" value={totalMembers} accent="blue" />
        <StatCard label="Active" value={activeCount} accent="green" />
        <StatCard label="Inactive" value={inactiveCount} accent="orange" />
        <StatCard label="Avg Books / Member" value={avgBooks} accent="purple" />
      </div>

      {/* CHARTS — ROW 1: Status + City */}
      <div className={styles.chartsGrid2}>
        <MemberCharts
          chartData={{
            labels: Object.keys(charts.statusCount),
            values: Object.values(charts.statusCount),
          }}
          type="doughnut"
          title="Status distribution"
          colorScheme="status"
        />
        <MemberCharts
          chartData={charts.cityData}
          type="bar"
          title="Members by city"
        />
      </div>

      {/* CHARTS — ROW 2: Expiry + Books */}
      <div className={styles.chartsGrid2}>
        <MemberCharts
          chartData={charts.expiryData}
          type="line"
          title="Membership expiry — month wise"
        />
        <MemberCharts
          chartData={charts.booksData}
          type="bar"
          title="Max books allowed"
        />
      </div>

      {/* CHARTS — ROW 3: Age + State */}
      <div className={styles.chartsGrid2}>
        <MemberCharts
          chartData={charts.ageData}
          type="horizontalBar"
          title="Age group segmentation"
        />
        <MemberCharts
          chartData={charts.stateChartData}
          type="bar"
          title="Members by state"
        />
      </div>

      {/* STATE TABLE */}
      <section className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>State-wise breakdown</h2>
        <div className={styles.tableWrapper}>
          {stateData.length === 0 ? (
            <p className={styles.emptyTable}>No data for selected filters.</p>
          ) : (
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
                  const pct =
                    totalMembers > 0
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
          )}
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