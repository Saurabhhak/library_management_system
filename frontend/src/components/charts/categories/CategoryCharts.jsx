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
import styles from "./CategoryCharts.module.css";

/* _____ register _____ */
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

/* __ LABEL MAP (single source) ___ */
const LABEL_MAP = {
  "<10": "Short Name (<10)",
  "10–20": "Medium Name (10–20)",
  "20+": "Long Name (20+)",
  "with description": "Has Description",
  "without description": "No Description",
};

/* __ COLORS __*/
const DESC_COLORS = {
  "with description": "#10b981",
  "without description": "rgb(210, 245, 11)",
};

const LENGTH_COLORS = {
  "<10": "#6366f1",
  "10–20": "#06b6d4",
  "20+": "#ef4444",
};

const PALETTE = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
];

/* ___ HELPERS  ___ */

// resolve colors
function resolveColors(labels) {
  return labels.map((label, i) => {
    const key = label.toLowerCase();
    if (DESC_COLORS[key]) return DESC_COLORS[key];
    if (LENGTH_COLORS[label]) return LENGTH_COLORS[label];
    return PALETTE[i % PALETTE.length];
  });
}
/* ____ Engine ________________________________ */
/* ____ IMPORTANT: dataset builder_____________*/
function buildDatasets(labels, values, type) {
  /* __ doughnut & polar → single dataset __*/
  if (type === "doughnut" || type === "polar") {
    const colors = resolveColors(labels);
    return [
      {
        label: "Categories",
        data: values,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 0,
      },
    ];
  }

  // bar & line → split datasets (checkbox behavior)
  return labels.map((label, i) => {
    const color = resolveColors([label])[0];
    return {
      label,
      data: [values[i]],
      backgroundColor: color,
      borderColor: color,
      borderWidth: 0,
      borderRadius: type === "bar" ? 5 : 0,
      tension: 30,
      fill: false,
    };
  });
}

/* ─── OPTIONS ───────────────────────────── */

const createOptions = (hideLegend) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: !hideLegend,
      position: "bottom",
      labels: {
        boxWidth: 12,
        font: { size: 11 },
        padding: 12,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const raw = ctx.dataset.label || ctx.label || "";
          const normalized = raw.toLowerCase();

          const label = LABEL_MAP[raw] || LABEL_MAP[normalized] || raw;

          const value = ctx.parsed?.y ?? ctx.parsed ?? ctx.raw ?? 0;

          return ` ${label}: ${value}`;
        },
      },
    },
  },
});

const AXIS_OPTIONS = (hideLegend) => ({
  ...createOptions(hideLegend),
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 15 } },
    },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1, precision: 0 },
      grid: { color: "#1e2025" },
    },
  },
});

/* ____________________________ MAIN COMPONENT ___________________________*/
function CategoryCharts({
  /* chartData = {
  labels: ["<10", "10–20", "20+"],
  values: [5, 3, 2]
}*/
  // Ye props se aa raha hai
  chartData = {},
  type = "bar",
  title = "",
  hideLegend = false,
}) {
  const { labels = [], values = [] } = chartData;
  // Check: labels empty?
  if (!labels.length) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.empty}>No data available</p>
      </div>
    );
  }

  /* _______ dynamic data _________ */
  const data = {
    labels: type === "bar" || type === "line" ? ["Categories"] : labels,
    datasets: buildDatasets(labels, values, type),
  };

  /* ─── render ───────────────────────── */
  const renderChart = () => {
    switch (type) {
      case "doughnut":
        return (
          <Doughnut
            data={data}
            options={{ ...createOptions(hideLegend), cutout: "60%" }}
          />
        );

      case "polar":
        return <PolarArea data={data} options={createOptions(hideLegend)} />;

      case "line":
        return <Line data={data} options={AXIS_OPTIONS(hideLegend)} />;
        
      default:
        return <Bar data={data} options={AXIS_OPTIONS(hideLegend)} />;
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.chartWrapper}>{renderChart()}</div>
    </div>
  );
}

export default CategoryCharts;
