import { Link } from "react-router-dom";
import styles from "./LegalPage.module.css";

/* ─── Reusable layout for Privacy / Terms / Cookies pages ─── */

/** Section block: heading + content */
export const Section = ({ title, children }) => (
  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    <div className={styles.sectionBody}>{children}</div>
  </section>
);

/** Info highlight box */
export const InfoBox = ({ icon = "fa-solid fa-circle-info", children }) => (
  <div className={styles.infoBox}>
    <i className={icon} />
    <span>{children}</span>
  </div>
);

/** Full page wrapper */
function LegalPage({ title, subtitle, icon, updatedDate, children }) {
  return (
    <div className={styles.page}>

      {/* Hero header */}
      <header className={styles.hero}>
        <div className={styles.heroIcon}><i className={icon} /></div>
        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroSubtitle}>{subtitle}</p>
        <p className={styles.updated}>Last updated: <strong>{updatedDate}</strong></p>
      </header>

      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="breadcrumb">
        <Link to="/">Home</Link>
        <i className="fa-solid fa-chevron-right" />
        <span>{title}</span>
      </nav>

      {/* Main content */}
      <main className={styles.content}>{children}</main>

      {/* Footer nav between legal pages */}
      <div className={styles.legalNav}>
        <Link to="/privacy" className={styles.legalNavLink}>
          <i className="fa-solid fa-shield-halved" /> Privacy Policy
        </Link>
        <Link to="/terms" className={styles.legalNavLink}>
          <i className="fa-solid fa-file-contract" /> Terms of Use
        </Link>
        <Link to="/cookies" className={styles.legalNavLink}>
          <i className="fa-solid fa-cookie-bite" /> Cookie Policy
        </Link>
      </div>

      <p className={styles.contact}>
        Questions? Contact us at{" "}
        <a href="mailto:support@libraryms.in">support@libraryms.in</a>
      </p>
    </div>
  );
}

export default LegalPage;