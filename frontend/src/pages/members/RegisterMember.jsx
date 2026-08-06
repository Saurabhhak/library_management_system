import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, Mail } from "lucide-react";
import Swal from "sweetalert2";
import { sendOtp, verifyOtp } from "../../services/auth/otp.service";
import { createMember } from "../../services/member/member.service";
import styles from "./RegisterMember.module.css";

/* ── Swal toast ─────────────────────────────────────────────────── */
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

const PASSWORD_REGEX =
  /^(?=(.*[A-Za-z]){3,})(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const OTP_RESEND_DELAY = 30;

const INIT = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
};

export default function RegisterMember() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setTimer(0);
    setResendDisabled(true);
  }, [form.email]);

  useEffect(() => {
    if (!otpSent || timer === 0) {
      if (timer === 0) setResendDisabled(false);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer, otpSent]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSendOtp = async () => {
    if (!form.email) {
      toast("warning", "Enter your email first.");
      return;
    }
    try {
      setLoading(true);
      await sendOtp({
        email: form.email,
        role: "member",
        purpose: "registration",
      });
      setOtpSent(true);
      setTimer(OTP_RESEND_DELAY);
      setResendDisabled(true);
      toast("success", "OTP sent — check your inbox.");
    } catch (err) {
      toast("error", err?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast("warning", "Enter the 6-digit OTP.");
      return;
    }
    try {
      await verifyOtp({
        email: form.email,
        otp,
        role: "member",
        purpose: "registration",
      });
      setOtpVerified(true);
      toast("success", "Email verified successfully.");
    } catch (err) {
      toast("error", err?.response?.data?.message || "Invalid OTP.");
    }
  };

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "First name is required.";
    if (!form.last_name.trim()) e.last_name = "Last name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.password) {
      e.password = "Password is required.";
    } else if (!PASSWORD_REGEX.test(form.password)) {
      e.password = "Min 8 chars, 1 uppercase, 1 number, 1 special character.";
    }
    if (form.password !== form.confirm_password)
      e.confirm_password = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      toast("warning", "Please verify your email before submitting.");
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast("error", Object.values(errs)[0]);
      return;
    }

    try {
      setLoading(true);
      await createMember({
        first_name: form.first_name,
        last_name: form.last_name,
        member_type:form.member_type,
        email: form.email,
        password: form.password,
      });
      toast("success", "Account created! Please log in.");
      setTimeout(() => navigate("/memberlogin"), 1200);
    } catch (err) {
      toast("error", err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const Err = ({ name }) =>
    errors[name] ? <p className={styles.errMsg}>{errors[name]}</p> : null;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <i className="fa-solid fa-book-open-reader" />
          </span>
          <h1 className={styles.brandName}>APV Library</h1>
        </div>

        <h2 className={styles.heading}>Create Member Account</h2>
        <p className={styles.sub}>Join the library — quick & simple</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>First Name</label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="John"
                className={`${styles.input} ${errors.first_name ? styles.inputErr : ""}`}
              />
              <Err name="first_name" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Last Name</label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className={`${styles.input} ${errors.last_name ? styles.inputErr : ""}`}
              />
              <Err name="last_name" />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>I am a</label>
            <select
              name="member_type"
              value={form.member_type}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="professor">Professor</option>
              <option value="staff">Staff (non-teaching)</option>
              <option value="guest">Guest</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.otpRow}>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={otpVerified}
                placeholder="you@example.com"
                autoComplete="email"
                className={`${styles.input} ${errors.email ? styles.inputErr : ""}`}
              />
              {otpVerified ? (
                <div className={styles.verifiedBadge}>
                  <CheckCircle size={14} strokeWidth={2.5} /> Verified
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || (otpSent && resendDisabled)}
                  className={styles.btnInline}
                >
                  {loading ? "Sending…" : otpSent ? "Resend" : "Send OTP"}
                </button>
              )}
            </div>
            <Err name="email" />

            {otpSent && !otpVerified && (
              <div className={styles.otpBox}>
                <div className={styles.otpInputRow}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className={styles.input}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otp.length < 6}
                    className={styles.btnInline}
                  >
                    <Mail size={13} /> Verify
                  </button>
                </div>
                {resendDisabled ? (
                  <p className={styles.timer}>Resend in {timer}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className={styles.resendBtn}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.pwWrap}>
              <input
                type={showPw ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
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

          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.pwWrap}>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Re-enter password"
                className={`${styles.input} ${styles.pwInput} ${errors.confirm_password ? styles.inputErr : ""}`}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Err name="confirm_password" />
          </div>

          <button type="submit" className={styles.btnSubmit} disabled={loading}>
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link to="/memberlogin" className={styles.registerLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
