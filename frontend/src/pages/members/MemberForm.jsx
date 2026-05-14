import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, Mail } from "lucide-react";
import styles from "./MemberForm.module.css";

const getMaxDob = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
};

function MemberForm({
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
  /* OTP — create only */
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

  /* Common bind helper */
  const bind = (name, extra = {}) => ({
    name,
    value: userinfo[name] ?? "",
    onChange: handleChange,
    className: `${styles.input} ${errors[name] ? styles.inputErr : ""}`,
    ...extra,
  });

  const Err = ({ name }) =>
    errors[name] ? <p className={styles.errMsg}>{errors[name]}</p> : null;

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* ── Title ──────────────────────────────────── */}
        <h1 className={styles.title}>{title}</h1>

        {/* _______ PERSONAL INFO _______ */}
        <p className={styles.divider}>Personal Info</p>

        <div className={styles.field}>
          <label className={styles.label}>
            First Name <sup>*</sup>
          </label>
          <input {...bind("first_name")} placeholder="John" />
          <Err name="first_name" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Last Name</label>
          <input {...bind("last_name")} placeholder="Doe" />
          <Err name="last_name" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Phone <sup>*</sup>
          </label>
          <input {...bind("phone")} inputMode="tel" placeholder="9876543210" />
          <Err name="phone" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Date of Birth</label>
          <input type="date" max={maxDob} {...bind("date_of_birth")} />
          <Err name="date_of_birth" />
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
                placeholder="john@example.com"
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
                  {loading ? (
                    <span className={styles.spinner}>
                      <i className="fa-solid fa-spinner fa-spin" /> Sending…
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
        )}

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

        {/* _______ MEMBERSHIP (edit only — admin sets these) _______ */}
        {isEdit && (
          <>
            <p className={styles.divider}>Membership</p>

            <div className={styles.field}>
              <label className={styles.label}>Membership End</label>
              <input type="date" {...bind("membership_end")} />
              <Err name="membership_end" />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Max Books Allowed</label>
              <input
                type="number"
                min="1"
                max="10"
                {...bind("max_books_allowed")}
                placeholder="3"
              />
              <Err name="max_books_allowed" />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Account Status <sup>*</sup>
              </label>
              <select {...bind("status")}>
                <option value="">Select status</option>
                <option value="active">Active — can borrow</option>
                <option value="inactive">Inactive — access blocked</option>
                <option value="suspended">Suspended</option>
              </select>
              <Err name="status" />
            </div>
          </>
        )}

        {/* _______ SECURITY (create only) _______ */}
        {!isEdit && (
          <>
            <p className={styles.divider}>Security</p>

            <div className={styles.pwField}>
              <label className={styles.label}>
                Password <sup>*</sup>
              </label>
              <input
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
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

            <div className={styles.pwField}>
              <label className={styles.label}>
                Confirm Password <sup>*</sup>
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter password"
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
              onClick={() => navigate("/memberinventory")}
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
                ? "Update Member"
                : "Create Member"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberForm;
