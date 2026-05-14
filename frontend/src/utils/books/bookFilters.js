// src/utils/bookFilters.js

/**
 * Central filter engine for all book pages.
 * Consumed by Bookslib, HighRatingBooks, Authors, and
 * any future page that needs to query allBooks.
 */

/* __________________________________________________
   MAIN FILTER FUNCTION
   options: { search, category, filter, page, limit }
   filter values: "new" | "trending" | "top"
_____________________________________________________*/
export const filterBooks = (books, options = {}) => {
  const { search = "", category = "All", filter = "" } = options;

  let result = [...books];

  /* ── SEARCH (id, title, author, year, category) ── */
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (b) =>
        b.id.toString().includes(q) ||
        b.year.toString().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q),
    );
  }

  /* ── CATEGORY ── */
  if (category !== "All") {
    result = result.filter((b) => b.category === category);
  }

  /* ── FILTER PRESETS ── */
  switch (filter) {
    case "new":
      // Sort newest publication year first
      result.sort((a, b) => b.year - a.year);
      break;

    case "trending":
      // Highly-rated (≥ 4.5) — all genres
      result = result.filter((b) => b.rating >= 4.5);
      result.sort((a, b) => b.rating - a.rating);
      break;

    case "top":
      // Elite tier (≥ 4.7)
      result = result.filter((b) => b.rating >= 4.7);
      result.sort((a, b) => b.rating - a.rating);
      break;

    default:
      break;
  }

  return result;
};

/* __________________________________________________
   RECOMMENDATION ENGINE
   Returns personalised picks based on member's favourite
   category. Falls back to the six highest-rated books.
_____________________________________________________*/
export const getRecommendedBooks = (books, member) => {
  if (!member?.favoriteCategory) {
    return [...books].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }

  return books
    .filter((b) => b.category === member.favoriteCategory)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
};

/* __________________________________________________
   LABEL MAP  — maps a URL filter param → human-readable title
   Use in page <h1> / breadcrumbs
_____________________________________________________*/
export const FILTER_LABELS = {
  new: "New Arrivals",
  trending: "Trending Now",
  top: "High Rating Books",
  "": "Browse Books",
};

/* __________________________________________________
   FILTER DESCRIPTIONS — subtitle shown below page heading
_____________________________________________________*/
export const FILTER_DESCRIPTIONS = {
  new: "Sorted by most recently published",
  trending: "Books with a rating of 4.5 ★ and above",
  top: "The elite tier — rated 4.7 ★ or higher",
  "": "Explore our complete collection",
};
