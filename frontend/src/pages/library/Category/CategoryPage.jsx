import { useEffect, useState, useMemo } from "react";
import { getCategories } from "../../../services/books/category.service";
import CategoryCharts from "../../../components/charts/CategoryCharts";
import styles from "./CategoryPage.module.css";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasDescription, setHasDescription] = useState("");

  // ─── fetch ─────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await getCategories();
        setCategories(res?.data?.data || []);
      } catch (err) {
        console.error("Category fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ─── filter ────────────────────────────────────
  const filtered = useMemo(() => {
    return categories.filter((c) => {
      if (hasDescription === "yes" && !c.description) return false;
      if (hasDescription === "no" && c.description) return false;
      return true;
    });
  }, [categories, hasDescription]);

  // ─── charts ────────────────────────────────────
  const charts = useMemo(() => {
    const withDesc = filtered.filter((c) => c.description).length;
    const withoutDesc = filtered.length - withDesc;

    return {
      descriptionChart: {
        labels: ["With Description", "Without Description"],
        values: [withDesc, withoutDesc],
      },
      nameLengthChart: {
        labels: ["<10", "10–20", "20+"],
        values: [
          filtered.filter((c) => c.name?.length < 10).length,
          filtered.filter((c) => c.name?.length >= 10 && c.name?.length <= 20)
            .length,
          filtered.filter((c) => c.name?.length > 20).length,
        ],
      },
    };
  }, [filtered]);

  // ─── stats ─────────────────────────────────────
  const total = filtered.length;
  const withDesc = charts.descriptionChart.values[0] || 0;
  const withoutDesc = charts.descriptionChart.values[1] || 0;

  // ─── loading ───────────────────────────────────
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

        <select
          value={hasDescription}
          className={styles.selectItem}
          onChange={(e) => setHasDescription(e.target.value)}
        >
          <option className={styles.options} value="">All</option>
          <option className={styles.options} value="yes">With Description</option>
          <option className={styles.options} value="no">Without Description</option>
        </select>
      </div>

      {/* STATS */}
      <div className={styles.stats}>
        <div className={styles.card}>Total: {total}</div>
        <div className={styles.card}>With Desc: {withDesc}</div>
        <div className={styles.card}>Without Desc: {withoutDesc}</div>
      </div>

      {/* CHARTS */}
      <div className={styles.grid}>
        <CategoryCharts
          chartData={charts.descriptionChart}
          type="doughnut"
          title="Description Distribution"
        />

        <CategoryCharts
          chartData={charts.nameLengthChart}
          type="bar"
          title="Category Name Length"
        />
      </div>
    </div>
  );
}

export default CategoryPage;
