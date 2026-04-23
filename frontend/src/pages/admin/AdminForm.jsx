import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, Mail } from "lucide-react";
import styles from "./AdminForm.module.css";

/* max DOB = today − 18 years (enforced natively + validated on submit) */
const getMaxDob = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
};

function AdminForm({
  title,
  userinfo,
  handleChange,
  handleSubmit,
  handleReset,
  states = [],
  cities = [],
  errors = {},
  isEdit = false,
  loading = false,
  /* OTP (create only) */
  handleSendOtp,
  handleVerifyOtp,
  otp,
  setOtp,
  otpSent,
  otpVerified,
  timer,
  resendDisabled,
}) {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const maxDob = useMemo(getMaxDob, []);

  /* Spread common attributes onto every controlled input / select */
  const bind = (name, extra = {}) => ({
    name,
    value: userinfo[name] ?? "",
    onChange: handleChange,
    className: `${styles.input} ${errors[name] ? styles.inputErr : ""}`,
    ...extra,
  });

  /* Inline error line */
  const Err = ({ name }) =>
    errors[name] ? <p className={styles.errMsg}>{errors[name]}</p> : null;

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* ── Title ─────────────────────────────────── */}
        <h1 className={styles.title}>{title}</h1>

        {/* _______ PERSONAL INFO _______ */}
        <p className={styles.divider}>Personal Info</p>

        <div className={styles.field}>
          <label className={styles.label}>
            First Name <sup>*</sup>
          </label>
          <input {...bind("first_name")} />
          <Err name="first_name" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Last Name <sup>*</sup>
          </label>
          <input {...bind("last_name")} />
          <Err name="last_name" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Phone <sup>*</sup>
          </label>
          <input {...bind("phone")} inputMode="tel" />
          <Err name="phone" />
        </div>

        {/* DOB — browser picker limited to ≥ 18 yrs ago */}
        <div className={styles.field}>
          <label className={styles.label}>
            Date of Birth <sup>*</sup>
          </label>
          <input type="date" max={maxDob} {...bind("dob")} />
          <Err name="dob" />
        </div>

        {/* _______ EMAIL + OTP (create only) _______ */}
        {!isEdit && (
          <div className={`${styles.field} ${styles.span2}`}>
            <label className={styles.label}>
              Email Address <sup>*</sup>
            </label>

            <div className={styles.otpRow}>
              <input
                name="email"
                value={userinfo.email}
                onChange={handleChange}
                disabled={otpVerified}
                inputMode="email"
                autoComplete="email"
                className={`${styles.input} ${errors.email ? styles.inputErr : ""}`}
              />
              {otpVerified ? (
                <div className={styles.verifiedBadge}>
                  <CheckCircle size={14} strokeWidth={2.5} />
                  Verified
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || (otpSent && resendDisabled)}
                  className={styles.btnInline}
                >
                  {loading ? (
                    <span className={styles.spinner}>
                      <i className="fa-solid fa-spinner fa-spin" />
                      Sending…
                    </span>
                  ) : otpSent ? (
                    "Resend OTP"
                  ) : (
                    "Send OTP"
                  )}
                </button>
              )}
            </div>
            <Err name="email" />

            {/* OTP verify row */}
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
                    <Mail size={13} />
                    Verify
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
        )}

        {/* _______ ACCOUNT SETTINGS _______ */}
        <p className={styles.divider}>Account Settings</p>

        <div className={styles.field}>
          <label className={styles.label}>
            Role <sup>*</sup>
          </label>
          <select {...bind("role")}>
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <Err name="role" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Account Status <sup>*</sup>
          </label>
          <select {...bind("is_active")}>
            <option value="">Select status</option>
            <option value="active">Active — can log in</option>
            <option value="inactive">Inactive — login blocked</option>
          </select>
          <Err name="is_active" />
        </div>

        {/* _______ LOCATION _______ */}
        <p className={styles.divider}>Location</p>

        <div className={styles.field}>
          <label className={styles.label}>
            State <sup>*</sup>
          </label>
          <select {...bind("state_id")}>
            <option value="">Select state</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <Err name="state_id" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            City <sup>*</sup>
          </label>
          <select {...bind("city_id")}>
            <option value="">Select city</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Err name="city_id" />
        </div>

        {/* _______ SECURITY — create only _______ */}
        {!isEdit && (
          <>
            <p className={styles.divider}>Security</p>

            {/* Password */}
            <div className={styles.pwField}>
              <label className={styles.label}>
                Password <sup>*</sup>
              </label>
              <input
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                {...bind("password", {
                  className: `${styles.input} ${styles.pwInput} ${errors.password ? styles.inputErr : ""}`,
                })}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <Err name="password" />
            </div>

            {/* Confirm Password */}
            <div className={styles.pwField}>
              <label className={styles.label}>
                Confirm Password <sup>*</sup>
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                {...bind("confirm_password", {
                  className: `${styles.input} ${styles.pwInput} ${errors.confirm_password ? styles.inputErr : ""}`,
                })}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <Err name="confirm_password" />
            </div>
          </>
        )}

        {/* _______ ACTIONS _______ */}
        <div className={styles.actions}>
          {isEdit ? (
            <button
              type="button"
              onClick={() => navigate("/admininventory")}
              className={styles.btnGhost}
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className={styles.btnGhost}
            >
              Reset
            </button>
          )}

          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading}
          >
            {loading
              ? isEdit
                ? "Updating…"
                : "Creating…"
              : isEdit
                ? "Update Admin"
                : "Create Admin"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminForm;
