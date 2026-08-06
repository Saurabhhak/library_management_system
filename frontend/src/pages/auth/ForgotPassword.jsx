import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { forgotPassword } from "../../services/auth/password.service";
import styles from "./ForgotPassword.module.css";

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

/**
 * ForgotPassword — the ONLY forgot-password page. No role needed;
 * the backend searches both admin and member tables by email.
 */
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword({ email: email.trim() });
      toast.fire({ icon: "success", title: "OTP sent to your email" });
      setTimeout(
        () => navigate("/reset-password", { state: { email: email.trim() } }),
        1000,
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.request ? "Server not responding" : err.message) ||
        "Something went wrong";
      toast.fire({ icon: "error", title: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className={styles.headers}>
        <div className={styles.leftIcon}>
          <i className="fa-solid fa-book-open-reader" />
        </div>
        <div className={styles.headingTitle}>
          <h2>APV Tech Library</h2>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h2>Forgot Password</h2>
        <p className={styles.subText}>Enter your account email</p>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className={`${styles.formInput} ${error ? styles.inputError : ""}`}
        />
        {error && <p className={styles.errorMsg}>{error}</p>}

        <button type="submit" disabled={loading} className={styles.btnFeature}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </>
  );
}
