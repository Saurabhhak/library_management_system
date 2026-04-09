import { useParams } from "react-router-dom";
import styles from "./AcceptInvite.module.css";

/* ─────────────────────────────────────────────────────────────────
   AcceptInvite  ·  Invite flow entry point
   URL: /accept-invite/:token
   Bug fixes:
     1. REACT_APP_API_URL now lives in frontend/.env (no /api suffix)
     2. Redirect URL built as  BASE_URL + /api/auth/google  (no double /api)
     3. Guard against undefined / missing token
───────────────────────────────────────────────────────────────── */
function AcceptInvite() {
  const { token } = useParams();

  const handleGoogleLogin = () => {
    // ── Guard: token must exist ─────────────────────────────────
    if (!token || token === "undefined") {
      alert("Invalid or expired invite link. Please request a new invite.");
      return;
    }

    // ── Guard: env var must be set ──────────────────────────────
    const backendBase = process.env.REACT_APP_API_URL;
    if (!backendBase) {
      console.error(
        "[AcceptInvite] REACT_APP_API_URL is not set in frontend .env",
      );
      alert("Configuration error. Please contact support.");
      return;
    }
    // ── Build absolute URL to backend Google OAuth route ────────
    // REACT_APP_API_URL = http://localhost:5000  (NO /api suffix)
    // Route registered at  /api/auth/google
    const url = `${backendBase}/api/auth/google?inviteToken=${token}`;
    window.location.href = url;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>You're Invited </h2>
        <p className={styles.text}>
          Click below to continue with Google and complete your profile.
        </p>
        <button className={styles.googleBtn} onClick={handleGoogleLogin}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default AcceptInvite;
