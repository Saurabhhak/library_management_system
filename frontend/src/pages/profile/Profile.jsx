import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Profile.module.css";
import Swal from "sweetalert2";
/**
 * Profile — dropdown panel shown from the Navbar.
 *
 * Reads `user` directly from AuthContext (already fetched once at app
 * bootstrap and kept in sync after login) — zero extra API calls. This
 * also means it's safe for Navbar to render this unconditionally, since
 * it renders nothing (`return null`) when nobody is logged in.
 */
function Profile({ closeAll , profile}) {
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
      html: `
        <b>Role:</b> ${user?.role} <br/>
        <b>Name:</b> ${user?.first_name} ${user?.last_name}
      `,
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
      await logout(); // AuthContext — clears in-memory token + revokes refresh cookie
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

  const initials = (user?.first_name ??
    user?.email ??
    "?")[0].toUpperCase();

  return (
    <div className={styles.profileContainer}>
        <div className={styles.avatar}>{initials}</div>
      <div className={styles.profileCard}>
        <p>
          <span>
            {user.first_name} {user.last_name}
          </span>
        </p>
        <p>
          <span
            className={
              user.role === "admin" || user.role === "superadmin"
                ? styles.admins_role
                : styles.member_role
            }
          >
            {user.role}
          </span>
        </p>
        <p>
          <span>{user.email}</span>
        </p>
      </div>
      <div className={styles.actionBtns} onClick={handleSetting}>
        <button className={styles.logoutBtn}>
          <i className={`fa-solid fa-gear ${styles.settingsIcon}`}></i> Manage Account
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
