import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import styles from "./Bookslib.module.css";
import { allBooks } from "../../../utils/books/bookdata";
import {
  filterBooks,
  FILTER_LABELS,
  FILTER_DESCRIPTIONS,
} from "../../../utils/books/bookFilters";

/* ─────────── per-filter theme config ─────────── */
const FILTER_META = {
  "": {
    icon: "fa-solid fa-layer-group",
    badge: "Full Collection",
    color: "#1088ff",
    heroGlow: "rgba(16,136,255,0.08)",
    title: (
      <>
        Browse <span className={styles.accent}>Books</span>
      </>
    ),
  },
  new: {
    icon: "fa-solid fa-wand-magic-sparkles",
    badge: "Fresh In",
    color: "#22c55e",
    heroGlow: "rgba(34,197,94,0.07)",
    title: (
      <>
        New <span className={styles.accent}>Arrivals</span>
      </>
    ),
  },
  trending: {
    icon: "fa-solid fa-fire-flame-curved",
    badge: "Trending",
    color: "#f97316",
    heroGlow: "rgba(249,115,22,0.08)",
    title: (
      <>
        Trending <span className={styles.accent}>Now</span>
      </>
    ),
  },
  top: {
    icon: "fa-solid fa-trophy",
    badge: "Elite Tier",
    color: "#fbbf24",
    heroGlow: "rgba(251,191,36,0.08)",
    title: (
      <>
        Top <span className={styles.accent}>Rated</span>
      </>
    ),
  },
};

/* ─────────── categories (derive from data or hard-code) ─────────── */
const CATEGORIES = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Biography",
  "Fantasy",
  "Mystery",
];

/* ─────────── stars ─────────── */
const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className={styles.stars} title={`${rating} / 5`}>
      {Array.from({ length: full }, (_, i) => (
        <i key={i} className="fa-solid fa-star" />
      ))}
      {half && <i className="fa-solid fa-star-half-stroke" />}
      <span className={styles.ratingNum}>{rating}</span>
    </span>
  );
};

/* ════════════════════ MAIN COMPONENT ════════════════════ */
export default function BooksLib() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") ?? "";

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  /* Reset local state whenever the filter route changes */
  useEffect(() => {
    setSearchQuery("");
    setCategory("All");
  }, [filter]);

  const meta = FILTER_META[filter] ?? FILTER_META[""];
  const description = FILTER_DESCRIPTIONS[filter] ?? FILTER_DESCRIPTIONS[""];

  /* Show category strip only on browse & new-arrivals views */
  const showCategories = filter === "" || filter === "new";

  const books = useMemo(
    () => filterBooks(allBooks, { search: searchQuery, category, filter }),
    [searchQuery, category, filter],
  );

  return (
    <div className={styles.pageContainer}>
      {/* ══ HERO ══ */}
      <header
        className={styles.hero}
        style={{
          "--accent-color": meta.color,
          "--glow-color": meta.heroGlow,
        }}
      >
        {/* ambient glow layer */}
        <div className={styles.heroGlow} />

        <div
          className={styles.heroBadge}
          style={{
            background: `${meta.color}1a`,
            borderColor: `${meta.color}4d`,
            color: meta.color,
          }}
        >
          <i className={meta.icon} /> {meta.badge}
        </div>

        <h1 className={styles.heroTitle}>{meta.title}</h1>
        <p className={styles.heroSub}>{description}</p>

        {/* ── Quick-nav tabs (all four views) ── */}
        <nav className={styles.quickNav} aria-label="Library sections">
          {Object.entries(FILTER_LABELS).map(([key, label]) => {
            const m = FILTER_META[key];
            const isActive = filter === key;
            return (
              <Link
                key={key}
                to={key ? `/library?filter=${key}` : "/library"}
                className={`${styles.navTab} ${isActive ? styles.navTabActive : ""}`}
                style={isActive ? { "--tab-color": m.color } : {}}
                aria-current={isActive ? "page" : undefined}
              >
                <i className={m.icon} />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* ══ TOOLBAR ══ */}
      <div className={styles.toolbar}>
        {/* Category strip */}
        {showCategories && (
          <div className={styles.catStrip}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.catBtn} ${category === cat ? styles.catBtnActive : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search books, authors…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search books"
          />
          {searchQuery && (
            <button
              className={styles.clearBtn}
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>
      </div>

      {/* ══ COUNT ══ */}
      <div className={styles.countRow}>
        <strong>{books.length}</strong> book{books.length !== 1 ? "s" : ""}{" "}
        found
      </div>

      {/* ══ GRID ══ */}
      <div className={styles.grid}>
        {books.length > 0 ? (
          books.map((book, i) => (
            <article
              key={book.id}
              className={styles.card}
              style={{ animationDelay: `${i * 0.045}s` }}
            >
              {/* Rank badge — only for rated views */}
              {(filter === "trending" || filter === "top") && (
                <span className={styles.rankBadge}>#{i + 1}</span>
              )}

              {/* Cover */}
              <div className={styles.cover}>
                <img src={book.img} alt={book.title} loading="lazy" />
                <div className={styles.coverOverlay}>
                  <button className={styles.viewBtn}>
                    <i className="fa-solid fa-eye" /> View
                  </button>
                </div>
                <span className={styles.catBadge}>{book.category}</span>
              </div>

              {/* Details */}
              <div className={styles.details}>
                <h3 className={styles.title}>{book.title}</h3>
                <p className={styles.author}>
                  <i className="fa-solid fa-user-pen" /> {book.author}
                </p>
                <Stars rating={book.rating} />
                <div className={styles.cardFooter}>
                  <span className={styles.year}>
                    <i className="fa-regular fa-calendar" /> {book.year}
                  </span>
                  <button className={styles.borrowBtn}>
                    <i className="fa-solid fa-hand-holding" /> Borrow
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className={styles.empty}>
            <i className="fa-solid fa-face-sad-tear" />
            <h3>No results</h3>
            <p>Try a different search term or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
