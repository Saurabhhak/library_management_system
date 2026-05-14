import styles from "./ApiReference.module.css";

const endpoints = [
  {
    group: "Authentication",
    color: "#f59e0b",
    routes: [
      { method: "POST", path: "/api/admin/login",         desc: "Login and receive access token + refresh cookie" },
      { method: "POST", path: "/api/admin/logout",        desc: "Logout and clear refresh cookie" },
      { method: "POST", path: "/api/admin/refresh-token", desc: "Obtain new access token via refresh cookie" },
      { method: "POST", path: "/api/admin/heartbeat",     desc: "Keep session alive (auth required)" },
    ],
  },
  {
    group: "Admin",
    color: "#8b5cf6",
    routes: [
      { method: "GET",    path: "/api/admin/profile",  desc: "Get logged-in admin profile" },
      { method: "GET",    path: "/api/admin",          desc: "List all admins" },
      { method: "POST",   path: "/api/admin",          desc: "Create a new admin" },
      { method: "GET",    path: "/api/admin/:id",      desc: "Get admin by ID" },
      { method: "PUT",    path: "/api/admin/:id",      desc: "Update admin" },
      { method: "DELETE", path: "/api/admin/:id",      desc: "Delete admin" },
      { method: "DELETE", path: "/api/admin/delete-account", desc: "Delete own account" },
    ],
  },
  {
    group: "Books",
    color: "#10b981",
    routes: [
      { method: "GET",    path: "/api/books",     desc: "Get all books" },
      { method: "POST",   path: "/api/books",     desc: "Create a book" },
      { method: "GET",    path: "/api/books/:id", desc: "Get book by ID" },
      { method: "PUT",    path: "/api/books/:id", desc: "Update book" },
      { method: "DELETE", path: "/api/books/:id", desc: "Delete book" },
    ],
  },
  {
    group: "Members",
    color: "#3b82f6",
    routes: [
      { method: "GET",    path: "/api/members",     desc: "Get all members" },
      { method: "POST",   path: "/api/members",     desc: "Create a member" },
      { method: "GET",    path: "/api/members/:id", desc: "Get member by ID" },
      { method: "PUT",    path: "/api/members/:id", desc: "Update member" },
      { method: "DELETE", path: "/api/members/:id", desc: "Delete member" },
    ],
  },
  {
    group: "Categories",
    color: "#ef4444",
    routes: [
      { method: "GET",    path: "/api/categories",     desc: "Get all categories" },
      { method: "POST",   path: "/api/categories",     desc: "Create a category" },
      { method: "PUT",    path: "/api/categories/:id", desc: "Update category" },
      { method: "DELETE", path: "/api/categories/:id", desc: "Delete category" },
    ],
  },
  {
    group: "Meta",
    color: "#64748b",
    routes: [
      { method: "GET", path: "/api/meta/states",           desc: "Get all states" },
      { method: "GET", path: "/api/meta/cities/:stateId",  desc: "Get cities by state" },
    ],
  },
];

const METHOD_COLORS = {
  GET:    { bg: "rgba(16,185,129,0.12)", color: "#10b981" },
  POST:   { bg: "rgba(59,130,246,0.12)", color: "#60a5fa" },
  PUT:    { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
  DELETE: { bg: "rgba(239,68,68,0.12)",  color: "#ef4444" },
};

export default function ApiReference() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.badge}>API Reference</span>
        <h1>REST API Reference</h1>
        <p>All endpoints require <code>Authorization: Bearer &lt;accessToken&gt;</code> except login and refresh.</p>
        <div className={styles.baseUrl}>
          <span className={styles.baseLabel}>Base URL</span>
          <code className={styles.urlLink}>https://library-management-system-jm0d.onrender.com</code>
        </div>
      </div>

      <div className={styles.container}>
        {endpoints.map((group) => (
          <section key={group.group} className={styles.group}>
            <div className={styles.groupHeader} style={{ borderLeftColor: group.color }}>
              <h2>{group.group}</h2>
              <span className={styles.routeCount}>{group.routes.length} endpoints</span>
            </div>
            <div className={styles.routeList}>
              {group.routes.map((r, i) => {
                const mc = METHOD_COLORS[r.method] || METHOD_COLORS.GET;
                return (
                  <div key={i} className={styles.route}>
                    <span className={styles.method} style={{ background: mc.bg, color: mc.color }}>
                      {r.method}
                    </span>
                    <code className={styles.path}>{r.path}</code>
                    <span className={styles.desc}>{r.desc}</span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}