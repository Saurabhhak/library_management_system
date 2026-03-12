import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword, forgotPassword } from "../../services/auth.service";
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

  const [timer, setTimer] = useState(120); // 2 minutes
  const [resendDisabled, setResendDisabled] = useState(true);
  useEffect(() => {
    if (timer === 0) {
      setResendDisabled(false);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
  const showNotification = (msg, type) => {
    setNotification(msg);
    setNotifyType(type);

    setTimeout(() => {
      setNotification("");
      setNotifyType("");
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const otpRegex = /^[0-9]{6}$/;
    const passwordRegex =
      /^(?=(?:.*[a-z]){3,})(?=.*[A-Z])(?=(?:.*\d){2,3})(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!otp) newErrors.otp = "OTP required";
    else if (!otpRegex.test(otp))
      newErrors.otp = "OTP must be 6 digits";

    if (!password)
      newErrors.password = "Password required";
    else if (!passwordRegex.test(password))
      newErrors.password =
        "1 capital, 3 lowercase, 2 numbers, 1 special character, min 8 characters";

    if (!confirm)
      newErrors.confirm = "Confirm password required";
    else if (password !== confirm)
      newErrors.confirm = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {

      setLoading(true);

      await resetPassword({ email, otp, password });

      showNotification("Password updated successfully", "success");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {

      showNotification(
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
      showNotification("OTP sent again", "success");
      setTimer(120); // reset timer
      setResendDisabled(true);
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to resend OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {notification && (
        <div className={`${styles.notify} ${styles[notifyType]}`}>
          {notification}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        {/* OTP */}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[0-9]*$/.test(value)) {
              setOtp(value);
              setErrors(prev => ({ ...prev, otp: "" }));
            }
          }}
          className={`${styles.formInput} ${errors.otp ? styles.inputError : ""}`}
        />
        {errors.otp && <p className={styles.errorMsg}>{errors.otp}</p>}

        {/* Password */}
        <div className={styles.password_wrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors(prev => ({ ...prev, password: "" }));
            }}
            className={`${styles.formInput} ${errors.password ? styles.inputError : ""}`}
          />

          <span
            className={styles.eye_icon}
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
          </span>
        </div>

        {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}

        {/* Confirm Password */}
        <div className={styles.password_wrapper}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              setErrors(prev => ({ ...prev, confirm: "" }));
            }}
            className={`${styles.formInput} ${errors.confirm ? styles.inputError : ""}`}
          />

          <span
            className={styles.eye_icon}
            onClick={() => setShowConfirm(!showConfirm)}
          >
            <i className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
          </span>
        </div>

        {errors.confirm && <p className={styles.errorMsg}>{errors.confirm}</p>}

        <button type="submit" disabled={loading} className={styles.btnFeature}>
          {loading ? "Updating..." : "Update Password"}
        </button>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendDisabled}
          className={`${styles.btnFeature} ${styles.resendBtn}`}
        >
          {resendDisabled
            ? `Resend OTP (${timer}s)`
            : "Resend OTP"}
        </button>
      </form>
    </>
  );
}

export default ResetPassword;