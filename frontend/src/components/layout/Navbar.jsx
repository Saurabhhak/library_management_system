import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Profile from "../../pages/profile/Profile";
import styles from "./Navbar.module.css";
import Swal from "sweetalert2";
function NavbarSection() {
  // -------- STATE --------
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminBarOpen, setAdminBarOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // -------- DROPDOWN STATES --------
  const [bookOpen, setBookOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // -------- TIMEOUT REFS (FOR SMOOTH HOVER) --------
  const bookTimeout = useRef(null);
  const memberTimeout = useRef(null);
  const historyTimeout = useRef(null);

  // -------- HOVER HANDLERS (DESKTOP ONLY) --------
  const handleEnter = (setter, ref) => {
    if (window.innerWidth <= 768) return;
    clearTimeout(ref.current);
    setter(true);
  };

  const handleLeave = (setter, ref) => {
    if (window.innerWidth <= 768) return;
    ref.current = setTimeout(() => setter(false), 150);
  };

  // -------- CLOSE ALL --------
  const closeAll = () => {
    setMenuOpen(false);
    setAdminBarOpen(false);
    setProfileOpen(false);
    setAdminMenuOpen(false);
    setBookOpen(false);
    setMemberOpen(false);
    setHistoryOpen(false);
  };
  const role = localStorage.getItem("role");
  return (
    <div className={styles.navbarHeader}>
      {/* ------ ADMIN ICON ------ */}
      {role !== "superadmin" ? (
        // NOT SUPERADMIN → BLOCK
        <button
          className={styles.iconBtn}
          onClick={() => {
            Swal.fire({
              icon: "error",
              title: "Access Denied!",
              text: "Only Super Admin allowed",
            });
          }}
        >
          <i className="fa-solid fa-user-gear"></i>
        </button>
      ) : (
        //  SUPERADMIN → ALLOW
        <button
          className={`${styles.iconBtn} ${adminBarOpen ? styles.active : ""}`}
          onClick={() => {
            setAdminBarOpen(!adminBarOpen);
            setMenuOpen(false);
            setProfileOpen(false);
          }}
        >
          <i className="fa-solid fa-user-gear"></i>
        </button>
      )}

      {/* ----- ADMIN SIDEBAR ----- */}
      <nav
        className={`${styles.adminSidebar} ${adminBarOpen ? styles.activeAdmin : ""}`}
      >
        <button
          className={styles.adminMainBtn}
          onClick={() => setAdminMenuOpen(!adminMenuOpen)}
        >
          <span className={styles.leftContent}>
            <i className="fa-solid fa-user-gear"></i>
            <span>Admin Management</span>
          </span>
          <i
            className={`fa-solid ${
              adminMenuOpen ? "fa-chevron-up" : "fa-chevron-down"
            }`}
          />
        </button>
        <div
          className={`${styles.subMenu} ${adminMenuOpen ? styles.subMenuActive : ""}`}
        >
          <Link to="/createadmin" onClick={closeAll}>
            <i className="fa-solid fa-user-plus"></i> Create Admin
          </Link>
          <Link to="/admininventory" onClick={closeAll}>
            <i className="fa-solid fa-users"></i> All Admins
          </Link>
        </div>
      </nav>

      {/* ------ MAIN NAV ------ */}
      <nav
        className={`${styles.leftIcons} ${menuOpen ? styles.activeMenu : ""}`}
      >
        <Link to="/" className={styles.navlink} title="Home" onClick={closeAll}>
          <i class="fa-solid fa-gauge"></i> Dashboard
        </Link>

        {/* ------- BOOKS ------- */}
        <div
          className={styles.dropdown}
          onMouseEnter={() => handleEnter(setBookOpen, bookTimeout)}
          onMouseLeave={() => handleLeave(setBookOpen, bookTimeout)}
        >
          <button
            className={styles.navlink}
            onClick={() => menuOpen && setBookOpen(!bookOpen)}
          >
            <i className="fa-solid fa-book-bookmark"></i>
            Books
            {menuOpen && (
              <i
                className={`fa-solid ${styles.mobileArrow} ${bookOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
              />
            )}
          </button>
          {bookOpen && (
            <div className={styles.dropdownMenu}>
              <Link to="/bookinventory" onClick={closeAll}>
                <i class="fa-solid fa-solid fa-book"></i> Book Inventory
              </Link>
              <Link to="/createbook" onClick={closeAll}>
                <i class="fa-solid fa-book-medical"></i> Add Books
              </Link>
              <Link to="/bookslib" onClick={closeAll}>
                <i class="fa-solid fa-book-open"></i> Library
              </Link>
              {/* <Link to="/issuebook" onClick={closeAll}>
                <i class="fa-solid fa-book-open"></i> Issue Books
              </Link> */}
              <Link to="/categoryinventory" onClick={closeAll}>
                <i class="fa-solid fa-layer-group"></i> Categories Inventory
              </Link>
              <Link to="/addcategory" onClick={closeAll}>
                <i class="fa-solid fa-layer-group"></i> Add Categories
              </Link>
              {/* <Link to="/categorypage" onClick={closeAll}>
                <i class="fa-solid fa-layer-group"></i> Categories Chart
              </Link> */}
            </div>
          )}
        </div>

        {/* ------- MEMBERS ------- */}
        <div
          className={styles.dropdown}
          onMouseEnter={() => handleEnter(setMemberOpen, memberTimeout)}
          onMouseLeave={() => handleLeave(setMemberOpen, memberTimeout)}
        >
          <button
            className={styles.navlink}
            onClick={() => menuOpen && setMemberOpen(!memberOpen)}
          >
            <i className="fa-solid fa-users-gear"></i> Members
            {menuOpen && (
              <i
                className={`fa-solid ${styles.mobileArrow} ${memberOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
              />
            )}
          </button>
          {memberOpen && (
            <div className={styles.dropdownMenu}>
              <Link to="/memberinventory" onClick={closeAll}>
                <i class="fa-solid fa-users"></i> All Members
              </Link>
              <Link to="/createmember" onClick={closeAll}>
                <i class="fa-solid fa-user-plus"></i> Add Member
              </Link>
              <Link to="/memberpage" onClick={closeAll}>
                <i class="fa-solid fa-graph"></i> Member Chart
              </Link>
            </div>
          )}
        </div>

        {/* ------- HISTORY ------- */}
        <div
          className={styles.dropdown}
          onMouseEnter={() => handleEnter(setHistoryOpen, historyTimeout)}
          onMouseLeave={() => handleLeave(setHistoryOpen, historyTimeout)}
        >
          <button
            className={styles.navlink}
            onClick={() => menuOpen && setHistoryOpen(!historyOpen) && closeAll}
          >
            <i className="fa-solid fa-clock-rotate-left"></i> History
            {menuOpen && (
              <i
                className={`fa-solid ${styles.mobileArrow}  ${historyOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
              />
            )}
          </button>

          {historyOpen && (
            <div className={styles.dropdownMenu}>
              <Link to="/history" onClick={closeAll}>
                <i class="fa-solid fa-clock-rotate-left"></i> All
              </Link>
              <Link to="/history/issue" onClick={closeAll}>
                <i class="fa-solid fa-book-bookmark"></i> Issued
              </Link>
              <Link to="/history/return" onClick={closeAll}>
                <i class="fa-solid fa-rotate-left"></i> Returned
              </Link>
            </div>
          )}
        </div>
      </nav>
      {/* ------ RIGHT ICONS Menu Button ------ */}
      <nav className={styles.rightIcons}>
        <button
          className={`${styles.iconBtn} ${styles.menuBtn} ${menuOpen ? styles.active : ""}`}
          title="Menu Button"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setAdminBarOpen(false);
            setProfileOpen(false);
          }}
        >
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} />
        </button>

        <button
          className={`${styles.iconBtn} ${profileOpen ? styles.active : ""}`}
          title="Profile Panel"
          onClick={() => {
            setProfileOpen(!profileOpen);
            setMenuOpen(false);
            setAdminBarOpen(false);
          }}
        >
          <i className="fa-solid fa-user-shield" />
        </button>
      </nav>
      {/* ------ PROFILE PANEL ------ */}
      <div
        className={`${styles.profilePanel} ${profileOpen ? styles.profileActive : ""}`}
      >
        <div className={styles.profileWrapper}>
          <Profile closeAll={closeAll} />
        </div>
      </div>
    </div>
  );
}

export default NavbarSection;
