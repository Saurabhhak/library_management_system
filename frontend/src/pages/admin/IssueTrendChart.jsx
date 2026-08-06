import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../api/axiosInstance";
import styles from "./IssueTrendChart.module.css";

const AUTO_REFRESH_MS = 30000;

export default function IssueTrendChart() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (y) => {
    setLoading(true);
    try {
      const { data: res } = await axiosInstance.get(
        "/transactions/monthly-stats",
        { params: { year: y } },
      );
      setData(res.data);
    } catch (err) {
      console.error("[IssueTrendChart] load failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(year);
  }, [load, year]);
  useEffect(() => {
    const id = setInterval(() => load(year), AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [load, year]);

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i,
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Books Issued vs Returned</h3>
        <select
          className={styles.yearSelect}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <i className="fa-solid fa-spinner fa-spin" /> Loading chart…
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis allowDecimals={false} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 8,
              }}
            />
            <Legend />
            <Bar
              dataKey="issued"
              fill="#2ee6a6"
              name="Issued"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="returned"
              fill="#1a73e8"
              name="Returned"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
