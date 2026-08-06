import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../api/axiosInstance";
import styles from "./Settings.module.css";

/* ─────────────────────────────────────────────────────────────────────────────
 * Settings Page
 * Tabs: Profile · Security  (Preferences removed — future requirement)
 * Works for all roles: superadmin / admin / librarian / staff / member
 * ───────────────────────────────────────────────────────────────────────────── */

const TABS = [
  { id: "profile", label: "Profile", icon: "fa-solid fa-user-circle" },
  { id: "security", label: "Security", icon: "fa-solid fa-shield-halved" },
];

const ROLE_LABELS = {
  superadmin: { label: "Super Admin", color: "badge--superadmin" },
  admin: { label: "Admin", color: "badge--admin" },
  librarian: { label: "Librarian", color: "badge--admin" },
  staff: { label: "Staff", color: "badge--admin" },
  member: { label: "Member", color: "badge--member" },
};

/* ── Profile Tab ──────────────────────────────────────────────────────────── */
function ProfileTab({ profile, onUpdated }) {
  const role = profile?.role ?? "member";
  const roleInfo = ROLE_LABELS[role] ?? { label: role, color: "badge--member" };
  const initials = (profile?.first_name ??
    profile?.email ??
    "?")[0].toUpperCase();

  const [form, setForm] = useState({
    first_name: profile?.first_name ?? "",
    last_name: profile?.last_name ?? "",
    phone: profile?.phone ?? "",
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint =
        role === "member" ? "/members/profile" : "/admin/profile";
      const { data } = await axiosInstance.put(endpoint, {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
      });
      onUpdated?.(data.user);

      Swal.fire({
        icon: "success",
        title: "Profile updated",
        timer: 1400,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#e5e7eb",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          err.response?.data?.message ??
          "Could not save changes. Please try again.",
        background: "#0f172a",
        color: "#e5e7eb",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.avatarRow}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.avatarInfo}>
          <span className={`${styles.badge} ${styles[roleInfo.color]}`}>
            <i className="fa-solid fa-circle-check" /> {roleInfo.label}
          </span>
          <p className={styles.avatarEmail}>{profile?.email ?? "—"}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>First Name</label>
          <input
            className={styles.input}
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="First name"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Last Name</label>
          <input
            className={styles.input}
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Last name"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email Address</label>
          <input
            className={`${styles.input} ${styles.inputReadonly}`}
            value={profile?.email ?? ""}
            readOnly
            title="Email cannot be changed here"
          />
          <p className={styles.hint}>
            <i className="fa-solid fa-circle-info" /> Contact support to change
            your email
          </p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Phone Number</label>
          <input
            className={styles.input}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 00000 00000"
            type="tel"
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Role</label>
          <input
            className={`${styles.input} ${styles.inputReadonly}`}
            value={roleInfo.label}
            readOnly
          />
        </div>

        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" /> Saving…
            </>
          ) : (
            <>
              <i className="fa-solid fa-floppy-disk" /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}

/* ── Security Tab ─────────────────────────────────────────────────────────── */
function SecurityTab({ role }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    newPw: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }
  function toggleShow(field) {
    setShow((p) => ({ ...p, [field]: !p[field] }));
  }

  function strength(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  const pwStrength = strength(form.newPassword);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const strengthClass = [
    "",
    styles.weak,
    styles.fair,
    styles.good,
    styles.strong,
  ][pwStrength];

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return Swal.fire({
        icon: "warning",
        title: "Passwords do not match",
        background: "#0f172a",
        color: "#e5e7eb",
      });
    }
    if (pwStrength < 2) {
      return Swal.fire({
        icon: "warning",
        title: "Password too weak",
        text: "Use at least 8 characters with uppercase letters and numbers.",
        background: "#0f172a",
        color: "#e5e7eb",
      });
    }

    setSaving(true);
    try {
      const endpoint =
        role === "member"
          ? "/members/change-password"
          : "/admin/change-password";

      await axiosInstance.put(endpoint, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password changed",
        timer: 1400,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#e5e7eb",
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message ?? "Could not change password",
        background: "#0f172a",
        color: "#e5e7eb",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <i className="fa-solid fa-lock" />
        <div>
          <h3 className={styles.sectionTitle}>Change Password</h3>
          <p className={styles.sectionDesc}>
            Use a strong password you don't use elsewhere
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Current Password</label>
          <div className={styles.pwWrap}>
            <input
              className={styles.input}
              name="currentPassword"
              type={show.current ? "text" : "password"}
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => toggleShow("current")}
            >
              <i
                className={`fa-solid ${show.current ? "fa-eye-slash" : "fa-eye"}`}
              />
            </button>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>New Password</label>
          <div className={styles.pwWrap}>
            <input
              className={styles.input}
              name="newPassword"
              type={show.newPw ? "text" : "password"}
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => toggleShow("newPw")}
            >
              <i
                className={`fa-solid ${show.newPw ? "fa-eye-slash" : "fa-eye"}`}
              />
            </button>
          </div>
          {form.newPassword && (
            <div className={styles.strengthWrap}>
              <div className={styles.strengthBar}>
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`${styles.strengthSegment} ${pwStrength >= n ? strengthClass : ""}`}
                  />
                ))}
              </div>
              <span className={`${styles.strengthLabel} ${strengthClass}`}>
                {strengthLabel}
              </span>
            </div>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Confirm New Password</label>
          <div className={styles.pwWrap}>
            <input
              className={`${styles.input} ${
                form.confirmPassword &&
                form.confirmPassword !== form.newPassword
                  ? styles.inputError
                  : ""
              }`}
              name="confirmPassword"
              type={show.confirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              required
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => toggleShow("confirm")}
            >
              <i
                className={`fa-solid ${show.confirm ? "fa-eye-slash" : "fa-eye"}`}
              />
            </button>
          </div>
          {form.confirmPassword &&
            form.confirmPassword !== form.newPassword && (
              <p className={styles.hintError}>
                <i className="fa-solid fa-triangle-exclamation" /> Passwords do
                not match
              </p>
            )}
        </div>

        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" /> Saving…
            </>
          ) : (
            <>
              <i className="fa-solid fa-key" /> Update Password
            </>
          )}
        </button>
      </form>

      <div className={styles.infoCard}>
        <i className="fa-solid fa-circle-info" />
        <p>
          Changing your password will not log you out of this session, but all
          other active sessions will be invalidated.
        </p>
      </div>
    </div>
  );
}

/* ── Main Settings Component ──────────────────────────────────────────────── */
function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/auth/profile")
      .then((res) => setProfile(res.data.user))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <i className="fa-solid fa-gear" /> Settings
        </h1>
        <p className={styles.pageSubtitle}>Manage your account and security</p>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={tab.icon} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <i className="fa-solid fa-chevron-right" />
              )}
            </button>
          ))}
        </aside>

        <main className={styles.main}>
          {loading ? (
            <div className={styles.tabContent}>
              <i className="fa-solid fa-spinner fa-spin" /> Loading…
            </div>
          ) : (
            <>
              {activeTab === "profile" && (
                <ProfileTab profile={profile} onUpdated={setProfile} />
              )}
              {activeTab === "security" && (
                <SecurityTab role={profile?.role ?? "member"} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Settings;
