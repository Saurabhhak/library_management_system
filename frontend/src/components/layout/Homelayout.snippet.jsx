/**
 * HomeLayout.jsx — SNIPPET
 *
 * The ONE change needed: attach { ref } from useScrollContext()
 * to whatever element has overflow-y: auto / scroll.
 * That makes ScrollToTop and ScrollToTopButton target the right element.
 */

import { Outlet } from "react-router-dom";
import { useScrollContext } from "../../pages/resources/ScrollContext"; // adjust path
import Sidebar from "./Sidebar";
import styles from "./HomeLayout.module.css";

function HomeLayout() {
  // ↓ Get the ref from context — attach it to the scrollable container
  const { ref } = useScrollContext();

  return (
    <div className={styles.layout}>
      <Sidebar />

      {/*
       * ✅ Add ref={ref} here — whichever element has overflow-y: auto/scroll.
       * This is the element ScrollToTop resets and ScrollToTopButton monitors.
       */}
      <main ref={ref} className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default HomeLayout;