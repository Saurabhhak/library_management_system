import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./GoogleSuccess.module.css";
import API from "../../api/axiosInstance";

/* ─────────────────────────────────────────────────────────────────
   GoogleSuccess
   - Receives ?token= from backend redirect
   - Saves to localStorage
   - Fetches profile to decide where to route next
───────────────────────────────────────────────────────────────── */
function GoogleSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Authentication failed. No token received.");
      return;
    }

    // Persist token
    localStorage.setItem("token", token);

    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/admin/profile");

        if (data?.user?.is_profile_complete) {
          navigate("/", { replace: true });
        } else {
          navigate("/complete-profile", { replace: true });
        }
      } catch (err) {
        console.error("[GoogleSuccess] Profile fetch error:", err);
        localStorage.removeItem("token");
        setError("Session error. Please login again.");
      }
    };

    fetchProfile();
  }, [searchParams, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {error ? (
          <>
            <p className={styles.error}>{error}</p>
            <button
              className={styles.retryBtn}
              onClick={() => navigate("/login", { replace: true })}
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div className={styles.loader}></div>
            <p>Authenticating, please wait…</p>
          </>
        )}
      </div>
    </div>
  );
}

export default GoogleSuccess;
