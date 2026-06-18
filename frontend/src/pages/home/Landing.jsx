import { useNavigate } from "react-router-dom";
import styles from "./Landing.module.css";

/**
 * Landing Page — LibraryHub
 * Public route: visible to all unauthenticated visitors.
 * All CTAs route to /signup. Login link routes to /login.
 */
function Landing() {
  const navigate = useNavigate();

  const toSignup = () => navigate("/signup");
  const toLogin = () => navigate("/login");

  const features = [
    {
      icon: "📚",
      title: "Smart Catalog",
      desc: "Organize thousands of books with instant search, filters, and ISBN lookup.",
    },
    {
      icon: "👥",
      title: "Member Management",
      desc: "Member profiles, borrowing limits, history, and fine tracking in one place.",
    },
    {
      icon: "📊",
      title: "Live Analytics",
      desc: "Real-time dashboards showing circulation trends, top titles, and utilization.",
    },
    {
      icon: "🔔",
      title: "Auto Reminders",
      desc: "Automated due-date and overdue notifications — no manual follow-up needed.",
    },
    {
      icon: "🔐",
      title: "Role-based Access",
      desc: "Separate portals for Super Admins, Admins, and Members with fine-grained permissions.",
    },
    {
      icon: "📱",
      title: "Works Everywhere",
      desc: "Fully responsive — manage your library from desktop, tablet, or phone.",
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "Free",
      sub: "forever",
      items: [
        "Up to 500 books",
        "50 active members",
        "Basic reports",
        "Email support",
      ],
      cta: "Get Started Free",
      highlight: false,
    },
    {
      name: "Professional",
      price: "₹999",
      sub: "/ month",
      items: [
        "Unlimited books",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "API access",
      ],
      cta: "Start Free Trial",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      sub: "contact us",
      items: [
        "Everything in Pro",
        "Dedicated manager",
        "Custom features",
        "SLA guarantee",
        "On-premise option",
      ],
      cta: "Talk to Sales",
      highlight: false,
    },
  ];

  const testimonials = [
    {
      quote:
        "We cut overdue returns by 60% in the first month. The automated reminders alone are worth it.",
      author: "Priya Mehta",
      role: "Head Librarian, Delhi Public Library",
    },
    {
      quote:
        "Finally a system that doesn't need a manual. Our volunteers were up and running in an afternoon.",
      author: "Ramesh Gupta",
      role: "School Librarian, Lucknow",
    },
    {
      quote:
        "The analytics dashboard gave us insights we never had before. Circulation is up 40%.",
      author: "Anjali Singh",
      role: "Library Director, IIT Kanpur",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── NAV ── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>LibraryHub</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>
              Features
            </a>
            <a href="#how" className={styles.navLink}>
              How it works
            </a>
            <a href="#pricing" className={styles.navLink}>
              Pricing
            </a>
            <button className={styles.navLogin} onClick={toLogin}>
              Log in
            </button>
            <button className={styles.navSignup} onClick={toSignup}>
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>Library Management System</div>
          <h1 className={styles.heroHeadline}>
            Your library,
            <br />
            <span className={styles.heroAccent}>fully in control.</span>
          </h1>
          <p className={styles.heroBody}>
            LibraryHub brings your books, members, and circulation into one
            clean, fast system — so you spend less time on admin and more time
            connecting readers with the right books.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.ctaPrimary} onClick={toSignup}>
              Start free — no card needed
            </button>
            <button className={styles.ctaGhost} onClick={toLogin}>
              I already have an account →
            </button>
          </div>
          <div className={styles.heroTrustBar}>
            <span>✦ 1,000+ libraries</span>
            <span>✦ 50,000+ books managed</span>
            <span>✦ 99.9% uptime</span>
          </div>
        </div>

        {/* Abstract book-stack illustration */}
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.bookStack}>
            {["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"].map(
              (c, i) => (
                <div
                  key={i}
                  className={styles.book}
                  style={{ "--bc": c, "--i": i }}
                />
              ),
            )}
            <div className={styles.bookShadow} />
          </div>
          <div className={styles.floatCard}>
            <span className={styles.floatDot} />
            <span>12 books due today</span>
          </div>
          <div className={styles.floatCardAlt}>
            <span>↑ 24% circulation</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className={styles.section}>
        <div className={styles.sectionLabel}>What you get</div>
        <h2 className={styles.sectionTitle}>
          Everything a modern library needs
        </h2>
        <div className={styles.featGrid}>
          {features.map((f, i) => (
            <div key={i} className={styles.featCard}>
              <div className={styles.featEmoji}>{f.icon}</div>
              <h3 className={styles.featTitle}>{f.title}</h3>
              <p className={styles.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className={styles.sectionAlt}>
        <div className={styles.sectionLabel}>Getting started</div>
        <h2 className={styles.sectionTitle}>Up and running in three steps</h2>
        <div className={styles.stepsRow}>
          {[
            {
              n: "01",
              t: "Create your account",
              d: "Sign up in under 2 minutes. No credit card, no commitment.",
            },
            {
              n: "02",
              t: "Import your catalog",
              d: "Bulk-upload books via CSV or add them one by one with ISBN scan.",
            },
            {
              n: "03",
              t: "Invite your team",
              d: "Add admins and members. Set roles, launch, and start circulating.",
            },
          ].map((s, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepNum}>{s.n}</div>
              <h3 className={styles.stepTitle}>{s.t}</h3>
              <p className={styles.stepDesc}>{s.d}</p>
            </div>
          ))}
        </div>
        <button
          className={styles.ctaPrimary}
          onClick={toSignup}
          style={{ margin: "2.5rem auto 0", display: "block" }}
        >
          Create your free account
        </button>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>What librarians say</div>
        <h2 className={styles.sectionTitle}>Trusted by real libraries</h2>
        <div className={styles.testiRow}>
          {testimonials.map((t, i) => (
            <div key={i} className={styles.testiCard}>
              <p className={styles.testiQuote}>"{t.quote}"</p>
              <div className={styles.testiAuthor}>
                <strong>{t.author}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className={styles.sectionAlt}>
        <div className={styles.sectionLabel}>Pricing</div>
        <h2 className={styles.sectionTitle}>Simple, transparent plans</h2>
        <div className={styles.pricingRow}>
          {plans.map((p, i) => (
            <div
              key={i}
              className={`${styles.planCard} ${p.highlight ? styles.planHighlight : ""}`}
            >
              {p.highlight && (
                <div className={styles.planBadge}>Most popular</div>
              )}
              <h3 className={styles.planName}>{p.name}</h3>
              <div className={styles.planPrice}>
                {p.price}
                <span className={styles.planSub}>{p.sub}</span>
              </div>
              <ul className={styles.planList}>
                {p.items.map((item, j) => (
                  <li key={j}>
                    <span className={styles.check}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className={p.highlight ? styles.ctaPrimary : styles.ctaOutline}
                onClick={toSignup}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA BANNER ── */}
      <section className={styles.banner}>
        <h2 className={styles.bannerTitle}>Ready to modernise your library?</h2>
        <p className={styles.bannerSub}>
          Join 1,000+ libraries already on LibraryHub. Free to start, easy to
          grow.
        </p>
        <button className={styles.ctaPrimary} onClick={toSignup}>
          Get started for free
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>LibraryHub</span>
            <p>Modern library management for the digital age.</p>
          </div>
          <div className={styles.footerCols}>
            {[
              {
                heading: "Product",
                links: ["Features", "Pricing", "Changelog", "API Reference"],
              },
              {
                heading: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              { heading: "Legal", links: ["Privacy", "Terms", "Cookies"] },
            ].map((col, i) => (
              <div key={i} className={styles.footerCol}>
                <h5>{col.heading}</h5>
                <ul>
                  {col.links.map((l, j) => (
                    <li key={j}>
                      <button className={styles.footerLink} onClick={toSignup}>
                        {l}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 LibraryHub. All rights reserved.</p>
          <div className={styles.socials}>
            {["𝕏", "in", "f"].map((s, i) => (
              <button key={i} className={styles.socialBtn} onClick={toSignup}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
