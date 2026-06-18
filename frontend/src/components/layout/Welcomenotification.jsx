import { useEffect, useState } from "react";
import styles from "./WelcomeNotification.module.css";

/**
 * WelcomeNotification Component
 * Shows a subtle, professional welcome message when user signs up
 * Automatically dismisses after 5 seconds or when user clicks close
 */
function WelcomeNotification({ userName = "Member", onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  },[]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.notificationContainer} ${isExiting ? styles.exiting : styles.entering}`}
    >
      <div className={styles.notification}>
        <div className={styles.iconWrapper}>
          <i className="fa-solid fa-check-circle"></i>
        </div>

        <div className={styles.content}>
          <h3>Welcome to LibraryHub, {userName}!</h3>
          <p>
            Your account has been created successfully. Let's explore the
            collection.
          </p>
        </div>

        <button
          className={styles.closeBtn}
          onClick={handleDismiss}
          aria-label="Close notification"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      </div>
    </div>
  );
}

export default WelcomeNotification;
