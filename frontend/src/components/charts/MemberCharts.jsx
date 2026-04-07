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

function MemberCharts({ stateCounts = {}, type = "bar", title }) {
  const labels = Object.keys(stateCounts);
  const values = Object.values(stateCounts);

  if (!labels.length) return <p>No data available</p>;

  const data = {
    labels,
    datasets: [
      {
        label: "Members",
        data: values,
        backgroundColor: [
          "#4f46e5",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#06b6d4",
          "#a855f7",
        ],
        borderWidth: 1,
      },
    ],
  };

  const renderChart = () => {
    switch (type) {
      case "line":
        return <Line data={data} />;
      case "doughnut":
        return <Doughnut data={data} />;
      case "polar":
        return <PolarArea data={data} />;
      default:
        return <Bar data={data} />;
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