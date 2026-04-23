import { useEffect, useState } from "react";
import { getCategories } from "../../../services/books/category.service";
import CategoryCharts from "../../../components/charts/categories/CategoryCharts";
import styles from "./CategoryPage.module.css";
import { Link } from "react-router-dom";

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasDescription, setHasDescription] = useState("");

  /* FETCH */
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

  /* FILTER */
  const filtered = categories.filter((c) => {
    if (hasDescription === "yes" && !c.description) return false;
    if (hasDescription === "no" && c.description) return false;
    return true;
  });

  /* STATS */
  const total = filtered.length;
  const withDesc = filtered.filter((c) => c.description).length;
  const withoutDesc = filtered.filter((c) => !c.description).length;

  /* NAME LENGTH STATS */
  const short = filtered.filter((c) => c.name?.length < 10).length;
  const medium = filtered.filter(
    (c) => c.name?.length >= 10 && c.name?.length <= 20,
  ).length;
  const long = filtered.filter((c) => c.name?.length > 20).length;

  /* CHART DATA */
  const descriptionChart = {
    labels: ["With Description", "Without Description"],
    values: [withDesc, withoutDesc],
  };

  const nameLengthChart = {
    labels: ["<10", "10–20", "20+"],
    values: [short, medium, long],
  };

  /* CLEAR */
  function handleClear() {
    setHasDescription("");
  }

  /* LOADING */
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
        <h1>
          Category Analytics <i className="fa-solid fa-chart-line"></i>
        </h1>

        <div className={styles.headerActions}>
          <Link to="/categoryinventory" className={styles.inventoryBtn}>
            <i className="fa-solid fa-table"></i> Category Inventory
          </Link>

          {/* FILTER */}
          <select
            value={hasDescription}
            className={styles.selectItem}
            onChange={(e) => setHasDescription(e.target.value)}
          >
            <option value="">All</option>
            <option value="yes">With Desc</option>
            <option value="no">Without Desc</option>
          </select>

          {/* CLEAR */}
          {hasDescription && (
            <button className={styles.clearBtn} onClick={handleClear}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className={styles.stats}>
        <div className={styles.card}>Total: {total}</div>
        <div className={styles.card}>With Desc: {withDesc}</div>
        <div className={styles.card}>Without Desc: {withoutDesc}</div>
      </div>

      {/* EMPTY */}
      {total === 0 && <p>No categories found</p>}

      {/* CHARTS */}
      {total > 0 && (
        <div className={styles.grid}>
          <CategoryCharts
            chartData={descriptionChart}
            type="doughnut"
            title="Description Distribution"
          />

          <CategoryCharts
            chartData={nameLengthChart}
            type="bar"
            title="Category Name Length"
          />
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
