import { useState, useRef } from "react";
import Swal from "sweetalert2";
import { submitContactForm } from "../../services/contact/contact.service";
import styles from "./ContactUs.module.css";

/* ── Swal helpers ─────────────────────────────────────────────────── */
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  background: "#0b0e18",
  color: "#dde6f8",
  iconColor: "#10b981",
});
const toast = (icon, title) => Toast.fire({ icon, title });

/* ── Validation ───────────────────────────────────────────────────── */
const validate = ({ name, email, subject, message }) => {
  const errs = {};
  if (!name.trim()) errs.name = "Name is required.";
  if (!email.trim()) errs.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = "Enter a valid email.";
  if (!subject.trim()) errs.subject = "Subject is required.";
  if (!message.trim()) errs.message = "Message is required.";
  else if (message.trim().length < 20)
    errs.message = "Message must be at least 20 characters.";
  return errs;
};

const INIT = { name: "", email: "", subject: "", message: "" };

/* ─────────────────────────────────────────────────────────────────── */
export default function ContactUs() {
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef(null);

  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast("warning", Object.values(errs)[0]);
      return;
    }

    try {
      setLoading(true);
      await submitContactForm(form);
      setSent(true);
      setForm(INIT);
      setErrors({});
    } catch (err) {
      toast(
        "error",
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setForm(INIT);
    setErrors({});
    setTimeout(() => formRef.current?.querySelector("input")?.focus(), 100);
  };

  /* ── Success state ───────────────────────────────────────────────── */
  if (sent) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <svg
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="26" cy="26" r="25" stroke="#10b981" strokeWidth="2" />
              <path
                d="M14 26l8 8 16-16"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className={styles.successTitle}>Message Sent!</h2>
          <p className={styles.successText}>
            Thank you for reaching out. We've received your message and will get
            back to you within 1–2 business days. A confirmation has been sent
            to your email.
          </p>
          <button className={styles.btnPrimary} onClick={handleReset}>
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────────────── */
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Left — Info panel */}
        <aside className={styles.info}>
          <div className={styles.infoInner}>
            <span className={styles.badge}>Get in Touch</span>
            <h1 className={styles.infoTitle}>Contact Us</h1>
            <p className={styles.infoText}>
              Have a question, suggestion, or just want to say hello? Fill in
              the form and our team will respond promptly.
            </p>

            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>
                  <i className="fa-solid fa-location-dot" />
                </span>
                <span>APV Library, Main Campus, Block C</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>
                  <i className="fa-solid fa-phone" />
                </span>
                <span>+91 98765 43210</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>
                  <i className="fa-solid fa-envelope" />
                </span>
                <span>library@apvcollege.edu.in</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactIcon}>
                  <i className="fa-solid fa-clock" />
                </span>
                <span>Mon – Sat &nbsp; 9:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Decorative orbs */}
          <div className={styles.orb1} aria-hidden="true" />
          <div className={styles.orb2} aria-hidden="true" />
        </aside>

        {/* Right — Form */}
        <section className={styles.formSection}>
          <h2 className={styles.formTitle}>Send a Message</h2>
          <p className={styles.formSubtitle}>
            We typically reply within one business day.
          </p>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className={styles.form}
            noValidate
          >
            {/* Name + Email */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Full Name <sup>*</sup>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`${styles.input} ${errors.name ? styles.inputErr : ""}`}
                />
                {errors.name && <p className={styles.errMsg}>{errors.name}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Email Address <sup>*</sup>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`${styles.input} ${errors.email ? styles.inputErr : ""}`}
                />
                {errors.email && (
                  <p className={styles.errMsg}>{errors.email}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className={styles.field}>
              <label className={styles.label}>
                Subject <sup>*</sup>
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className={`${styles.input} ${errors.subject ? styles.inputErr : ""}`}
              />
              {errors.subject && (
                <p className={styles.errMsg}>{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div className={styles.field}>
              <label className={styles.label}>
                Message <sup>*</sup>
              </label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message here… (min. 20 characters)"
                className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputErr : ""}`}
              />
              <div className={styles.charRow}>
                {errors.message ? (
                  <p className={styles.errMsg}>{errors.message}</p>
                ) : (
                  <span />
                )}
                <span
                  className={`${styles.charCount} ${form.message.length < 20 ? styles.charWarn : ""}`}
                >
                  {form.message.length} / 20 min
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => {
                  setForm(INIT);
                  setErrors({});
                }}
                disabled={loading}
              >
                Clear
              </button>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane" /> Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
