// src/pages/BookChartPage/BookChartPage.jsx

import CategoryChart from "../../components/Chart";
import styles from "./BookChartPage.module.css";

function BookChartPage({ books = [], loading = false }) {
  if (loading) {
    return <div className={styles.messageContainer}>Loading analytics...</div>;
  }

  // if (books.length) {
  //   return <div className={styles.messageContainer}>No data available.</div>;
  // }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Library Analytics</h1>

      <div className={styles.cardLayout}>
        <div className={styles.chartCard}>
          <CategoryChart
            books={books}
            type="bar"
            mode="copies"
            title="Total Copies by Category"
          />
        </div>

        <div className={styles.chartCard}>
          <CategoryChart
            books={books}
            type="donut"
            mode="books"
            title="Books Distribution"
          />
        </div>

        <div className={styles.chartCard}>
          <CategoryChart
            books={books}
            type="line"
            mode="copies"
            title="Copies Trend"
          />
        </div>
      </div>
    </div>
  );
}

export default BookChartPage;
