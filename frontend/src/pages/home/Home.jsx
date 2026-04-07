import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import bannerImg from "../../assets/bannerImg.png";
import book1 from "../../assets/book-1.jpg";
import book2 from "../../assets/book-2.jpg";
import book3 from "../../assets/book-3.jpg";
import book4 from "../../assets/book-4.jpg";

const BANNER_IMAGE = bannerImg;

const popularBooks = [
  { 
    id: 1,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    img: book1,
  },
  {
    id: 2,
    title: "Art of Architecture",
    author: "Marcus Vitruvius",
    img: book2,
  },
  {
    id: 3,
    title: "Deep Space Mystery",
    author: "Carl Sagan",
    img: book3,
  },
  {
    id: 4,
    title: "Classical Literature",
    author: "Jane Austen",
    img: book4,
  },
];

function Home() {
  return (
    <div className={styles.homeContainer}>
      {/* ----- BANNER SECTION (Parallax & Glassmorphism) ----- */}
      <section className={styles.bannerWrapper}>
        <div
          className={styles.bannerBackground}
          style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
        ></div>
        <div className={styles.bannerOverlay}></div>

        <div className={styles.bannerContent}>
          <h1 className={styles.animateText}>Library Management System</h1>
          <p className={styles.animateTextDelay}>
            Discover, Manage, and Track Books with an elegant and seamless
            digital experience.
          </p>
          <div className={styles.animateBtn}>
            <Link to="/bookslib">
              <button className={styles.ctaBtn}>
                Explore Library <i className="fa-solid fa-arrow-right"></i>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ----- POPULAR BOOKS (3D Hover Effect) ----- */}
      <section className={styles.popularSection}>
        <div className={styles.sectionHeader}>
          <h2>Trending Books</h2>
          <div className={styles.underline}></div>
        </div>

        <div className={styles.bookGrid}>
          {popularBooks.map((book) => (
            <div key={book.id} className={styles.bookCard}>
              <div className={styles.imageWrapper}>
                <img src={book.img} alt={book.title} />
                <div className={styles.bookOverlay}>
                  <button className={styles.readBtn}>View Details</button>
                </div>
              </div>
              <div className={styles.bookInfo}>
                <h4>{book.title}</h4>
                <p>{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----- LMS FEATURES (Neon Glow & Smooth Slide) ----- */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2>System Features</h2>
          <div className={styles.underline}></div>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconBox}>
              <i className="fa-solid fa-book-open"></i>
            </div>
            <h3>Book Management</h3>
            <p>
              Seamlessly add, update, and organize your vast collection of
              books.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconBox}>
              <i className="fa-solid fa-users"></i>
            </div>
            <h3>Member Profiles</h3>
            <p>
              Maintain detailed member records with high-end security and ease.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconBox}>
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <h3>Smart Tracking</h3>
            <p>Real-time tracking of issued, returned, and overdue books.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconBox}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3>Admin Dashboard</h3>
            <p>Powerful role-based access control with detailed analytics.</p>
          </div>
        </div>
      </section>

      {/* ----- STATS SECTION (Premium Dark Card) ----- */}
      <section className={styles.statsSection}>
        <div className={styles.statBox}>
          <i className="fa-solid fa-swatchbook"></i>
          <h2>5,000+</h2>
          <p>Books Available</p>
        </div>
        <div className={styles.statBox}>
          <i className="fa-solid fa-user-graduate"></i>
          <h2>1,200+</h2>
          <p>Active Members</p>
        </div>
        <div className={styles.statBox}>
          <i className="fa-solid fa-hand-holding-hand"></i>
          <h2>15,000+</h2>
          <p>Books Issued</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
