import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  RadialLinearScale,
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
  Tooltip,
  Legend
);

// Palette cycles if more states than colors
const PALETTE = [
  "#4f46e5", "#10b981", "#f59e0b", "#ef4444",
  "#06b6d4", "#a855f7", "#ec4899", "#84cc16",
  "#f97316", "#14b8a6", "#8b5cf6", "#0ea5e9",
];

const BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 12 } } },
    tooltip: { callbacks: {
      label: (ctx) => ` ${ctx.parsed.y ?? ctx.parsed ?? ctx.formattedValue} members`,
    }},
  },
};

const BAR_OPTIONS = {
  ...BASE_OPTIONS,
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1, precision: 0 },
      grid: { color: "#f3f4f6" },
    },
  },
};

// stateData: [{ stateName, count }]
function MemberCharts({ stateData = [], type = "bar", title }) {
  if (!stateData.length) {
    return (
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.empty}>No data available</p>
      </div>
    );
  }

  const labels = stateData.map((d) => d.stateName);
  const values = stateData.map((d) => d.count);
  const colors = labels.map((_, i) => PALETTE[i % PALETTE.length]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Members",
        data: values,
        backgroundColor: colors,
        borderColor: type === "line" ? "#4f46e5" : colors,
        borderWidth: type === "line" ? 2 : 1,
        tension: 0.4,
        pointBackgroundColor: "#4f46e5",
        fill: type === "line",
      },
    ],
  };

  const renderChart = () => {
    switch (type) {
      case "doughnut": return <Doughnut data={chartData} options={BASE_OPTIONS} />;
      case "polar":    return <PolarArea data={chartData} options={BASE_OPTIONS} />;
      case "line":     return <Line      data={chartData} options={BAR_OPTIONS}  />;
      default:         return <Bar       data={chartData} options={BAR_OPTIONS}  />;
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