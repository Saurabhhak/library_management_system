import styles from "./HelpCenter.module.css";
import { useState } from "react";

const faqs = [
  { q: "How do I issue a book to a member?", a: "Go to Members → Issue a Book. Search for the member by name or ID, then select the book. Confirm the issue — the due date is set automatically based on your library's policy." },
  { q: "What happens if a book is overdue?", a: "The system flags overdue books automatically. You'll see them highlighted in the Reports section. The member will be notified via email if email notifications are configured." },
  { q: "How do I add a new book category?", a: "Navigate to Admin → Manage Books → Categories. Click 'Add Category', enter the name and description, then save. The category immediately becomes available when adding books." },
  { q: "Can I delete my own admin account?", a: "Yes. Go to My Account → Danger Zone → Delete Account. Note: this is irreversible. If you're the only admin, consider creating another admin first." },
  { q: "How does the refresh token work?", a: "Your login session uses two tokens: a short-lived access token (15 min) and a long-lived refresh token stored in a secure HTTP-only cookie. The system silently refreshes your access automatically — you won't be logged out unless you're inactive for 7 days." },
  { q: "How do I reset an admin's password?", a: "Currently, password resets are done by a SuperAdmin from Admin → Manage Members. An automated email reset flow is planned for v2.2.0." },
];

export default function HelpCenter() {
  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.badge}>Help Center</span>
        <h1>How can we help?</h1>
        <p>Find answers to the most common questions about LibraryMS.</p>
      </div>

      <div className={styles.container}>
        {/* Contact cards */}
        <div className={styles.contactGrid}>
          {[
            { icon: "fa-solid fa-book",        title: "Documentation",  desc: "Step-by-step guides",     link: "/docs" },
            { icon: "fa-solid fa-code",         title: "API Reference",  desc: "All endpoints documented", link: "/api-reference" },
            { icon: "fa-solid fa-circle-dot",   title: "System Status",  desc: "Check live uptime",        link: "/status" },
          ].map((c) => (
            <a key={c.title} href={c.link} className={styles.contactCard}>
              <div className={styles.contactIcon}><i className={c.icon}></i></div>
              <div>
                <div className={styles.contactTitle}>{c.title}</div>
                <div className={styles.contactDesc}>{c.desc}</div>
              </div>
              <i className="fa-solid fa-arrow-right" style={{ color: "#475569", marginLeft: "auto" }}></i>
            </a>
          ))}
        </div>

        {/* FAQ */}
        <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {faqs.map((f, i) => (
            <div key={i} className={`${styles.faqItem} ${open === i ? styles.faqOpen : ""}`}>
              <button className={styles.faqQ} onClick={() => toggle(i)}>
                <span>{f.q}</span>
                <i className={`fa-solid ${open === i ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
              </button>
              {open === i && <p className={styles.faqA}>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}