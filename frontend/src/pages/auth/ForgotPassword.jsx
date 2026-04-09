import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/validations/password.service";
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [notifyType, setNotifyType] = useState("");
  
  const showNotification = (msg, type) => {
    setNotification(msg);
    setNotifyType(type);
    setTimeout(() => {
      setNotification("");
      setNotifyType("");
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email required");
      return;
    }
    try {
      setLoading(true);
      await forgotPassword({ email }); // must send object
      showNotification("OTP sent to your email", "success");
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1000);
    } catch (err) {
      showNotification(err.response?.data?.message || "Error sending OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notification && <div className={`${styles.notify} ${styles[notifyType]}`}>{notification}</div>}
      <form onSubmit={handleSubmit} className={styles.formSection}>
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter admin email"
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

export default ForgotPassword;