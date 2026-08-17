import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Profile.module.css";
import Swal from "sweetalert2";

function Profile({ closeAll }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSetting = () => {
    closeAll();
    navigate("/settings");
  };

  const handleLogout = async () => {
    closeAll();
    const result = await Swal.fire({
      title: "Are you sure you want to logout?",
      html: `<b>Name:</b> ${user?.first_name} ${user?.last_name}`,
      icon: "question",
      showCancelButton: true,
      background: "#0f172a",
      color: "#e5e7eb",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      await logout();
      await Swal.fire({
        icon: "success",
        title: "Logged Out!",
        text: "Successfully logged out.",
        timer: 1500,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#e5e7eb",
      });
      navigate("/login");
    }
  };

  if (!user) return null;

  const initials = (user?.first_name ?? user?.email ?? "?")[0].toUpperCase();

  // THE FIX: Resolve correct Display Role for Navbar
  let displayRole = "Member";
  if (user.role === "member" && user.member_type) {
    displayRole =
      user.member_type.charAt(0).toUpperCase() + user.member_type.slice(1);
  } else if (user.role !== "member") {
    displayRole =
      user.role === "superadmin"
        ? "Super Admin"
        : user.role.charAt(0).toUpperCase() + user.role.slice(1);
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.avatar}>{initials}</div>
      <div className={styles.profileCard}>
        {/* Name */}
        <p>
          <span className={styles.userName}>
            {user.first_name} {user.last_name}
          </span>
        </p>

        {/* Dynamic Role (Student, Professor, Admin, etc.) */}
        <p>
          <span
            className={
              user.role === "admin" || user.role === "superadmin"
                ? styles.admins_role
                : styles.member_role
            }
          >
            {displayRole}
          </span>
        </p>

        {/* Institutional ID (Only for Members) */}
        {user.role === "member" && user.institutional_id && (
          <p>
            <span className={styles.instId}>
              <i className="fa-solid fa-id-badge" /> {user.institutional_id}
            </span>
          </p>
        )}

        {/* Email */}
        <p>
          <span className={styles.userEmail}>{user.email}</span>
        </p>
      </div>

      <div className={styles.actionBtns} onClick={handleSetting}>
        <button className={styles.logoutBtn}>
          <i className={`fa-solid fa-gear ${styles.settingsIcon}`}></i> Manage
          Account
        </button>
      </div>
      <div className={styles.actionBtns}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> Sign Out
        </button>
      </div>
    </div>
  );
}

export default Profile;
