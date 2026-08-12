import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import styles from "./RegisterMember.module.css";
// import { registerMember } from "../../services/auth.service"; // Adjust import

export default function RegisterMember() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields",
        background: "#0d1117",
        color: "#d9edff",
      });
    }

    try {
      setLoading(true);
      // await registerMember(form); // Call your API
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        timer: 1500,
        showConfirmButton: false,
        background: "#0d1117",
        color: "#d9edff",
      });
      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.message || "Error creating account",
        background: "#0d1117",
        color: "#d9edff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Left Branding Side */}
        <div className={styles.brandSide}>
          <div className={styles.brandContent}>
            <h1 className={styles.brandTitle}>
              <i
                className="fa-solid fa-book-open-reader"
                style={{ color: "#10b981", marginRight: "8px" }}
              />
              LibraryMS
            </h1>
            <p className={styles.brandSubtitle}>
              Your gateway to thousands of books and resources.
            </p>
          </div>
          <div className={styles.brandGraphic}>
            <div className={styles.graphicBox}></div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className={styles.formSide}>
          <div className={styles.formHeader}>
            <h2>Create Account</h2>
            <p>Join our library community today.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>First Name*</label>
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
              <div className={styles.inputGroup}>
                <label>Last Name*</label>
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
              <label>Email Address*</label>
              <div className={styles.inputWrapper}>
                <i className="fa-solid fa-envelope" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Password*</label>
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
              disabled={loading}
            >
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className={styles.loginText}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
