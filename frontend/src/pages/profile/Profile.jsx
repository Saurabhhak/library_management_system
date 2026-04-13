import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, deleteAccount } from "../../services/admin/admin.service";
import styles from "./Profile.module.css";
import Swal from "sweetalert2";

function Profile({ closeAll }) {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- SETTINGS ALERTS ---------------- */
  const handleSetting = () => {
    closeAll(); // Close dropdown before showing alert
    Swal.fire({
      icon: "info",
      title: "Action Not Allowed",
      text: "Profile page update coming soon!",
      confirmButtonColor: "#3085d6",
    });
  };

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
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

  /* ---------------- LOGOUT ALERTS ---------------- */
  // FIXED: Made async and added proper confirmation logic
  const handleLogout = async () => {
    closeAll(); // Close dropdown first

    const result = await Swal.fire({
      title: "Are you sure you want to logout?",
      html: `
        <b>ID:</b> ${user?.id} <br/>
        <b>Role:</b> ${user?.role} <br/>
        <b>Name:</b> ${user?.first_name} ${user?.last_name}
      `,
      icon: "question", // Better icon for logout
      showCancelButton: true,
      confirmButtonColor: "#3085d6", // Blue for safe action
      cancelButtonColor: "#d33", // Red for cancel
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    // If User Clicks "Yes, Logout!"
    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Show small success popup before redirecting
      await Swal.fire({
        icon: "success",
        title: "Logged Out!",
        text: "Successfully logged out.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/login");
    }
  };

  /* ---------------- DELETE ACCOUNT ALERTS ---------------- */
  const handleDeleteAccount = async () => {
    closeAll(); // Close dropdown first

    const result = await Swal.fire({
      title: "Delete Account?",
      text: "You won't be able to revert this!",
      html: `
        <div style="text-align: left; background: #f8d7da; padding: 10px; border-radius: 5px; color: #721c24;">
          <b>ID:</b> ${user?.id} <br/>
          <b>Role:</b> ${user?.role} <br/>
          <b>Name:</b> ${user?.first_name} ${user?.last_name}
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Red for Danger/Delete
      cancelButtonColor: "#3085d6", // Blue for Cancel
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,
    });

    // If cancelled
    if (!result.isConfirmed) return;

    try {
      const { data } = await deleteAccount();
      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your account has been deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Try again.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <p className={styles.loading}>
        <i className="fa-solid fa-spinner fa-spin-pulse"></i> profile...
      </p>
    );
  }

  /* ---------------- RENDER UI ---------------- */
  return (
    <div className={styles.profileContainer}>
      {/* -------- TITLE -------- */}
      <div className={styles.header}>
        <h3 className={styles.title}>Admin Profile</h3>
        <i
          className={`fa-solid fa-gear ${styles.settingsIcon}`}
          onClick={handleSetting}
        ></i>
      </div>

      {/* -------- AVATAR -------- */}
      <div className={styles.avatar}>
        <i className="fa-solid fa-user-tie"></i>
      </div>

      {/* -------- USER DATA -------- */}
      {user && (
        <div className={styles.profileCard}>
          <p>
            <strong>ID</strong> <span>{user.id}</span>
          </p>
          <p>
            <strong>Name</strong>{" "}
            <span>
              {user.first_name} {user.last_name}
            </span>
          </p>
          <p>
            <strong>Gmail</strong> <span>{user.email}</span>
          </p>
          <p>
            <strong>Phone</strong> <span>{user.phone}</span>
          </p>
          <p>
            <strong>State</strong> <span>{user.state}</span>
          </p>
          <p>
            <strong>City</strong> <span>{user.city}</span>
          </p>
          <p>
            <strong>Role</strong>{" "}
            <span className={styles.role}>{user.role}</span>
          </p>
        </div>
      )}

      {/* -------- ACTION BUTTONS -------- */}
      <div className={styles.actionBtns}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
        <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
          <i className="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </div>
  );
}

export default Profile;



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getProfile, deleteAccount } from "../../services/admin/admin.service";
// import styles from "./Profile.module.css";

// function Profile() {
//   const navigate = useNavigate();

//   /* ---------------- STATE ---------------- */
//   // store admin profile
//   const [user, setUser] = useState(null);
//   // loading state while fetching data
//   const [loading, setLoading] = useState(true);
//   // delete popup toggle
//   const [showDelete, setShowDelete] = useState(false);

//   /* ---------------- FETCH PROFILE ---------------- */

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         // Yaha getProfile() API call ho raha hai
//         const { data } = await getProfile();

//         if (data.success) {
//           setUser(data.user);
//         }
//       } catch (error) {
//         console.error("Profile fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   /* ---------------- LOGOUT ---------------- */
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     navigate("/login");
//   };

//   /* ---------------- DELETE ACCOUNT ---------------- */
//   const handleDeleteAccount = async () => {
//     try {
//       const { data } = await deleteAccount();

//       if (data.success) {
//         localStorage.removeItem("token");
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error("Delete account error:", error);
//     }
//   };

//   /* ---------------- LOADING ---------------- */

//   if (loading) {
//     return <p className={styles.loading}>Loading profile...</p>;
//   }

//   return (
//     <div className={styles.profileContainer}>
//       {/* -------- TITLE -------- */}

//       <h3 className={styles.title}>Admin Profile</h3>

//       {/* -------- AVATAR -------- */}

//       <div className={styles.avatar}>
//         <i className="fa-solid fa-user-tie"></i>
//       </div>

//       {/* -------- USER DATA -------- */}

//       {user && (
//         <div className={styles.profileCard}>
//           <p><strong>ID:</strong> {user.id}</p>
//           <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Phone:</strong> {user.phone}</p>
//           <p><strong>State:</strong> {user.state}</p>
//           <p><strong>City:</strong> {user.city}</p>
//           <p><strong>Role:</strong> {user.role}</p>
//         </div>
//       )}

//       {/* -------- ACTION BUTTONS -------- */}

//       <div className={styles.actionBtns}>

//         <button className={styles.logoutBtn} onClick={handleLogout}>
//           <i className="fa-solid fa-right-from-bracket"></i> Logout
//         </button>

//         <button
//           className={styles.deleteBtn}
//           onClick={() => setShowDelete(true)}
//         >
//           <i className="fa-solid fa-trash"></i> Delete
//         </button>

//       </div>

//       {/* -------- DELETE POPUP -------- */}

//       {showDelete && (
//         <div className={styles.popupOverlay}>
//           <div className={styles.popup}>
//             <h4>Delete Account</h4>
//             <p>Are you sure you want to delete this account?</p>

//             <div className={styles.popupBtns}>
//               <button className={styles.popupBtnsCancel} onClick={() => setShowDelete(false)}>Cancel</button>
//               <button className={styles.popupBtnsDel} onClick={handleDeleteAccount}>Yes Delete</button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Profile;
