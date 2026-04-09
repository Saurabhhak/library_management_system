import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ─────────────────────────────────────────────────────────────────
   Setup.jsx  —  /setup
   
   First-time SuperAdmin creation page.
   
   On mount:
     1. Calls /api/auth/bootstrap/check
     2. If bootstrap NOT needed → redirect to /login (already set up)
     3. If bootstrap needed → show "Create SuperAdmin with Google" UI
   
   On button click:
     → Redirects to backend bootstrap Google OAuth
     → Google → callback → GoogleSuccess.jsx → saves token+role → "/"
───────────────────────────────────────────────────────────────── */
function Setup() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // checking | ready | done | error
  const [loading, setLoading] = useState(false);

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const check = async () => {
      try {
        const { data } = await axios.get(`${API}/api/auth/bootstrap/check`);

        if (!data.bootstrap_needed) {
          // SuperAdmin already exists — go to login
          navigate("/login", { replace: true });
        } else {
          setStatus("ready");
        }
      } catch (err) {
        console.error("[Setup] Check failed:", err);
        setStatus("error");
      }
    };

    check();
  }, [navigate, API]);

  const handleCreateWithGoogle = () => {
    if (!API) {
      alert("Configuration error: REACT_APP_API_URL is not set.");
      return;
    }
    setLoading(true);
    window.location.href = `${API}/api/auth/bootstrap/google`;
  };

  /* ── CHECKING ── */
  if (status === "checking") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.spinner} />
          <p style={styles.subtext}>Checking system status…</p>
        </div>
      </div>
    );
  }

  /* ── ERROR ── */
  if (status === "error") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.iconError}>✕</div>
          <h2 style={styles.title}>Cannot connect to server</h2>
          <p style={styles.subtext}>
            Make sure the backend is running and <code>REACT_APP_API_URL</code>{" "}
            is set correctly.
          </p>
          <button
            style={styles.btnPrimary}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ── READY — show setup UI ── */
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Icon */}
        <div style={styles.iconWrap}>
          <i
            className="fa-solid fa-book-open-reader"
            style={{ fontSize: "2rem", color: "#2563eb" }}
          />
        </div>

        {/* Heading */}
        <h1 style={styles.title}>Welcome to APV Tech Library</h1>
        <p style={styles.subtext}>
          No SuperAdmin account exists yet. Create your account using Google to
          get started. This setup can only be done once.
        </p>

        {/* Steps */}
        <div style={styles.steps}>
          <div style={styles.step}>
            <span style={styles.stepNum}>1</span>
            <span>Click the button below</span>
          </div>
          <div style={styles.step}>
            <span style={styles.stepNum}>2</span>
            <span>Sign in with your Google account</span>
          </div>
          <div style={styles.step}>
            <span style={styles.stepNum}>3</span>
            <span>You become the SuperAdmin automatically</span>
          </div>
        </div>

        {/* CTA */}
        <button
          style={{
            ...styles.googleBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={handleCreateWithGoogle}
          disabled={loading}
        >
          <i className="fa-brands fa-google" style={{ marginRight: "8px" }} />
          {loading ? "Redirecting to Google…" : "Create SuperAdmin with Google"}
        </button>

        <p style={styles.warning}>
          ⚠️ Use the Google account you want as your permanent SuperAdmin login.
          This cannot be changed easily.
        </p>
      </div>
    </div>
  );
}

/* ── Inline styles (no CSS file dependency) ── */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
    fontFamily: "sans-serif",
    padding: "1rem",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "2.5rem 2rem",
    maxWidth: "440px",
    width: "100%",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  iconWrap: {
    marginBottom: "1rem",
  },
  iconError: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    margin: "0 auto 1rem",
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 0.75rem",
  },
  subtext: {
    fontSize: "0.9rem",
    color: "#6b7280",
    lineHeight: "1.6",
    margin: "0 0 1.5rem",
  },
  steps: {
    textAlign: "left",
    background: "#f9fafb",
    borderRadius: "10px",
    padding: "1rem 1.25rem",
    marginBottom: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.65rem",
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "0.88rem",
    color: "#374151",
  },
  stepNum: {
    minWidth: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  googleBtn: {
    width: "100%",
    padding: "0.75rem 1rem",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "1rem",
    transition: "opacity 0.2s",
  },
  btnPrimary: {
    padding: "0.65rem 1.5rem",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  warning: {
    fontSize: "0.78rem",
    color: "#9ca3af",
    lineHeight: "1.5",
    margin: 0,
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto 1rem",
  },
};

export default Setup;
