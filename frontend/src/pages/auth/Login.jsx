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
    const identifier = form.email.trim(); // "form.email" state object ki key hai

    if (!identifier) {
      err.email = "Email or Institutional ID is required.";
    } else {
      // 1. Agar '@' hai, toh Email validation rule lagao
      if (identifier.includes("@")) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(identifier)) {
          err.email = "Please enter a valid email address.";
        }
      }
      // 2. Agar '@' nahi hai, toh Institutional ID validation rule lagao
      else {
        // Regex format: Starts with STU- or FAC-, exactly 4 digit year, followed by dash and alphanumeric code
        const idRegex = /^(STU|FAC)-\d{4}-[A-Za-z0-9]+$/i;
        if (!idRegex.test(identifier)) {
          err.email = "Invalid ID format. Use STU-2026-XXXX or FAC-2026-XXXX.";
        }
      }
    }

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
        {/* BRAND SIDE */}
        <div className={styles.brandSide}>
          <h1 className={styles.brandTitle}>
            <i className="fa-solid fa-book-open-reader" /> LibraryMS
          </h1>
          <p className={styles.brandSubtitle}>
            Access your dashboard, manage your books, and explore resources
            seamlessly.
          </p>
        </div>

        {/* FORM SIDE */}
        <div className={styles.formSideLogin}>
          <div className={styles.formHeader}>
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.inputGroup}>
              <label>Email or Institutional ID</label>
              <div className={styles.inputWrapper}>
                <i className="fa-solid fa-user" />{" "}
                <input
                  name="email"
                  type="text"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@university.edu or STU-2026-XXXX"
                  autoComplete="username"
                  className={errors.email ? styles.inputErr : ""}
                />
              </div>
              <Err name="email" />
            </div>

            {/* PASSWORD INPUT & RECOVERY LINKS */}
            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>Password</label>

                {/* ── THE FIX: Tab-based Recovery Links ── */}
                <div className={styles.recoveryLinks}>
                  <Link
                    to="/forgot-password"
                    state={{ tab: "password" }}
                    className={styles.forgotLink}
                  >
                    Forgot password?
                  </Link>
                  <span className={styles.linkDivider}>|</span>
                  <Link
                    to="/forgot-password"
                    state={{ tab: "id" }}
                    className={styles.forgotLink}
                  >
                    Forgot ID?
                  </Link>
                </div>
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

            {/* SUBMIT BUTTON */}
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
        </div>
      </div>
    </div>
  );
}
