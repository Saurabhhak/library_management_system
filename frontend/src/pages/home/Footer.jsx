import { Link, useLocation, useSearchParams } from "react-router-dom";
import styles from "./Footer.module.css";
import { useAuth } from "../../context/AuthContext"; // Imported useAuth

const NAV = {
  Library: [
    { label: "Browse Books", to: "/library", filter: "" },
    { label: "New Arrivals", to: "/library?filter=new", filter: "new" },
    {
      label: "Trending Now",
      to: "/library?filter=trending",
      filter: "trending",
    },
    { label: "High Rating Books", to: "/library?filter=top", filter: "top" },
    { label: "Authors", to: "/authors", filter: null },
  ],
  Members: [
    { label: "Member Portal", to: "/members" },
    { label: "Issue a Book", to: "/issue" },
    { label: "Return a Book", to: "/return" },
    { label: "My Account", to: "/account" },
    { label: "Membership Plans", to: "/plans" },
  ],
  Admin: [
    { label: "Dashboard", to: "/home" },
    { label: "Manage Books", to: "/bookinventory" },
    { label: "Manage Members", to: "/memberinventory" },
    { label: "Reports", to: "/adminpage" },
    { label: "Settings", to: "/settings" },
  ],
  Resources: [
    { label: "Documentation", to: "/docs" },
    { label: "API Reference", to: "/api-reference" },
    { label: "Changelog", to: "/changelog" },
    { label: "Help Center", to: "/help" },
    { label: "Feedback", to: "/feedback-page" },
    { label: "Contact Us", to: "/contact-us" },
  ],
};

const SOCIALS = [
  {
    icon: "fa-brands fa-github",
    href: "https://github.com/Saurabhhak",
    label: "GitHub",
  },
  {
    icon: "fa-brands fa-linkedin",
    href: "https://www.linkedin.com/in/saurabh555/",
    label: "LinkedIn",
  },
  {
    icon: "fa-brands fa-twitter",
    href: "https://x.com/ExtremeHacker6",
    label: "Twitter",
  },
  {
    icon: "fa-brands fa-instagram",
    href: "https://instagram.com/swe_saurabh_kashyap",
    label: "Instagram",
  },
];

const LEGAL = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Use", to: "/terms" },
  { label: "Cookies", to: "/cookies" },
];

const Dot = () => <span className={styles.bottomDot}>·</span>;

function FooterLink({ label, to, filter }) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") ?? "";

  let isActive = false;
  if (filter === undefined || filter === null) isActive = pathname === to;
  else isActive = pathname === "/library" && currentFilter === filter;

  return (
    <li>
      <Link
        to={to}
        className={`${styles.footerLink} ${isActive ? styles.footerLinkActive : ""}`}
      >
        {label}
      </Link>
    </li>
  );
}

function LinkColumn({ heading, links }) {
  return (
    <div className={styles.linkCol}>
      <h4 className={styles.colHeading}>{heading}</h4>
      <ul className={styles.linkList}>
        {links.map((link) => (
          <FooterLink key={link.to + link.label} {...link} />
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const { isStaff } = useAuth(); // 🔥 Get user role

  // 🔥 Smart Filtering: Admin column sirf tabhi dikhega jab user staff/admin ho
  const filteredNav = Object.entries(NAV).filter(([heading]) => {
    if (heading === "Admin" && !isStaff) return false;
    return true;
  });

  return (
    <footer className={styles.footer}>
      <div className={styles.topGlow} />

      <div className={styles.ctaStrip}>
        <div className={styles.ctaStripInner}>
          <div>
            <h3>Ready to explore the library?</h3>
            <p>Join 1,200+ active members and discover your next great read.</p>
          </div>
          <div className={styles.ctaStripBtns}>
            <Link to="/library">
              <button className={styles.ctaGreenBtn}>
                Browse Books <i className="fa-solid fa-arrow-right" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.footerMain}>
        <div className={styles.brandCol}>
          <div className={styles.brandLogo}>
            <i className="fa-solid fa-book-open-reader" />{" "}
            <span>LibraryMS</span>
          </div>
          <p className={styles.brandDesc}>
            A modern, full-featured Library Management System for seamless book
            management and digital circulation.
          </p>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} /> All systems operational
          </div>
          <div className={styles.socialRow}>
            {SOCIALS.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <i className={icon} />
              </a>
            ))}
          </div>
        </div>

        {/* Render dynamically filtered links */}
        {filteredNav.map(([heading, links]) => (
          <LinkColumn key={heading} heading={heading} links={links} />
        ))}
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.footerBottomInner}>
          <div className={styles.bottomLeft}>
            <span>
              © {year} <strong>LibraryMS</strong>. All rights reserved.
            </span>{" "}
            <Dot />
            <span>
              Built by{" "}
              <a
                href="https://github.com/Saurabhhak"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.authorLink}
              >
                Saurabh
              </a>
            </span>{" "}
            <Dot />
            <span className={styles.versionTag}>Feb 2026</span>
          </div>
          <div className={styles.bottomRight}>
            {LEGAL.map(({ label, to }, i) => (
              <span key={label} className={styles.legalItem}>
                {i > 0 && <Dot />}{" "}
                <Link to={to} className={styles.legalLink}>
                  {label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
