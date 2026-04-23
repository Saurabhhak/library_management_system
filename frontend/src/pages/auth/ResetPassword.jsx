import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { resetPassword, forgotPassword } from "../../services/validations/password.service";
import styles from "./ForgotPassword.module.css";

const PASSWORD_REGEX =
  /^(?=(.*[A-Za-z]){3,})(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const OTP_RESEND_DELAY = 120;

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const [fields, setFields] = useState({ otp: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_RESEND_DELAY);
  const [canResend, setCanResend] = useState(false);

  // Redirect if arrived without email in state
  useEffect(() => {
    if (!email) navigate("/forgot-password", { replace: true });
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const setField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!/^\d{6}$/.test(fields.otp)) errs.otp = "OTP must be 6 digits";
    if (!fields.password) {
      errs.password = "Password is required";
    } else if (!PASSWORD_REGEX.test(fields.password)) {
      errs.password = "Min 8 chars, 1 uppercase, 1 number, 1 special character & at least 3 letters";
    }
    if (fields.password !== fields.confirm) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      setLoading(true);
      await resetPassword({ email, otp: fields.otp, password: fields.password });
      toast.fire({ icon: "success", title: "Password updated successfully" });
      setTimeout(() => navigate("/login", { replace: true }), 1500);
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

  const handleResend = async () => {
    try {
      setLoading(true);
      await forgotPassword(email);
      toast.fire({ icon: "success", title: "OTP resent to your email" });
      setTimer(OTP_RESEND_DELAY);
      setCanResend(false);
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
        <h2>Reset Password</h2>

        {/* OTP */}
        <input
          type="text"
          placeholder="Enter OTP"
          value={fields.otp}
          maxLength={6}
          onChange={(e) => setField("otp", e.target.value)}
          className={`${styles.formInput} ${errors.otp ? styles.inputError : ""}`}
        />
        {errors.otp && <p className={styles.errorMsg}>{errors.otp}</p>}

        {/* New Password */}
        <div className={styles.password_wrapper}>
          <input
            type={show.password ? "text" : "password"}
            placeholder="New Password"
            value={fields.password}
            onChange={(e) => setField("password", e.target.value)}
            className={`${styles.formInput} ${errors.password ? styles.inputError : ""}`}
          />
          <span className={styles.eye_icon} onClick={() => setShow((s) => ({ ...s, password: !s.password }))}>
            <i className={`fa-solid ${show.password ? "fa-eye-slash" : "fa-eye"}`} />
          </span>
        </div>
        {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}

        {/* Confirm Password */}
        <div className={styles.password_wrapper}>
          <input
            type={show.confirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={fields.confirm}
            onChange={(e) => setField("confirm", e.target.value)}
            className={`${styles.formInput} ${errors.confirm ? styles.inputError : ""}`}
          />
          <span className={styles.eye_icon} onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}>
            <i className={`fa-solid ${show.confirm ? "fa-eye-slash" : "fa-eye"}`} />
          </span>
        </div>
        {errors.confirm && <p className={styles.errorMsg}>{errors.confirm}</p>}

        <button type="submit" disabled={loading} className={styles.btnFeature}>
          {loading ? "Updating..." : "Update Password"}
        </button>

        <button
          type="button"
          disabled={!canResend || loading}
          onClick={handleResend}
          className={`${styles.btnFeature} ${styles.resendBtn}`}
        >
          {canResend ? "Resend OTP" : `Resend OTP (${timer}s)`}
        </button>
      </form>
    </>
  );
}

export default ResetPassword;