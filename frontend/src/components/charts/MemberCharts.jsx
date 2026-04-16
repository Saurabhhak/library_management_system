import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";
import styles from "./MemberCharts.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

const STATUS_COLORS = {
  active: "#10b981",
  inactive: "#ef4444",
};

const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" } },
};

function MemberCharts({ chartData, type, title, colorScheme }) {
  const { labels = [], values = [] } = chartData || {};

  if (!labels.length) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.empty}>No data</p>
      </div>
    );
  }

  const colors = labels.map((l, i) =>
    colorScheme === "status"
      ? STATUS_COLORS[l.toLowerCase()]
      : COLORS[i % COLORS.length],
  );

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
      },
    ],
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.chart}>
        {type === "doughnut" ? (
          <Doughnut data={data} options={OPTIONS} />
        ) : (
          <Bar data={data} options={OPTIONS} />
        )}
      </div>
    </div>
  );
}

export default MemberCharts;
