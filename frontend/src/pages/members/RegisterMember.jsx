import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import API from "../../api/axiosInstance";
import { registerPublicMember } from "../../services/member/member.service";
import styles from "../../styles/Auth.module.css";
const swalDark = {
  background: "#0f1117",
  color: "#e2e8f0",
  confirmButtonColor: "#2563eb",
};

export default function RegisterMember() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [showPw, setShowPw] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    if (timer > 0) {
      const id = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(id);
    }
  }, [timer]);

  const handleSendOtp = async () => {
    if (!form.email)
      return Swal.fire({
        ...swalDark,
        icon: "warning",
        title: "Wait",
        text: "Enter email address first.",
      });
    setIsSendingOtp(true);
    try {
      const checkRes = await API.post("/auth/check-email", {
        email: form.email,
        role: "member",
      });
      if (checkRes.data.exists) {
        setIsSendingOtp(false);
        return Swal.fire({
          ...swalDark,
          icon: "error",
          title: "Exists",
          text: "Email already registered.",
          confirmButtonColor: "#ef4444",
        });
      }

      await API.post("/auth/send-otp", {
        email: form.email,
        role: "member",
        purpose: "registration",
      });
      setOtpSent(true);
      setTimer(120);
      Swal.fire({
        ...swalDark,
        icon: "success",
        title: "OTP Sent",
        text: "Check your inbox.",
      });
    } catch (err) {
      Swal.fire({
        ...swalDark,
        icon: "error",
        title: "Error",
        text: "Could not send OTP.",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    try {
      await API.post("/auth/verify-otp", {
        email: form.email,
        otp,
        role: "member",
        purpose: "registration",
      });
      setOtpVerified(true);
      Swal.fire({
        ...swalDark,
        icon: "success",
        title: "Verified",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        ...swalDark,
        icon: "error",
        title: "Invalid OTP",
        text: "Incorrect code.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified)
      return Swal.fire({
        ...swalDark,
        icon: "warning",
        title: "Verify Email",
        text: "Please verify email first.",
      });

    setLoading(true);
    try {
      await registerPublicMember(form);
      Swal.fire({
        ...swalDark,
        icon: "success",
        title: "Account Created!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/login");
    } catch (err) {
      Swal.fire({
        ...swalDark,
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brandSide}>
          <h1 className={styles.brandTitle}>
            <i className="fa-solid fa-book-open-reader" /> LibraryMS
          </h1>
          <p className={styles.brandSubtitle}>
            Join the university library public portal to explore resources.
          </p>
        </div>

        <div className={styles.formSideRegister}>
          <div className={styles.formHeader}>
            <h2>Create Account</h2>
            <p>Enter your details to register.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label>First Name</label>
                <div className={styles.inputWrapper}>
                  <i className="fa-solid fa-user" />
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.inputGroup} style={{ flex: 1 }}>
                <label>Last Name</label>
                <div className={styles.inputWrapper}>
                  <i className="fa-solid fa-user" />
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <div className={styles.inputWithBtn}>
                <div className={styles.inputWrapper}>
                  <i className="fa-solid fa-envelope" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={otpVerified}
                    required
                  />
                </div>
                {otpVerified ? (
                  <div className={styles.verifiedBadge}>
                    <CheckCircle size={16} /> Verified
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || timer > 0}
                    className={styles.actionBtn}
                  >
                    {isSendingOtp
                      ? "Sending..."
                      : timer > 0
                        ? `${timer}s`
                        : "Get OTP"}
                  </button>
                )}
              </div>
            </div>

            {otpSent && !otpVerified && (
              <div className={styles.inputGroup}>
                <div className={styles.inputWithBtn}>
                  <div className={styles.inputWrapper}>
                    <i className="fa-solid fa-key" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6}
                    className={styles.actionBtn}
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <i className="fa-solid fa-lock" />
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !otpVerified}
            >
              {loading ? "Creating..." : "Register Now"}
            </button>
          </form>

          <p className={styles.loginText}>
            Already a member? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
