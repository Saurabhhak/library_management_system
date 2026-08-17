import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  forgotPassword,
  forgotInstitutionalId,
} from "../../services/auth/password.service";
import styles from "./ForgotPassword.module.css";

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tab state: 'password' or 'id'
  const [activeTab, setActiveTab] = useState("password");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-switch tab based on where the user clicked from Login page
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location]);

  // Handle Forgot Password (Admin & Members)
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Email is required");

    try {
      setLoading(true);
      await forgotPassword({ email: email.trim() });
      toast.fire({ icon: "success", title: "OTP sent to your email" });
      setTimeout(
        () => navigate("/reset-password", { state: { email: email.trim() } }),
        1000,
      );
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.fire({ icon: "error", title: message });
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Institutional ID (Members Only)
  const handleForgotId = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Email is required");

    try {
      setLoading(true);
      const res = await forgotInstitutionalId({ email: email.trim() });
      toast.fire({
        icon: "success",
        title: res.data?.message || "ID recovery email sent!",
      });
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after sending ID
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
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

      <div className={styles.formContainer}>
        {/* Tab Navigation */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabBtn} ${activeTab === "password" ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab("password");
              setError("");
            }}
          >
            Reset Password
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "id" ? styles.activeTab : ""}`}
            onClick={() => {
              setActiveTab("id");
              setError("");
            }}
          >
            Forgot ID
          </button>
        </div>

        {/* Tab 1: Reset Password Form */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordReset} className={styles.formSection}>
            <h2>Reset Password</h2>
            <p className={styles.subText}>
              Enter your account email to receive an OTP.
            </p>

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

            <button
              type="submit"
              disabled={loading}
              className={styles.btnFeature}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Tab 2: Forgot ID Form */}
        {activeTab === "id" && (
          <form onSubmit={handleForgotId} className={styles.formSection}>
            <h2>Recover Institutional ID</h2>
            <p className={styles.subText}>
              We will email your ID to your registered email address.
            </p>

            <input
              type="email"
              placeholder="Registered Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={`${styles.formInput} ${error ? styles.inputError : ""}`}
            />
            {error && <p className={styles.errorMsg}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={styles.btnFeature}
            >
              {loading ? "Sending ID..." : "Send My ID"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
