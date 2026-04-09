import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/admin/auth.service";
import styles from "./LoginAdmin.module.css";
function AdminLoginForm() {
  /* ---------------- NAVIGATION ---------------- */
  const navigate = useNavigate();
  /* ---------------- STATE ---------------- */
  const [showPassword, setShowPassword] = useState(false);
  const [userinfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");
  const [notifyType, setNotifyType] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- NOTIFICATION ---------------- */
  const showNotification = (msg, type) => {
    setNotification(msg);
    setNotifyType(type);
    setTimeout(() => {
      setNotification("");
      setNotifyType("");
    }, 4000);
  };
  /* ---------------- INPUT CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({ ...errors, [name]: "" });
  };
  /* ---------------- FORM SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!userinfo.email) newErrors.email = "Email required";
    if (!userinfo.password) newErrors.password = "Password required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    try {
      setLoading(true);
      const res = await loginAdmin(userinfo);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      showNotification("Login successful", "success");
      navigate("/", { replace: true });
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Invalid email or password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  /* ---------------- MEMBER LOGIN (TEMP) ---------------- */
  function handleMember() {
    alert("Member Feature coming soon");
  }
  /* ---------------- UI ---------------- */
  return (
    <>
      {notification && (
        <div className={`${styles.notify} ${styles[notifyType]}`}>
          {notification}
        </div>
      )}
      {/* -------- HEADER -------- */}
      <header className={styles.headers}>
        <div className={styles.leftIcon}>
          <i className="fa-solid fa-book"></i>
        </div>
        <div className={styles.centerTitle}>
          <h2>APV Tech Library</h2>
        </div>
      </header>
      {/* -------- LOGIN FORM -------- */}
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.formSection}>
          <h1 className={styles.tagh1}>Admin Login</h1>
          {/* -------- EMAIL FIELD -------- */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={userinfo.email}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.email ? styles.inputError : ""}`}
            />
            {errors.email && (
              <span className={styles.errorMsg}>{errors.email}</span>
            )}
          </div>
          {/* -------- PASSWORD FIELD -------- */}
          <div className={styles.formGroup}>
            <div className={styles.lableOrForgotPass}>
              <label htmlFor="password">Password</label>
              <Link className={styles.linkStyle} to="/forgot-password">
                Forgot password?
              </Link>
            </div>
            <div className={styles.password_wrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={userinfo.password}
                onChange={handleChange}
                className={`${styles.formInput} ${errors.password ? styles.inputError : ""}`}
              />
              <span
                className={styles.eye_icon}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            {errors.password && (
              <span className={styles.errorMsg}>{errors.password}</span>
            )}
          </div>
          {/* -------- LOGIN BUTTON -------- */}
          <div className={styles.btnSection}>
            <button
              type="submit"
              className={styles.btnFeature}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
          {/* -------- MEMBER LINK -------- */}
          <p>
            <Link
              onClick={handleMember}
              className={styles.linkStyle}
              to="/"
            >
              Member Login
            </Link>
          </p>

        </form>
      </div>
    </>
  );
}
export default AdminLoginForm;

// import { useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { loginAdmin } from "../../services/admin/auth.service";
// import styles from "./AdminLogin.module.css";

// /* ─────────────────────────────────────────────────────────────────
//    AdminLoginForm
//    ─ Email/password login
//    ─ Login with Google  (existing admin account)
//    ─ Error messages from OAuth redirects (?error=auth_failed etc.)
// ───────────────────────────────────────────────────────────────── */
// function AdminLoginForm() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   /* -- State ---------------------------------------------------- */
//   const [showPassword, setShowPassword] = useState(false);
//   const [userinfo, setUserInfo] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [notification, setNotification] = useState(
//     // Show OAuth error if redirected from backend
//     searchParams.get("error") === "auth_failed"
//       ? "Google login failed. Make sure you're using your registered email."
//       : searchParams.get("error") === "invite_required"
//         ? "Invalid invite link. Please request a new invite."
//         : "",
//   );
//   const [notifyType, setNotifyType] = useState(
//     searchParams.get("error") ? "error" : "",
//   );
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);

//   /* -- Notification helper -------------------------------------- */
//   const showNotification = (msg, type) => {
//     setNotification(msg);
//     setNotifyType(type);
//     setTimeout(() => {
//       setNotification("");
//       setNotifyType("");
//     }, 5000);
//   };

//   /* -- Input change --------------------------------------------- */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserInfo((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   /* -- Email / Password submit ---------------------------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     if (!userinfo.email.trim()) newErrors.email = "Email is required";
//     if (!userinfo.password) newErrors.password = "Password is required";
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length) return;

//     try {
//       setLoading(true);
//       const res = await loginAdmin(userinfo);

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("role", res.data.user.role);

//       showNotification("Login successful!", "success");

//       // Small delay so user sees the success message
//       setTimeout(() => navigate("/", { replace: true }), 600);
//     } catch (error) {
//       showNotification(
//         error.response?.data?.message || "Invalid email or password",
//         "error",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -- Google Login (existing admin) ---------------------------- */
//   const handleGoogleLogin = () => {
//     const backendBase = process.env.REACT_APP_API_URL;

//     if (!backendBase) {
//       showNotification("Configuration error. Please contact support.", "error");
//       console.error("[AdminLogin] REACT_APP_API_URL is not set");
//       return;
//     }

//     setGoogleLoading(true);
//     window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google/superadmin`;

//   };

//   /* -- Member placeholder --------------------------------------- */
//   const handleMember = (e) => {
//     e.preventDefault();
//     alert("Member portal coming soon");
//   };

//   /* -- UI ------------------------------------------------------- */
//   return (
//     <>
//       {notification && (
//         <div className={`${styles.notify} ${styles[notifyType]}`}>
//           {notification}
//         </div>
//       )}

//       {/* ── HEADER ── */}
//       <header className={styles.headers}>
//         <div className={styles.leftIcon}>
//           <i className="fa-solid fa-book-open-reader logoIcon"></i>
//         </div>
//         <div className={styles.headingTitle}>
//           <h2>APV Tech Library</h2>
//         </div>
//       </header>

//       {/* ── FORM ── */}
//       <div className={styles.formContainer}>
//         <form onSubmit={handleSubmit} className={styles.formSection}>
//           <h1 className={styles.formTitle}>
//             Admin Login <i className="fa-solid fa-user-shield"></i>
//           </h1>

//           {/* EMAIL */}
//           <div className={styles.formGroup}>
//             <label htmlFor="email">Email address</label>
//             <input
//               id="email"
//               type="email"
//               name="email"
//               value={userinfo.email}
//               onChange={handleChange}
//               disabled={loading || googleLoading}
//               autoComplete="email"
//               className={`${styles.formInput} ${
//                 errors.email ? styles.inputError : ""
//               }`}
//             />
//             {errors.email && (
//               <span className={styles.errorMsg}>{errors.email}</span>
//             )}
//           </div>

//           {/* PASSWORD */}
//           <div className={styles.formGroup}>
//             <div className={styles.lableOrForgotPass}>
//               <label htmlFor="password">Password</label>
//               <Link className={styles.linkStyle} to="/forgot-password">
//                 Forgot password?
//               </Link>
//             </div>
//             <div className={styles.password_wrapper}>
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={userinfo.password}
//                 onChange={handleChange}
//                 disabled={loading || googleLoading}
//                 autoComplete="current-password"
//                 className={`${styles.formInput} ${
//                   errors.password ? styles.inputError : ""
//                 }`}
//               />
//               <span
//                 className={styles.eye_icon}
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 role="button"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 <i
//                   className={`fa-solid ${
//                     showPassword ? "fa-eye-slash" : "fa-eye"
//                   }`}
//                 />
//               </span>
//             </div>
//             {errors.password && (
//               <span className={styles.errorMsg}>{errors.password}</span>
//             )}
//           </div>

//           {/* BUTTONS */}
//           <div className={styles.btnSection}>
//             {/* Email/password login */}
//             <button
//               type="submit"
//               className={styles.btnFeature}
//               disabled={loading || googleLoading}
//             >
//               {loading ? (
//                 <>
//                   <span className={styles.spinnerSmall} /> Logging in…
//                 </>
//               ) : (
//                 "Login"
//               )}
//             </button>

//             {/* Divider */}
//             <div className={styles.divider}>
//               <span>or</span>
//             </div>

//             {/* Google login — for admins who already have an account */}
//             <button
//               type="button"
//               onClick={handleGoogleLogin}
//               className={styles.googleBtn}
//               disabled={loading || googleLoading}
//             >
//               {googleLoading ? (
//                 <>
//                   <span className={styles.spinnerSmall} /> Redirecting…
//                 </>
//               ) : (
//                 <>
//                   <i className="fa-brands fa-google" /> Login with Google
//                 </>
//               )}
//             </button>
//           </div>

//           {/* Member link */}
//           <p className={styles.memberLink}>
//             <Link onClick={handleMember} className={styles.linkStyle} to="/">
//               Member Login
//             </Link>
//           </p>
//         </form>
//       </div>
//     </>
//   );
// }
// export default AdminLoginForm;



// .headers {
//   position: fixed;
//   top: 0;
//   left: 0;
//   height: 60px;
//   width: 100%;
//   background:#0d1117;
//   backdrop-filter: blur(10px);
//   display: flex;
//   align-items: center;
//   padding: 0 20px;
//   z-index: 1000;
//   box-shadow: 1px 0 1px #ffffff60;
// }

// .leftIcon {
//   font-size: 22px;
//   color: #ffffff;
// }

// .headingTitle {
//   position: absolute;
//   left: 50%;
//   transform: translateX(-50%);
//   color: #ffffff;
//   letter-spacing: 1px;
// }

// /* ---------- FORM LAYOUT ---------- */

// .formContainer {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   min-height: 100vh;
//   padding-top: 60px;
//   background:#111827;
  
// }
// .formSection {
//   width: 20rem;
//   display: grid;
//   gap: 1rem;
//   border:  1px solid rgba(107, 107, 107, 0.058);
//   padding: 2rem;
//   border-radius: 8px;
//   /* border: none; */
//   background: #1f2937;
//   box-shadow: 0 0 .5rem rgba(202, 209, 214, 0.327);
// }

// /* ---------- TITLE ---------- */

// .formTitle {
//   text-align: center;
//   font-size: 1.5rem;
//   color: #f6fff7;
// }

// /* ---------- FORM FIELD ---------- */

// .formGroup {
//   display: flex;
//   flex-direction: column;
// }

// .formGroup label {
//   font-size: 14px;
//   color: #9ca3af;
//   font-weight: 600;
//   margin-bottom: 4px;
// }



// /* ---------- PASSWORD ---------- */

// .lableOrForgotPass {
//   display: flex;
//   justify-content: space-between;
// }

// .password_wrapper {
//   position: relative;
// }

// /* ---------- INPUT ---------- */

// .formInput {
//   width: 100%;
//   padding: 0.7rem 2.5rem 0.7rem 0.8rem;
//   border-radius: 4px;
//   border: none;  
//   background: #111827;
//   color: #e5e7eb;
// }

// .formInput:focus {
//   outline: none;
//   border-color: #374151;
//   box-shadow: inset 0 0 .4rem rgba(2, 255, 158, 0.3);
// }

// /* eye icon */

// .eye_icon {
//   position: absolute;
//   right: 10px;
//   top: 50%;
//   transform: translateY(-50%);
//   cursor: pointer;
//   color: #9b9b9b;
// }

// /* ---------- ERROR ---------- */

// .errorMsg {
//   font-size: 11px;
//   color: #e53935;
//   margin-top: 4px;
// }

// .inputError {
//   border: 1px solid #e53935;
// }

// /* ---------- BUTTON ---------- */

// .btnSection {
//   display: flex;
//   justify-content: center;
// }

// .btnFeature {
//   padding: .6rem 1.2rem;
//   border: none;
//   border-radius: 4px;
//   background: #2563eb;
//   color: white;
//   font-weight: 600;
//   cursor: pointer;
// }

// .btnFeature:hover {
//   background:#1d4ed8;
// }

// /* If Logining Inputs Disable */
// input:disabled {
//   opacity: 0.6;
//   cursor: not-allowed;
// }

// button:disabled {
//   opacity: 0.7;
//   cursor: not-allowed;
// }
// /* ---------- LINK ---------- */
// .linkStyle {
//   color: #1088ff;
//   text-decoration: none;
//   font-size: 14px;
// }

// .linkStyle:hover {
//   text-decoration: underline;
// }

// /* ---------- NOTIFICATION ---------- */

// .notify {
//   position: fixed;
//   top: 5rem;
//   left: 50%;
//   transform: translateX(-50%);
//   padding: .7rem 1rem;
//   border-radius: .3rem;
//   font-weight: 700;
// }

// .success {
//   background: #16a34a;
//   color: white;
// }

// .error {
//   background: #dc2626;
//   color: white;
// }