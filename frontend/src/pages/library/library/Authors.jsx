import { useState, useMemo } from "react";
import styles from "./Authors.module.css";
import { getAuthors } from "../../../utils/books/bookdata";

/* ── Sort options ── */
const SORT_OPTIONS = [
  { value: "name", label: "Name A–Z" },
  { value: "rating", label: "Top Rated" },
  { value: "books", label: "Most Books" },
];

/* ── Stars ── */
const Stars = ({ rating }) => (
  <span className={styles.stars} title={`${rating} / 5`}>
    {Array.from({ length: Math.floor(rating) }, (_, i) => (
      <i key={i} className="fa-solid fa-star" />
    ))}
    {rating % 1 >= 0.5 && <i className="fa-solid fa-star-half-stroke" />}
    <span className={styles.ratingNum}>{rating}</span>
  </span>
);

/* ─────────────────── MAIN COMPONENT ─────────────────── */
function Authors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [expandedAuthor, setExpandedAuthor] = useState(null);

  const allAuthors = useMemo(() => getAuthors(), []);

  const authors = useMemo(() => {
    let result = [...allAuthors];

    /* search */
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q),
      );
    }

    /* sort */
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case "books":
        result.sort((a, b) => b.books.length - a.books.length);
        break;
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [allAuthors, searchQuery, sortBy]);

  const toggleExpand = (name) =>
    setExpandedAuthor((prev) => (prev === name ? null : name));

  /* Initials avatar */
  const getInitials = (name) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

  /* Colour from name */
  const getAvatarColor = (name) => {
    const colors = [
      "#1088ff",
      "#00c853",
      "#ff6b35",
      "#9b59b6",
      "#e74c3c",
      "#f39c12",
      "#1abc9c",
      "#3498db",
    ];
    const idx =
      name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
      colors.length;
    return colors[idx];
  };

  return (
    <div className={styles.pageContainer}>
      {/* ── HERO ── */}
      <header className={styles.hero}>
        <div className={styles.heroBadge}>
          <i className="fa-solid fa-feather-pointed" /> Meet the Authors
        </div>
        <h1 className={styles.heroTitle}>The Minds Behind the Books</h1>
        <p className={styles.heroSub}>
          {allAuthors.length} distinguished authors across{" "}
          {[...new Set(allAuthors.map((a) => a.category))].length} genres.
        </p>
      </header>

      {/* ── TOOLBAR ── */}
      <div className={styles.toolbar}>
        {/* Search */}
        <div className={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search authors or genre…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              className={styles.clearBtn}
              onClick={() => setSearchQuery("")}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className={styles.sortWrapper}>
          <label className={styles.sortLabel}>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── COUNT ── */}
      <div className={styles.countRow}>
        <span>
          Showing <strong>{authors.length}</strong> author
          {authors.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── GRID ── */}
      <div className={styles.grid}>
        {authors.length > 0 ? (
          authors.map((author, i) => {
            const isExpanded = expandedAuthor === author.name;
            const color = getAvatarColor(author.name);
            return (
              <article
                key={author.name}
                className={`${styles.card} ${isExpanded ? styles.expanded : ""}`}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {/* Avatar */}
                <div
                  className={styles.avatar}
                  style={{
                    background: `${color}22`,
                    border: `2px solid ${color}55`,
                  }}
                >
                  <span style={{ color }}>{getInitials(author.name)}</span>
                </div>

                {/* Main info */}
                <div className={styles.authorInfo}>
                  <h3 className={styles.authorName}>{author.name}</h3>
                  <span className={styles.authorCat}>{author.category}</span>
                  <Stars rating={author.avgRating} />

                  <div className={styles.statRow}>
                    <span className={styles.stat}>
                      <i className="fa-solid fa-book" />
                      {author.books.length} book
                      {author.books.length !== 1 ? "s" : ""}
                    </span>
                    <button
                      className={styles.expandBtn}
                      onClick={() => toggleExpand(author.name)}
                      title={isExpanded ? "Hide books" : "Show books"}
                    >
                      <i
                        className={`fa-solid ${
                          isExpanded ? "fa-chevron-up" : "fa-chevron-down"
                        }`}
                      />
                      {isExpanded ? "Hide" : "Books"}
                    </button>
                  </div>
                </div>

                {/* Expandable book list */}
                {isExpanded && (
                  <div className={styles.bookList}>
                    {author.books.map((b) => (
                      <div key={b.id} className={styles.bookRow}>
                        <img
                          src={b.img}
                          alt={b.title}
                          className={styles.bookThumb}
                          loading="lazy"
                        />
                        <div className={styles.bookRowInfo}>
                          <span className={styles.bookRowTitle}>{b.title}</span>
                          <span className={styles.bookRowMeta}>
                            {b.year} · ★ {b.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <div className={styles.empty}>
            <i className="fa-solid fa-face-sad-tear" />
            <h3>No authors found</h3>
            <p>Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Authors;
