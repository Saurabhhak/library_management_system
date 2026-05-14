import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import styles from "./Settings.module.css";

/* ─────────────────────────────────────────────────────────────────────────────
 * Settings Page
 * Tabs: Profile · Security · Preferences
 * Works for all roles: superadmin / admin / member
 * ───────────────────────────────────────────────────────────────────────────── */

const TABS = [
  { id: "profile", label: "Profile", icon: "fa-solid fa-user-circle" },
  { id: "security", label: "Security", icon: "fa-solid fa-shield-halved" },
  { id: "preferences", label: "Preferences", icon: "fa-solid fa-sliders" },
];

const ROLE_LABELS = {
  superadmin: { label: "Super Admin", color: "badge--superadmin" },
  admin: { label: "Admin", color: "badge--admin" },
  member: { label: "Member", color: "badge--member" },
};

/* ── helpers ── */
function getDecodedToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return jwtDecode(token);
  } catch {
    return null;
  }
}

/* ── Profile Tab ──────────────────────────────────────────────────────────── */
function ProfileTab({ decoded }) {
  const role = decoded?.role ?? "member";
  const roleInfo = ROLE_LABELS[role] ?? { label: role, color: "badge--member" };
  const initials = (decoded?.name ?? decoded?.email ?? "?")[0].toUpperCase();

  const [form, setForm] = useState({
    name: decoded?.name ?? "",
    email: decoded?.email ?? "",
    phone: decoded?.phone ?? "",
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      /* Replace with your actual profile update API */
      const token = localStorage.getItem("token");
      const endpoint =
        role === "member" ? "/api/members/profile" : "/api/admin/profile";

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: form.name, phone: form.phone }),
      });

      if (!res.ok) throw new Error("Update failed");

      Swal.fire({
        icon: "success",
        title: "Profile updated",
        timer: 1400,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#e5e7eb",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Could not save changes. Please try again.",
        background: "#0f172a",
        color: "#e5e7eb",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.tabContent}>
      {/* Avatar + role badge */}
      <div className={styles.avatarRow}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.avatarInfo}>
          <span className={`${styles.badge} ${styles[roleInfo.color]}`}>
            <i className="fa-solid fa-circle-check" /> {roleInfo.label}
          </span>
          <p className={styles.avatarEmail}>{decoded?.email ?? "—"}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Full Name</label>
          <input
            className={styles.input}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email Address</label>
          <input
            className={`${styles.input} ${styles.inputReadonly}`}
            name="email"
            value={form.email}
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
function SecurityTab({ decoded }) {
  const role = decoded?.role ?? "member";

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

  /* Password strength meter */
  function strength(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0–4
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
      const token = localStorage.getItem("token");
      const endpoint =
        role === "member"
          ? "/api/members/change-password"
          : "/api/admin/change-password";

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed");
      }

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
        text: err.message ?? "Could not change password",
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
        {/* Current */}
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

        {/* New */}
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
          {/* Strength meter */}
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

        {/* Confirm */}
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

      {/* Active sessions info */}
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

/* ── Preferences Tab ──────────────────────────────────────────────────────── */
function PreferencesTab() {
  const [prefs, setPrefs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lib_prefs") ?? "{}");
    } catch {
      return {};
    }
  });

  function toggle(key) {
    setPrefs((p) => {
      const next = { ...p, [key]: !p[key] };
      localStorage.setItem("lib_prefs", JSON.stringify(next));
      return next;
    });
  }

  const toggleItems = [
    {
      key: "emailNotifications",
      label: "Email notifications",
      desc: "Get notified about due dates and updates",
      icon: "fa-solid fa-envelope",
    },
    {
      key: "smsNotifications",
      label: "SMS notifications",
      desc: "Receive SMS alerts for critical reminders",
      icon: "fa-solid fa-message",
    },
    {
      key: "compactTable",
      label: "Compact table rows",
      desc: "Show more data with smaller row height",
      icon: "fa-solid fa-table-list",
    },
    {
      key: "showRowNumbers",
      label: "Show row numbers",
      desc: "Display row index in all inventory tables",
      icon: "fa-solid fa-list-ol",
    },
  ];

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <i className="fa-solid fa-sliders" />
        <div>
          <h3 className={styles.sectionTitle}>Preferences</h3>
          <p className={styles.sectionDesc}>
            Customise your library experience
          </p>
        </div>
      </div>

      <div className={styles.prefList}>
        {toggleItems.map(({ key, label, desc, icon }) => (
          <div key={key} className={styles.prefItem}>
            <span className={styles.prefIcon}>
              <i className={icon} />
            </span>
            <div className={styles.prefText}>
              <span className={styles.prefLabel}>{label}</span>
              <span className={styles.prefDesc}>{desc}</span>
            </div>
            <button
              className={`${styles.toggle} ${prefs[key] ? styles.toggleOn : ""}`}
              onClick={() => toggle(key)}
              aria-pressed={!!prefs[key]}
              title={prefs[key] ? "Disable" : "Enable"}
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.infoCard}>
        <i className="fa-solid fa-circle-info" />
        <p>
          Preferences are saved locally in your browser. Clearing browser data
          will reset them.
        </p>
      </div>
    </div>
  );
}

/* ── Main Settings Component ──────────────────────────────────────────────── */
function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const decoded = getDecodedToken();

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <i className="fa-solid fa-gear" /> Settings
        </h1>
        <p className={styles.pageSubtitle}>
          Manage your account and preferences
        </p>
      </div>

      <div className={styles.layout}>
        {/* ── Tab sidebar ── */}
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

        {/* ── Tab content ── */}
        <main className={styles.main}>
          {activeTab === "profile" && <ProfileTab decoded={decoded} />}
          {activeTab === "security" && <SecurityTab decoded={decoded} />}
          {activeTab === "preferences" && <PreferencesTab />}
        </main>
      </div>
    </div>
  );
}

export default Settings;
