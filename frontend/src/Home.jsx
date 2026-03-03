import BannerImage from "./assets/BannerImage.png";
import BImg from "./assets/BImg.jpg";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      {/* -----  BANNER SECTION -----  */}
      <section className={styles.bannerWrapper}>
        <img
          src={BannerImage}
          alt="Library Banner"
          className={styles.bannerImage}
        />

        <div className={styles.bannertitle}>
          <h1>Library Management System</h1>
          <p>Manage Books, Members & Records Efficiently</p>
          <Link to="/books">
            <button className={styles.ctaBtn}>Browse Books</button>
          </Link>
        </div>
      </section>

      {/* -----  POPULAR BOOKS -----  */}
      <section className={styles.popularSection}>
        <h2>Popular Books</h2>
        <div className={styles.bookGrid}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className={styles.bookCard}>
              <img src={BImg} alt="Book" />
              <h4>Book Title</h4>
              <p>Author Name</p>
            </div>
          ))}
        </div>
      </section>

      {/* -----  LMS FEATURES -----  */}
      <section className={styles.featuresSection}>
        <h2>System Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3>📚 Book Management</h3>
            <p>Add, update and organize books easily.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>👥 Member Management</h3>
            <p>Maintain member records securely.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>📊 Issue & Return Tracking</h3>
            <p>Track borrowed and returned books.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>🔐 Admin Dashboard</h3>
            <p>Role-based secure system access.</p>
          </div>
        </div>
      </section>
      {/* -----  STATS SECTION -----  */}
      <section className={styles.statsSection}>
        <div>
          <h2>500+</h2>
          <p>Books</p>
        </div>
        <div>
          <h2>200+</h2>
          <p>Members</p>
        </div>
        <div>
          <h2>1000+</h2>
          <p>Books Issued</p>
        </div>
      </section>
    </>
  );
}

export default Home;
