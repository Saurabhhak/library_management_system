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
import styles from "./MemberCharts.module.css";

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
);

/*__________________ COLOR SYSTEM (LIKE CATEGORY CHARTS) */
const STATUS_COLORS = {
  active: "#22c55e",
  inactive: "#ef4444",
};

const DEFAULT_PALETTE = ["#6366f1", "#06b6d4"];

/* resolve color */
const getColor = (label, i) =>
  STATUS_COLORS[label.toLowerCase()] || DEFAULT_PALETTE[i % 2];

/* __________________ COMMON OPTIONS */
const COMMON_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        boxWidth: 12,
        font: { size: 11 },
      },
    },
  },
};

/* _________________ DATA BUILDERS (CLEAN & SEPARATED) */
/* _________________ DONUT → single dataset */
const buildDonutData = (labels, values) => ({
  labels,
  datasets: [
    {
      data: values,
      backgroundColor: labels.map(getColor),
      borderWidth: 0,
    },
  ],
});

/* _______________ BAR → separate dataset (for legend buttons) */
const buildBarData = (labels, values) => ({
  labels: ["Members"],
  datasets: labels.map((label, i) => ({
    label,
    data: [values[i]],
    backgroundColor: getColor(label, i),
    borderColor: getColor(label, i),
    borderWidth: 1,
  })),
});

/* ________________________ COMPONENT ___________________________ */
function MemberCharts({
  chartData = {},
  type = "bar" /* ---- doughnut , bar ---- */,
  title = "",
}) {
  const { labels = [], values = [] } = chartData;

  /* _______________ EMPTY STATE */
  if (!labels.length) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.empty}>No data</p>
      </div>
    );
  }
  /* ______ SELECT DATA BASED ON TYPE */
  let data;
  let options = COMMON_OPTIONS;
  if (type === "doughnut") {
    data = buildDonutData(labels, values);
  } else {
    data = buildBarData(labels, values);
  }

  /* ______ RENDER */
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.chartWrapper}>
        {type === "doughnut" && <Doughnut data={data} options={options} />}
        {type === "bar" && <Bar data={data} options={options} />}
      </div>
    </div>
  );
}
export default MemberCharts;
