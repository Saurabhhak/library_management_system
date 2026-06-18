import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Profile from "../../pages/profile/Profile";
import styles from "./Navbar.module.css";
import Swal from "sweetalert2";

function NavbarSection() {
  // ── STATE ──────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminBarOpen, setAdminBarOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [bookOpen, setBookOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // ── TIMEOUT REFS (smooth hover debounce) ──────────────────
  const bookTimeout = useRef(null);
  const memberTimeout = useRef(null);
  const historyTimeout = useRef(null);

  // ── HOVER HANDLERS (desktop only) ─────────────────────────
  const handleEnter = (setter, ref) => {
    if (window.innerWidth <= 768) return;
    clearTimeout(ref.current);
    setter(true);
  };

  const handleLeave = (setter, ref) => {
    if (window.innerWidth <= 768) return;
    ref.current = setTimeout(() => setter(false), 150);
  };

  // ── CLOSE ALL ─────────────────────────────────────────────
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

  // WIP alert for unbuilt pages
  function handleAlert() {
    closeAll();
    Swal.fire({
      icon: "info",
      title: "Coming Soon",
      text: "All, Issued & Returned pages are under development.",
      confirmButtonColor: "#2ee6a6",
      background: "#0d1117",
      color: "#c9d1d9",
    });
  }

  return (
    <div className={styles.navbarHeader}>
      {/* ── ADMIN ICON ────────────────────────────────────── */}
      <button
        className={`${styles.iconBtn} ${adminBarOpen ? styles.active : ""}`}
        title="Admin Panel"
        onClick={() => {
          if (role !== "superadmin") {
            Swal.fire({
              icon: "error",
              title: "Access Denied",
              text: "Only Super Admin is allowed.",
              background: "#0d1117",
              color: "#c9d1d9",
            });
            return;
          }
          setAdminBarOpen(!adminBarOpen);
          setMenuOpen(false);
          setProfileOpen(false);
        }}
      >
        <span className={styles.iconColor}>
          <i className="fa-solid fa-user-gear" />
        </span>
      </button>

      {/* ── ADMIN SIDEBAR ─────────────────────────────────── */}
      <nav
        className={`${styles.adminSidebar} ${adminBarOpen ? styles.activeAdmin : ""}`}
      >
        <button
          className={styles.adminMainBtn}
          onClick={() => setAdminMenuOpen(!adminMenuOpen)}
        >
          <span className={styles.leftContent}>
            <span className={styles.iconColor}>
              <i className="fa-solid fa-user-gear" />
            </span>
            Admin Management
          </span>
          <span className={styles.iconColor}>
            <i
              className={`fa-solid ${adminMenuOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
            />
          </span>
        </button>

        <div
          className={`${styles.subMenu} ${adminMenuOpen ? styles.subMenuActive : ""}`}
        >
          <Link
            to="/admininventory"
            onClick={closeAll}
            className={styles.hoverDropDown}
          >
            <span className={styles.iconColor}>
              <i className="fa-solid fa-table" />
            </span>
            Admin Inventory
          </Link>
          <Link
            to="/adminpage"
            onClick={closeAll}
            className={styles.hoverDropDown}
          >
            <span className={styles.iconColor}>
              <i className="fa-solid fa-chart-line" />
            </span>
            Admin Charts
          </Link>
          <Link
            to="/feedbackinventory"
            onClick={closeAll}
            className={styles.hoverDropDown}
          >
            <span className={styles.iconColor}>
              <i className="fa-solid fa-inbox" />
            </span>
            Feedback
          </Link>
          <Link
            to="/contact-inventory"
            onClick={closeAll}
            className={styles.hoverDropDown}
          >
            <span className={styles.iconColor}>
              <i className="fa-solid fa-envelope" />
            </span>
            Contact Us
          </Link>
        </div>
      </nav>

      {/* ── MAIN NAV ──────────────────────────────────────── */}
      <nav
        className={`${styles.leftIcons} ${menuOpen ? styles.activeMenu : ""}`}
      >
        <Link to="/home" className={styles.navlink} onClick={closeAll}>
          <span className={styles.iconColor}>
            {/* <i className="fa-solid fa-gauge" /> */}
            <i class="fa fa-gauge"></i>
          </span>
          Dashboard
        </Link>

        <Link to="/bookslib" className={styles.navlink} onClick={closeAll}>
          <span className={styles.iconColor}>
            <i className="fa-solid fa-book" />
          </span>
          Library
        </Link>

        {/* ── BOOKS ───────────────────────────────────────── */}
        <div
          className={styles.dropdown}
          onMouseEnter={() => handleEnter(setBookOpen, bookTimeout)}
          onMouseLeave={() => handleLeave(setBookOpen, bookTimeout)}
        >
          <button
            className={styles.navlink}
            onClick={() => menuOpen && setBookOpen(!bookOpen)}
          >
            <span className={styles.iconColor}>
              <i className="fa-solid fa-book-open" />
            </span>
            Books
            <span className={styles.iconColor}>
              <i
                className={`fa-solid ${bookOpen && menuOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
              />
            </span>
          </button>

          {bookOpen && (
            <div className={styles.dropdownMenu}>
              
              <Link
                to="/authors"
                onClick={closeAll}
                className={styles.hoverDropDown}
              >
                <span className={styles.DropdowniconColor}>
                    <i class="fa fa-user-pen"></i>
                </span>
                Authors
              </Link>
              <Link
                to="/bookinventory"
                onClick={closeAll}
                className={styles.hoverDropDown}
              >
                <span className={styles.DropdowniconColor}>
                  <i className="fa-solid fa-table" />
                </span>
                Books Inventory
              </Link>
              <Link
                to="/bookchartpage"
                onClick={closeAll}
                className={styles.hoverDropDown}
              >
                <span className={styles.DropdowniconColor}>
                  <i className="fa-solid fa-chart-line" />
                </span>
                Books Chart
              </Link>
              <Link
                to="/categoryinventory"
                onClick={closeAll}
                className={styles.hoverDropDown}
              >
                <span className={styles.DropdowniconColor}>
                  <i className="fa-solid fa-table" />
                </span>
                Categories Inventory
              </Link>
              <Link
                to="/categorypage"
                onClick={closeAll}
                className={styles.hoverDropDown}
              >
                <span className={styles.DropdowniconColor}>
                  <i className="fa-solid fa-chart-line" />
                </span>
                Categories Chart
              </Link>
            </div>
          )}
        </div>

        {/* ── MEMBERS ─────────────────────────────────────── */}
        <div
          className={styles.dropdown}
          onMouseEnter={() => handleEnter(setMemberOpen, memberTimeout)}
          onMouseLeave={() => handleLeave(setMemberOpen, memberTimeout)}
        >
          <button
            className={styles.navlink}
            onClick={() => menuOpen && setMemberOpen(!memberOpen)}
          >
            <span className={styles.iconColor}>
              <i className="fa-solid fa-users-gear" />
            </span>
            Members
            <span className={styles.iconColor}>
              <i
                className={`fa-solid ${memberOpen && menuOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
              />
            </span>
          </button>

          {memberOpen && (
            <div className={styles.dropdownMenu}>
              <Link
                to="/memberinventory"
                onClick={closeAll}
                className={styles.hoverDropDown}
              >
                <span className={styles.DropdowniconColor}>
                  <i className="fa-solid fa-table" />
                </span>
                Member Inventory
              </Link>
              <Link
                to="/memberpage"
                onClick={closeAll}
                className={styles.hoverDropDown}
              >
                <span className={styles.DropdowniconColor}>
                  <i className="fa-solid fa-chart-line" />
                </span>
                Member Chart
              </Link>
            </div>
          )}
        </div>

        {/* ── HISTORY ─────────────────────────────────────── */}
        <div
          className={styles.dropdown}
          onMouseEnter={() => handleEnter(setHistoryOpen, historyTimeout)}
          onMouseLeave={() => handleLeave(setHistoryOpen, historyTimeout)}
        >
          <button
            className={styles.navlink}
            onClick={() => menuOpen && setHistoryOpen(!historyOpen)}
          >
            <span className={styles.iconColor}>
              <i className="fa-solid fa-clock-rotate-left" />
            </span>
            History
            <span className={styles.iconColor}>
              <i
                className={`fa-solid ${historyOpen && menuOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
              />
            </span>
          </button>

          {historyOpen && (
            <div className={styles.dropdownMenu}>
              <Link onClick={handleAlert} className={styles.hoverDropDown}>
                <span className={styles.DropdowniconColor}>
                  <i className="fa-solid fa-clock-rotate-left" />
                </span>
                All
              </Link>
              <Link onClick={handleAlert} className={styles.hoverDropDown}>
                <span className={styles.DropdowniconColor}>
                  <i className="fa-solid fa-book-bookmark" />
                </span>
                Issued
              </Link>
              <Link onClick={handleAlert} className={styles.hoverDropDown}>
                <span className={styles.DropdowniconColor}>
                  <i className="fa-solid fa-rotate-left" />
                </span>
                Returned
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ── RIGHT ICONS ───────────────────────────────────── */}
      <nav className={styles.rightIcons}>
        {/* Mobile hamburger */}
        <button
          className={`${styles.iconBtn} ${styles.menuBtn} ${menuOpen ? styles.active : ""}`}
          title={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => {
            setMenuOpen(!menuOpen);
            setAdminBarOpen(false);
            setProfileOpen(false);
          }}
        >
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} />
        </button>

        {/* Profile */}
        <button
          className={`${styles.iconBtn} ${profileOpen ? styles.active : ""}`}
          title="Profile"
          onClick={() => {
            setProfileOpen(!profileOpen);
            setMenuOpen(false);
            setAdminBarOpen(false);
          }}
        >
          <span className={styles.iconColor}>
            <i className="fa-solid fa-user-shield" />
          </span>
        </button>
      </nav>

      {/* ── PROFILE PANEL ─────────────────────────────────── */}
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
