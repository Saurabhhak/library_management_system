import { useNavigate } from "react-router-dom";
import styles from "../../pages/admin/AdminForm.module.css"; // Reuse styling!

export default function MemberForm({
  title,
  userinfo,
  handleChange,
  handleSubmit,
  errors,
  isEdit,
  isSubmitting,
}) {
  const navigate = useNavigate();
  const bind = (name, extra = {}) => ({
    name,
    value: userinfo[name] ?? "",
    onChange: handleChange,
    className: `${styles.input} ${errors[name] ? styles.inputErr : ""}`,
    ...extra,
  });

  const Err = ({ name }) =>
    errors[name] ? <p className={styles.errMsg}>{errors[name]}</p> : null;

  // Smart Check for Dynamic Fields
  const isStudent = userinfo.member_type === "student";
  const isFaculty =
    userinfo.member_type === "teacher" || userinfo.member_type === "professor";

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h1 className={styles.title}>{title}</h1>

        <p className={styles.divider}>Institutional Identity</p>
        <div className={styles.field}>
          <label className={styles.label}>
            Member Type <sup>*</sup>
          </label>
          <select {...bind("member_type", { disabled: isEdit })}>
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="professor">Professor</option>
          </select>
          <Err name="member_type" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Institutional ID (Roll No / Emp ID)
          </label>
          <input
            {...bind("institutional_id")}
            placeholder="Leave blank to auto-generate"
            disabled={isEdit}
          />
          <Err name="institutional_id" />
        </div>

        {/* ── DYNAMIC FIELDS BASED ON ROLE ── */}
        {isStudent && (
          <>
            <div className={styles.field}>
              <label className={styles.label}>Course</label>
              <input
                {...bind("course")}
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Batch Year</label>
              <input {...bind("batch_year")} placeholder="e.g. 2024-2028" />
            </div>
          </>
        )}
        {isFaculty && (
          <>
            <div className={styles.field}>
              <label className={styles.label}>Department</label>
              <input {...bind("department")} placeholder="e.g. Physics Dept" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Designation</label>
              <input
                {...bind("designation")}
                placeholder="e.g. Head of Department"
              />
            </div>
          </>
        )}

        <p className={styles.divider}>Personal Details</p>
        <div className={styles.field}>
          <label className={styles.label}>
            First Name <sup>*</sup>
          </label>
          <input {...bind("first_name")} /> <Err name="first_name" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            Last Name <sup>*</sup>
          </label>
          <input {...bind("last_name")} /> <Err name="last_name" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            Email Address <sup>*</sup>
          </label>
          <input type="email" {...bind("email")} disabled={isEdit} />{" "}
          <Err name="email" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Phone Number</label>
          <input {...bind("phone")} maxLength={10} /> <Err name="phone" />
        </div>

        {isEdit && (
          <>
            <p className={styles.divider}>Library Access</p>
            <div className={styles.field}>
              <label className={styles.label}>
                Status <sup>*</sup>
              </label>
              <select {...bind("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive / Suspended</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Max Books Allowed</label>
              <input
                type="number"
                {...bind("max_books_allowed")}
                min="1"
                max="15"
              />
            </div>
          </>
        )}

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
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Update Member"
                : "Enroll Member"}
          </button>
        </div>
      </form>
    </div>
  );
}
