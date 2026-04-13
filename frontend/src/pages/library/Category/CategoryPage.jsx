import { useEffect, useState, useMemo } from "react";
import { getCategories } from "../../../services/books/category.service";
import MemberCharts from "../../../components/charts/MemberCharts";
import styles from "./CategoryPage.module.css";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [hasDescription, setHasDescription] = useState("");

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategories();
        setCategories(res?.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    return categories.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
        return false;

      if (hasDescription === "yes" && !c.description) return false;
      if (hasDescription === "no" && c.description) return false;

      return true;
    });
  }, [categories, search, hasDescription]);

  /* ---------------- CHART DATA ---------------- */
  const charts = useMemo(() => {
    const withDesc = filtered.filter((c) => c.description).length;
    const withoutDesc = filtered.length - withDesc;

    return {
      descriptionChart: {
        labels: ["With Description", "Without Description"],
        values: [withDesc, withoutDesc],
      },
      nameLengthChart: {
        labels: ["<10", "10-20", "20+"],
        values: [
          filtered.filter((c) => c.name.length < 10).length,
          filtered.filter(
            (c) => c.name.length >= 10 && c.name.length <= 20
          ).length,
          filtered.filter((c) => c.name.length > 20).length,
        ],
      },
    };
  }, [filtered]);

  /* ---------------- STATS ---------------- */
  const total = filtered.length;
  const withDesc = filtered.filter((c) => c.description).length;
  const withoutDesc = total - withDesc;

  /* ---------------- PAGE LOADER ---------------- */
  if (loading) {
    return (
      <div className={styles.loaderPage}>
        <div className={styles.loader}></div>
        <p>Loading Category Analytics...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>Category Analytics</h1>

        <div className={styles.filters}>
          <input
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={hasDescription}
            onChange={(e) => setHasDescription(e.target.value)}
          >
            <option value="">All</option>
            <option value="yes">With Description</option>
            <option value="no">Without Description</option>
          </select>
        </div>
      </div>

      {/* STATS */}
      <div className={styles.stats}>
        {loading ? (
          <div className={styles.skeletonCard}></div>
        ) : (
          <>
            <div className={styles.card}>Total: {total}</div>
            <div className={styles.card}>With Desc: {withDesc}</div>
            <div className={styles.card}>Without Desc: {withoutDesc}</div>
          </>
        )}
      </div>

      {/* CHARTS */}
      <div className={styles.grid}>
        <div className={styles.chartCard}>
          <MemberCharts
            chartData={charts.descriptionChart}
            type="doughnut"
            title="Description Distribution"
          />
        </div>

        <div className={styles.chartCard}>
          <MemberCharts
            chartData={charts.nameLengthChart}
            type="bar"
            title="Category Name Length"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className={styles.skeleton}></div></td>
                    <td><div className={styles.skeleton}></div></td>
                    <td><div className={styles.skeleton}></div></td>
                  </tr>
                ))
              : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="3">No data</td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>{c.description || "—"}</td>
                    </tr>
                  ))
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoryPage;