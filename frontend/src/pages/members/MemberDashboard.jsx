import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/MemberDashboard.module.css";

/**
 * MemberDashboard — member's landing page after login.
 * Part 1: clean shell with real user data from AuthContext.
 * Part 2: will wire real endpoints for issued books, due dates, fines.
 */
export default function MemberDashboard() {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Welcome back, {user?.first_name ?? "Member"}
        </h1>
        <p className={styles.sub}>Here's your library activity at a glance.</p>
      </header>

      <section className={styles.grid}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Books issued</span>
          <span className={styles.cardValue}>—</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Due soon</span>
          <span className={styles.cardValue}>—</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Outstanding fine</span>
          <span className={styles.cardValue}>—</span>
        </div>
      </section>

      <p className={styles.note}>
        Book history and fine details are coming in the next update.
      </p>
    </div>
  );
}
