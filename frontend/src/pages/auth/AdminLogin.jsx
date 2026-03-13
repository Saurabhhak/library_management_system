import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/admin.service";
import styles from "./LoginAdmin.module.css";
function AdminLoginForm() {
  /* ---------------- NAVIGATION ---------------- */
  const navigate = useNavigate();
  /* ---------------- STATE ---------------- */
  const [showPassword, setShowPassword] = useState(false);
  const [userinfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");
  const [notifyType, setNotifyType] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- NOTIFICATION ---------------- */
  const showNotification = (msg, type) => {
    setNotification(msg);
    setNotifyType(type);
    setTimeout(() => {
      setNotification("");
      setNotifyType("");
    }, 3000);
  };
  /* ---------------- INPUT CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({ ...errors, [name]: "" });
  };
  /* ---------------- FORM SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!userinfo.email) newErrors.email = "Email required";
    if (!userinfo.password) newErrors.password = "Password required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    try {
      setLoading(true);
      const res = await loginAdmin(userinfo);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      showNotification("Login successful", "success");
      navigate("/", { replace: true });
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Invalid email or password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  /* ---------------- MEMBER LOGIN (TEMP) ---------------- */
  function handleMember() {
    alert("Member Feature coming soon");
  }
  /* ---------------- UI ---------------- */
  return (
    <>
      {notification && (
        <div className={`${styles.notify} ${styles[notifyType]}`}>
          {notification}
        </div>
      )}
      {/* -------- HEADER -------- */}
      <header className={styles.headers}>
        <div className={styles.leftIcon}>
          <i className="fa-solid fa-book"></i>
        </div>
        <div className={styles.centerTitle}>
          <h2>APV Tech Library</h2>
        </div>
      </header>
      {/* -------- LOGIN FORM -------- */}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.formSection}>
          <h1 className={styles.tagh1}>Admin Login</h1>
          {/* -------- EMAIL FIELD -------- */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={userinfo.email}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.email ? styles.inputError : ""}`}
            />
            {errors.email && (
              <span className={styles.errorMsg}>{errors.email}</span>
            )}
          </div>
          {/* -------- PASSWORD FIELD -------- */}
          <div className={styles.formGroup}>
            <div className={styles.lableOrForgotPass}>
              <label htmlFor="password">Password</label>
              <Link className={styles.linkStyle} to="/forgot-password">
                Forgot password?
              </Link>
            </div>
            <div className={styles.password_wrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={userinfo.password}
                onChange={handleChange}
                className={`${styles.formInput} ${errors.password ? styles.inputError : ""}`}
              />
              <span
                className={styles.eye_icon}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            {errors.password && (
              <span className={styles.errorMsg}>{errors.password}</span>
            )}
          </div>
          {/* -------- LOGIN BUTTON -------- */}
          <div className={styles.btnSection}>
            <button
              type="submit"
              className={styles.btnFeature}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
          {/* -------- MEMBER LINK -------- */}
          <p>
            <Link
              onClick={handleMember}
              className={styles.linkStyle}
              to="/"
            >
              Member Login
            </Link>
          </p>

        </form>
      </div>
    </>
  );
}
export default AdminLoginForm;