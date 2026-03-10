import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/adminapi";
import styles from "./AdminLogin.module.css";

function AdminLoginForm() {
  const navigate = useNavigate();

  const [userinfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");
  const [notifyType, setNotifyType] = useState("");

  const showNotification = (msg, type) => {
    setNotification(msg);
    setNotifyType(type);

    setTimeout(() => {
      setNotification("");
      setNotifyType("");
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInfo({ ...userinfo, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleReset = () => {
    setUserInfo({ email: "", password: "" });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: userinfo.email ? "" : "Email field is required",
      password: userinfo.password ? "" : "Password field is required",
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    try {
      const res = await loginAdmin(userinfo);
      // Login ke baad frontend me token localStorage me save hota hai
      localStorage.setItem("token", res.data.token);
      showNotification("Login successful", "success");

      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Invalid email or password",
        "error",
      );
    }
  };

  return (
    <>
      {notification && (
        <div className={`${styles.notify} ${styles[notifyType]}`}>
          {notification}
        </div>
      )}

      <header className={styles.headers}>
        <div className={styles.leftIcon}>
          <i className="fa-solid fa-book"></i>
        </div>

        <div className={styles.centerTitle}>
          <h2>APV Tech Library</h2>
        </div>
      </header>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.formSection}>
          <h1 className={styles.tagh1}>Admin Login</h1>

          <input
            className={`${styles.formInput} ${
              errors.email ? styles.inputError : ""
            }`}
            type="email"
            name="email"
            value={userinfo.email}
            onChange={handleChange}
            placeholder="Admin email"
          />

          {errors.email && (
            <span className={styles.errorMsg}>{errors.email}</span>
          )}

          <input
            className={`${styles.formInput} ${
              errors.password ? styles.inputError : ""
            }`}
            type="password"
            name="password"
            value={userinfo.password}
            onChange={handleChange}
            placeholder="Admin password"
          />

          {errors.password && (
            <span className={styles.errorMsg}>{errors.password}</span>
          )}

          <div className={styles.btnSection}>
            <button
              type="reset"
              className={styles.btnFeature}
              onClick={handleReset}
            >
              Reset
            </button>

            <button type="submit" className={styles.btnFeature}>
              Login
            </button>
          </div>

          <p>
            <Link className={styles.linkStyle} to="/">
              Member Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default AdminLoginForm;
