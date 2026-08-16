import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import styles from "./AdminChart.module.css";

/* ───── REGISTER ───── */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

/* ───── PREMIUM PALETTE (Matching Your Image) ───── */
const ROLE_COLORS = {
  "super admin": "#22c55e", // Green
  admin: "#3b82f6", // Blue
  librarian: "#f59e0b", // Orange
};
const DEFAULT_PALETTE = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
];
const getColor = (label, i) =>
  ROLE_COLORS[label.toLowerCase()] ||
  DEFAULT_PALETTE[i % DEFAULT_PALETTE.length];

/* ───── COMMON OPTIONS ───── */
const COMMON_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1200, easing: "easeOutQuart" },
  plugins: {
    legend: {
      display: true,
      position: "right", // Default right for Doughnut
      labels: {
        color: "#94a3b8",
        usePointStyle: true,
        boxWidth: 8,
        font: { size: 11, family: "Inter" },
        padding: 15,
      },
    },
    tooltip: {
      backgroundColor: "#161b22",
      titleColor: "#f8fafc",
      bodyColor: "#cbd5e1",
      borderColor: "#30363d",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    },
  },
};

const barOptions = {
  ...COMMON_OPTIONS,
  plugins: { ...COMMON_OPTIONS.plugins, legend: { display: false } }, // Hide legend for bar
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "rgba(255,255,255,0.05)" },
      ticks: { color: "#64748b", stepSize: 1, font: { size: 10 } },
    },
    x: {
      grid: { display: false },
      ticks: { color: "#94a3b8", font: { size: 10 } },
    },
  },
};

/* ───── DATA BUILDERS ───── */
const buildDonutData = (labels, values) => ({
  labels,
  datasets: [
    {
      data: values,
      backgroundColor: labels.map(getColor),
      borderColor: "#0d1117",
      borderWidth: 4,
      hoverOffset: 6,
    },
  ],
});

const buildBarData = (labels, values) => ({
  labels,
  datasets: [
    {
      data: values,
      backgroundColor: labels.map((l, i) => getColor(l, i)),
      borderRadius: 6,
      barPercentage: 0.6,
    },
  ],
});

/* ___________________________ COMPONENT _____________________________ */
export default function AdminChart({
  chartData = {},
  type = "bar",
  title = "",
  icon = "fa-chart-pie",
  badgeText = "Overview",
}) {
  const { labels = [], values = [] } = chartData;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!labels.length) {
    return (
      <div className={`${styles.card} ${isVisible ? styles.fadeIn : ""}`}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>
            <i className={`fa-solid ${icon}`} /> {title}
          </h3>
        </div>
        <div className={styles.empty}>
          <i className="fa-solid fa-chart-simple" />
          <p>No data to display</p>
        </div>
      </div>
    );
  }

  const data =
    type === "doughnut"
      ? buildDonutData(labels, values)
      : buildBarData(labels, values);
  const options = type === "doughnut" ? COMMON_OPTIONS : barOptions;

  return (
    <div className={`${styles.card} ${isVisible ? styles.fadeIn : ""}`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>
          <i className={`fa-solid ${icon}`} /> {title}
        </h3>
        <span className={styles.chartBadge}>{badgeText}</span>
      </div>
      <div className={styles.chartWrapper}>
        {type === "doughnut" && <Doughnut data={data} options={options} />}
        {type === "bar" && <Bar data={data} options={options} />}
      </div>
    </div>
  );
}
