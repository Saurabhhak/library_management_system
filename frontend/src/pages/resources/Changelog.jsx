import styles from "./Changelog.module.css";

const changes = [
  {
    version: "v2.1.0",
    date: "April 2026",
    type: "release",
    changes: [
      { type: "new",  text: "HTTP-only cookie auth with refresh token rotation" },
      { type: "new",  text: "Heartbeat endpoint for real-time last_seen tracking" },
      { type: "fix",  text: "Fixed token expiry not clearing session on frontend" },
      { type: "improve", text: "Axios interceptor now queues parallel requests during token refresh" },
    ],
  },
  {
    version: "v2.0.0",
    date: "February 2026",
    type: "major",
    changes: [
      { type: "new",  text: "Complete UI redesign with dark theme" },
      { type: "new",  text: "Footer with resource pages (Docs, API Reference, Status)" },
      { type: "new",  text: "Book library with category filters and ratings" },
      { type: "improve", text: "Footer links reorganized and corrected" },
    ],
  },
  {
    version: "v1.5.0",
    date: "December 2025",
    type: "release",
    changes: [
      { type: "new",  text: "Member portal with issue and return workflows" },
      { type: "new",  text: "Book management CRUD with image upload" },
      { type: "fix",  text: "Admin role check on protected routes" },
    ],
  },
  {
    version: "v1.0.0",
    date: "October 2025",
    type: "release",
    changes: [
      { type: "new", text: "Initial release of LibraryMS" },
      { type: "new", text: "Admin authentication with JWT" },
      { type: "new", text: "Basic book and member management" },
    ],
  },
];

const CHANGE_STYLES = {
  new:     { icon: "fa-solid fa-plus",   color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "New" },
  fix:     { icon: "fa-solid fa-wrench", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Fix" },
  improve: { icon: "fa-solid fa-arrow-up", color: "#60a5fa", bg: "rgba(59,130,246,0.12)", label: "Improved" },
};

const VERSION_BADGE = {
  major:   { color: "#a78bfa", bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.3)" },
  release: { color: "#60a5fa", bg: "rgba(59,130,246,0.15)",  border: "rgba(59,130,246,0.3)" },
};

export default function Changelog() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.badge}>Changelog</span>
        <h1>What's New in LibraryMS</h1>
        <p>All notable changes, improvements, and fixes.</p>
      </div>

      <div className={styles.container}>
        {changes.map((entry, i) => {
          const vb = VERSION_BADGE[entry.type];
          return (
            <div key={i} className={styles.entry}>
              <div className={styles.entryMeta}>
                <span className={styles.version} style={{ color: vb.color, background: vb.bg, border: `1px solid ${vb.border}` }}>
                  {entry.version}
                </span>
                <span className={styles.date}>{entry.date}</span>
              </div>
              <div className={styles.entryCard}>
                {entry.changes.map((c, j) => {
                  const cs = CHANGE_STYLES[c.type];
                  return (
                    <div key={j} className={styles.changeItem}>
                      <span className={styles.changeTag} style={{ background: cs.bg, color: cs.color }}>
                        <i className={cs.icon}></i> {cs.label}
                      </span>
                      <span className={styles.changeText}>{c.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}