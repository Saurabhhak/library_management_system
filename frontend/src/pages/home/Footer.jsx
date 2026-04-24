import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

/* ─────────────────────────────────────
   FOOTER COMPONENT
   Created by Saurabh · February 2026
───────────────────────────────────── */

const FOOTER_LINKS = {
  Library: [
    { label: "Browse Books",  to: "/bookslib" },
    { label: "New Arrivals",  to: "/bookslib?filter=new" },
    { label: "Trending Now",  to: "/bookslib?filter=trending" },
    { label: "Categories",   to: "/categories" },
    { label: "Authors",      to: "/authors" },
  ],
  Members: [
    { label: "Member Portal",    to: "/members" },
    { label: "Issue a Book",     to: "/issue" },
    { label: "Return a Book",    to: "/return" },
    { label: "My Account",       to: "/account" },
    { label: "Membership Plans", to: "/plans" },
  ],
  Admin: [
    { label: "Dashboard",       to: "/admin" },
    { label: "Manage Books",    to: "/admin/books" },
    { label: "Manage Members",  to: "/admin/members" },
    { label: "Reports",         to: "/admin/reports" },
    { label: "Settings",        to: "/admin/settings" },
  ],
  Resources: [
    { label: "Documentation",  to: "/docs" },
    { label: "API Reference",  to: "/api" },
    { label: "Changelog",      to: "/changelog" },
    { label: "Help Center",    to: "/help" },
    { label: "Status Page",    to: "/status" },
  ],
};

const SOCIAL_LINKS = [
  { icon: "fa-brands fa-github",   href: "https://github.com/saurabh",    label: "GitHub"   },
  { icon: "fa-brands fa-linkedin", href: "https://linkedin.com/in/saurabh", label: "LinkedIn" },
  { icon: "fa-brands fa-twitter",  href: "https://twitter.com/saurabh",   label: "Twitter"  },
  { icon: "fa-brands fa-instagram",href: "https://instagram.com/saurabh", label: "Instagram"},
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Decorative top glow */}
      <div className={styles.topGlow} />

      {/* ── Top CTA Strip ── */}
      <div className={styles.ctaStrip}>
        <div className={styles.ctaStripInner}>
          <div>
            <h3>Ready to explore the library?</h3>
            <p>Join 1,200+ active members and discover your next great read.</p>
          </div>
          <div className={styles.ctaStripBtns}>
            <Link to="/bookslib">
              <button className={styles.ctaGreenBtn}>
                Browse Books <i className="fa-solid fa-arrow-right"></i>
              </button>
            </Link>
            <Link to="/members">
              <button className={styles.ctaOutlineBtn}>Join as Member</button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Footer Content ── */}
      <div className={styles.footerMain}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <div className={styles.brandLogo}>
            <i className="fa-solid fa-book-open-reader"></i>
            <span>LibraryMS</span>
          </div>
          <p className={styles.brandDesc}>
            A modern, full-featured Library Management System designed for
            seamless book management, member tracking, and digital circulation.
          </p>

          {/* System status */}
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} />
            All systems operational
          </div>

          {/* Social icons */}
          <div className={styles.socialRow}>
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label={s.label}
                title={s.label}
              >
                <i className={s.icon}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading} className={styles.linkCol}>
            <h4 className={styles.colHeading}>{heading}</h4>
            <ul className={styles.linkList}>
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom Bar ── */}
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomInner}>
          <div className={styles.bottomLeft}>
            <span>
              © {year} <strong>LibraryMS</strong>. All rights reserved.
            </span>
            <span className={styles.bottomDot}>·</span>
            <span>
              Built with <i className="fa-solid fa-heart" style={{ color: "#ef4444" }}></i> by{" "}
              <a
                href="https://github.com/saurabh"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.authorLink}
              >
                Saurabh
              </a>
            </span>
            <span className={styles.bottomDot}>·</span>
            <span className={styles.versionTag}>v1.0.0 · Feb 2026</span>
          </div>

          <div className={styles.bottomRight}>
            <Link to="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <span className={styles.bottomDot}>·</span>
            <Link to="/terms" className={styles.legalLink}>Terms of Use</Link>
            <span className={styles.bottomDot}>·</span>
            <Link to="/cookies" className={styles.legalLink}>Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;