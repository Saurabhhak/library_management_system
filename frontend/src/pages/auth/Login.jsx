import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { login as loginApi } from "../../services/auth/login.service";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/Auth.module.css";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  background: "#0f1117",
  color: "#e2e8f0",
});
const toast = (icon, title) =>
  Toast.fire({
    icon,
    title,
    iconColor: icon === "success" ? "#10b981" : "#ef4444",
  });

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.email) err.email = "Email is required.";
    if (!form.password) err.password = "Password is required.";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    try {
      setLoading(true);
      const { data } = await loginApi(form);
      const { accessToken, refreshToken, user } = data.data;

      login(accessToken, refreshToken, user);
      toast("success", `Welcome back, ${user.first_name}!`);

      const destination =
        user.role === "member" ? "/member/dashboard" : "/home";
      setTimeout(() => navigate(destination, { replace: true }), 600);
    } catch (err) {
      toast(
        "error",
        err?.response?.data?.message || "Invalid email or password.",
      );
      setForm((prev) => ({ ...prev, password: "" })); // Clear password on fail
    } finally {
      setLoading(false);
    }
  };

  const Err = ({ name }) =>
    errors[name] ? <p className={styles.errMsg}>{errors[name]}</p> : null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brandSide}>
          <h1 className={styles.brandTitle}>
            <i className="fa-solid fa-book-open-reader" /> LibraryMS
          </h1>
          <p className={styles.brandSubtitle}>
            Access your dashboard, manage your books, and explore resources
            seamlessly.
          </p>
        </div>

        <div className={styles.formSideLogin}>
          <div className={styles.formHeader}>
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <div className={styles.inputWrapper}>
                <i className="fa-solid fa-envelope" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@university.edu"
                  autoComplete="email"
                  className={errors.email ? styles.inputErr : ""}
                />
              </div>
              <Err name="email" />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>Password</label>
                <Link to="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>
              <div className={styles.inputWrapper}>
                <i className="fa-solid fa-lock" />
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={errors.password ? styles.inputErr : ""}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Err name="password" />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" /> Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className={styles.loginText}>
            Don't have an account? <Link to="/register">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
