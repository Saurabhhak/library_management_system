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
);

/* COLOR SYSTEM (ADMIN ROLES) */
const ROLE_COLORS = {
  superadmin: "#22c55e", // green
  admin: "#3b82f6", // blue
};

const DEFAULT_PALETTE = ["#22c55e", "#3b82f6"];

/* resolve color */
const getColor = (label, i) =>
  ROLE_COLORS[label.toLowerCase()] || DEFAULT_PALETTE[i % 2];

/* COMMON OPTIONS */
const COMMON_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        boxWidth: 10,
        font: { size: 13 },
      },
    },
  },
};

/* DONUT DATA */
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

/* BAR DATA */
const buildBarData = (labels, values) => ({
  labels: ["Admins"],
  datasets: labels.map((label, i) => ({
    label,
    data: [values[i]],
    backgroundColor: getColor(label, i),
    borderColor: getColor(label, i),
    borderWidth: 1,
  })),
});

/* ___________________________ COMPONENT _____________________________ */
function AdminChart({
  chartData = {},
  type = "bar", // doughnut | bar
  title = "",
}) {
  const { labels = [], values = [] } = chartData;

  /* EMPTY */
  if (!labels.length) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.empty}>No data</p>
      </div>
    );
  }

  let data;
  let options = COMMON_OPTIONS;

  if (type === "doughnut") {
    data = buildDonutData(labels, values);
  } else {
    data = buildBarData(labels, values);
  }

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

export default AdminChart;
