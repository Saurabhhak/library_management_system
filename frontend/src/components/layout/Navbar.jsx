import { useState } from "react";
import { Link } from "react-router-dom";
import Profile from "../../pages/profile/Profile";
import styles from "./Navbar.module.css";

function NavbarSection() {
  // -------- STATE --------
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminBarOpen, setAdminBarOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // -------- CLOSE ALL PANELS --------
  const closeAll = () => {
    setMenuOpen(false);
    setAdminBarOpen(false);
    setProfileOpen(false);
  };
  const role = localStorage.getItem("role");
  return (

    <div className={styles.Navbar_header}>
      {role !== "superadmin" && (
        <button
          className={`${styles.navlink} ${styles.AdminBar}`}
          onClick={() => alert("This Page Only Super Admin Access")}>
          <i class="fa-solid fa-user-gear"></i>
        </button>
      )}
      {/* -------- ADMIN SIDEBAR BUTTON -------- */}
      {role === "superadmin" && (
        <button
          className={`${styles.navlink} ${styles.AdminBar}`}
          onClick={() => {
            setAdminBarOpen(!adminBarOpen);
            setMenuOpen(false);
            setProfileOpen(false);
          }}
        >
          <i class="fa-solid fa-user-gear"></i>
        </button>
      )}
      {/* -------- ADMIN SIDEBAR -------- */}

      <nav
        className={`${styles.adminBars} ${adminBarOpen ? styles.activeAdmin : ""}`}
      >
        <button
          className={styles.adminMainBtn}
          onClick={() => setAdminMenuOpen(!adminMenuOpen)}
        >
          <i class="fa-solid fa-user-gear"></i> Admin Management
          <i
            className={`fa-solid ${adminMenuOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
          ></i>
        </button>

        {/* Sub Menu */}
        <div
          className={`${styles.subMenu} ${adminMenuOpen ? styles.subMenuActive : ""}`}
        >
          <Link to="/createadmin" onClick={closeAll}>
            <i class="fa-solid fa-user-plus"></i> Create Admin Account
          </Link>
          <Link to="/displayadmin" onClick={closeAll}>
            <i class="fa-solid fa-users"></i> All admins list
          </Link>
        </div>
      </nav>

      {/* -------- LEFT NAVIGATION MENU -------- */}
      <nav className={`${styles.left_icons} ${menuOpen ? styles.active : ""}`}>
        <Link to="/" onClick={closeAll}>
          <button className={styles.navlink}>Home</button>
        </Link>
        <Link to="/books" onClick={closeAll}>
          <button className={styles.navlink}>Books Management</button>
        </Link>
        <Link to="/categories" onClick={closeAll}>
          <button className={styles.navlink}>Books Category</button>
        </Link>
        <Link to="/members" onClick={closeAll}>
          <button className={styles.navlink}>Member Management</button>
        </Link>
        <Link to="/history" onClick={closeAll}>
          <button className={styles.navlink}>History</button>
        </Link>
      </nav>

      {/* -------- RIGHT ICONS -------- */}
      <nav className={styles.right_icons}>
        {/* Menu Toggle */}
        <button
          className={`${styles.navlink} ${styles.menuBtn}`}
          onClick={() => {
            setMenuOpen(!menuOpen);
            setAdminBarOpen(false);
            setProfileOpen(false);
          }}
        >
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>

        {/* Profile Toggle */}
        <button
          className={styles.navlink}
          onClick={() => {
            setProfileOpen(!profileOpen);
            setMenuOpen(false);
            setAdminBarOpen(false);
          }}
        >
          <i className="fa-solid fa-user-shield"></i>
        </button>
      </nav>

      {/* -------- PROFILE PANEL -------- */}
      <div
        className={`${styles.profilePanel} ${profileOpen ? styles.profileActive : ""}`}
      >
        {/* <div className={styles.ProfileData}> */}
        <Profile />
        {/* </div> */}
      </div>
    </div>
  );
}

export default NavbarSection;
