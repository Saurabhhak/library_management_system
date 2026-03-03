import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useState } from "react";
import Profile from "./Profile";
function NavbarSection() {
  const navigate = useNavigate();
  const [isClick, setIsClick] = useState(false);
  const [isClickAdminBar, setIsClickAdminBar] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isClickAdminProfile, setIsClickAdminProfile] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <>
      <div className={styles.Navbar_header}>
        <button
          type="button"
          onClick={() => ` ${setIsClickAdminProfile(false)}
            ${setIsClickAdminBar(!isClickAdminBar)} ${setIsClick(false)} `}
          className={`${styles.navlink} ${styles.AdminBar}`}
        >
          <i
            className={`fa-solid ${isClickAdminBar ? "fa-xmark" : "fa-book"}`}
          ></i>
        </button>
        <nav
          className={`${styles.adminBars} ${
            isClickAdminBar ? styles.activeAdmin : ""
          }`}
        >
          <button
            className={styles.adminMainBtn}
            onClick={() => setIsAdminOpen(!isAdminOpen)}
          >
            Admin Management
            <i
              className={`fa-solid ${
                isAdminOpen ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            ></i>
          </button>

          <div
            className={`${styles.subMenu} ${
              isAdminOpen ? styles.subMenuActive : ""
            }`}
          >
            <Link to="/createadmin" onClick={() => setIsClickAdminBar(false)}>
              Create Admin Record
            </Link>
            <Link to="/updateadmin" onClick={() => setIsClickAdminBar(false)}>
              Update Admin Record
            </Link>
            <Link to="/displayadmin" onClick={() => setIsClickAdminBar(false)}>
              Display Admin Record
            </Link>
            <Link to="/deleteadmin" onClick={() => setIsClickAdminBar(false)}>
              Delete Admin Record
            </Link>
            <Link to="/searchadmin" onClick={() => setIsClickAdminBar(false)}>
              Search Admin Record
            </Link>
          </div>
        </nav>
        {/* ------------------------------------------------------------------- */}
        <nav className={`${styles.left_icons} ${isClick ? styles.active : ""}`}>
          <Link
            className={styles.Link}
            to="/"
            onClick={() => `${setIsClick(false)} ${setIsClickAdminProfile(false)} ${setIsClickAdminBar(false)}`}
          >
            <button type="button" className={styles.navlink}>
              Home
            </button>
          </Link>
          <Link
            className={styles.Link}
            to="/books"
            onClick={() => `${setIsClick(false)} ${setIsClickAdminProfile(false)}  ${setIsClickAdminBar(false)}`}
          >
            <button type="button" className={styles.navlink}>
              Books Management
            </button>
          </Link>
          <Link
            className={styles.Link}
            to="/categories"
            onClick={() => `${setIsClick(false)} ${setIsClickAdminProfile(false)}  ${setIsClickAdminBar(false)}`}
          >
            <button type="button" className={styles.navlink}>
              Books Category
            </button>
          </Link>
          <Link
            className={styles.Link}
            to="/members"
            onClick={() => `${setIsClick(false)} ${setIsClickAdminProfile(false)}  ${setIsClickAdminBar(false)}`}
          >
            <button type="button" className={styles.navlink}>
              Member Management
            </button>
          </Link>
          <Link
            className={styles.Link}
            to="/history"
            onClick={() => `${setIsClick(false)} ${setIsClickAdminProfile(false)}  ${setIsClickAdminBar(false)}`}
          >
            <button type="button" className={styles.navlink}>
              History
            </button>
          </Link>
        </nav>
        <nav className={styles.right_icons}>
          <button
            type="button"
            onClick={() => {
              setIsClick(!isClick);
              setIsClickAdminBar(false);
              setIsClickAdminProfile(false);
            }}
            className={`${styles.navlink} ${styles.menuBtn}`}
          >
            <i className={`fa-solid ${isClick ? "fa-xmark" : "fa-bars"}`}></i>
          </button>

          <button
            type="button"
            className={styles.navlink}
            onClick={() => {
              setIsClickAdminProfile(!isClickAdminProfile);
              setIsClick(false);
              setIsClickAdminBar(false);
            }}
          >
            <i className="fa-solid fa-user"></i>
          </button>
        </nav>

        <div
          className={`${styles.profilePanel} ${
            isClickAdminProfile ? styles.profileActive : ""
          }`}
        >
          <span className={styles.ProfileData}>
            <Profile />
          </span>
          <Link to="/profile">
            <button
              className={styles.settingbtn}
              onClick={() => {
                setIsClickAdminProfile(false);
              }}
            >
              <i className="fa-solid fa-gear"></i>
            </button>
          </Link>
          <button
            className={styles.logoutBtn}
            onClick={() => {
              handleLogout();
            }}
          >
            <i className="fa-solid fa-sign-out"></i>
          </button>
        </div>
      </div>
    </>
  );
}
export default NavbarSection;
