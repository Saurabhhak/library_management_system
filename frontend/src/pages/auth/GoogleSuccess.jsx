import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../../api/axiosInstance";

function GoogleSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const authError = searchParams.get("error");

    if (authError) {
      const msgs = {
        auth_failed: "Google sign-in failed. Please try again.",
        invite_required: "Invalid invite link. Please request a new invite.",
      };
      setError(msgs[authError] || "Authentication error.");
      return;
    }

    if (!token) {
      setError("No token received. Please try again.");
      return;
    }

    // Save token first so the profile API call is authenticated
    localStorage.setItem("token", token);

    const go = async () => {
      try {
        const { data } = await API.get("/admin/profile");
        if (!data?.user) throw new Error("No user data");

        // ── Critical: save role so guards work ──
        localStorage.setItem("role", data.user.role);

        if (data.user.is_profile_complete) {
          navigate("/", { replace: true });
        } else {
          navigate("/complete-profile", { replace: true });
        }
      } catch (err) {
        console.error("[GoogleSuccess]", err);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setError("Session error. Please try logging in again.");
      }
    };

    go();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div style={page}>
        <div style={card}>
          <p style={{ color: "#dc2626", marginBottom: "1rem" }}>{error}</p>
          <button
            style={btn}
            onClick={() => navigate("/login", { replace: true })}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={card}>
        <p style={{ color: "#6b7280" }}>Signing you in…</p>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f3f4f6",
  fontFamily: "sans-serif",
};
const card = {
  background: "#fff",
  borderRadius: "12px",
  padding: "2rem",
  textAlign: "center",
  boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
};
const btn = {
  padding: "0.6rem 1.25rem",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.9rem",
};

export default GoogleSuccess;
