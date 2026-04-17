// src/components/charts/AdminChart.jsx
import { Doughnut, Bar, Line, PolarArea } from "react-chartjs-2";
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

import { getAdminRoleData } from "../../../utils/chartHelpers";
import styles from "./AdminChart.module.css";

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

function AdminChart({
  admins = [],
  type = "donut",
  title = "Admin Distribution",
}) {
  const { labels, data } = getAdminRoleData(admins);
  const COLORS = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
  ];

  const BORDER_COLORS = COLORS.map((color) => color.replace("0.6", "1"));
  const chartData = {
    labels,
    datasets: [
      {
        label: "Admins",
        data,

        // MULTI COLOR for all chart types
        backgroundColor: COLORS,
        borderColor: BORDER_COLORS,

        borderWidth: 2,

        //  Only for line chart
        fill: type === "line",
        tension: type === "line" ? 0.4 : 0,
      },
    ],
  };
  return (
    <div className={styles.chartWrapper}>
      <h3 className={styles.chartTitle}>{title}</h3>

      <div className={styles.canvasContainer}>
        {data.length > 0 ? (
          <>
            {type === "donut" && <Doughnut data={chartData} />}
            {type === "bar" && <Bar data={chartData} />}
            {type === "line" && <Line data={chartData} />}
            {type === "polararea" && <PolarArea data={chartData} />}
          </>
        ) : (
          <div
            style={{ textAlign: "center", marginTop: "10%", color: "#8b949e" }}
          >
            No admin data available
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminChart;
