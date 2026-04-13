import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut, PolarArea } from "react-chartjs-2";
import styles from "./MemberCharts.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
);

// ─── palette ─────────────────────────────────────────────────────────────────

const PALETTE = [
  "#4f46e5", "#10b981", "#f59e0b", "#ef4444",
  "#06b6d4", "#a855f7", "#ec4899", "#84cc16",
  "#f97316", "#14b8a6", "#8b5cf6", "#0ea5e9",
];

// For status doughnut: green = active, orange = inactive
const STATUS_COLORS = {
  active: "#10b981",
  inactive: "#f59e0b",
  unknown: "#e5e7eb",
};

// ─── chart options ────────────────────────────────────────────────────────────

const BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { boxWidth: 12, font: { size: 11 }, padding: 12 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const val = ctx.parsed?.y ?? ctx.parsed ?? ctx.raw ?? 0;
          return ` ${val} members`;
        },
      },
    },
  },
};

const AXIS_OPTIONS = {
  ...BASE_OPTIONS,
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, maxRotation: 45 },
    },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1, precision: 0, font: { size: 11 } },
      grid: { color: "#f3f4f6" },
    },
  },
};

const H_BAR_OPTIONS = {
  ...BASE_OPTIONS,
  indexAxis: "y",
  scales: {
    x: {
      beginAtZero: true,
      ticks: { stepSize: 1, precision: 0, font: { size: 11 } },
      grid: { color: "#f3f4f6" },
    },
    y: {
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
  },
};

// ─── component ───────────────────────────────────────────────────────────────

/**
 * Props
 * ─────
 * chartData     { labels: string[], values: number[] }
 * type          "bar" | "horizontalBar" | "line" | "doughnut" | "polar"
 * title         string
 * colorScheme   "status" | undefined  (status maps green/orange per label)
 */
function MemberCharts({ chartData = {}, type = "bar", title, colorScheme }) {
  const { labels = [], values = [] } = chartData;

  if (!labels.length) {
    return (
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.empty}>No data available</p>
      </div>
    );
  }

  // Resolve colors
  const backgroundColors = labels.map((label, i) => {
    if (colorScheme === "status") {
      return (
        STATUS_COLORS[label.toLowerCase()] ||
        PALETTE[i % PALETTE.length]
      );
    }
    return PALETTE[i % PALETTE.length];
  });

  const isLine = type === "line";
  const isDoughnut = type === "doughnut" || type === "polar";

  const dataset = {
    label: "Members",
    data: values,
    backgroundColor: isLine
      ? "rgba(79, 70, 229, 0.08)"
      : backgroundColors,
    borderColor: isLine ? "#4f46e5" : backgroundColors,
    borderWidth: isLine ? 2 : isDoughnut ? 0 : 1,
    tension: 0.4,
    pointBackgroundColor: "#4f46e5",
    pointRadius: isLine ? 4 : undefined,
    fill: isLine,
    borderRadius: (!isLine && !isDoughnut) ? 6 : undefined,
    borderSkipped: false,
    hoverOffset: isDoughnut ? 6 : undefined,
  };

  const data = { labels, datasets: [dataset] };

  const renderChart = () => {
    switch (type) {
      case "doughnut":
        return <Doughnut data={data} options={{ ...BASE_OPTIONS, cutout: "62%" }} />;
      case "polar":
        return <PolarArea data={data} options={BASE_OPTIONS} />;
      case "line":
        return <Line data={data} options={AXIS_OPTIONS} />;
      case "horizontalBar":
        return <Bar data={data} options={H_BAR_OPTIONS} />;
      default: // "bar"
        return <Bar data={data} options={AXIS_OPTIONS} />;
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.chartWrapper}>{renderChart()}</div>
    </div>
  );
}

export default MemberCharts;