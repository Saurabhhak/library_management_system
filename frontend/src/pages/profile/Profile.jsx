import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, deleteAccount } from "../../services/admin.service";
import styles from "./Profile.module.css";

function Profile() {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */

  // store admin profile
  const [user, setUser] = useState(null);

  // loading state while fetching data
  const [loading, setLoading] = useState(true);

  // delete popup toggle
  const [showDelete, setShowDelete] = useState(false);

  /* ---------------- FETCH PROFILE ---------------- */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Yaha getProfile() API call ho raha hai
        const { data } = await getProfile();

        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ---------------- DELETE ACCOUNT ---------------- */

  const handleDeleteAccount = async () => {
    try {
      const { data } = await deleteAccount();

      if (data.success) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Delete account error:", error);
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return <p className={styles.loading}>Loading profile...</p>;
  }

  return (
    <div className={styles.profileContainer}>
      {/* -------- TITLE -------- */}

      <h3 className={styles.title}>Admin Profile</h3>

      {/* -------- AVATAR -------- */}

      <div className={styles.avatar}>
        <i className="fa-solid fa-user-tie"></i>
      </div>

      {/* -------- USER DATA -------- */}

      {user && (
        <div className={styles.profileCard}>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>State:</strong> {user.state}</p>
          <p><strong>City:</strong> {user.city}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      {/* -------- ACTION BUTTONS -------- */}

      <div className={styles.actionBtns}>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>

        <button
          className={styles.deleteBtn}
          onClick={() => setShowDelete(true)}
        >
          <i className="fa-solid fa-trash"></i> Delete
        </button>

      </div>

      {/* -------- DELETE POPUP -------- */}

      {showDelete && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h4>Delete Account</h4>
            <p>Are you sure you want to delete this account?</p>

            <div className={styles.popupBtns}>
              <button className={styles.popupBtnsCancel} onClick={() => setShowDelete(false)}>Cancel</button>
              <button className={styles.popupBtnsDel} onClick={handleDeleteAccount}>Yes Delete</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
