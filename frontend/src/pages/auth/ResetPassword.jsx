import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword, forgotPassword } from "../../services/validations/password.service";
import styles from "./ForgotPassword.module.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");
  const [notifyType, setNotifyType] = useState("");
  const [timer, setTimer] = useState(120);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (timer === 0) return setResendDisabled(false);
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const showNotificationFn = (msg, type) => {
    setNotification(msg);
    setNotifyType(type);
    setTimeout(() => { setNotification(""); setNotifyType(""); }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!/^\d{6}$/.test(otp)) newErrors.otp = "OTP must be 6 digits";

    const passwordRegex =
      /^(?=(.*[A-Za-z]){3,})(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      newErrors.password = "Password required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Min 8 chars, 1 capital, 1 number, 1 special & at least 3 letters required";
    }

    if (password !== confirm) {
      newErrors.confirm = "Passwords do not match";
    }
    //  IMPORTANT FIX ERROR AUTO REMOVE IF CORERCT INPUT 
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await resetPassword({ email, otp, password });
      showNotificationFn("Password updated successfully", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showNotificationFn(
        err.response?.data?.message || "Error resetting password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await forgotPassword({ email });
      showNotificationFn("OTP sent again", "success");
      setTimer(120);
      setResendDisabled(true);
    } catch (err) {
      showNotificationFn(err.response?.data?.message || "Failed to resend OTP", "error");
    } finally { setLoading(false); }
  };

  return (
    <>
      {notification && <div className={`${styles.notify} ${styles[notifyType]}`}>{notification}</div>}
      <form onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => {
            setOtp(e.target.value);
            // ✅ error remove
            setErrors((prev) => ({
              ...prev,
              otp: "",
            }));
          }}
          className={`${styles.formInput} ${errors.otp ? styles.inputError : ""}`}
        />
        {errors.otp && <p className={styles.errorMsg}>{errors.otp}</p>}
        <div className={styles.password_wrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              // ✅ error remove
              setErrors((prev) => ({
                ...prev,
                password: "",
              }));
            }}
            className={`${styles.formInput} ${errors.password ? styles.inputError : ""}`}
          />
          <span className={styles.eye_icon} onClick={() => setShowPassword(!showPassword)}>
            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
          </span>
        </div>
        {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
        <div className={styles.password_wrapper}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              // ✅ error remove
              setErrors((prev) => ({
                ...prev,
                confirm: "",
              }));
            }}
            className={`${styles.formInput} ${errors.confirm ? styles.inputError : ""}`}
          />
          <span className={styles.eye_icon} onClick={() => setShowConfirm(!showConfirm)}>
            <i className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
          </span>
        </div>
        {errors.confirm && <p className={styles.errorMsg}>{errors.confirm}</p>}
        <button type="submit" disabled={loading} className={styles.btnFeature}>
          {loading ? "Updating..." : "Update Password"}
        </button>
        <button type="button" disabled={resendDisabled} onClick={handleResendOtp}
          className={`${styles.btnFeature} ${styles.resendBtn}`}>
          {resendDisabled ? `Resend OTP (${timer}s)` : "Resend OTP"}
        </button>
      </form>
    </>
  );
}

export default ResetPassword;