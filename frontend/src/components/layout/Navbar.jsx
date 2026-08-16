import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Profile from "../../pages/profile/Profile";
import styles from "./Navbar.module.css";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

function NavbarSection() {
  // Destructure roles from AuthContext to conditionally render menus
  const { isMember, isStaff, isAdmin } = useAuth();

  // ── STATE ──
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminBarOpen, setAdminBarOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Dropdown States (For Staff/Admin)
  const [bookOpen, setBookOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // ── TIMEOUT REFS (Smooth Hover Debounce) ──
  const bookTimeout = useRef(null);
  const memberTimeout = useRef(null);
  const historyTimeout = useRef(null);

  // ── HOVER HANDLERS (Desktop Only) ──
  const handleEnter = (setter, ref) => {
    if (window.innerWidth <= 768) return;
    clearTimeout(ref.current);
    setter(true);
  };

  const handleLeave = (setter, ref) => {
    if (window.innerWidth <= 768) return;
    ref.current = setTimeout(() => setter(false), 150);
  };

  // ── CLOSE ALL MENUS ──
  const closeAll = () => {
    setMenuOpen(false);
    setAdminBarOpen(false);
    setProfileOpen(false);
    setAdminMenuOpen(false);
    setBookOpen(false);
    setMemberOpen(false);
    setHistoryOpen(false);
  };

  // ── ADMIN SIDEBAR TOGGLE HANDLER ──
  const handleAdminPanelClick = () => {
    // Only Superadmin & Admin can manage staff/admin inventory
    if (!isAdmin) {
      return Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Only Admins and Super Admins can access the Staff Management Panel.",
        background: "#0d1117",
        color: "#c9d1d9",
        confirmButtonColor: "#ef4444",
      });
    }
    setAdminBarOpen(!adminBarOpen);
    setMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <div className={styles.navbarHeader}>
      {/* ── ADMIN/STAFF ONLY: LEFT ACTION ICON ── */}
      {isStaff && (
        <button
          className={`${styles.iconBtn} ${adminBarOpen ? styles.active : ""}`}
          title="Admin Panel"
          onClick={handleAdminPanelClick}
        >
          <span className={styles.iconColor}>
            <i className="fa-solid fa-user-gear" />
          </span>
        </button>
      )}

      {/* ── ADMIN ONLY: SIDEBAR PANEL ── */}
      {isStaff && (
        <nav
          className={`${styles.adminSidebar} ${adminBarOpen ? styles.activeAdmin : ""}`}
        >
          <button
            className={styles.adminMainBtn}
            onClick={() => setAdminMenuOpen(!adminMenuOpen)}
          >
            <span className={styles.leftContent}>
              <span className={styles.iconColor}>
                <i className="fa-solid fa-user-shield" />
              </span>
              Staff Management
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
              </span>{" "}
              Admin Inventory
            </Link>
            <Link
              to="/adminpage"
              onClick={closeAll}
              className={styles.hoverDropDown}
            >
              <span className={styles.iconColor}>
                <i className="fa-solid fa-chart-line" />
              </span>{" "}
              Staff Analytics
            </Link>
            <Link
              to="/feedbackinventory"
              onClick={closeAll}
              className={styles.hoverDropDown}
            >
              <span className={styles.iconColor}>
                <i className="fa-solid fa-inbox" />
              </span>{" "}
              Feedback
            </Link>
            <Link
              to="/contact-inventory"
              onClick={closeAll}
              className={styles.hoverDropDown}
            >
              <span className={styles.iconColor}>
                <i className="fa-solid fa-envelope" />
              </span>{" "}
              Contact Us
            </Link>
            <Link
              to="/deleted-accounts-inventory"
              onClick={closeAll}
              className={styles.hoverDropDown}
            >
              <span className={styles.iconColor}>
                <i className="fa-solid fa-recycle" />
              </span>{" "}
              Recycle Bin
            </Link>
          </div>
        </nav>
      )}

      {/* ── MAIN HORIZONTAL NAVIGATION ── */}
      <nav
        className={`${styles.leftIcons} ${menuOpen ? styles.activeMenu : ""}`}
      >
        {/* 1. PUBLIC MEMBER NAVIGATION */}
        {isMember && (
          <>
            <Link
              to="/member/dashboard"
              className={styles.navlink}
              onClick={closeAll}
            >
              <span className={styles.iconColor}>
                <i className="fa-solid fa-house" />
              </span>{" "}
              Home
            </Link>
            <Link to="/library" className={styles.navlink} onClick={closeAll}>
              <span className={styles.iconColor}>
                <i className="fa-solid fa-book-open" />
              </span>{" "}
              Browse Books
            </Link>
            <Link
              to="/library?filter=trending"
              className={styles.navlink}
              onClick={closeAll}
            >
              <span className={styles.iconColor}>
                <i className="fa-solid fa-fire" />
              </span>{" "}
              New Releases
            </Link>
            {/* History Link Removed per requirements */}
          </>
        )}

        {/* 2. STAFF/LIBRARIAN NAVIGATION */}
        {isStaff && (
          <>
            <Link to="/home" className={styles.navlink} onClick={closeAll}>
              <span className={styles.iconColor}>
                <i className="fa-solid fa-gauge"></i>
              </span>{" "}
              Dashboard
            </Link>

            <Link to="/bookslib" className={styles.navlink} onClick={closeAll}>
              <span className={styles.iconColor}>
                <i className="fa-solid fa-swatchbook" />
              </span>{" "}
              Library
            </Link>

            {/* Books Dropdown */}
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
                </span>{" "}
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
                    to="/bookinventory"
                    onClick={closeAll}
                    className={styles.hoverDropDown}
                  >
                    <span className={styles.DropdowniconColor}>
                      <i className="fa-solid fa-table" />
                    </span>{" "}
                    Books Inventory
                  </Link>
                  <Link
                    to="/bookchartpage"
                    onClick={closeAll}
                    className={styles.hoverDropDown}
                  >
                    <span className={styles.DropdowniconColor}>
                      <i className="fa-solid fa-chart-line" />
                    </span>{" "}
                    Books Analytics
                  </Link>
                  <Link
                    to="/categoryinventory"
                    onClick={closeAll}
                    className={styles.hoverDropDown}
                  >
                    <span className={styles.DropdowniconColor}>
                      <i className="fa-solid fa-layer-group" />
                    </span>{" "}
                    Categories Inventory
                  </Link>
                  <Link
                    to="/categorypage"
                    onClick={closeAll}
                    className={styles.hoverDropDown}
                  >
                    <span className={styles.DropdowniconColor}>
                      <i className="fa-solid fa-chart-pie" />
                    </span>{" "}
                    Categories Analytics
                  </Link>
                  <Link
                    to="/authors"
                    onClick={closeAll}
                    className={styles.hoverDropDown}
                  >
                    <span className={styles.DropdowniconColor}>
                      <i className="fa-solid fa-user-pen" />
                    </span>{" "}
                    Authors
                  </Link>
                </div>
              )}
            </div>

            {/* Institutional Members Dropdown */}
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
                </span>{" "}
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
                      <i className="fa-solid fa-users-viewfinder" />
                    </span>{" "}
                    Member Inventory
                  </Link>
                  <Link
                    to="/memberpage"
                    onClick={closeAll}
                    className={styles.hoverDropDown}
                  >
                    <span className={styles.DropdowniconColor}>
                      <i className="fa-solid fa-chart-line" />
                    </span>{" "}
                    Member Analytics
                  </Link>
                </div>
              )}
            </div>

            {/* Transactions Dropdown */}
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
                  <i className="fa-solid fa-arrow-right-arrow-left" />
                </span>{" "}
                Transactions
                <span className={styles.iconColor}>
                  <i
                    className={`fa-solid ${historyOpen && menuOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
                  />
                </span>
              </button>
              {historyOpen && (
                <div className={styles.dropdownMenu}>
                  <Link
                    to="/issuebook"
                    onClick={closeAll}
                    className={styles.hoverDropDown}
                  >
                    <span className={styles.DropdowniconColor}>
                      <i className="fa-solid fa-book-bookmark" />
                    </span>{" "}
                    Issue Books
                  </Link>
                  <Link
                    to="/history"
                    onClick={closeAll}
                    className={styles.hoverDropDown}
                  >
                    <span className={styles.DropdowniconColor}>
                      <i className="fa-solid fa-clock-rotate-left" />
                    </span>{" "}
                    Transaction History
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      {/* ── RIGHT ICONS (MOBILE MENU & PROFILE) ── */}
      <nav className={styles.rightIcons}>
        {/* Mobile hamburger toggle */}
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

        {/* Profile Avatar */}
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
            <i
              className="fa-solid fa-user-circle"
              style={{ fontSize: "1.2rem" }}
            />
          </span>
        </button>
      </nav>

      {/* ── PROFILE PANEL (SLIDE-OUT) ── */}
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
