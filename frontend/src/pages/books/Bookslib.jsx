import { useState } from "react";
import styles from "./Bookslib.module.css";
/* -------------- Import All The Books Images --------------- */
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

// ---------------- REAL BOOKS DATABASE (30 Books - All Categories)
const booksData = [
  // ----- FICTION -----
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    year: 1960,
    category: "Fiction",
    img: To_Kill_a_Mockingbird,
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    year: 1949,
    category: "Fiction",
    img: Nineteen_Eighty_Four,
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: 1925,
    category: "Fiction",
    img: The_Great_Gatsby,
  },

  // ----- SCIENCE -----
  {
    id: 4,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    year: 1988,
    category: "Science",
    img: A_Brief_History_of_Time,
  },
  {
    id: 5,
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    year: 1976,
    category: "Science",
    img: The_Selfish_Gene,
  },
  {
    id: 6,
    title: "Cosmos",
    author: "Carl Sagan",
    year: 1980,
    category: "Science",
    img: Cosmos,
  },

  // ----- TECHNOLOGIES -----
  {
    id: 7,
    title: "Clean Code",
    author: "Robert C. Martin",
    year: 2008,
    category: "Technologies",
    img: Clean_Code,
  },
  {
    id: 8,
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    year: 1999,
    category: "Technologies",
    img: The_Pragmatic_Programmer,
  },
  {
    id: 9,
    title: "Design Patterns",
    author: "Gang of Four",
    year: 1994,
    category: "Technologies",
    img: Design_Patterns,
  },

  // ----- COMPUTERS (Languages) -----
  {
    id: 10,
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    year: 2011,
    category: "Computers",
    img: Eloquent_JavaScript,
  },
  {
    id: 11,
    title: "Learning React",
    author: "Alex Banks & Eve Porcello",
    year: 2017,
    category: "Computers",
    img: Learning_React,
  },
  {
    id: 12,
    title: "Node.js Design Patterns",
    author: "Mario Casciaro",
    year: 2014,
    category: "Computers",
    img: Nodejs_Design_Patterns,
  },

  // ----- PSYCHOLOGY -----
  {
    id: 13,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    year: 2011,
    category: "Psychology",
    img: Thinking_Fast_and_Slow,
  },
  {
    id: 14,
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    year: 1946,
    category: "Psychology",
    img: Man_s_Search_for_Meaning,
  },
  {
    id: 15,
    title: "The Power of Habit",
    author: "Charles Duhigg",
    year: 2012,
    category: "Psychology",
    img: The_Power_of_Habit,
  },

  // ----- SELF HELP -----
  {
    id: 16,
    title: "Atomic Habits",
    author: "James Clear",
    year: 2018,
    category: "Self Help",
    img: Atomic_Habits,
  },
  {
    id: 17,
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    year: 1989,
    category: "Self Help",
    img: The_7_Habits_of_Highly_Effective_People,
  },
  {
    id: 18,
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    year: 1936,
    category: "Self Help",
    img: How_to_Win_and_Influence_People,
  },

  // ----- PHILOSOPHY -----
  {
    id: 19,
    title: "Meditations",
    author: "Marcus Aurelius",
    year: 180,
    category: "Philosophy",
    img: Meditations,
  },
  {
    id: 20,
    title: "Beyond Good and Evil",
    author: "Friedrich Nietzsche",
    year: 1886,
    category: "Philosophy",
    img: Beyond_Good_and_Evil,
  },

  // ----- HISTORY -----
  {
    id: 21,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    year: 2011,
    category: "History",
    img: Sapiens_A_Brief_History_of_Humankind,
  },
  {
    id: 22,
    title: "Guns Germs, and Steel",
    author: "Jared Diamond",
    year: 1997,
    category: "History",
    img: Guns_Germs_and_Steel,
  },

  // ----- ECONOMICS -----
  {
    id: 23,
    title: "The Wealth of Nations",
    author: "Adam Smith",
    year: 1776,
    category: "Economics",
    img: The_Wealth_of_Nations,
  },
  {
    id: 24,
    title: "Freakonomics",
    author: "Steven D. Levitt",
    year: 2005,
    category: "Economics",
    img: Freakonomics,
  },

  // ----- MATHEMATICS -----
  {
    id: 25,
    title: "Gödel, Escher, Bach",
    author: "Douglas Hofstadter",
    year: 1979,
    category: "Mathematics",
    img: Gödel_Escher_Bach,
  },
  {
    id: 26,
    title: "Flatland: A Romance of Many Dimensions",
    author: "Edwin A. Abbott",
    year: 1884,
    category: "Mathematics",
    img: Flatland_A_Romance_of_Many_Dimensions,
  },

  // ----- LITERATURE -----
  {
    id: 27,
    title: "War and Peace",
    author: "Leo Tolstoy",
    year: 1869,
    category: "Literature",
    img: War_and_Peace,
  },
  {
    id: 28,
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    year: 1967,
    category: "Literature",
    img: One_Hundred_Years_of_Solitude,
  },
  {
    id: 29,
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    year: 1880,
    category: "Literature",
    img: The_Brothers_Karamazov,
  },
  {
    id: 30,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: 1813,
    category: "Literature",
    img: Pride_and_Prejudice,
  },
];

// import  CATEGORIES
const categories = [
  "All",
  "Fiction",
  "Science",
  "Technologies",
  "Computers",
  "Psychology",
  "Self Help",
  "Philosophy",
  "History",
  "Economics",
  "Mathematics",
  "Literature",
];

/* ------------------ MAIN COMPONENT ----------------*/
function Bookslib() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter books based on category and search
  const filteredBooks = booksData.filter((book) => {
    const matchesCategory =
      activeCategory === "All" || book.category === activeCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.booksContainer}>
      {/* ----- HEADER SECTION ----- */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>
            <i className="fa-solid fa-book-open-reader"></i> Book Library
          </h1>
          <p>Explore our collection of {booksData.length}+ premium books</p>
        </div>

        {/* Search Bar */}
        <div className={styles.searchWrapper}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </header>

      {/* ----- CATEGORY FILTER TABS ----- */}
      <div className={styles.categoryWrapper}>
        <div className={styles.categoryTabs}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryBtn} ${
                activeCategory === category ? styles.active : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* ----- BOOKS COUNT ----- */}
      <div className={styles.resultsInfo}>
        <span>
          Showing <strong>{filteredBooks.length}</strong> books
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </span>
      </div>

      {/* ----- BOOKS GRID ----- */}
      <div className={styles.booksGrid}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <div
              key={book.id}
              className={styles.bookCard}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Book Image */}
              <div className={styles.imageContainer}>
                <img src={book.img} alt={book.title} loading="lazy" />
                <div className={styles.overlay}>
                  <button className={styles.viewBtn}>
                    <i className="fa-solid fa-eye"></i> View Details
                  </button>
                </div>
                <span className={styles.categoryBadge}>{book.category}</span>
              </div>

              {/* Book Info */}
              <div className={styles.bookInfo}>
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookAuthor}>
                  <i className="fa-solid fa-user-pen"></i> {book.author}
                </p>
                <div className={styles.bookMeta}>
                  <span className={styles.year}>
                    <i className="fa-regular fa-calendar"></i> {book.year}
                  </span>
                  <button className={styles.borrowBtn}>
                    <i className="fa-solid fa-hand-holding"></i> Borrow
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <i className="fa-solid fa-face-sad-tear"></i>
            <h3>No Books Found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default Bookslib;
