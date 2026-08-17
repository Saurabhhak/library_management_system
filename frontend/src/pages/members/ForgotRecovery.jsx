import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { successAlert, apiErrorAlert } from "../../utils/swalAlert";
import styles from "./ForgotRecovery.module.css";

export default function ForgotRecovery() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("password"); // 'password' or 'id'
  const [step, setStep] = useState(1); // 1: Request, 2: Verify & Reset

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Forgot Password Request
  const handleRequestPasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      successAlert("OTP Sent!", "Check your email for the password reset OTP.");
      setStep(2);
    } catch (err) {
      apiErrorAlert(err, "Request Failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Reset Submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/reset-password", { email, otp, newPassword });
      successAlert("Success!", "Password reset successfully. Please login.");
      navigate("/login");
    } catch (err) {
      apiErrorAlert(err, "Reset Failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot ID Submission
  const handleForgotId = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-id", { email });
      successAlert("ID Sent!", "Your Institutional ID has been emailed to you.");
      navigate("/login");
    } catch (err) {
      apiErrorAlert(err, "Recovery Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Account Recovery</h2>
          <p className={styles.subtitle}>Recover your credentials securely</p>
        </div>

        <div className={styles.tabBar}>
          <button 
            className={`${styles.tab} ${mode === "password" ? styles.tabActive : ""}`}
            onClick={() => { setMode("password"); setStep(1); }}
          >
            Reset Password
          </button>
          <button 
            className={`${styles.tab} ${mode === "id" ? styles.tabActive : ""}`}
            onClick={() => { setMode("id"); setStep(1); }}
          >
            Forgot Institutional ID
          </button>
        </div>

        {mode === "password" && step === 1 && (
          <form onSubmit={handleRequestPasswordReset} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email Address</label>
              <input 
                type="email" 
                className={styles.input} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your registered email" 
                required 
              />
            </div>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? "Sending OTP..." : "Send Reset OTP"}
            </button>
          </form>
        )}

        {mode === "password" && step === 2 && (
          <form onSubmit={handleResetPassword} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Enter 6-Digit OTP</label>
              <input 
                type="text" 
                className={styles.input} 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                maxLength="6" 
                placeholder="123456" 
                required 
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>New Password</label>
              <input 
                type="password" 
                className={styles.input} 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Min 8 characters" 
                required 
              />
            </div>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? "Resetting..." : "Update Password"}
            </button>
          </form>
        )}

        {mode === "id" && (
          <form onSubmit={handleForgotId} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Registered Email Address</label>
              <input 
                type="email" 
                className={styles.input} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                required 
              />
            </div>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? "Recovering..." : "Send My Institutional ID"}
            </button>
          </form>
        )}

        <div className={styles.footer}>
          <Link to="/login" className={styles.backLink}>← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}