import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  resetPassword,
  forgotPassword,
} from "../../services/auth/password.service";
import { Eye, EyeOff } from "lucide-react";
import styles from "./ForgotPassword.module.css"; // Reuse the EXACT SAME CSS file for consistency

const PASSWORD_REGEX =
  /^(?=(.*[A-Za-z]){3,})(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const OTP_RESEND_DELAY = 120;

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#0f1117",
  color: "#e2e8f0",
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const [fields, setFields] = useState({ otp: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_RESEND_DELAY);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) navigate("/login", { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const setField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!/^\d{6}$/.test(fields.otp)) errs.otp = "OTP must be exactly 6 digits";
    if (!fields.password) {
      errs.password = "Password is required";
    } else if (!PASSWORD_REGEX.test(fields.password)) {
      errs.password = "Min 8 chars, 1 uppercase, 1 number, 1 special char";
    }
    if (fields.password !== fields.confirm)
      errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      setLoading(true);
      await resetPassword({
        email,
        otp: fields.otp,
        password: fields.password,
      });
      toast.fire({ icon: "success", title: "Password updated successfully!" });
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.fire({ icon: "error", title: message });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await forgotPassword({ email }); // Will trigger OTP resend
      toast.fire({ icon: "success", title: "OTP resent to your email" });
      setTimer(OTP_RESEND_DELAY);
      setCanResend(false);
    } catch (err) {
      toast.fire({ icon: "error", title: "Failed to resend OTP" });
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

      <div className={styles.formContainer} style={{ marginTop: "7rem" }}>
        <form onSubmit={handleSubmit} className={styles.formSection}>
          <h2>Secure Reset</h2>
          <p className={styles.subText}>
            Enter the 6-digit OTP sent to <b>{email}</b>
          </p>

          <input
            type="text"
            placeholder="Enter 6-Digit OTP"
            value={fields.otp}
            maxLength={6}
            onChange={(e) => setField("otp", e.target.value.replace(/\D/g, ""))}
            className={`${styles.formInput} ${errors.otp ? styles.inputError : ""}`}
            style={{
              letterSpacing: "4px",
              fontSize: "16px",
              textAlign: "center",
            }}
          />
          {errors.otp && <p className={styles.errorMsg}>{errors.otp}</p>}

          <div style={{ position: "relative" }}>
            <input
              type={show.password ? "text" : "password"}
              placeholder="New Strong Password"
              value={fields.password}
              onChange={(e) => setField("password", e.target.value)}
              className={`${styles.formInput} ${errors.password ? styles.inputError : ""}`}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#8f94a4",
                cursor: "pointer",
              }}
              onClick={() => setShow((s) => ({ ...s, password: !s.password }))}
            >
              {show.password ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className={styles.errorMsg}>{errors.password}</p>
          )}

          <div style={{ position: "relative" }}>
            <input
              type={show.confirm ? "text" : "password"}
              placeholder="Confirm New Password"
              value={fields.confirm}
              onChange={(e) => setField("confirm", e.target.value)}
              className={`${styles.formInput} ${errors.confirm ? styles.inputError : ""}`}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#8f94a4",
                cursor: "pointer",
              }}
              onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
            >
              {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirm && (
            <p className={styles.errorMsg}>{errors.confirm}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.btnFeature}
          >
            {loading ? "Updating..." : "Set New Password"}
          </button>

          <button
            type="button"
            disabled={!canResend || loading}
            onClick={handleResend}
            className={styles.btnFeature}
            style={{
              background: "transparent",
              border: "1px solid #30363d",
              color: "#8f94a4",
              marginTop: "-10px",
            }}
          >
            {canResend ? "Resend OTP" : `Resend OTP (${timer}s)`}
          </button>
        </form>
      </div>
    </>
  );
}
