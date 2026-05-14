import { useState } from "react";
import styles from "./FeedbackForm.module.css";
import { validateFeedbackForm } from "../../validations/validateFeedbackForm";
import { sendFeedback } from "../../services/Resources/feedback.service";
import Swal from "sweetalert2";

const FIELDS = [
  {
    id: "name",
    label: "First Name",
    type: "text",
    placeholder: "Your name",
    tag: "input",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    tag: "input",
  },
  {
    id: "message",
    label: "Message",
    type: "text",
    placeholder: "Write your message…",
    tag: "textarea",
    rows: 3,
  },
];

const INITIAL = { name: "", email: "", message: "" };

// Reusable SweetAlert config
const swalBase = { background: "#0a0c13", color: "#d9edff" };

const FeedbackForm = () => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleReset = () => {
    setForm(INITIAL);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFeedbackForm(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await sendFeedback(form);

      Swal.fire({
        ...swalBase,
        icon: "success",
        title: "Sent!",
        text: "Thanks for your feedback!",
        confirmButtonColor: "#1088ff",
      });
      handleReset();
    } catch (err) {
      Swal.fire({
        ...swalBase,
        icon: "error",
        title: "Failed",
        text: err?.response?.data?.message || "Something went wrong.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.formSection} noValidate>
        <div className={styles.headingBlock}>
          <span className={styles.headingIcon}>
            <i className="fa-solid fa-comments" />
          </span>
          <h2 className={styles.heading}>Share Your Feedback</h2>
          <p className={styles.subheading}>
            Have a question or suggestion? We'd love to hear from you.
          </p>
        </div>

        {FIELDS.map(({ id, label, type, placeholder, tag, rows }) => (
          <div className={styles.formGroup} key={id}>
            <label htmlFor={id} className={styles.label}>
              {label} <span className={styles.required}>*</span>
            </label>

            {tag === "textarea" ? (
              <textarea
                id={id}
                name={id}
                rows={rows}
                value={form[id]}
                placeholder={placeholder}
                onChange={handleChange}
                disabled={loading}
                className={`${styles.formInput} ${errors[id] ? styles.inputError : ""}`}
              />
            ) : (
              <input
                id={id}
                type={type}
                name={id}
                value={form[id]}
                placeholder={placeholder}
                onChange={handleChange}
                disabled={loading}
                autoComplete={id === "email" ? "email" : "off"}
                className={`${styles.formInput} ${errors[id] ? styles.inputError : ""}`}
              />
            )}

            {errors[id] && (
              <p className={styles.errorMsg}>
                <i className="fa-solid fa-circle-exclamation" /> {errors[id]}
              </p>
            )}
          </div>
        ))}

        <div className={styles.btnSection}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnReset}`}
            onClick={handleReset}
            disabled={loading}
          >
            <i className="fa-solid fa-rotate-left" /> Reset
          </button>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnSubmit}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} /> Sending…
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane" /> Submit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
