import { useState, useEffect, useCallback } from "react";
import { useScrollContext } from "./ScrollContext";
import styles from "./Scrolltotopbutton.module.css";

/**
 * ScrollToTopButton
 * Floating button — appears after scrolling 300px, smooth scroll back to top.
 * Place once in App.jsx (inside <ScrollProvider>).
 */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const { ref, scrollToTop, getScrollY } = useScrollContext();

  // listen on the correct scroll target
  const handleScroll = useCallback(() => {
    setVisible(getScrollY() > 300);
  }, [getScrollY]);

  useEffect(() => {
    const el = ref.current ?? window;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [ref, handleScroll]);

  return (
    <button
      className={`${styles.btn} ${visible ? styles.show : ""}`}
      onClick={() => scrollToTop("smooth")}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <i className="fa-solid fa-chevron-up" />
    </button>
  );
}

export default ScrollToTopButton;
