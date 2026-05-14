import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { memberLogin } from "../../../services/member/auth.service";
import styles from "./Memberlogin.module.css";

/* ── Swal helpers ───────────────────────────────────────────────── */
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#0b0e18",
  color: "#dde6f8",
  iconColor: "#10b981",
});
const toast = (icon, title) => Toast.fire({ icon, title });

/* ─────────────────────────────────────────────────────────────────
   MemberLogin
───────────────────────────────────────────────────────────────── */
export default function MemberLogin() {
  const navigate = useNavigate();
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
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);
      const { data } = await memberLogin(form);
      localStorage.setItem("memberToken", data.token);
      localStorage.setItem("memberInfo", JSON.stringify(data.data));
      toast("success", `Welcome back, ${data.data.first_name}!`);
      setTimeout(() => navigate("/member/dashboard"), 800);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Login failed. Please try again.";
      if (err?.response?.status === 403) toast("error", msg);
      else setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  };

  const Err = ({ name }) =>
    errors[name] ? <p className={styles.errMsg}>{errors[name]}</p> : null;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* ── Brand ───────────────────────────────────── */}
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <i className="fa-solid fa-book-open-reader" />
          </span>
          <h1 className={styles.brandName}>LMS</h1>
        </div>

        <h2 className={styles.heading}>Member Login</h2>
        <p className={styles.sub}>Access your library account</p>

        {/* ── Form ────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              className={`${styles.input} ${errors.email ? styles.inputErr : ""}`}
            />
            <Err name="email" />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Password</label>
              <Link to="/member/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
            <div className={styles.pwWrap}>
              <input
                name="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`${styles.input} ${styles.pwInput} ${errors.password ? styles.inputErr : ""}`}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Err name="password" />
          </div>

          {/* Submit */}
          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* ── Footer ──────────────────────────────────── */}
        <p className={styles.footer}>
          Not a member yet?{" "}
          <Link to="/createmember" className={styles.registerLink}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
