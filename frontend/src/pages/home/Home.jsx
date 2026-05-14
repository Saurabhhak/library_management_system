import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
import { Bar, Doughnut, Line } from "react-chartjs-2";

import styles from "./Home.module.css";
import bannerImg from "../../assets/homebannerImg.jpg.png";
/* ── Book data ── */
import { allBooks } from "../../utils/books/bookdata";
// Footer
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

/* ── Genre count for doughnut chart ── */
const genreCounts = allBooks.reduce((acc, b) => {
  acc[b.category] = (acc[b.category] || 0) + 1;
  return acc;
}, {});

const doughnutData = {
  labels: Object.keys(genreCounts),
  datasets: [
    {
      data: Object.values(genreCounts),
      backgroundColor: PALETTE,
      borderColor: "#0d1117",
      borderWidth: 3,
      hoverOffset: 8,
    },
  ],
};

/* ── Monthly issues line chart ── */
const lineData = {
  labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan '26", "Feb '26"],
  datasets: [
    {
      label: "Books Issued",
      data: [980, 1120, 1050, 1340, 890, 1480, 1620],
      borderColor: "#10b981",
      backgroundColor: "rgba(16,185,129,0.12)",
      tension: 0.45,
      fill: true,
      pointBackgroundColor: "#10b981",
      pointRadius: 4,
      pointHoverRadius: 7,
    },
    {
      label: "Books Returned",
      data: [870, 1030, 990, 1200, 820, 1360, 1510],
      borderColor: "#6366f1",
      backgroundColor: "rgba(99,102,241,0.08)",
      tension: 0.45,
      fill: true,
      pointBackgroundColor: "#6366f1",
      pointRadius: 4,
      pointHoverRadius: 7,
    },
  ],
};

/* ── Category bar chart ── */
const barData = {
  labels: Object.keys(genreCounts),
  datasets: [
    {
      label: "Books in Collection",
      data: Object.values(genreCounts),
      backgroundColor: PALETTE.map((c) => c + "cc"),
      borderColor: PALETTE,
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    },
  ],
};

const chartOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#161b22",
      borderColor: "#30363d",
      borderWidth: 1,
      titleColor: "#ffffff",
      bodyColor: "#8b949e",
    },
  },
  scales: {
    x: {
      ticks: { color: "#8b949e", font: { size: 10 } },
      grid: { color: "#21262d" },
    },
    y: {
      ticks: { color: "#8b949e", font: { size: 10 } },
      grid: { color: "#21262d" },
    },
  },
});

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      display: true,
      labels: { color: "#8b949e", boxWidth: 12, font: { size: 11 } },
    },
    tooltip: {
      backgroundColor: "#161b22",
      borderColor: "#30363d",
      borderWidth: 1,
      titleColor: "#fff",
      bodyColor: "#8b949e",
    },
  },
  scales: {
    x: {
      ticks: { color: "#8b949e", font: { size: 10 } },
      grid: { color: "#21262d" },
    },
    y: {
      ticks: { color: "#8b949e", font: { size: 10 } },
      grid: { color: "#21262d" },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        color: "#8b949e",
        boxWidth: 12,
        font: { size: 10 },
        padding: 10,
      },
    },
    tooltip: {
      backgroundColor: "#161b22",
      borderColor: "#30363d",
      borderWidth: 1,
      titleColor: "#fff",
      bodyColor: "#8b949e",
    },
  },
};

/* ─────────────────────────────────────
   ANIMATED COUNTER HOOK
───────────────────────────────────── */
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else setCount(Math.floor(start));
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return [count, ref];
}

/* ─────────────────────────────────────
   STAT COUNTER COMPONENT
───────────────────────────────────── */
function StatCounter({ target, suffix = "+", label, icon }) {
  const [count, ref] = useCounter(target);
  return (
    <div className={styles.statBox} ref={ref}>
      <i className={icon}></i>
      <h2>
        {count.toLocaleString()}
        {suffix}
      </h2>
      <p>{label}</p>
    </div>
  );
}

/* ─────────────────────────────────────
   HOME COMPONENT
───────────────────────────────────── */
function Home() {
  return (
    <div className={styles.homeContainer}>
      {/* _______ HERO BANNER _______ */}
      <section className={styles.bannerWrapper}>
        <div
          className={styles.bannerBackground}
          style={{ backgroundImage: `url(${bannerImg})` }}
        />
        <div className={styles.bannerOverlay} />

        <div className={styles.bannerContent}>
          <span className={styles.badgeLabel}>
            <i className="fa-solid fa-circle-dot"></i> Live System Coming soon
          </span>
          <h1 className={styles.animateText}>
            Library
            <br />
            <span className={styles.accentText}>Management</span>
            <br />
            System
          </h1>
          <p className={styles.animateTextDelay}>
            Discover, manage, and track an entire world of knowledge — with an
            elegant, blazing-fast digital experience.
          </p>
          <div className={styles.animateBtn}>
            <Link to="/bookslib">
              <button className={styles.ctaBtn}>
                Explore Library <i className="fa-solid fa-arrow-right"></i>
              </button>
            </Link>
            <Link to="/memberinventory">
              <button className={styles.ctaOutlineBtn}>View Members</button>
            </Link>
          </div>
        </div>

        {/* Floating quick-stats badges on banner */}
        <div className={styles.bannerFloatCards}>
          <div className={styles.floatCard}>
            <i
              className="fa-solid fa-book-open"
              style={{ color: "#f59e0b" }}
            ></i>
            <span>
              {/* {allBooks.length} */}
              <strong>1200+</strong> books
            </span>
          </div>
          <div className={styles.floatCard}>
            <i className="fa-solid fa-star" style={{ color: "#6366f1" }}></i>
            <span>
              <strong>Atomic Habits</strong> top borrowed
            </span>
          </div>
          <div className={styles.floatCard}>
            <i
              className="fa-solid fa-user-plus"
              style={{ color: "#10b981" }}
            ></i>
            <span>
              <strong>12</strong> new members this week
            </span>
          </div>
        </div>
      </section>

      {/* _______ DASHBOARD / CHART PANEL _______ */}
      <section className={styles.dashboardSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Analytics</span>
          <h2>Library Dashboard</h2>
          <div className={styles.underline} />
          <p className={styles.sectionSubtitle}>
            Real-time insights into your collection and circulation data
          </p>
        </div>

        <div className={styles.dashboardGrid}>
          {/* KPI Row */}
          <div className={styles.kpiRow}>
            <div className={styles.kpiCard}>
              <div
                className={styles.kpiIcon}
                style={{
                  background: "rgba(99,102,241,0.15)",
                  color: "#6366f1",
                }}
              >
                <i className="fa-solid fa-book"></i>
              </div>
              <div>
                <h3>5,248</h3>
                <p>Total Books</p>
                <span className={styles.kpiBadge} style={{ color: "#10b981" }}>
                  ↑ 3.2% this month
                </span>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div
                className={styles.kpiIcon}
                style={{
                  background: "rgba(16,185,129,0.15)",
                  color: "#10b981",
                }}
              >
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <h3>1,247</h3>
                <p>Active Members</p>
                <span className={styles.kpiBadge} style={{ color: "#10b981" }}>
                  ↑ 1.8% this month
                </span>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div
                className={styles.kpiIcon}
                style={{
                  background: "rgba(245,158,11,0.15)",
                  color: "#f59e0b",
                }}
              >
                <i className="fa-solid fa-hand-holding-heart"></i>
              </div>
              <div>
                <h3>1,620</h3>
                <p>Issued Feb 2026</p>
                <span className={styles.kpiBadge} style={{ color: "#10b981" }}>
                  ↑ 9.4% vs Jan
                </span>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div
                className={styles.kpiIcon}
                style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}
              >
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div>
                <h3>38</h3>
                <p>Overdue Books</p>
                <span className={styles.kpiBadge} style={{ color: "#ef4444" }}>
                  ↑ 5 from last week
                </span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className={styles.chartsRow}>
            {/* Line Chart – Circulation Trend */}
            <div className={styles.chartCard + " " + styles.chartLarge}>
              <div className={styles.chartCardHeader}>
                <h4>
                  <i className="fa-solid fa-chart-line"></i> Circulation Trend
                </h4>
                <span className={styles.chartBadge}>Aug 2025 – Feb 2026</span>
              </div>
              <div className={styles.chartBody}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>

            {/* Doughnut – Genre Distribution */}
            <div className={styles.chartCard}>
              <div className={styles.chartCardHeader}>
                <h4>
                  <i className="fa-solid fa-chart-pie"></i> Category
                  Distribution
                </h4>
                <span className={styles.chartBadge}>30 books</span>
              </div>
              <div className={styles.chartBody}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>

            {/* Bar Chart – Books Per Category */}
            <div className={styles.chartCard + " " + styles.chartLarge}>
              <div className={styles.chartCardHeader}>
                <h4>
                  <i className="fa-solid fa-chart-bar"></i> Books by Category
                </h4>
                <span className={styles.chartBadge}>Collection breakdown</span>
              </div>
              <div className={styles.chartBody}>
                <Bar
                  data={barData}
                  options={chartOptions("Books by Category")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* _______ BOOK SLIDER _______ */}
      <section className={styles.sliderSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Collection</span>
          <h2>Browse All Books</h2>
          <div className={styles.underline} />
          <p className={styles.sectionSubtitle}>
            Swipe through our curated collection of {allBooks.length} titles
          </p>
        </div>

        <div className={styles.swiperWrapper}>
          <Swiper
            modules={[Autoplay, EffectCoverflow, Navigation, Pagination]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 180,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 2800,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={true}
            pagination={{ clickable: true }}
            loop={true}
            className={styles.mySwiper}
          >
            {allBooks.map((book) => (
              <SwiperSlide key={book.id} className={styles.swiperSlide}>
                <div className={styles.sliderCard}>
                  <div className={styles.sliderImgWrap}>
                    <img src={book.img} alt={book.title} />
                    <div className={styles.sliderHoverOverlay}>
                      <div className={styles.sliderMeta}>
                        <span className={styles.categoryTag}>
                          {book.category}
                        </span>
                        <div className={styles.rating}>
                          <i className="fa-solid fa-star"></i>
                          {book.rating}
                        </div>
                      </div>
                      <button className={styles.sliderViewBtn}>
                        <i className="fa-solid fa-eye"></i> View Details
                      </button>
                    </div>
                  </div>
                  <div className={styles.sliderInfo}>
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                    <span>{book.year}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      {/* _______ FEATURES _______ */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Platform</span>
          <h2>System Features</h2>
          <div className={styles.underline} />
        </div>
        <div className={styles.featuresGrid}>
          {[
            {
              icon: "fa-solid fa-book-open",
              title: "Book Management",
              desc: "Seamlessly add, update, and organize your vast collection of books with powerful search and filters.",
            },
            {
              icon: "fa-solid fa-users",
              title: "Member Profiles",
              desc: "Maintain detailed member records with high-end security, role-based access, and activity history.",
            },
            {
              icon: "fa-solid fa-clock-rotate-left",
              title: "Smart Tracking",
              desc: "Real-time tracking of issued, returned, and overdue books with automated reminder notifications.",
            },
            {
              icon: "fa-solid fa-shield-halved",
              title: "Admin Dashboard",
              desc: "Powerful role-based access control with detailed analytics, reports, and audit logs.",
            },
            {
              icon: "fa-solid fa-magnifying-glass",
              title: "Advanced Search",
              desc: "Full-text search across title, author, ISBN, Category with instant autocomplete and filters.",
            },
            {
              icon: "fa-solid fa-bell",
              title: "Smart Alerts",
              desc: "Automated due-date reminders, overdue notices, and new-arrival announcements.",
            },
          ].map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.iconBox}>
                <i className={f.icon}></i>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div className={styles.featureArrow}>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* _______ STATS COUNTERS _______ */}
      <section className={styles.statsSection}>
        <div className={styles.statsBg} />
        <StatCounter
          target={5248}
          suffix="+"
          label="Books Available"
          icon="fa-solid fa-swatchbook"
        />
        <StatCounter
          target={17}
          suffix="+"
          label="Active Members"
          icon="fa-solid fa-user-graduate"
        />
        <StatCounter
          target={15820}
          suffix="+"
          label="Books Issued"
          icon="fa-solid fa-hand-holding-hand"
        />
        <StatCounter
          target={30}
          suffix=""
          label="Categories"
          icon="fa-solid fa-layer-group"
        />
      </section>
    </div>
  );
}
export default Home;
