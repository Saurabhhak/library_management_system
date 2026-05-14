import styles from "./StatusPage.module.css";

const services = [
  { name: "API Server", status: "operational", latency: "42ms" },
  { name: "Database", status: "operational", latency: "8ms" },
  { name: "Authentication", status: "operational", latency: "55ms" },
  { name: "File Storage", status: "operational", latency: "120ms" },
  { name: "Email Notifications", status: "operational", latency: "—" },
];

const incidents = [
  {
    date: "Apr 15, 2026",
    title: "Scheduled maintenance",
    status: "resolved",
    desc: "Database migration completed. 12 minutes of read-only mode.",
  },
  {
    date: "Mar 2, 2026",
    title: "Elevated API latency",
    status: "resolved",
    desc: "Resolved after scaling the API server cluster. Duration: 23 minutes.",
  },
];

const STATUS_STYLES = {
  operational: {
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    label: "Operational",
    icon: "fa-solid fa-circle-check",
  },
  degraded: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    label: "Degraded",
    icon: "fa-solid fa-triangle-exclamation",
  },
  outage: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    label: "Outage",
    icon: "fa-solid fa-circle-xmark",
  },
};

export default function StatusPage() {
  const allGood = services.every((s) => s.status === "operational");

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.badge}>System Status</span>
        <br />
        <div
          className={styles.overallBadge}
          style={{
            background: allGood
              ? "rgba(16,185,129,0.15)"
              : "rgba(245,158,11,0.15)",
            borderColor: allGood
              ? "rgba(16,185,129,0.4)"
              : "rgba(245,158,11,0.4)",
          }}
        >
          <i
            className={`fa-solid fa-circle`}
            style={{
              color: allGood ? "#10b981" : "#f59e0b",
              fontSize: "0.5rem",
            }}
          ></i>
          <span style={{ color: allGood ? "#34d399" : "#fbbf24" }}>
            {allGood ? "All Systems Operational" : "Some Systems Degraded"}
          </span>
        </div>
        <p>Last checked: just now · Updates every 60 seconds</p>
      </div>

      <div className={styles.container}>
        {/* Services */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Services</h2>
          <div className={styles.serviceList}>
            {services.map((s) => {
              const ss = STATUS_STYLES[s.status];
              return (
                <div key={s.name} className={styles.serviceRow}>
                  <div className={styles.serviceName}>
                    <i className={ss.icon} style={{ color: ss.color }}></i>
                    {s.name}
                  </div>
                  <div className={styles.serviceRight}>
                    {s.latency !== "—" && (
                      <span className={styles.latency}>{s.latency}</span>
                    )}
                    <span
                      className={styles.statusPill}
                      style={{ background: ss.bg, color: ss.color }}
                    >
                      {ss.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Incidents */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Past Incidents</h2>
          {incidents.map((inc, i) => (
            <div key={i} className={styles.incident}>
              <div className={styles.incidentHeader}>
                <span className={styles.incidentTitle}>{inc.title}</span>
                <span className={styles.incidentResolved}>
                  <i className="fa-solid fa-circle-check"></i> Resolved
                </span>
              </div>
              <p className={styles.incidentDate}>{inc.date}</p>
              <p className={styles.incidentDesc}>{inc.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
