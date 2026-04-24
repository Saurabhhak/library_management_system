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
import bannerImg from "../../assets/bannerImg.png";

/* ── Import all book covers ── */
import Nineteen_Eighty_Four from "../../assets/BookLib/Nineteen_Eighty_Four.jpg";
import To_Kill_a_Mockingbird from "../../assets/BookLib/To_Kill_a_Mockingbird.jpg";
import The_Great_Gatsby from "../../assets/BookLib/The_Great_Gatsby.jpg";
import A_Brief_History_of_Time from "../../assets/BookLib/A_Brief_History_of_Time.jpg";
import The_Selfish_Gene from "../../assets/BookLib/The_Selfish_Gene.jpg";
import Cosmos from "../../assets/BookLib/Cosmos.jpg";
import Clean_Code from "../../assets/BookLib/Clean_Code.jpg";
import The_Pragmatic_Programmer from "../../assets/BookLib/The_Pragmatic_Programmer.jpg";
import Design_Patterns from "../../assets/BookLib/Design_Patterns.jpg";
import Eloquent_JavaScript from "../../assets/BookLib/Eloquent_JavaScript.jpg";
import Learning_React from "../../assets/BookLib/Learning_React.jpg";
import Nodejs_Design_Patterns from "../../assets/BookLib/Nodejs_Design_Patterns.jpg";
import Thinking_Fast_and_Slow from "../../assets/BookLib/Thinking_Fast_and_Slow.jpg";
import Man_s_Search_for_Meaning from "../../assets/BookLib/Man_s_Search_for_Meaning.jpg";
import The_Power_of_Habit from "../../assets/BookLib/The_Power_of_Habit.jpg";
import Atomic_Habits from "../../assets/BookLib/Atomic_Habits.jpg";
import The_7_Habits_of_Highly_Effective_People from "../../assets/BookLib/The_7_Habits_of_Highly_Effective_People.jpg";
import How_to_Win_and_Influence_People from "../../assets/BookLib/How_to_Win_and_Influence_People.jpg";
import Meditations from "../../assets/BookLib/Meditations.jpg";
import Beyond_Good_and_Evil from "../../assets/BookLib/Beyond_Good_and_Evil.jpg";
import Sapiens_A_Brief_History_of_Humankind from "../../assets/BookLib/Sapiens_A_Brief_History_of_Humankind.jpg";
import Guns_Germs_and_Steel from "../../assets/BookLib/Guns_Germs_and_Steel.jpg";
import The_Wealth_of_Nations from "../../assets/BookLib/The_Wealth_of_Nations.jpg";
import Freakonomics from "../../assets/BookLib/Freakonomics.jpg";
import Gödel_Escher_Bach from "../../assets/BookLib/Gödel_Escher_Bach.jpg";
import Flatland_A_Romance_of_Many_Dimensions from "../../assets/BookLib/Flatland_A_Romance_of_Many_Dimensions.jpg";
import War_and_Peace from "../../assets/BookLib/War_and_Peace.jpg";
import One_Hundred_Years_of_Solitude from "../../assets/BookLib/One_Hundred_Years_of_Solitude.jpg";
import The_Brothers_Karamazov from "../../assets/BookLib/The_Brothers_Karamazov.jpg";
import Pride_and_Prejudice from "../../assets/BookLib/Pride_and_Prejudice.jpg";

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
  Legend
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

/* ── Book data ── */
const allBooks = [
  { id: 1,  title: "1984",                               author: "George Orwell",        genre: "Fiction",    img: Nineteen_Eighty_Four,                  year: 1949, rating: 4.8 },
  { id: 2,  title: "To Kill a Mockingbird",              author: "Harper Lee",           genre: "Fiction",    img: To_Kill_a_Mockingbird,                 year: 1960, rating: 4.7 },
  { id: 3,  title: "The Great Gatsby",                   author: "F. Scott Fitzgerald",  genre: "Fiction",    img: The_Great_Gatsby,                      year: 1925, rating: 4.5 },
  { id: 4,  title: "A Brief History of Time",            author: "Stephen Hawking",      genre: "Science",    img: A_Brief_History_of_Time,               year: 1988, rating: 4.6 },
  { id: 5,  title: "The Selfish Gene",                   author: "Richard Dawkins",      genre: "Science",    img: The_Selfish_Gene,                      year: 1976, rating: 4.4 },
  { id: 6,  title: "Cosmos",                             author: "Carl Sagan",           genre: "Science",    img: Cosmos,                                year: 1980, rating: 4.7 },
  { id: 7,  title: "Clean Code",                         author: "Robert C. Martin",     genre: "Technology", img: Clean_Code,                            year: 2008, rating: 4.6 },
  { id: 8,  title: "The Pragmatic Programmer",           author: "Hunt & Thomas",        genre: "Technology", img: The_Pragmatic_Programmer,              year: 1999, rating: 4.5 },
  { id: 9,  title: "Design Patterns",                    author: "GoF",                  genre: "Technology", img: Design_Patterns,                       year: 1994, rating: 4.4 },
  { id: 10, title: "Eloquent JavaScript",                author: "Marijn Haverbeke",     genre: "Technology", img: Eloquent_JavaScript,                   year: 2018, rating: 4.5 },
  { id: 11, title: "Learning React",                     author: "Alex Banks",           genre: "Technology", img: Learning_React,                        year: 2020, rating: 4.3 },
  { id: 12, title: "Node.js Design Patterns",            author: "Mario Casciaro",       genre: "Technology", img: Nodejs_Design_Patterns,                year: 2020, rating: 4.4 },
  { id: 13, title: "Thinking, Fast and Slow",            author: "Daniel Kahneman",      genre: "Psychology", img: Thinking_Fast_and_Slow,                year: 2011, rating: 4.6 },
  { id: 14, title: "Man's Search for Meaning",           author: "Viktor Frankl",        genre: "Psychology", img: Man_s_Search_for_Meaning,              year: 1946, rating: 4.8 },
  { id: 15, title: "The Power of Habit",                 author: "Charles Duhigg",       genre: "Psychology", img: The_Power_of_Habit,                    year: 2012, rating: 4.5 },
  { id: 16, title: "Atomic Habits",                      author: "James Clear",          genre: "Self-Help",  img: Atomic_Habits,                         year: 2018, rating: 4.9 },
  { id: 17, title: "7 Habits of Highly Effective People",author: "Stephen Covey",        genre: "Self-Help",  img: The_7_Habits_of_Highly_Effective_People,year: 1989, rating: 4.7 },
  { id: 18, title: "How to Win Friends",                 author: "Dale Carnegie",        genre: "Self-Help",  img: How_to_Win_and_Influence_People,       year: 1936, rating: 4.6 },
  { id: 19, title: "Meditations",                        author: "Marcus Aurelius",      genre: "Philosophy", img: Meditations,                           year: 180,  rating: 4.8 },
  { id: 20, title: "Beyond Good and Evil",               author: "Friedrich Nietzsche",  genre: "Philosophy", img: Beyond_Good_and_Evil,                  year: 1886, rating: 4.4 },
  { id: 21, title: "Sapiens",                            author: "Yuval Noah Harari",    genre: "History",    img: Sapiens_A_Brief_History_of_Humankind,  year: 2011, rating: 4.7 },
  { id: 22, title: "Guns, Germs and Steel",              author: "Jared Diamond",        genre: "History",    img: Guns_Germs_and_Steel,                  year: 1997, rating: 4.6 },
  { id: 23, title: "The Wealth of Nations",              author: "Adam Smith",           genre: "Economics",  img: The_Wealth_of_Nations,                 year: 1776, rating: 4.3 },
  { id: 24, title: "Freakonomics",                       author: "Levitt & Dubner",      genre: "Economics",  img: Freakonomics,                          year: 2005, rating: 4.5 },
  { id: 25, title: "Gödel, Escher, Bach",                author: "Douglas Hofstadter",   genre: "Mathematics",img: Gödel_Escher_Bach,                     year: 1979, rating: 4.6 },
  { id: 26, title: "Flatland",                           author: "Edwin Abbott",         genre: "Mathematics",img: Flatland_A_Romance_of_Many_Dimensions, year: 1884, rating: 4.4 },
  { id: 27, title: "War and Peace",                      author: "Leo Tolstoy",          genre: "Fiction",    img: War_and_Peace,                         year: 1869, rating: 4.6 },
  { id: 28, title: "One Hundred Years of Solitude",      author: "Gabriel García Márquez",genre: "Fiction",   img: One_Hundred_Years_of_Solitude,         year: 1967, rating: 4.7 },
  { id: 29, title: "The Brothers Karamazov",             author: "Fyodor Dostoevsky",    genre: "Fiction",    img: The_Brothers_Karamazov,                year: 1880, rating: 4.8 },
  { id: 30, title: "Pride and Prejudice",                author: "Jane Austen",          genre: "Fiction",    img: Pride_and_Prejudice,                   year: 1813, rating: 4.7 },
];

/* ── Genre count for doughnut chart ── */
const genreCounts = allBooks.reduce((acc, b) => {
  acc[b.genre] = (acc[b.genre] || 0) + 1;
  return acc;
}, {});

const doughnutData = {
  labels: Object.keys(genreCounts),
  datasets: [{
    data: Object.values(genreCounts),
    backgroundColor: PALETTE,
    borderColor: "#0d1117",
    borderWidth: 3,
    hoverOffset: 8,
  }],
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
  datasets: [{
    label: "Books in Collection",
    data: Object.values(genreCounts),
    backgroundColor: PALETTE.map((c) => c + "cc"),
    borderColor: PALETTE,
    borderWidth: 2,
    borderRadius: 6,
    borderSkipped: false,
  }],
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
    x: { ticks: { color: "#8b949e", font: { size: 10 } }, grid: { color: "#21262d" } },
    y: { ticks: { color: "#8b949e", font: { size: 10 } }, grid: { color: "#21262d" } },
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
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
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
      <h2>{count.toLocaleString()}{suffix}</h2>
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

      {/* ══════════ HERO BANNER ══════════ */}
      <section className={styles.bannerWrapper}>
        <div
          className={styles.bannerBackground}
          style={{ backgroundImage: `url(${bannerImg})` }}
        />
        <div className={styles.bannerOverlay} />

        <div className={styles.bannerContent}>
          <span className={styles.badgeLabel}>
            <i className="fa-solid fa-circle-dot"></i> Live System · Feb 2026
          </span>
          <h1 className={styles.animateText}>
            Library<br />
            <span className={styles.accentText}>Management</span><br />
            System
          </h1>
          <p className={styles.animateTextDelay}>
            Discover, manage, and track an entire world of knowledge — with
            an elegant, blazing-fast digital experience.
          </p>
          <div className={styles.animateBtn}>
            <Link to="/bookslib">
              <button className={styles.ctaBtn}>
                Explore Library <i className="fa-solid fa-arrow-right"></i>
              </button>
            </Link>
            <Link to="/memberinventory">
              <button className={styles.ctaOutlineBtn}>
                View Members
              </button>
            </Link>
          </div>
        </div>

        {/* Floating quick-stats badges on banner */}
        <div className={styles.bannerFloatCards}>
          <div className={styles.floatCard}>
            <i className="fa-solid fa-fire" style={{ color: "#f59e0b" }}></i>
            <span><strong>248</strong> books issued today</span>
          </div>
          <div className={styles.floatCard}>
            <i className="fa-solid fa-star" style={{ color: "#6366f1" }}></i>
            <span><strong>Atomic Habits</strong> top borrowed</span>
          </div>
          <div className={styles.floatCard}>
            <i className="fa-solid fa-user-plus" style={{ color: "#10b981" }}></i>
            <span><strong>12</strong> new members this week</span>
          </div>
        </div>
      </section>

      {/* ══════════ DASHBOARD / CHART PANEL ══════════ */}
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
              <div className={styles.kpiIcon} style={{ background: "rgba(99,102,241,0.15)", color: "#6366f1" }}>
                <i className="fa-solid fa-book"></i>
              </div>
              <div>
                <h3>5,248</h3>
                <p>Total Books</p>
                <span className={styles.kpiBadge} style={{ color: "#10b981" }}>↑ 3.2% this month</span>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <h3>1,247</h3>
                <p>Active Members</p>
                <span className={styles.kpiBadge} style={{ color: "#10b981" }}>↑ 1.8% this month</span>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>
                <i className="fa-solid fa-hand-holding-heart"></i>
              </div>
              <div>
                <h3>1,620</h3>
                <p>Issued Feb 2026</p>
                <span className={styles.kpiBadge} style={{ color: "#10b981" }}>↑ 9.4% vs Jan</span>
              </div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiIcon} style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div>
                <h3>38</h3>
                <p>Overdue Books</p>
                <span className={styles.kpiBadge} style={{ color: "#ef4444" }}>↑ 5 from last week</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className={styles.chartsRow}>
            {/* Line Chart – Circulation Trend */}
            <div className={styles.chartCard + " " + styles.chartLarge}>
              <div className={styles.chartCardHeader}>
                <h4><i className="fa-solid fa-chart-line"></i> Circulation Trend</h4>
                <span className={styles.chartBadge}>Aug 2025 – Feb 2026</span>
              </div>
              <div className={styles.chartBody}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>

            {/* Doughnut – Genre Distribution */}
            <div className={styles.chartCard}>
              <div className={styles.chartCardHeader}>
                <h4><i className="fa-solid fa-chart-pie"></i> Genre Distribution</h4>
                <span className={styles.chartBadge}>30 books</span>
              </div>
              <div className={styles.chartBody}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>

            {/* Bar Chart – Books Per Category */}
            <div className={styles.chartCard + " " + styles.chartLarge}>
              <div className={styles.chartCardHeader}>
                <h4><i className="fa-solid fa-chart-bar"></i> Books by Category</h4>
                <span className={styles.chartBadge}>Collection breakdown</span>
              </div>
              <div className={styles.chartBody}>
                <Bar data={barData} options={chartOptions("Books by Category")} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ BOOK SLIDER ══════════ */}
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
            autoplay={{ delay: 2800, disableOnInteraction: false, pauseOnMouseEnter: true }}
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
                        <span className={styles.genreTag}>{book.genre}</span>
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

      {/* ══════════ FEATURES ══════════ */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Platform</span>
          <h2>System Features</h2>
          <div className={styles.underline} />
        </div>

        <div className={styles.featuresGrid}>
          {[
            { icon: "fa-solid fa-book-open",         title: "Book Management",   desc: "Seamlessly add, update, and organize your vast collection of books with powerful search and filters." },
            { icon: "fa-solid fa-users",              title: "Member Profiles",   desc: "Maintain detailed member records with high-end security, role-based access, and activity history." },
            { icon: "fa-solid fa-clock-rotate-left",  title: "Smart Tracking",    desc: "Real-time tracking of issued, returned, and overdue books with automated reminder notifications." },
            { icon: "fa-solid fa-shield-halved",      title: "Admin Dashboard",   desc: "Powerful role-based access control with detailed analytics, reports, and audit logs." },
            { icon: "fa-solid fa-magnifying-glass",   title: "Advanced Search",   desc: "Full-text search across title, author, ISBN, genre with instant autocomplete and filters." },
            { icon: "fa-solid fa-bell",               title: "Smart Alerts",      desc: "Automated due-date reminders, overdue notices, and new-arrival announcements." },
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

      {/* ══════════ STATS COUNTERS ══════════ */}
      <section className={styles.statsSection}>
        <div className={styles.statsBg} />
        <StatCounter target={5248}  suffix="+"  label="Books Available"  icon="fa-solid fa-swatchbook" />
        <StatCounter target={1247}  suffix="+"  label="Active Members"   icon="fa-solid fa-user-graduate" />
        <StatCounter target={15820} suffix="+"  label="Books Issued"     icon="fa-solid fa-hand-holding-hand" />
        <StatCounter target={30}    suffix=""   label="Categories"       icon="fa-solid fa-layer-group" />
      </section>
    </div>
  );
}

export default Home;