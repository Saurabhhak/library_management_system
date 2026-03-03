import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminSignup.css";
import ADMINAPI from "./adminserver";

function AdminLoginForm() {
  const navigate = useNavigate();
  const [getData, setGetData] = useState([]);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  const [userinfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  // -------------- Auto hide notification
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);
  // --------------------- Get Data verify user existance
  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const res = await ADMINAPI.get("/");
        setGetData(res.data.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load data");
      }
    };
    fetchEmp();
  }, []);
  //------------------ OnSubmit form to back database Compare
  const handleChangeEvent = (e) => {
    const { name, value } = e.target;

    setUserInfo((prev) => ({ ...prev, [name]: value }));

    // remove error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleReset = () => {
    setUserInfo({ email: "", password: "" });
    setErrors({ email: "", password: "" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: userinfo.email ? "" : "Email field is required",
      password: userinfo.password ? "" : "Password field is required",
    };
    setErrors(newErrors);
    // Stop submit if any error exists
    if (newErrors.email || newErrors.password) return;

    const emailExists = getData.some((item) => item.email === userinfo.email);
    if (!emailExists) {
      setNotification({
        message: "Email not exists Create an account",
        type: "error",
      });
      return;
    }
    try {
      const res = await ADMINAPI.post("/login", userinfo);

      localStorage.setItem("token", res.data.token);
      setNotification({
        message: "Login successful",
        type: "success",
      });

      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || "Invalid email or password",
        type: "error",
      });
    }
  };

  return (
    <>
      {/* Floating Notification */}
      {notification.message && (
        <div className={`notify ${notification.type}`}>
          {notification.message}
          <span
            className="closeBtn"
            onClick={() => setNotification({ message: "", type: "" })}
          >
            ✖
          </span>
        </div>
      )}

      <div className="headers">
        <div className="leftIcon">
          <i className="fa-solid fa-book"></i>
        </div>
        <div className="centerTitle">
          <h2>APV Tech Library</h2>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form-section">
          <h1 className="tagh1">Admin Login</h1>

          <input
            className={`form-input ${errors.email ? "input-error" : ""}`}
            type="email"
            name="email"
            value={userinfo.email}
            onChange={handleChangeEvent}
            placeholder="Admin email"
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
          <input
            className={`form-input ${errors.password ? "input-error" : ""}`}
            type="password"
            name="password"
            value={userinfo.password}
            onChange={handleChangeEvent}
            placeholder="Admin password"
          />
          {errors.password && (
            <span className="error-msg">{errors.password}</span>
          )}
          <div className="btn_section">
            <input type="reset" className="btn_feature" onClick={handleReset} />
            <input id="btn" className="btn_feature" type="submit" />
          </div>

          <p>
            <Link className="linkStyle" to="/signup">
              Create new account
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default AdminLoginForm;
