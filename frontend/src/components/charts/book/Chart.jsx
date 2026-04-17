// components/charts/Chart.jsx
import { Bar, Line, Doughnut } from "react-chartjs-2";
const colors = ["#4facfe", "#43e97b", "#fa709a", "#fee140", "#f093fb"];
function Chart({ labels, data, type = "bar", title }) {
  // Simple data structure for Chart.js
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: data,
        backgroundColor:
          type === "donut"
            ? data.map((_, i) => colors[i % colors.length])
            : "#4facfe",
        borderColor: "#00f2fe",
        borderWidth: 2,
      },
    ],
  };

  // Simple options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        display: type === "donut",
        labels: { color: "#e6edf3" },
      },
    },
    scales:
      type !== "donut"
        ? {
            x: { ticks: { color: "#c9d1d9" } },
            y: { beginAtZero: true, ticks: { color: "#c9d1d9" } },
          }
        : {},
  };
  // Return the correct chart type
  if (type === "bar") return <Bar data={chartData} options={chartOptions} />;
  if (type === "line") return <Line data={chartData} options={chartOptions} />;
  if (type === "donut") return <Doughnut data={chartData} options={chartOptions} />;

  return null;
}

export default Chart;