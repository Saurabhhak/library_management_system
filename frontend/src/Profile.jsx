import { useEffect, useState } from "react";
import "./ramdom.css";
import styles from "./ProfileCard.module.css";
// import { useNavigate } from "react-router-dom";
function Profile() {
  // const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        // backend returns { success, user }
        setUser(data.user);
        // console.log(data.user);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };
    fetchProfile();
  }, []);
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/login");
  // };
  return (
    <>
      <h1 className={styles.title}>Profile Section</h1>
      <span className={styles.userAvter}>
        <i className="fa-solid fa-user-circle"></i>
      </span>
      <div className={styles.CardContiner}>
        {user ? (
          <div className={styles.profileCard}>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Name:</strong> {user.first_name} {user.last_name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>State:</strong> {user.state}
            </p>
            <p>
              <strong>City:</strong> {user.city}
            </p>           <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {/* <button
        className={styles.logoutBtn}
        onClick={() => {
          handleLogout();
        }}
      >
        <i className="fa-solid fa-sign-out"></i>
      </button> */}
      <div className={styles.DeleteACBox}>
        <p className={styles.Del_AC_Title}>Account Delete Option Coming Soon</p>
      </div>
    </>
  );
}

export default Profile;
