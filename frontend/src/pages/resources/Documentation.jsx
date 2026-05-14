import styles from "./Documentation.module.css";
import { Link } from "react-router-dom";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "fa-solid fa-rocket",
    content:
      "LibraryMS is a full-featured library management system. Begin by logging in as an admin, then configure your library's book inventory, member database, and circulation settings.",
    steps: [
      "Create your admin account",
      "Add book categories",
      "Import or add books",
      "Register members",
      "Start issuing and returning books",
    ],
  },
  {
    id: "books",
    title: "Book Management",
    icon: "fa-solid fa-book",
    content:
      "Manage your entire book catalog from one place. Add books with full metadata, cover images, categories, and availability status.",
    steps: [
      "Navigate to Admin → Manage Books",
      "Click 'Add Book' and fill in details",
      "Assign a category and upload a cover",
      "Set availability and location",
    ],
  },
  {
    id: "members",
    title: "Member Management",
    icon: "fa-solid fa-users",
    content:
      "Register and manage library members, track their issued books, history, and membership status.",
    steps: [
      "Go to Members → Member Portal",
      "Click 'Add Member'",
      "Fill in contact and address details",
      "Assign a membership plan",
    ],
  },
  {
    id: "circulation",
    title: "Circulation",
    icon: "fa-solid fa-arrows-rotate",
    content:
      "Handle book issuing and returns seamlessly. Track due dates and overdue items automatically.",
    steps: [
      "Go to Members → Issue a Book",
      "Search for the member",
      "Select the book and confirm issue",
      "For returns, go to Members → Return a Book",
    ],
  },
];

export default function Documentation() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>Documentation</span>
          <h1>LibraryMS Documentation</h1>
          <p>Everything you need to manage your library efficiently.</p>
          <div className={styles.heroLinks}>
            <Link to="/api-reference" className={styles.heroBtn}>
              API Reference
            </Link>
            <Link
              to="/help"
              className={styles.heroBtn + " " + styles.heroBtnOutline}
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Sidebar nav */}
        <aside className={styles.sidebar}>
          <p className={styles.sidebarLabel}>On this page</p>
          <ul className={styles.sidebarList}>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={styles.sidebarLink}>
                  <i className={s.icon}></i> {s.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className={styles.content}>
          {sections.map((s) => (
            <section key={s.id} id={s.id} className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <i className={s.icon}></i>
                </div>
                <h2>{s.title}</h2>
              </div>
              <p className={styles.sectionText}>{s.content}</p>
              <ol className={styles.stepList}>
                {s.steps.map((step, i) => (
                  <li key={i} className={styles.stepItem}>
                    <span className={styles.stepNum}>{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
