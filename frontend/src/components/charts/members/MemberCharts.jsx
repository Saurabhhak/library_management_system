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
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import styles from "../admin/AdminChart.module.css"; // 🔥 Reusing Admin CSS for exact same Premium UI!

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

/* ───── PREMIUM STATUS PALETTE ───── */
const STATUS_COLORS = {
  active: "#10b981", // Emerald Green
  inactive: "#ef4444", // Red
};
const DEFAULT_PALETTE = ["#3b82f6", "#f59e0b"];

const getColor = (label, i) =>
  STATUS_COLORS[label.toLowerCase()] || DEFAULT_PALETTE[i % 2];

/* ───── COMMON OPTIONS ───── */
const COMMON_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1500, easing: "easeOutQuart" },
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        color: "#94a3b8",
        usePointStyle: true,
        padding: 20,
        font: { size: 12, family: "Inter" },
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      titleColor: "#f8fafc",
      bodyColor: "#cbd5e1",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    },
  },
};

const barOptions = {
  ...COMMON_OPTIONS,
  plugins: { ...COMMON_OPTIONS.plugins, legend: { display: false } },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "rgba(255,255,255,0.05)" },
      ticks: { color: "#64748b", stepSize: 1 },
    },
    x: { grid: { display: false }, ticks: { color: "#94a3b8" } },
  },
};

const buildDonutData = (labels, values) => ({
  labels,
  datasets: [
    {
      data: values,
      backgroundColor: labels.map(getColor),
      borderColor: "#0d1117",
      borderWidth: 3,
      hoverOffset: 8,
    },
  ],
});

const buildBarData = (labels, values) => ({
  labels: ["Member Status"],
  datasets: labels.map((label, i) => ({
    label,
    data: [values[i]],
    backgroundColor: getColor(label, i),
    borderRadius: 6,
    barPercentage: 0.6,
  })),
});

export default function MemberCharts({
  chartData = {},
  type = "bar",
  title = "",
  icon = "fa-chart-pie",
  badgeText = "Status",
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
          <p>Not enough data to display.</p>
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
