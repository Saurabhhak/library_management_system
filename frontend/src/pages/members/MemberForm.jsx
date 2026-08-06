import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MemberForm.module.css";

const getMaxDob = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
};

/**
 * MemberForm — EDIT ONLY.
 *
 * Registration (create) now goes through RegisterMember.jsx, which is a
 * separate, simplified, OTP-gated public form. This component used to
 * handle both create + edit with a large set of conditional branches
 * (isEdit ? ... : ...) — that dead "create" code (email+OTP fields,
 * password/confirm fields, Reset button) has been removed since
 * UpdateMember.jsx is the only remaining consumer.
 */
function MemberForm({
  title = "Update Member",
  userinfo,
  handleChange,
  handleSubmit,
  states = [],
  cities = [],
  errors = {},
  loading = false,
}) {
  const navigate = useNavigate();
  const maxDob = useMemo(getMaxDob, []);

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
        <h1 className={styles.title}>{title}</h1>

        {/* ── Personal Info ── */}
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

        {/* ── Location ── */}
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

        {/* ── Membership (admin-controlled fields) ── */}
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

        {/* ── Actions ── */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate("/memberinventory")}
            className={styles.btnGhost}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.btnPrimary}
            disabled={loading}
          >
            {loading ? "Updating…" : "Update Member"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemberForm;
