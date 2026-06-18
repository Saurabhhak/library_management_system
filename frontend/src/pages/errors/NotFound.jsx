import { useNavigate, Link } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
  const navigate = useNavigate();
  const canGoBack = window.history.length > 2; // false if user landed directly on 404

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <i className={`fa-solid fa-face-sad-tear ${styles.icon}`} />
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.subtitle}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className={styles.actions}>
          {/* Only show "Go Back" if there's real history to go back to */}
          {canGoBack && (
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => navigate(-1)}
            >
              <i className="fa-solid fa-arrow-left" /> Previous Page
            </button>
          )}

          <Link to="/home">
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              <i className="fa-solid fa-house" /> Go to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
