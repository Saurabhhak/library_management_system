import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginAdmin } from "../../services/admin/auth.service";
import styles from "./AdminLogin.module.css";

function AdminLoginForm() {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [showPassword, setShowPassword] = useState(false);
  const [userinfo, setUserInfo] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /* ---------------- INPUT ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ---------------- LOGIN ---------------- */
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!userinfo.email.trim()) newErrors.email = "Email required";
    if (!userinfo.password) newErrors.password = "Password required";

    setErrors(newErrors);

    //  ONLY stop submit (NO Swal for validation)
    if (Object.keys(newErrors).length) return;

    try {
      setLoading(true);

      const res = await loginAdmin(userinfo);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      // SUCCESS TOAST
      Toast.fire({
        icon: "success",
        title: "Login successful",
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      let message = "Something went wrong";

      if (err.response) {
        message = err.response.data?.message || message;
      } else if (err.request) {
        message = "Server not responding";
      } else {
        message = err.message;
      }

      //  ERROR TOAST ONLY
      Toast.fire({
        icon: "error",
        title: message,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GOOGLE (COMING SOON) ---------------- */
  const handleGoogleLogin = () => {
    Swal.fire({
      icon: "info",
      title: "Coming Soon ",
      text: "Google login will be available soon",
      confirmButtonColor: "#2563eb",
    });
    setGoogleLoading(false);
  };

  /* ---------------- MEMBER (COMING SOON) ---------------- */
  const handleMember = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "info",
      title: "Coming Soon ",
      text: "Member login system will be available soon",
      confirmButtonColor: "#2563eb",
    });
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* HEADER */}
      <header className={styles.headers}>
        <div className={styles.leftIcon}>
          <i className="fa-solid fa-book-open-reader"></i>
        </div>
        <div className={styles.headingTitle}>
          <h2>APV Tech Library</h2>
        </div>
      </header>

      {/* FORM */}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.formSection}>
          <h1 className={styles.formTitle}>
            Admin Login <i className="fa-solid fa-user-shield"></i>
          </h1>

          {/* EMAIL */}
          <div className={styles.formGroup}>
            <label>Email address</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                value={userinfo.email}
                onChange={handleChange}
                disabled={loading || googleLoading}
                className={`${styles.formInput} ${
                  errors.email ? styles.inputError : ""
                }`}
              />
              <span className={styles.inputIcon}>
                <i className="fa-solid fa-envelope"></i>
              </span>
            </div>
            {errors.email && (
              <span className={styles.errorMsg}>{errors.email}</span>
            )}
          </div>

          {/* PASSWORD */}
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Password</label>
              <Link to="/forgot-password" className={styles.linkStyle}>
                Forgot password?
              </Link>
            </div>

            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={userinfo.password}
                onChange={handleChange}
                disabled={loading || googleLoading}
                className={`${styles.formInput} ${
                  errors.password ? styles.inputError : ""
                }`}
              />

              {/* 👁 Eye icon RIGHT PERFECT */}
              <span
                className={styles.inputIcon}
                onClick={() => setShowPassword((p) => !p)}
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
            <button
              type="submit"
              className={styles.btnFeature}
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className={styles.googleBtn}
            >
              <i className="fa-brands fa-google"></i> Login with Google
            </button>
          </div>

          {/* MEMBER */}
          <p className={styles.memberLink}>
            <Link onClick={handleMember} to="/" className={styles.linkStyle}>
              Member Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default AdminLoginForm;
