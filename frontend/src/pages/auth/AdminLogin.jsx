import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { loginAdmin } from "../../services/admin/auth.service";
import styles from "./AdminLogin.module.css";

/* ─────────────────────────────────────────────────────────────────
   AdminLoginForm
   ─ Email/password login
   ─ Login with Google  (existing admin account)
   ─ Error messages from OAuth redirects (?error=auth_failed etc.)
───────────────────────────────────────────────────────────────── */
function AdminLoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* -- State ---------------------------------------------------- */
  const [showPassword, setShowPassword] = useState(false);
  const [userinfo, setUserInfo] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(
    // Show OAuth error if redirected from backend
    searchParams.get("error") === "auth_failed"
      ? "Google login failed. Make sure you're using your registered email."
      : searchParams.get("error") === "invite_required"
        ? "Invalid invite link. Please request a new invite."
        : "",
  );
  const [notifyType, setNotifyType] = useState(
    searchParams.get("error") ? "error" : "",
  );
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /* -- Notification helper -------------------------------------- */
  const showNotification = (msg, type) => {
    setNotification(msg);
    setNotifyType(type);
    setTimeout(() => {
      setNotification("");
      setNotifyType("");
    }, 5000);
  };

  /* -- Input change --------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* -- Email / Password submit ---------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!userinfo.email.trim()) newErrors.email = "Email is required";
    if (!userinfo.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      setLoading(true);
      const res = await loginAdmin(userinfo);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      showNotification("Login successful!", "success");

      // Small delay so user sees the success message
      setTimeout(() => navigate("/", { replace: true }), 600);
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Invalid email or password",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  /* -- Google Login (existing admin) ---------------------------- */
  const handleGoogleLogin = () => {
    const backendBase = process.env.REACT_APP_API_URL;

    if (!backendBase) {
      showNotification("Configuration error. Please contact support.", "error");
      console.error("[AdminLogin] REACT_APP_API_URL is not set");
      return;
    }

    setGoogleLoading(true);
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google/superadmin`;

  };

  /* -- Member placeholder --------------------------------------- */
  const handleMember = (e) => {
    e.preventDefault();
    alert("Member portal coming soon");
  };

  /* -- UI ------------------------------------------------------- */
  return (
    <>
      {notification && (
        <div className={`${styles.notify} ${styles[notifyType]}`}>
          {notification}
        </div>
      )}

      {/* ── HEADER ── */}
      <header className={styles.headers}>
        <div className={styles.leftIcon}>
          <i className="fa-solid fa-book-open-reader logoIcon"></i>
        </div>
        <div className={styles.headingTitle}>
          <h2>APV Tech Library</h2>
        </div>
      </header>

      {/* ── FORM ── */}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.formSection}>
          <h1 className={styles.formTitle}>
            Admin Login <i className="fa-solid fa-user-shield"></i>
          </h1>

          {/* EMAIL */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={userinfo.email}
              onChange={handleChange}
              disabled={loading || googleLoading}
              autoComplete="email"
              className={`${styles.formInput} ${
                errors.email ? styles.inputError : ""
              }`}
            />
            {errors.email && (
              <span className={styles.errorMsg}>{errors.email}</span>
            )}
          </div>

          {/* PASSWORD */}
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
                disabled={loading || googleLoading}
                autoComplete="current-password"
                className={`${styles.formInput} ${
                  errors.password ? styles.inputError : ""
                }`}
              />
              <span
                className={styles.eye_icon}
                onClick={() => setShowPassword((prev) => !prev)}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                />
              </span>
            </div>
            {errors.password && (
              <span className={styles.errorMsg}>{errors.password}</span>
            )}
          </div>

          {/* BUTTONS */}
          <div className={styles.btnSection}>
            {/* Email/password login */}
            <button
              type="submit"
              className={styles.btnFeature}
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <span className={styles.spinnerSmall} /> Logging in…
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Divider */}
            <div className={styles.divider}>
              <span>or</span>
            </div>

            {/* Google login — for admins who already have an account */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className={styles.googleBtn}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <>
                  <span className={styles.spinnerSmall} /> Redirecting…
                </>
              ) : (
                <>
                  <i className="fa-brands fa-google" /> Login with Google
                </>
              )}
            </button>
          </div>

          {/* Member link */}
          <p className={styles.memberLink}>
            <Link onClick={handleMember} className={styles.linkStyle} to="/">
              Member Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default AdminLoginForm;
