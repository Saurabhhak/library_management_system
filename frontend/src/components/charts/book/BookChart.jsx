import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  RadialLinearScale,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, PolarArea, Line } from "react-chartjs-2";
import styles from "./BookChart.module.css";

/* ── Register Chart.js modules ── */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  RadialLinearScale,
  LineElement,
  Tooltip,
  Legend,
);

/* ── Color palette ── */
const PALETTE = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
  "#f97316",
  "#14b8a6",
];

/* ── Chart options (no axes) — for doughnut & polar ── */
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        boxWidth: 10,
        font: { size: 11 },
        color: "#8b949e",
        padding: 14,
      },
    },
    tooltip: {
      backgroundColor: "#0d1117",
      borderColor: "#30363d",
      borderWidth: 1,
      titleColor: "#e6edf3",
      bodyColor: "#8b949e",
      padding: 10,
      callbacks: {
        label: (ctx) => {
          const label = ctx.dataset.label || ctx.label || "";
          const value = ctx.parsed?.y ?? ctx.parsed ?? ctx.raw ?? 0;
          return ` ${label}: ${value}`;
        },
      },
    },
  },
};

/* ── Chart options (with axes) — for bar & line ── */
const axisOptions = {
  ...baseOptions,
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#8b949e", font: { size: 12 } },
    },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1, precision: 0, color: "#8b949e" },
      grid: { color: "#1e2025" },
    },
  },
};

/* ── Build Chart.js dataset from labels + values ── */
function buildDatasets(labels, values, type) {
  const colors = labels.map((_, i) => PALETTE[i % PALETTE.length]);

  // Doughnut & Polar: one dataset, all slices together
  if (type === "doughnut" || type === "polar") {
    return [
      {
        label: "Books",
        data: values,
        backgroundColor: colors,
        borderColor: "transparent",
        borderWidth: 0,
        hoverOffset: 8,
      },
    ];
  }

  // Bar & Line: one dataset per label (each shows in legend separately)
  return labels.map((label, i) => ({
    label,
    data: [values[i]],
    backgroundColor: colors[i] + "cc",
    borderColor: colors[i],
    borderWidth: type === "line" ? 2 : 0,
    borderRadius: type === "bar" ? 6 : 0,
    tension: 0.4,
    fill: false,
    pointBackgroundColor: colors[i],
    pointRadius: 5,
  }));
}

/* ────────────────────────────────────────────
   BookChart — Reusable Chart Component

   Props:
     chartData  = { labels: string[], values: number[] }
     type       = "bar" | "doughnut" | "polar" | "line"
     title      = string (optional)
──────────────────────────────────────────── */
function BookChart({ chartData = {}, type = "bar", title = "" }) {
  const { labels = [], values = [] } = chartData;

  // Show empty state if no data
  if (!labels.length || values.every((v) => v === 0)) {
    return (
      <div className={styles.card}>
        {title && <h3 className={styles.title}>{title}</h3>}
        <p className={styles.empty}>No data to display</p>
      </div>
    );
  }

  // For bar/line: x-axis has one empty tick (bars are split by dataset)
  // For doughnut/polar: labels go directly to slices
  const data = {
    labels: type === "bar" || type === "line" ? [""] : labels,
    datasets: buildDatasets(labels, values, type),
  };

  const renderChart = () => {
    switch (type) {
      case "doughnut":
        return (
          <Doughnut data={data} options={{ ...baseOptions, cutout: "62%" }} />
        );
      case "polar":
        return <PolarArea data={data} options={baseOptions} />;
      case "line":
        return <Line data={data} options={axisOptions} />;
      default:
        return <Bar data={data} options={axisOptions} />;
    }
  };

  return (
    <div className={styles.card}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.chartWrapper}>{renderChart()}</div>
    </div>
  );
}

export default BookChart;
